const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, 
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetModel: { type: String, required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  details: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
