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
      questionText: typeof q === "string" ? q : q.questionText, // Handle string-based and object-based questions
      answerText: parsedAnswers[index]?.answerText || "",
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




router.get("/updates", protect, async (req, res) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      return res.status(400).json({ message: "Client ID not found" });
    }

    console.log("Fetching projects for client:", clientId);

    // Fetch projects related to this client
    const projects = await Project.find({ clientId }).populate("updates");

    if (!projects.length) {
      return res.status(404).json({ message: "No projects found for this client" });
    }

    console.log("Projects found:", projects);

    // Extract updates safely
    const allUpdates = projects.flatMap((project) =>
      (project.updates || []).map((update) => ({
        projectId: project._id,
        projectTitle: project.title,
        freelancerName: update.freelancerName || "Unknown",
        progress: update.progress || "No progress data",
        note: update.note || "No notes",
        timestamp: update.timestamp || new Date(),
      }))
    );

    // Sort updates by timestamp (most recent first)
    const sortedUpdates = allUpdates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ updates: sortedUpdates });
  } catch (error) {
    console.error("Error fetching project updates:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// // Get project updates
// router.get("/:projectId/updates", protect, async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     const project = await Project.findById(projectId).populate("updates.freelancer", "name email");

//     if (!project) return res.status(404).json({ message: "Project not found" });

//     return res.status(200).json({ updates: project.updates });
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", error });
//   }
// });

// In your projects router file
// router.get("/:projectId/updates", protect, async (req, res) => {
//   try {
//     // Ensure only clients can access their project updates
//     if (req.user.role !== 'client') {
//       return res.status(403).json({ message: "Access denied. Client role required." });
//     }

//     // Find all projects associated with this client
//     const projects = await Project.find({ client: req.user.id })
//       .populate({
//         path: 'updates.freelancer',
//         select: 'name email' // Select only necessary freelancer details
//       })
//       .populate('freelancer', 'name email') // Populate freelancer details for each project
//       .select('title status budget updates freelancer');

//     // Transform the data to create a comprehensive updates list
//     const projectUpdates = projects.map(project => ({
//       projectId: project._id,
//       projectTitle: project.title,
//       projectStatus: project.status,
//       projectBudget: project.budget,
//       freelancerName: project.freelancer?.name || 'Unassigned',
//       updates: project.updates.map(update => ({
//         progress: update.progress,
//         note: update.note,
//         timestamp: update.timestamp,
//         freelancerName: update.freelancer?.name || 'Unknown'
//       })).sort((a, b) => b.timestamp - a.timestamp) // Sort updates from newest to oldest
//     }));

//     return res.status(200).json({
//       message: "Project updates retrieved successfully",
//       updates: projectUpdates
//     });
//   } catch (error) {
//     console.error("Error retrieving project updates:", error);
//     return res.status(500).json({ 
//       message: "Server error", 
//       error: error.message 
//     });
//   }
// });













router.put("/:projectId/update-progress", async (req, res) => {
  const { progress } = req.body;
  const projectId = req.params.projectId; // ✅ Correcting the parameter key
  console.log("Received projectId:", projectId);

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.progress = progress; // Update progress field
    await project.save();

    res.json({ message: "Progress updated successfully", project });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:projectId/discussions", async (req, res) => {
  const { sender, text } = req.body; 
  const projectId = req.params.projectId;

  if (!text || !sender) {
    return res.status(400).json({ message: "Sender and text are required" });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const newMessage = {
      sender,
      text, // Ensure you're storing `text`, not `message`
      timestamp: new Date(),
    };

    project.messages.push(newMessage);
    await project.save();

    // Emit new message event to clients
    io.to(projectId).emit("messageReceived", newMessage);

    res.json({ message: "Message added successfully", newMessage });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:projectId/discussions", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate("messages.sender", "name"); // Populate sender details
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ discussions: project.messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//add update
router.post("/:projectId/update", protect , async (req, res) => {
  try {
    const { projectId } = req.params;
    const { progress, note } = req.body;
    const userId = req.user.id; // Authenticated freelancer

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Ensure only assigned freelancers can update progress
    if (project.freelancer.toString() !== userId)
      return res.status(403).json({ message: "Not authorized to update progress" });

    // Add update entry
    const updateEntry = {
      progress,
      note,
      timestamp: new Date(),
      freelancer: userId,
    };

    project.updates.push(updateEntry);
    await project.save();

    return res.status(200).json({ message: "Progress updated", project });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// GET all updates for all projects of the authenticated client
router.get("/updates", protect, async (req, res) => {
  try {
    console.log("Authenticated user:", req.user); // Check if req.user is populated
    const clientId = req.user.id;
    
    // Fetch projects where the client field matches the authenticated user's ID
    const projects = await Project.find({ client: clientId });
    console.log("Fetched projects:", projects);
    
    let allUpdates = [];
    projects.forEach((project) => {
      if (project.updates && Array.isArray(project.updates)) {
        project.updates.forEach((update) => {
          // Safely convert to a plain object if possible
          const updateObj = (update && typeof update.toObject === "function")
            ? update.toObject()
            : update;
          allUpdates.push({
            projectId: project._id,
            ...updateObj,
          });
        });
      } else {
        console.log(`Project ${project._id} has no updates array or it's not an array.`);
      }
    });
    
    console.log("Aggregated updates before sorting:", allUpdates);
    
    allUpdates.sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
      const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
      return dateB - dateA;
    });
    
    return res.status(200).json({ updates: allUpdates });
  } catch (error) {
    // Log full error details to the console
    console.error("Error in /updates endpoint:", error.message);
    console.error(error.stack);
    return res.status(500).json({ message: "Server error" });
  }
});



// GET updates for a specific project by projectId
router.get("/:projectId/updates", protect, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id; // The authenticated user's ID

    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Optionally, ensure that the authenticated user is authorized to view the updates.
    // For example, only the client or the assigned freelancer can access the updates.
    if (
      project.client.toString() !== userId &&
      (!project.freelancer || project.freelancer.toString() !== userId)
    ) {
      return res.status(403).json({ message: "Not authorized to view updates" });
    }

    // Return the updates
    return res.status(200).json({ updates: project.updates });
  } catch (error) {
    console.error("Error fetching updates for project:", error);
    return res.status(500).json({ message: "Server error" });
  }
});





module.exports = router;