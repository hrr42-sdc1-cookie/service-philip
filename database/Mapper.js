const mongoose = require('./connect');

mongoose.Promise = global.Promise;

const mapperSchema = mongoose.Schema({
  restaurant_id: Number,
  latitude: Number,
  longitude: Number,
});

const Mapper = mongoose.model('Mapper', mapperSchema);

const getAll = () => {
  const query = Mapper.find({ });
  return query.exec();
};

const getOne = restaurantId => {
  const query = Mapper.find({ restaurant_id: restaurantId });
  return query.exec();
};

const create = mapperData => Mapper.create(mapperData);

const update = (id, mapperData) => Mapper.findOneAndUpdate({ restaurant_id: id }, mapperData);

const del = id => Mapper.deleteOne({ restaurant_id: id });

module.exports = Mapper;
module.exports.getAll = getAll;
module.exports.getOne = getOne;
module.exports.createMapper = create;
module.exports.updateMapper = update;
module.exports.deleteMapper = del;
