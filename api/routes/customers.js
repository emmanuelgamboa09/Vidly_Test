const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:name', async (req, res) => {
  const customer = await Customer.find({ name: req.params.name });
  if (!customer) return res.status(404).send('Customer not found');
  res.send(customer);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  try {
    await customer.save();
    res.send(customer);
  } catch (ex) {
    res.status(401).send(ex.message);
  }
});

router.put('/:name', async (req, res) => {
  const customer = await Customer.findOneAndUpdate(
    { name: req.params.name },
    { phone: req.body.phone },
    { new: true }
  );

  if (!customer) return res.status(404).send('Could not find customer');
  res.send(customer);
});

router.delete('/:name', async (req, res) => {
  const customer = await Customer.findOneAndDelete({ name: req.params.name });
  if (!customer) return res.status(404).send('Customer not found');
  res.send(customer);
});

module.exports = router;
