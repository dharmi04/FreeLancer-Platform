// routes/tweets.js
const express = require("express");
const router = express.Router();
const Tweet = require("../Models/Tweet");
const User = require("../Models/User");
const protect = require("../middleware/authMiddleware"); // Auth middleware

// Create a new tweet
router.post("/", protect, async (req, res) => {
  try {
    const { content, tags } = req.body;

    const tweet = new Tweet({
      userId: req.user._id, 
      content,
      tags
    });

    await tweet.save();
    res.status(201).json({ message: "Tweet posted successfully!", tweet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .populate("userId", "name profilePicture") // Get username & profile picture
      .sort({ createdAt: -1 });

    res.status(200).json(tweets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/user/:userId", async (req, res) => {
  try {
    const userTweets = await Tweet.find({ userId: req.params.userId })
      .populate("userId", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(userTweets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/like/:tweetId", protect, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    const userId = req.user._id;
    const index = tweet.likes.indexOf(userId);

    if (index === -1) {
      // Like the tweet
      tweet.likes.push(userId);
    } else {
      // Unlike the tweet
      tweet.likes.splice(index, 1);
    }

    await tweet.save();
    res.status(200).json({ message: index === -1 ? "Liked" : "Unliked", tweet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/comment/:tweetId", protect, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Comment cannot be empty" });

    const tweet = await Tweet.findById(req.params.tweetId);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    const newComment = {
      userId: req.user._id,
      content,
      createdAt: new Date()
    };

    tweet.comments.push(newComment);
    await tweet.save();

    res.status(201).json({ message: "Comment added!", tweet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:tweetId", protect, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    if (tweet.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this tweet" });
    }

    await tweet.deleteOne();
    res.status(200).json({ message: "Tweet deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:tweetId", async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId)
      .populate("userId", "name profilePicture")
      .populate("comments.userId", "name profilePicture");

    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    res.status(200).json(tweet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;