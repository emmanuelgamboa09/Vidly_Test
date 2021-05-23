const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const validateObjectId = require('../../middleware/validateObjectId');

router.get('/', async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Couldn't find movie");
  res.send(movie);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  try {
    await movie.save();
    res.send(movie);
  } catch (ex) {
    res.status(401).send(ex.message);
  }
});

module.exports = router;
