const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200,
  },
  phone: {
    type: String,
    minlength: 4,
  },
  isGold: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const Customer = mongoose.model('Customer', customerSchema);

function validate(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(200).required(),
    phone: Joi.string().min(4).required(),
  });
  return schema.validate(genre);
}

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.validate = validate;
