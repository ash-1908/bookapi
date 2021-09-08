const mongoose = require("mongoose");

const PublicationSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
    minLength: 1,
    maxLength: 3,
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 20,
  },
  books: [{
    type: String,
    minLength: 3,
    maxLength: 15,
  }],
});

const PublicationModel = mongoose.model("publications", PublicationSchema);

module.exports = PublicationModel;