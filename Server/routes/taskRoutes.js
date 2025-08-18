const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const Task = require("../models/Task");

const router = express.Router();

router.post("/", protect, authorize("Admin", "ProjectManager"), async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      project: req.body.projectId,
      assignedTo: req.body.assignedTo
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

router.get("/my-tasks", protect, authorize("TeamMember"), async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate("project", "name");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.put("/:id", protect, authorize("TeamMember"), async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, assignedTo: req.user._id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.status = req.body.status || task.status;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

router.delete("/:taskId", protect, authorize("Admin"), async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    await task.remove();
    res.json({ msg: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});


module.exports = router;
