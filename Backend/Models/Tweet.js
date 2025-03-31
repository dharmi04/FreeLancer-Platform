// models/Tweet.js
const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 280 // Standard tweet length
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    retweets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    comments: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      content: {
        type: String,
        required: true,
        maxlength: 280
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    media: {
      type: String, // URL or path to media file
      default: ""
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tweet", TweetSchema);