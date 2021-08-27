const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPage: String,
    category: [String],
    publication: Number
});

const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;