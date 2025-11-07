const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const Task = require("../models/Task");
const sendEmail = require("../utils/mailer");
const router = express.Router();
const logActivity = require("../utils/activityLogger");
const User = require("../models/User");  // REQUIRED for task assignedTo

//create task only admin or pm
router.post("/", protect, authorize("Admin", "ProjectManager"), async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      project: req.body.projectId,
      assignedTo: req.body.assignedTo
    });
    await logActivity(req.user._id, `Created task: ${task.title}`, task._id, task.project);

    // Find user jisko assign hua
    const assignedUser = await User.findById(req.body.assignedTo);

    if (assignedUser) {
      await sendEmail({
        to: assignedUser.email,
        subject: "New Task Assigned",
        text: `Hello ${assignedUser.name},\n\nYou have been assigned a new task: ${task.title}\nDescription: ${task.description}\n\nPlease check your dashboard.`
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task", msg: error.message });
  }
});

//fetch assigned tasks for a team member
router.get("/my-tasks", protect, authorize("TeamMember"), async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate("project", "name");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

//update task status only team member
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "email name");
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (req.user.role === "TeamMember") {
      if (task.assignedTo._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: "Not authorized to update this task" });
      }
      task.status = req.body.status || task.status;
    } else {
      Object.assign(task, req.body); 
    }

    await task.save();
    await logActivity(req.user._id, `Updated task status to ${task.status}`, task._id, task.project);

    // Send email on update
    if (task.assignedTo?.email) {
      await sendEmail({
        email: task.assignedTo.email,
        subject: "Task Updated",
        message: `Hello ${task.assignedTo.name},\n\nThe task "${task.title}" has been updated.\nCurrent Status: ${task.status}\n\nPlease check your dashboard.`
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete task only admin & pm
router.delete("/:taskId", protect, authorize("Admin", "ProjectManager"), async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    await task.remove();
    res.json({ msg: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
  await logActivity(req.user._id, `Deleted task: ${task.title}`, task._id, task.project);

});


module.exports = router;
