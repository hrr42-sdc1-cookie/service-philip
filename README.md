# SDC - OpenTable Reservations

## Requirements

A `nvmrc` file is inlcuded if using [nvm](https://github.com/creationix/nvm)

- Node 12.14.0

## CRUD API

A completed CRUD api using the inherited database (MongoDB) is present in the at the commit tagged, `crud`. To get there:

```bash
git checkout crud
```

### Restaurants

- GET `/restaurant/all` - Get data for all restaurants
- GET `/restaurant/:restaurantId` - Get data for a restaurant
- POST `/restaurant` - Create a restaurant
- PUT `/restaurant/:restaurantId` - Update a restaurant
- DELETE `/restaurant/:restaurantId - Delete a restaurant

### Reservations

- GET `/reservation/all` - Get all reservations at all restaurants
- POST `/reservation` - Create a new reservation
- PUT `/reservation/:reservationId` - Update an existing reservation
- DELETE `/reservation/:reservationId` - Delete an existing reservation

### Mappers

- GET `/mapper/all` - Get all mappers (locations with restaurant id)
- GET `/mapper/:restaurantId` - Get mapper for a restaurant
- POST `/mapper/` - Create a mapper
- PUT `/mapper/:restaurantId` - Update mapper for a restaurant
- DELETE `/mapper/:restaurantId` - Delete mapper for a restaurant

## PostgreSQL

### Seeding

Seeding functionality is available at the commit tagged, `psql-seed` To get there:

```bash
git checkout psql-seed
```

To run the seeding script, you'll need to have PostgreSQL installed with a user and database for this project. Create a config file to make it all work:

```bash
cp psql/config/psql.config.example.js psql/config/psql.config.js
```

...then open up that file and fill in the blanks.

Next, generate some data files, populate the database, and then remove those data files:

```bash
npm run csv10M
npm run psql:seed
```

You can specify a number other than the 10,000,000 primary records this will generate. Get some usage instructions:

```bash
node dataGeneration/generate.js
```

Alternatively, you can skip seeding and just prepare an empty database:

```bash
npm run psql:schema
```
