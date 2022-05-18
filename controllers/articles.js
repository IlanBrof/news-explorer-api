const Article = require('../models/article');
const NotFoundErr = require('../middleware/errors/NotFound');
const UnauthorizedErr = require('../middleware/errors/Unauthorized');

const saveUserArticle = async (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image, owner, //eslint-disable-line
  } = req.body;
  const userId = req.user._id;
  try {
    const newSavedArticle = await Article.create({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image,
      owner: userId,
    });
    if (!newSavedArticle) {
      res.json('Error while saving article');
    }
    res.status(200).send(newSavedArticle);
  } catch (err) {
    next(err);
  }
};

const getUserArticles = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const articles = await Article.find({}).select('+owner');

    if (articles) {
      const userSavedArticles = articles.filter(
        (article) => article.owner.toHexString() === userId,
      );
      res.send(userSavedArticles);
    }
    if (!articles) {
      throw new NotFoundErr('Cannot find articles'); // Status(404)
    }
  } catch (err) {
    next(err);
  }
};

const deleteUserArticle = async (req, res, next) => {
  const userId = req.user._id;
  const article = await Article.findById(req.params.articleId).select('+owner');
  try {
    if (!article) {
      throw new NotFoundErr('Cannot find article to delete'); // Status(404)
    }
    const articleOwner = article.owner.toHexString();
    if (articleOwner !== userId) {
      throw new UnauthorizedErr(
        'You are not authorized to delete this article',
      ); // Status(401)
    }
    if (articleOwner === userId) {
      const articleToDelete = await Article.findByIdAndDelete( //eslint-disable-line
        req.params.articleId,
      );
    }
    res.status(200).json(`Article ${article.title} deleted successfully`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserArticles,
  saveUserArticle,
  deleteUserArticle,
};
