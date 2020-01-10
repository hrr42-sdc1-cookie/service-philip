const client = require('./connectClient');

const createReservationInsert = (restId, name, time, guests) => {
  const insert = 'INSERT INTO reservations '
  + '(restaurantId, customerName, time, guestCount) '
  + 'VALUES '
  + '($1, $2, $3, $4)'
  + 'RETURNING *';
  const values = [restId, name, new Date(time), guests];
  return client.query(insert, values)
    .then(({ rows }) => rows[0]);
};

const createReservation = ({
  restId, name, time, guests,
}) => {
  const utcTime = new Date(time);
  const before = new Date(time);
  const after = new Date(time);
  before.setHours(before.getHours() - 2);
  after.setHours(after.getHours() + 2);

  const select = 'SELECT * FROM reservations WHERE restaurantId = $1 AND customerName = $2 AND time > $3 AND time < $4';
  const selectValues = [restId, name, before, after];

  return client.query(select, selectValues)
    .then(({ rows }) => {
      if (rows.length) {
        return 'Sorry, you already have a booking at this time.  Please make another selection.';
      }
      return createReservationInsert(restId, name, utcTime, guests)
        .then(() => 'Your reservation has been successfully booked!');
    });
};

const getLocation = restaurantId => {
  const select = 'SELECT latitude, longitude FROM restaurants WHERE id = $1';
  const selectValues = [restaurantId];
  return client.query(select, selectValues)
    .then(({ rows }) => rows);
};

module.exports = {
  createReservation, getLocation,
};
