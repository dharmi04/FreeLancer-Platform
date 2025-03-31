// const mongoose = require("mongoose");

// const applicationSchema = new mongoose.Schema(
//   {
//     freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     answers: [
//       {
//         questionText: { type: String, required: true },
//         answerText: { type: String, required: true },
//       },
//     ],
//     resumeUrl: { type: String, default: "" },
//     status: {
//       type: String,
//       enum: ["pending", "accepted", "rejected"],
//       default: "pending",
//     },
//   },
//   { _id: false } // Prevents automatic generation of _id for array elements
// );

// // Message Schema for Chat Feature
// const messageSchema = new mongoose.Schema(
//   {
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     text: { type: String, required: true },
//     timestamp: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

// const projectSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     budget: { type: Number, required: true },
//     deadline: { type: Date, required: true },
//     client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
//     status: {
//       type: String,
//       enum: ["open", "in progress", "completed", "cancelled"],
//       default: "open",
//     },
//     category: { type: String },

//     // Questions Array
//     questions: [{
//       questionText: String, // Ensure it's an object
//       type: String, // Optional: Add other properties if needed
//     }],

//     applications: {
//       type: [applicationSchema], // Explicitly define it as an array of the schema
//       default: [], // Ensure it defaults to an empty array
//     },

//     // Messages for communication between client and freelancer
//     messages: {
//       type: [messageSchema], // Array of message objects
//       default: [], // Initialize as an empty array
//     },

//     // Image field
//     imageUrl: { type: String, default: "" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Project", projectSchema);


const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [
      {
        questionText: { type: String, required: true },
        answerText: { type: String, required: true },
      },
    ],
    resumeUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
);

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const updateSchema = new mongoose.Schema(
  {
    progress: { type: Number, min: 0, max: 100, required: true },
    note: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: false }
);

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
    
    questions: [{
      questionText: String,
      type: String,
    }],

    applications: {
      type: [applicationSchema],
      default: [],
    },

    messages: {
      type: [messageSchema],
      default: [],
    },

    updates: {
      type: [updateSchema],
      default: [],
    },

    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);