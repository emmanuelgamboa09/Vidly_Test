const express = require('express');
const genres = require('../api/routes/genres');
const customers = require('../api/routes/customers');
const movies = require('../api/routes/movies');
const rentals = require('../api/routes/rentals');
const users = require('../api/routes/users');
const auth = require('../api/routes/auth');
const helmet = require('helmet');
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use(express.static('public'));
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(error);
};
