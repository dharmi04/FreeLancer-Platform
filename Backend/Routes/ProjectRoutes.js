const express = require("express");
const Project = require("../Models/Project");
const protect = require("../middleware/authMiddleware");
const User = require("../Models/User"); // Make sure you import User if using it

const router = express.Router();

// Get all projects (Protected)
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("client", "name email")
      .populate("freelancer", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new project (Protected)
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, budget, deadline } = req.body;
    const project = new Project({
      title,
      description,
      budget,
      deadline,
      client: req.user._id,
    });

    await project.save();
    res.status(201).json({ message: "Project created successfully", project });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a project (Protected)
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Project updated successfully", updatedProject });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a project (Protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await project.remove();
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Assign Freelancer to Project (Protected)
router.put("/:projectId/assign/:freelancerId", protect, async (req, res) => {
  try {
    const { projectId, freelancerId } = req.params;

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check if the logged-in user is the client who created this project
    if (project.client.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized. Only the client can assign freelancers." });
    }

    // Check if the freelancer exists and is a valid user
    const freelancer = await User.findById(freelancerId);
    if (!freelancer || freelancer.role !== "freelancer") {
      return res.status(404).json({ message: "Freelancer not found or invalid role" });
    }

    // Assign freelancer to the project
    project.freelancer = freelancerId;
    project.status = "in progress";
    await project.save();

    res.json({ message: "Freelancer assigned successfully", project });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
