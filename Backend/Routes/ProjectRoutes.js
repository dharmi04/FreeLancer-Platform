const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Project = require("../Models/Project");
const User = require("../Models/User");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // For resume uploads
const uploadImage = require("../middleware/uploadImageMiddleware"); //image upload

// 1. Get all projects (Protected)
//    - Optional: Only "open" projects, or only for certain roles.
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

// 2. Get projects for the logged-in client (Protected, client only)
router.get("/my-projects", protect, async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can view their projects." });
    }

    const projects = await Project.find({ client: req.user._id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 3. Get single project by ID (Protected)
//    - Optional: Everyone can view, or restrict further if needed
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "name email")
      .populate("freelancer", "name email")
      .populate("applications.freelancer", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 4. Create a new project (Protected, client only)
// Create a new project (Protected, client only)
router.post(
  "/",
  protect,
  upload.single("projectImage"), // <-- MIDDLEWARE for single file
  async (req, res) => {
    try {
      if (req.user.role !== "client") {
        return res.status(403).json({ message: "Only clients can create projects." });
      }

      // Destructure fields from req.body (without `questions` here)
      const { title, description, budget, deadline, category } = req.body;

      // Parse the questions array from string to JSON
      let questions = [];
      if (req.body.questions) {
        try {
          questions = JSON.parse(req.body.questions);
        } catch (error) {
          return res.status(400).json({ message: "Invalid questions format. Must be a JSON array." });
        }
      }

      // Create project object
      const project = new Project({
        title,
        description,
        budget,
        deadline,
        category,
        client: req.user._id,
        questions, // Now this is a properly parsed array
      });

      // If a file was uploaded, store the path in `imageUrl`
      if (req.file) {
        project.imageUrl = req.file.path; // e.g., "uploads/images/project-123.png"
      }

      await project.save();
      res.status(201).json({ message: "Project created successfully", project });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);



// 5. Update a project (Protected, only the client who owns it)
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Project updated successfully", updatedProject });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 6. Delete a project (Protected, only the client who owns it)
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

// 7. Freelancer applies to a project (Protected, freelancer only)
// POST /api/projects/:projectId/apply (Protected, freelancer only)
router.post("/:projectId/apply", protect, upload.single("resume"), async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can apply." });
    }

    const { projectId } = req.params;
    const { answers } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Ensure project is open for applications
    if (project.status !== "open") {
      return res.status(400).json({ message: "Project is not open for applications." });
    }

    // Handle resume upload
    let resumeUrl = req.file ? req.file.path : null;

    // Ensure answers are correctly parsed
    let parsedAnswers = [];
    if (typeof answers === "string") {
      parsedAnswers = JSON.parse(answers);
    } else if (Array.isArray(answers)) {
      parsedAnswers = answers;
    }

    // ✅ Ensure `questionText` comes from project.questions
    const applicationAnswers = project.questions.map((q, index) => ({
      questionText: q.questionText, // Always take from project.questions
      answerText: parsedAnswers[index]?.answerText || "", // Avoid undefined errors
    }));

    // Create application object
    const application = {
      freelancer: req.user._id,
      answers: applicationAnswers, // ✅ Now correctly includes `questionText`
      resumeUrl,
      status: "pending",
    };

    project.applications.push(application);
    await project.save();

    res.status(201).json({ message: "Applied successfully", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// 8. Accept or Reject an application (Protected, client only)
router.put("/:projectId/applications/:applicationId", protect, async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can accept/reject applications." });
    }

    const { projectId, applicationId } = req.params;
    const { status } = req.body; // e.g. "accepted" or "rejected"

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check ownership
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Find the application subdoc
    const application = project.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    application.status = status;

    // If accepted, you can also set project.freelancer = application.freelancer, etc.
    if (status === "accepted") {
      project.freelancer = application.freelancer;
      project.status = "in progress";
    }

    await project.save();
    res.json({ message: `Application ${status} successfully`, project });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 9. (Optional) Directly assign a freelancer to a project
router.put("/:projectId/assign/:freelancerId", protect, async (req, res) => {
  try {
    const { projectId, freelancerId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check if the logged-in user is the client who created this project
    if (project.client.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized. Only the client can assign freelancers." });
    }

    // Check if the freelancer is valid
    const freelancer = await User.findById(freelancerId);
    if (!freelancer || freelancer.role !== "freelancer") {
      return res.status(404).json({ message: "Freelancer not found or invalid role" });
    }

    // Assign
    project.freelancer = freelancerId;
    project.status = "in progress";
    await project.save();

    res.json({ message: "Freelancer assigned successfully", project });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all projects by a specific userId (client)
router.get("/by-user/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;

    // Optionally, you can check if the logged-in user is admin or has permission
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Only admins can view other users' projects." });
    // }

    const projects = await Project.find({ client: userId })
      .populate("client", "name email")
      .populate("freelancer", "name email");

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



// Get projects a freelancer has applied to
// Get projects a freelancer has applied to
router.get("/by-freelancer/:freelancerId", async (req, res) => {
  try {
      const { freelancerId } = req.params;

      // Validate if freelancerId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(freelancerId)) {
          return res.status(400).json({ error: "Invalid Freelancer ID" });
      }

      const freelancerObjectId = new mongoose.Types.ObjectId(freelancerId);
      console.log("Freelancer ID received:", freelancerId);
      console.log("Converted ObjectId:", freelancerObjectId);

      // Query projects where the freelancer has applied
      const projects = await Project.find({ "applications.freelancer": freelancerObjectId });

      if (projects.length === 0) {
          return res.status(404).json({ error: "No projects found for this freelancer" });
      }

      console.log("Projects found:", projects);
      res.json(projects);
  } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});




module.exports = router;