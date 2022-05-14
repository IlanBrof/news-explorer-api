const Article = require("../models/article");

const getUserArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({});
    if (!articles) {
      // throw new NotFoundErr('Cannot find articles'); // Status(404)
      return res.status(404).send({ message: "Cannot find articles" });
    }
    res.send(articles);
  } catch (err) {
    next(err);
  }
};

const saveUserArticle = async (req, res, next) => {
  const { keyword, title, text, date, source, link, image, owner } = req.body;
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
      res.json("Error while saving article");
    }
    res.status(200).send(newSavedArticle);
  } catch (err) {
    next(err);
  }
};

const deleteUserArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.articleId);
    if (!article) {
      // throw new NotFoundErr('Cannot find card to delete'); // Status(404)
      return res.status(404).send({ message: "Cannot find card to delete" });
    }
    res.status(200).json(`Card ${card.name} deleted successfully`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserArticles,
  saveUserArticle,
  deleteUserArticle,
}
