const express = require('express');

const {
  getUserArticles,
  saveUserArticle,
  deleteUserArticle,
} = require('../controllers/articles');

const router = express.Router();

router.get('/', getUserArticles);

router.post('/', saveUserArticle);

router.delete('/:articleId', deleteUserArticle);

module.exports = router;
