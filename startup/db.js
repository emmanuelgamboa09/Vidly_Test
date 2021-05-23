const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');
require('winston-mongodb');

const dboptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};
const URI = config.get('db');

module.exports = function () {
  mongoose
    .connect(URI, dboptions)
    .then(() => winston.info(`Connected to ${URI} server...`))
    .catch((err) => winston.error('Failed to connect to MongoDB server', err));
};
