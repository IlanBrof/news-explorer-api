const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require("dotenv").config(); //eslint-disable-line
const cors = require('cors');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const mongoose = require('mongoose');

const app = express();
const { PORT, DB_ADDRESS } = process.env;
const usersRouter = require('./routes/users');
const articleRouter = require('./routes/articles');
const { registration, login } = require('./controllers/users');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const serverErr = require('./middleware/errors/Server');

mongoose.connect(DB_ADDRESS);

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.send('Welcome to News Explorer API!');
});

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  registration,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.use(auth);
app.use('/users', usersRouter);
app.use('/articles', articleRouter);

app.use(errorLogger);
app.use(errors());
app.use(serverErr);
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`); //eslint-disable-line
});
