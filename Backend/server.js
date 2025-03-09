require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io"); // <-- Important: import { Server }
const userRoutes = require("./Routes/UserRoutes");
const projectRoutes = require("./Routes/ProjectRoutes");
//const clientRoutes = require('./Routes/ClientRoutes')

// Initialize Express
const app = express();
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

// Create HTTP server
// const server = http.createServer(app);

// // Create Socket.io server (only once!)
// const io = new Server(server, {
//   cors: {
//     origin: "*", // or specify your frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   },
// });

// // Optionally store io in app, so routes can broadcast events
// app.set("io", io);

// // Socket.io logic
// io.on("connection", (socket) => {
//   console.log("🟢 A user connected:", socket.id);

//   // Example: user joins a chat room
//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);
//     console.log(`Socket ${socket.id} joined room ${roomId}`);
//   });

//   // Example: receiving a chat message
//   socket.on("chatMessage", (data) => {
//     // data might be { roomId, text, senderId }
//     // Broadcast to everyone in that room
//     io.to(data.roomId).emit("chatMessage", data);
//   });

  // Example: user joins a notifications room
//   socket.on("joinNotifications", (userId) => {
//     socket.join(`notify_${userId}`);
//     console.log(`User ${userId} joined notifications room`);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 User disconnected:", socket.id);
//   });
// });

// Register your routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
// app.use("/api/clients", clientRoutes); // Register client API route

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
