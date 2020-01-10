const client = require('./connectClient');

const createReservation = ({
  restId, name, time, guests,
}) => {
  const query = 'INSERT INTO reservations '
  + '(restaurantId, customerName, time, guestCount) '
  + 'VALUES '
  + '($1, $2, $3, $4)'
  + 'RETURNING *';
  const values = [restId, name, time, guests];
  return client.query(query, values)
    .then(({ rows }) => rows[0]);
};

module.exports = {
  createReservation,
};
