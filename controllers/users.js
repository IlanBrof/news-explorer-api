const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const registration = async (req, res, next) => {
  const { name, password, email } = req.body;
  const salt = 10;
    try {
    // const uniqueEmailTest = await User.findOne({ email });
    // if (uniqueEmailTest) {
    //   next(new ConflictErr('Email is already taken')); // StatusCode(409)
    // }

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
    if (err.name === "ValidationError") {
      // throw BadRequestErr('Create user validation error'); // StatusCode(400)
      return res.status(400).send({ message: "Create user validation error" });
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // throw new UnauthorizedErr('Wrong email or password'); // StatusCode(401)
      return res.status(401).send({ message: "Wrong email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // throw new UnauthorizedErr('Wrong Email or Password'); // statusCode(401)
      return res.status(401).send({ message: "Wrong Email or Password" });
    }
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key',
      { expiresIn: '7d' },
    );
    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const payload = await jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "super-secret-key"
    );
    const user = await User.findById(payload._id);
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === "CastError") {
      // throw BadRequestErr('Wrong ID Syntax'); // StatusCode(400)
      return res.status(400).send({ message: "Wrong ID Syntax" });
    }
    next(err);
  }
};

module.exports = {
  getUser,
  login,
  registration,
};
