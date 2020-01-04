const path = require('path');
const client = require('./connectClient');

const restaurantCsvPath = path.resolve(__dirname, '../dataGeneration/restaurants.csv');
const reservationCsvPath = path.resolve(__dirname, '../dataGeneration/reservations.csv');
const restaurantCopy = `
  COPY restaurants(id,name,seats,tables,latitude,longitude)
  FROM '${restaurantCsvPath}' DELIMITER ',' CSV HEADER
`;
const reservationCopy = `
  COPY reservations(restaurantId, customerName, time, guestCount)
  FROM '${reservationCsvPath}' DELIMITER ',' CSV HEADER
`;
const restaurantSetSeq = 'SELECT setval(\'restaurants_id_seq\', $1, false)';

client
  .query(restaurantCopy)
  .then(({ rowCount }) => client.query(restaurantSetSeq, [rowCount]))
  .then(() => client.query(reservationCopy))
  // .then(({ rowCount }) => client.query(reservationSetSeq, [rowCount]))
  .then(() => {
    console.log('Seeded database is ready to rock.');
    client.end();
  })
  .catch(err => console.log(err));
