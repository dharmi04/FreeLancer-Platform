const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // Optional (for project-related chats)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
