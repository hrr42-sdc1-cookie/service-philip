//  API server
const express = require('express');
const bodyParser = require('body-parser');
const { createReservation } = require('../psql/dbFunctions');
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

//  check if reservation can be accepted and add to the database if so
app.post('/reservation', (req, res, next) => {
  createReservation(req.body)
    .then(result => res.json(result))
    .catch(err => next(err));
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
