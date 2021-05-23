const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    min: 1,
    max: 50,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 5,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get('jwtPrivateKey')
  );
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(user);
}

const User = mongoose.model('User', userSchema);

exports.User = User;
exports.userSchema = userSchema;
exports.validate = validateUser;
