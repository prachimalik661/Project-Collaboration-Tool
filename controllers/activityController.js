const logActivity = require("../utils/logger");

router.post("/:taskId/assign/:userId", protect, authorize("Admin", "ProjectManager"), async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.assignedTo = req.params.userId;
    await task.save();

    await logActivity({
      action: "Task Assigned",
      performedBy: req.user._id,
      targetModel: "Task",
      targetId: task._id,
      details: { assignedTo: req.params.userId }
    });

    res.json({ msg: "Task assigned successfully", task });
  } catch (error) {
    res.status(500).json({ error: "Failed to assign task" });
  }
});

router.patch("/:taskId/status", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const oldStatus = task.status;
    task.status = req.body.status;
    await task.save();

    await logActivity({
      action: "Task Status Changed",
      performedBy: req.user._id,
      targetModel: "Task",
      targetId: task._id,
      details: { oldStatus, newStatus: req.body.status }
    });

    res.json({ msg: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});