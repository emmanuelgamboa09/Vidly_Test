const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const { Rental, validate } = require('../models/rental');
Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const rentals = await Rental.find().populate('customer', 'name -_id');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid Movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie is out of stock');

  const rental = new Rental({
    customer: req.body.customerId,
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update(
        'movies',
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
    res.send(rental);
  } catch (ex) {
    res.status(500).send('Something failed');
  }
});

module.exports = router;
