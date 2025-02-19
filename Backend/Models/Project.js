const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [
    {
      questionText: String,
      answerText: String,
    },
  ],
  resumeUrl: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    deadline: { type: Date, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["open", "in progress", "completed", "cancelled"],
      default: "open",
    },
    category: { type: String },
    questions: [
      {
        questionText: { type: String, required: true },
      },
    ],
    applications: [applicationSchema],

    // ⭐ NEW: store image path
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
