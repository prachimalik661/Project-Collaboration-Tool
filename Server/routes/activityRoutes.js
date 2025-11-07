const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const ActivityLog = require("../models/Activity");

const router = express.Router();

// Admin & PM sab logs dekh sakte hain
router.get("/", protect, authorize("Admin", "ProjectManager"), async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("user", "name email role")
      .populate("task", "title")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

// Team Member apne hi logs
router.get("/my-logs", protect, async (req, res) => {
  try {
    const logs = await ActivityLog.find({ user: req.user._id })
      .populate("task", "title")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch your logs" });
  }
});

module.exports = router;
