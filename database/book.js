const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
  ISBN: { type: String, required: true, minLength: 3, maxLength: 15 },
  title: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 40,
  },
  authors: [{
    type: Number,
    required: true,
    minLength: 1,
    maxLength: 3,
  }],
  language: { type: String, minLength: 2, maxLength: 4 },
  pubDate: { type: String, minLength: 4, maxLength: 10 },
  numOfPage: { type: String, minLength: 1, maxLength: 4 },
  category: [{ type: String, minLength: 1, maxLength: 10 }],
  publication: { type: Number, minLength: 1, maxLength: 3 },
});

const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;