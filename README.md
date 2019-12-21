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