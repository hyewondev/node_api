const mongoose = require('mongoose');
const uri = require('./db.config');

const connect = () => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, (error) => {
    if (error) {
      console.log('Database connection error', error);
    } else {
      console.log('Database connection established!');
    }
  });
};

mongoose.connection.on('error', (error) => {
  console.error('Database connection error', error);
});
mongoose.connection.on('disconnected', () => {
  console.error('Database connection disconnected. Reconnecting...');
  connect();
});

module.exports = connect;