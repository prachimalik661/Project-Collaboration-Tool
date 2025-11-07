const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const Project = require("../models/project");
const logActivity = require("../utils/activityLogger");
const router = express.Router();

//create project only admin or pm can do

// create project only admin or pm
router.post("/", protect, authorize("Admin", "ProjectManager"), async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      createdBy: req.user._id,
      teamMembers: req.body.teamMembers || [],
    });

    await logActivity(req.user._id, `Created project: ${project.name}`, null, project._id);

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
});


//get all projects
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find().populate("teamMembers", "name email role");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

//delete project only admin can do
router.delete("/:projectId", protect, authorize("Admin"), async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await Project.findByIdAndDelete(req.params.projectId);
await logActivity(req.user._id, `Deleted project: ${project.name}`, null, project._id);

    res.json({ msg: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});


module.exports = router;
