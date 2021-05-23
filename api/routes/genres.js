const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { TokenExpiredError } = require('jsonwebtoken');
const mongoose = require('mongoose');
const validateObjectId = require('../../middleware/validateObjectId');
router.get('/', async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('Genre Id Not found');
  res.send(genre);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const genre = new Genre({ name: req.body.name });

  try {
    await genre.save();
    res.send(genre);
  } catch (ex) {
    res.status(401).send(ex.message);
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const foundGenre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!foundGenre) return res.status(404).send('Genre Id not found');
  res.send(foundGenre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const foundGenre = await Genre.findByIdAndDelete(req.params.id);
  if (!foundGenre) return res.status(404).send('Genre Id not found');
  res.send(foundGenre);
});

module.exports = router;
