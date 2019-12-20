const mongoose = require('./connect.js');

mongoose.Promise = global.Promise;

const restaurantSchema = mongoose.Schema({
  restaurant_id: Number,
  seats: Number,
  tables: Number,
  reservations_today: Number,
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

const getAll = () => {
  const query = Restaurant.find({ });
  return query.exec();
};

const getOne = restaurantId => {
  const query = Restaurant.find({ restaurant_id: restaurantId });
  return query.exec();
};

const create = restaurantData => Restaurant.create(restaurantData);

const update = (id, restaurantData) => Restaurant.findOneAndUpdate(
  { restaurant_id: id }, restaurantData,
);

const deleteRestaurant = id => Restaurant.deleteOne({ restaurant_id: id });

module.exports = Restaurant;
module.exports.getAll = getAll;
module.exports.getOne = getOne;
module.exports.createRestaurant = create;
module.exports.updateRestaurant = update;
module.exports.deleteRestaurant = deleteRestaurant;
