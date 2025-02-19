const express = require("express");
const router = express.Router();
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

      // Destructure fields from req.body
      const { title, description, budget, deadline, questions, category } = req.body;

      // Create project object
      const project = new Project({
        title,
        description,
        budget,
        deadline,
        category,
        client: req.user._id,
        questions: questions || [],
      });

      // If a file was uploaded, store the path in `imageUrl`
      if (req.file) {
        project.imageUrl = req.file.path; // e.g. "uploads/images/project-123.png"
      }

      await project.save();
      res.status(201).json({ message: "Project created successfully", project });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
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
router.post("/:projectId/apply", protect, upload.single("resume"), async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can apply." });
    }

    const { projectId } = req.params;
    const { answers } = req.body; // e.g. an array of { questionText, answerText }
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Optionally ensure project.status === "open"
    if (project.status !== "open") {
      return res.status(400).json({ message: "Project is not open for applications." });
    }

    // Handle resume upload
    let resumeUrl = null;
    if (req.file) {
      resumeUrl = req.file.path; // e.g. "uploads/resumes/resume-123456.pdf"
    }

    const application = {
      freelancer: req.user._id,
      answers: [],
      resumeUrl,
      status: "pending",
    };

    // If answers is a JSON string, parse it
    // otherwise, if it's already an array, just push
    let parsedAnswers = [];
    if (typeof answers === "string") {
      parsedAnswers = JSON.parse(answers);
    } else if (Array.isArray(answers)) {
      parsedAnswers = answers;
    }

    parsedAnswers.forEach((ans) => {
      application.answers.push({
        questionText: ans.questionText,
        answerText: ans.answerText,
      });
    });

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


module.exports = router;
