const path = require('path');
const { client, schemaPromise } = require('./createSchema');

const restaurantCsvPath = path.resolve(__dirname, '../dataGeneration/restaurants.csv');
const reservationCsvPath = path.resolve(__dirname, '../dataGeneration/reservations.csv');

const dropForeignKey = `
  ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_restaurantid_fkey;
`;
const dropIndex = 'DROP INDEX IF EXISTS resIndex;';
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
const replaceIndex = 'CREATE INDEX resIndex ON  reservations(restaurantId);';

const time = () => (new Date()).toLocaleTimeString();

let d = Date.now();
schemaPromise
  .then(() => {
    console.log(time(), 'Removing foreign key from reservations...');
    return client.query(dropForeignKey);
  })
  .then(() => {
    console.log(time(), 'Removing index from reservations...');
    return client.query(dropIndex);
  })
  .then(() => {
    console.log(time(), 'Seeding...');
    return client.query(restaurantCopy);
  })
  .then(({ rowCount }) => {
    console.log(time(), `Restaurants populated in ${(-d + (d = Date.now())) / 1000} seconds...`);
    return client.query(restaurantSetSeq, [rowCount]);
  })
  .then(() => {
    console.log(time(), 'Restaurant pimary key is set...');
    return client.query(reservationCopy);
  })
  .then(() => {
    console.log(time(), `Reservations populated in ${(-d + (d = Date.now())) / 1000} seconds...`);
    return client.query(replaceForeignKey);
  })
  .then(() => {
    console.log(time(), `Foreign key for reservations replaced in ${(-d + (d = Date.now())) / 1000} seconds...`);
    return client.query(replaceIndex);
  })
  .then(() => {
    console.log(time(), `Index for reservations replaced in ${(-d + (d = Date.now())) / 1000} seconds...`);
    console.log('Seeded database is ready to rock.');
  })
  .catch(err => console.log(err))
  .finally(() => client.end());
