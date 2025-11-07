const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ActivityLog", activitySchema);
