const mongoose = require("mongoose");

const WishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, //自动生成 createAt和updateAt
  }
);

module.exports = mongoose.model('Wish', WishSchema)
