const mongoose = require("mongoose");
const validatorModule = require("validator");

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  source: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validatorModule.isURL(v);
      },
    },
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validatorModule.isURL(v);
      },
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
    select: false,
  }
});

module.exports = mongoose.model('article', articleSchema);
