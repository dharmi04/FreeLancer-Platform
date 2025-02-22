// Routes/ChatRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../Models/Message");
const protect = require("../middleware/authMiddleware"); // your auth middleware

// GET messages by roomId
// e.g., /api/chat/room/project_123
router.get("/room/:roomId", protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    // Fetch all messages in this room
    const messages = await Message.find({ roomId }).populate("sender", "name email");
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new message
// e.g., /api/chat/room/project_123
router.post("/room/:roomId", protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { text } = req.body;

    // Create a new message doc
    const newMessage = new Message({
      roomId,
      sender: req.user._id,
      text,
    });

    await newMessage.save();

    // Optionally broadcast via Socket.io here if you want
    // e.g. req.io.to(roomId).emit("chatMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error posting message:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
