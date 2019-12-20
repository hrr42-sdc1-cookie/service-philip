//  API server
const express = require('express');
const bodyParser = require('body-parser');
const Reservation = require('../database/Reservation.js');
const Mapper = require('../database/Mapper.js');
const Restaurant = require('../database/Restaurant.js');

const app = express();

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

//  get all reservations (for testing)
app.get('/reservation/all', (req, res) => {
  Reservation.getAll()
    .then(reservations => {
      res.write(JSON.stringify(reservations));
      res.end();
    })
    .catch(err => {
      console.log('Error: ', err);
      res.status(500).send(new Error(err));
      res.end();
    });
});

//  check if reservation can be accepted and add to the database if so
app.post('/reservation', (req, res) => {
  //  post if you can; return success
  //  if post not allowed, return error message
  //  errors can be: username already has a reservation,
  //    reservation overlaps too many (too many tables used)
  const booking = req.body;

  Reservation.make(booking)
    .then(notification => {
      res.write(JSON.stringify(notification));
      res.end();
    })
    .catch(err => {
      console.log('Error occurred: ', err);
      res.status(500).send(new Error(err));
      res.end();
    });
});

//  get all maps (for testing)
app.get('/mapper/all', (req, res) => {
  Mapper.getAll()
    .then(maps => {
      res.write(JSON.stringify(maps));
      res.end();
    })
    .catch(err => {
      console.log('Error occurred: ', err);
      res.status(500).send(new Error(err));
      res.end();
    });
});

//  get restaurant geolocator for call to google maps api
app.get('/mapper/:restaurantId', (req, res) => {
  const { restaurantId } = req.params;
  Mapper.getOne(restaurantId)
    .then(map => {
      res.write(JSON.stringify(map));
      res.end();
    })
    .catch(err => {
      console.log('Error occurred: ', err);
      res.status(500).send(new Error(err));
      res.end();
    });
});

app.post('/mapper', (req, res, next) => Mapper.createMapper(req.body)
  .then(result => res.json(result))
  .catch(err => next(err)));

app.put('/mapper/:restaurantId', (req, res, next) => Mapper.updateMapper(req.params.restaurantId, req.body)
  .then(result => res.json(result))
  .catch(err => next(err)));

//  get all maps (for testing)
app.get('/restaurant/all', (req, res) => {
  Restaurant.getAll()
    .then(restaurants => {
      res.write(JSON.stringify(restaurants));
      res.end();
    })
    .catch(err => {
      console.log('Error occurred:', err);
      res.status(500).send(new Error(err));
      res.end();
    });
});

//  get restaurant geolocator for call to google maps api
app.get('/restaurant/:restaurantId', (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.getOne(restaurantId)
    .then(restaurant => {
      res.write(JSON.stringify(restaurant));
      res.end();
    })
    .catch(err => {
      console.log('Error occurred: ', err);
      res.status(500).send(new Error(err));
      res.end();
    });
});

const port = 3002;

app.listen(port, () => console.log(`listening on port ${port}`));
