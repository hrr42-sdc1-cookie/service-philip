const faker = require('faker');
const mongoose = require('mongoose');
const Reservation = require('./Reservation.js');
const Mapper = require('./Mapper.js');
const Restaurant = require('./Restaurant.js');

mongoose.connect('mongodb://localhost/reservations');

const RESERVATIONS_TO_CREATE = 10;

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//  RESERVATIONS
//  we're going to use random number for restaurant_id so we don't end up with same
//    number of reservations in each restaurant
const res = [];

for (let i = 0; i < RESERVATIONS_TO_CREATE; i++) {
  res[i] = {};
  res[i].restaurant_id = Math.floor(Math.random() * 100) + 1;
  res[i].customer_name = faker.name.findName();
  //  create random time between now and 3 days from now (4320 minutes)
  const minutes = getRandomInteger(1, 4320);
  const reserveTime = new Date();
  reserveTime.setMinutes(reserveTime.getMinutes() + minutes);
  console.log(minutes, reserveTime);
  res[i].reservation_time = reserveTime;
  console.log(res[i].reservation_time);
  res[i].guests = Math.floor(Math.random() * 4) + 1;
}

//  clear any existing reservations
Reservation.deleteMany({}, () => {});
//  plug in array
Reservation.create(res, () => {});

// MAPS
const maps = [];

//  randomly create one set of mapping coordinates for each restaurant
//  within SF or nearby ocean
for (let i = 0; i < 100; i++) {
  const lat = getRandomInteger(37749, 37804);
  const long = getRandomInteger(122399, 12247) * -1; //  west longitude
  maps[i] = {};
  maps[i].restaurant_id = i + 1;
  maps[i].latitude = lat * 0.001;
  maps[i].longitude = long * 0.001;
}

//  clear current maps
Mapper.deleteMany({}, () => {});
//  plug in the array
Mapper.create(maps, () => {});

//  RESTAURANT - geolocators can go in here if want to refactor
const restaurant = [];

for (let i = 0; i < 100; i++) {
  restaurant[i] = {};
  restaurant[i].restaurant_id = i + 1;
  restaurant[i].seats = 70;
  restaurant[i].tables = 40;
  restaurant[i].reservations_today = getRandomInteger(0, 200);
}

//  clear current maps
Restaurant.deleteMany({}, () => {});
//  plug in the array
Restaurant.create(restaurant, () => {});

// mongoose.disconnect();
// let query = Mapper.find({ });
// console.log(query.exec());
