const dotenv = require("dotenv").config(); //eslint-disable-line

const {
  PORT = 3000,
  DB_ADDRESS = 'mongodb://localhost:27017/news-explorer-db',
  JWT_DEV_SECRET = 'secret',
} = process.env;

module.exports = {
  PORT, DB_ADDRESS, JWT_DEV_SECRET,
};
