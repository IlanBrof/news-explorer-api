const { JWT_DEV_SECRET } = require("../utils/serverConfig");
const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const ConflictErr = require('../utils/errors/Conflict');
const BadRequestErr = require('../utils/errors/Conflict');
const UnauthorizedErr = require('../utils/errors/Unauthorized');

const registration = async (req, res, next) => {
  const { name, password, email } = req.body;
  const salt = 10;
  try {
    const uniqueEmailTest = await User.findOne({ email });
    if (uniqueEmailTest) {
      next(new ConflictErr('Email is already taken')); // StatusCode(409)
    }

    const hashedPassword = await bcrypt.hash(password, salt);
    if (hashedPassword) {
      const newUser = await User.create({
        name,
        password: hashedPassword,
        email,
      });
      if (newUser) {
        res.status(201).send({
          name: newUser.name,
          email: newUser.email,
        });
      }
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw BadRequestErr('Create user validation error'); // StatusCode(400)
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedErr('Wrong email or password'); // StatusCode(401)
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedErr('Wrong Email or Password'); // statusCode(401)
    }
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET,
      { expiresIn: '7d' },
    );
    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const payload = await jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET,
    );
    const user = await User.findById(payload._id);
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      throw BadRequestErr('Wrong ID Syntax'); // StatusCode(400)
    }
    next(err);
  }
};

module.exports = {
  getUser,
  login,
  registration,
};
