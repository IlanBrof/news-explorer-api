const express = require("express");
const { celebrate, Joi } = require("celebrate");
const validateURL = require("../utils/validateURL");

const {
  getUserArticles,
  saveUserArticle,
  deleteUserArticle,
} = require("../controllers/articles");

const router = express.Router();

router.get("/", getUserArticles);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required().min(2).max(30),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().custom(validateURL),
      image: Joi.string().required().custom(validateURL),
    }),
  }),
  saveUserArticle
);

router.delete(
  "/:articleId",
  celebrate({
    params: Joi.object().keys({
      articleId: Joi.string().required().length(24).alphanum().hex(),
    }),
  }),
  deleteUserArticle
);

module.exports = router;
