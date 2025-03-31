const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const protect = require("../middleware/authMiddleware");
const auth = require("../middleware/auth")

// ✅ Import the upload middleware
const upload = require("../middleware/ImageMiddleware"); 

const router = express.Router();

// Update user profile (Protected)
router.put("/profile", protect, upload.single("profilePicture"), async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can update profile here." });
    }

    const { bio, portfolioProjects } = req.body;

    let profilePicturePath = null;
    if (req.file) {
      profilePicturePath = req.file.path; // Save file path
    }

    const updatedFields = {};
    if (bio !== undefined) updatedFields.bio = bio;
    if (portfolioProjects) {
      updatedFields.portfolioProjects = JSON.parse(portfolioProjects);
    }
    if (profilePicturePath) updatedFields.profilePicture = profilePicturePath;

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedFields }, { new: true });

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;



// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, skills, bio } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password, role, skills, bio });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error in /register:", err); // Log the error
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (Protected)
router.get("/", protect, async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get a single user by ID (Protected)
  router.get("/:id", protect, async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });


  router.get('/profile/:id', async (req, res) => {
    try {
      // Get user without password field
      const user = await User.findById(req.params.id).select('-password -email');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (err) {
      console.error('Error fetching profile:', err.message);
      res.status(500).send('Server Error');
    }
  });
  

  router.post("/follow/:id", auth, async (req, res) => {
    try {
      // Can't follow yourself
      if (req.user.id === req.params.id) {
        return res.status(400).json({ message: "You cannot follow yourself" });
      }
  
      const userToFollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
  
      if (!userToFollow || !currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if already following
      if (currentUser.following.includes(req.params.id)) {
        return res.status(400).json({ message: "Already following this user" });
      }
  
      // Add to following
      currentUser.following.push(req.params.id);
      await currentUser.save();
  
      // Add to followers
      userToFollow.followers.push(req.user.id);
      await userToFollow.save();
  
      res.json({ message: "User followed successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
  // Unfollow a user
  router.post("/unfollow/:id", auth, async (req, res) => {
    try {
      const userToUnfollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
  
      if (!userToUnfollow || !currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if not following
      if (!currentUser.following.includes(req.params.id)) {
        return res.status(400).json({ message: "You are not following this user" });
      }
  
      // Remove from following
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== req.params.id
      );
      await currentUser.save();
  
      // Remove from followers
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== req.user.id
      );
      await userToUnfollow.save();
  
      res.json({ message: "User unfollowed successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
  // Get user's following
  router.get("/:id/following", async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate("following", "name profilePicture bio");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user.following);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
  // Get user's followers
  router.get("/:id/followers", async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate("followers", "name profilePicture bio");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user.followers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  });

module.exports = router;
