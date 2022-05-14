const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv").config(); //eslint-disable-line
const cors = require("cors");
const helmet = require("helmet");
const { celebrate, Joi, errors } = require("celebrate");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3000 } = process.env;
const usersRouter = require("./routes/users");
const articleRouter = require("./routes/articles");
const { registration, login } = require("./controllers/users");
// const validateURL = require('./middleware/validateURL');
// const { requestLogger, errorLogger } = require('./middleware/logger');

mongoose.connect("mongodb://localhost:27017/news-explorer-db");

app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());
app.use(helmet());
// app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("Welcome to news-explorer-api Backend!");
});

app.post("/signup", registration);
app.post("/signin", login);
app.use("/users", usersRouter);
app.use("/articles", articleRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`); //eslint-disable-line
});
