const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = mongoose.Schema({

  email: {
    type: String,
    unique: true,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  password: { type: String, required: true, minLength: 5, maxLength: 1024 },

});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,

      email: this.email,

    },
    config.get("JWT_SECRET")
  );
};

const validateUser = (user) => {
  const schema = Joi.object({

    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),

  });
  return schema.validate(user);
};

const validateLogin = (req) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(req);
};

const User = mongoose.model("User", userSchema);
module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;
module.exports.validateLogin = validateLogin;
