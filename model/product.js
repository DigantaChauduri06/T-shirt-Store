const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "A product name must be provided"],
    trim: true,
    maxLength: 120,
  },
  price: {
    type: Number,
    required: [true, "A product price must be provided"],
    maxLength: [6, "Product price maximum length is 6 digits"],
  },
  description: {
    type: String,
    required: [true, "A product description must be provided"],
  },
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
    },
  ],
  catagory: {
    type: String,
    required: [
      true,
      "A product catcgory must be provided... Catagories are short-sleves, long-sleves, hoodies,sweat-shirts",
    ],
    enum: {
      values: ["shortsleves", "longsleves", "hoodies", "sweatsleves"],
      message:
        "please choose from short-sleves, long-sleves, hoodies,sweat-shirts",
    },
  },
  stock: {
    type: Number,
    required: [true, "please add a number in stock"],
  },
  brand: {
    type: String,
    required: [true, "please add a brand name"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  noOfRatings: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        enum: {
          values: [1, 2, 3, 4, 5],
          message: "A ratting must be between 1 and 5",
        },
      },
      feedback: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);

/*
name,
price,
description,
photos [{},{}],
catagory,
brand,
stock,
ratting,
numOfReviews,
reviews [user,name,ratting,comment],
user,
createdAt

*/
