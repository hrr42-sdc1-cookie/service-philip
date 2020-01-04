const path = require('path');
const { client, schemaPromise } = require('./createSchema');

const restaurantCsvPath = path.resolve(__dirname, '../dataGeneration/restaurants100k.csv');
const reservationCsvPath = path.resolve(__dirname, '../dataGeneration/reservations100k.csv');

const dropForeignKey = `
  ALTER TABLE reservations DROP CONSTRAINT reservations_restaurantid_fkey;
`;
const restaurantCopy = `
  COPY restaurants(id,name,seats,tables,latitude,longitude)
  FROM '${restaurantCsvPath}' DELIMITER ',' CSV HEADER;
`;
const reservationCopy = `
  COPY reservations(restaurantId, customerName, time, guestCount)
  FROM '${reservationCsvPath}' DELIMITER ',' CSV HEADER;
`;
const restaurantSetSeq = 'SELECT setval(\'restaurants_id_seq\', $1, false)';
const replaceForeignKey = `
  ALTER TABLE reservations ADD CONSTRAINT reservations_restaurantid_fkey
  FOREIGN KEY (restaurantid) REFERENCES restaurants (id);
`;

let d = Date.now();
schemaPromise
  .then(() => {
    console.log('Removing foreign key from reservations');
    return client.query(dropForeignKey);
  })
  .then(() => {
    console.log('Seeding...');
    return client.query(restaurantCopy);
  })
  .then(({ rowCount }) => {
    console.log(`Restaurants populated in ${(-d + (d = Date.now())) / 1000} seconds...`);
    return client.query(restaurantSetSeq, [rowCount]);
  })
  .then(() => {
    console.log('Restaurant pimary key is set...');
    return client.query(reservationCopy);
  })
  .then(() => {
    console.log(`Reservations populated in ${(-d + (d = Date.now())) / 1000} seconds...`);
    return client.query(replaceForeignKey);
  })
  .then(() => {
    console.log(`Foreign key for reservations replaced in ${(-d + (d = Date.now())) / 1000} seconds`);
    console.log('Seeded database is ready to rock.');
  })
  .catch(err => console.log(err))
  .finally(() => client.end());
