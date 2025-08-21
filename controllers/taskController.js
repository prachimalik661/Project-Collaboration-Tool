// controllers/taskController.js
const Task = require("../models/Task");

// Create Task (Admin/PM)
exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      status: "Pending",
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks (Admin/PM see all, TM sees assigned tasks)
exports.getTasks = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "TeamMember") {
      query.assignedTo = req.user._id;
    }
    const tasks = await Task.find(query).populate("assignedTo", "name email role");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single task
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "name email");
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (req.user.role === "TeamMember") {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: "Not authorized to update this task" });
      }
      task.status = req.body.status || task.status;
    } else {
      Object.assign(task, req.body); // Admin/PM can update anything
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Task 
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    await task.remove();
    res.json({ msg: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
