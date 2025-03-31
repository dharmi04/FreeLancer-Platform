// routes/tweets.js
const express = require("express");
const router = express.Router();
const Tweet = require("../Models/Tweet");
const User = require("../Models/User");
const auth = require("../middleware/auth"); // Assuming you have auth middleware

// Get all tweets (with pagination)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tweets = await Tweet.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name profilePicture");

    const total = await Tweet.countDocuments();

    res.json({
      tweets,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get a specific tweet
router.get("/:id", async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id)
      .populate("userId", "name profilePicture")
      .populate("comments.userId", "name profilePicture");

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    res.json(tweet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Create a tweet
router.post("/", auth, async (req, res) => {
  try {
    const { content, media, tags } = req.body;
    
    if (!content && !media) {
      return res.status(400).json({ message: "Tweet must contain content or media" });
    }

    const newTweet = new Tweet({
      userId: req.user.id,
      content,
      media: media || "",
      tags: tags || []
    });

    const tweet = await newTweet.save();
    
    // Populate user info before sending response
    const populatedTweet = await Tweet.findById(tweet._id).populate("userId", "name profilePicture");
    
    res.status(201).json(populatedTweet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update a tweet
router.put("/:id", auth, async (req, res) => {
  try {
    let tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // Check if user owns this tweet
    if (tweet.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const { content, media, tags } = req.body;
    
    if (content) tweet.content = content;
    if (media !== undefined) tweet.media = media;
    if (tags) tweet.tags = tags;

    await tweet.save();
    
    // Populate user info before sending response
    tweet = await Tweet.findById(req.params.id).populate("userId", "name profilePicture");
    
    res.json(tweet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a tweet
router.delete("/:id", auth, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // Check if user owns this tweet
    if (tweet.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await tweet.remove();
    res.json({ message: "Tweet removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Like a tweet
router.post("/:id/like", auth, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // Check if already liked
    if (tweet.likes.includes(req.user.id)) {
      // Unlike
      tweet.likes = tweet.likes.filter(
        (userId) => userId.toString() !== req.user.id
      );
    } else {
      // Like
      tweet.likes.push(req.user.id);
    }

    await tweet.save();
    res.json(tweet.likes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Comment on a tweet
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const newComment = {
      userId: req.user.id,
      content
    };

    tweet.comments.unshift(newComment);
    await tweet.save();

    // Populate the new comment with user info
    const populatedTweet = await Tweet.findById(req.params.id).populate("comments.userId", "name profilePicture");
    
    res.json(populatedTweet.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get user's tweets
router.get("/user/:userId", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tweets = await Tweet.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name profilePicture");

    const total = await Tweet.countDocuments({ userId: req.params.userId });

    res.json({
      tweets,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;