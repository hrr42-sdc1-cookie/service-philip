const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/reservations', {
  useFindAndModify: false,
});

module.exports = mongoose;
