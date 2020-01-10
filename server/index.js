//  API server
const express = require('express');
const { createReservation, getLocation } = require('../psql/dbFunctions');

const app = express();

app.use(express.static('public'));

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

//  check if reservation can be accepted and add to the database if so
app.post('/reservation', (req, res, next) => {
  createReservation(req.body)
    .then(result => res.json(result))
    .catch(err => next(err));
});

//  get restaurant geolocator for call to google maps api
app.get('/mapper/:restaurantId', (req, res, next) => {
  getLocation(req.params.restaurantId)
    .then(result => res.json(result))
    .catch(err => next(err));
});

const port = 3002;

app.listen(port, () => console.log(`listening on port ${port}`));
