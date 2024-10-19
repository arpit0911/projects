const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// cerate the schema for the data
const reviewSchema = new Schema({
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});
//  to export the model sp that it can be used throughout
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
