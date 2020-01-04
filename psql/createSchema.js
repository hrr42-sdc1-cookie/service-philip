const client = require('./connectClient');

const schemaOnly = (process.argv[2] || '').toLowerCase() === 'schemaonly';

const createTables = `
  DROP TABLE IF EXISTS reservations;
  DROP TABLE IF EXISTS restaurants;
  CREATE TABLE restaurants(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    seats SMALLINT NOT NULL,
    tables SMALLINT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL
  );
  CREATE TABLE reservations(
    id SERIAL PRIMARY KEY,
    restaurantId INTEGER REFERENCES restaurants (id),
    customerName TEXT NOT NULL,
    time TIMESTAMP NOT NULL,
    guestCount SMALLINT NOT NULL
  );
`;

module.exports = {
  client,
  schemaPromise: client
    .query(createTables)
    .then(() => console.log('Schema is ready to rock.'))
    .catch(err => console.log(err))
    .finally(() => { if (schemaOnly) { client.end(); } }),
};
