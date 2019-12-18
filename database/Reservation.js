const mongoose = require('./connect.js');

mongoose.Promise = global.Promise;

const reservationSchema = mongoose.Schema({
  restaurant_id: Number,
  customer_name: String,
  reservation_time: Date,
  guests: Number,
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});

const Reservation = mongoose.model('Reservation', reservationSchema);

const getAll = () => {
  const query = Reservation.find({ });
  return query.exec();
};

const getByDate = (restId, date) => (
  //  refactor when have time
  new Promise(resolve => {
    //  create search-between dates for the date sought
    const workDate = new Date(date);
    const fromDate = new Date(workDate.getFullYear(), workDate.getMonth(), workDate.getDate());
    const thruDate = new Date(fromDate);
    thruDate.setDate(thruDate.getDate() + 1);
    Reservation.find({ restaurant_id: restId })
      .where('reservation_time').gte(fromDate).lt(thruDate)
      .exec((err, reservations) => {
        resolve(reservations);
      });
  })
);

const addReservation = booking => {
  const res = new Reservation({
    restaurant_id: booking.restId,
    customer_name: booking.name,
    reservation_time: booking.time,
    guests: booking.guests,
  });

  // save model to database
  res.save();
};

// function to make a reservation.  or not.
const make = booking => (
  //  refactor when have time
  new Promise(resolve => {
    getByDate(booking.restId, booking.time)
      .then(reservations => {
      // process the booking
        const AVAIL_TABLES = 15;
        let nameMatch = false;
        const overlaps = [];
        const currResStart = new Date(booking.time);
        const currResEnd = new Date(currResStart);
        //  a reservation is two hours long
        currResEnd.setHours(currResEnd.getHours() + 2);
        //  a real restaurant would check that start AND end are within open hours
        for (let i = 0; i < reservations.length; i++) {
          const exResStart = reservations[i].reservation_time;
          const exResEnd = new Date(exResStart);
          //  every reservation is for two hours
          exResEnd.setHours(exResEnd.getHours() + 2);
          //  overlap = new reservation start OR end is between existing reservation start AND end
          if ((currResStart >= exResStart && currResStart <= exResEnd)
            || (currResEnd >= exResStart && currResEnd <= exResEnd)) {
            overlaps.push(reservations[i]);
            //  Does the name match?  If so, decline "you're alread here"
            if (booking.name !== '' && booking.name === reservations[i].customer_name) {
              nameMatch = true;
              break;
            }
          }
        }
        //  it works!
        let notification = '';
        if (nameMatch) {
          notification = 'Sorry, you already have a booking at this time.  Please make another selection.';
        } else if (overlaps.length >= AVAIL_TABLES) {
          notification = 'Sorry, there are no bookings available on this date and time.  Please make another selection.';
        } else {
          //  add reservation to the database
          notification = 'Your reservation has been successfully booked!';
          addReservation(booking);
        }

        resolve(notification);
      });
  })
);

module.exports = Reservation;
module.exports.getAll = getAll;
module.exports.getByDate = getByDate;
module.exports.make = make;
