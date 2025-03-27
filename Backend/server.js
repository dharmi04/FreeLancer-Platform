require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const userRoutes = require("./Routes/UserRoutes");
const projectRoutes = require("./Routes/ProjectRoutes");
const Project = require('./Models/Project');

// Initialize Express
const app = express();
const server = http.createServer(app); // Wrap Express in HTTP server

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Ensure this matches your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use("/uploads", express.static("uploads")); // Serve static files from /uploads
app.use(express.json());
app.use(cors());

// Load environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://forcoding94:4eGSWvZvgi2HrZJO@cluster0.m2qbv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a room for a specific project
  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`User joined project room: ${projectId}`);
  });

  // Listen for new messages
  socket.on("newMessage", async ({ projectId, sender, message }) => {
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        console.error("Project not found");
        return;
      }

      // Ensure `discussionThreads` exists before pushing messages
      if (!project.discussionThreads) {
        project.discussionThreads = []; // Initialize array if it's undefined
      }

      const newMessage = {
        sender,
        message,
        timestamp: new Date(),
      };

      project.discussionThreads.push(newMessage);
      await project.save();

      // Send the new message to all users in the project room
      io.to(projectId).emit("messageReceived", newMessage);
    } catch (error) {
      console.error("Error adding message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});


// Register routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

// Start Server using `server.listen` instead of `app.listen`
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
