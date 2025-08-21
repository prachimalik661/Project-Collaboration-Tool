const express = require("express");
const ActivityLog = require("../models/ActivityLog");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorize("Admin"), async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

module.exports = router;