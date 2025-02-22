// Routes/NotificationRoutes.js
const express = require("express");
const router = express.Router();
const Notification = require("../Models/Notification");
const protect = require("../middleware/authMiddleware");

// GET all notifications for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new notification (e.g., when application is accepted)
router.post("/", protect, async (req, res) => {
  try {
    const { userId, type, message } = req.body;

    const newNotification = new Notification({
      user: userId,
      type,
      message,
    });

    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT mark a notification as read
router.put("/:id/read", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    console.error("Error marking notification read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
