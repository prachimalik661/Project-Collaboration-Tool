const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({ action, performedBy, targetModel, targetId, details }) => {
  try {
    await ActivityLog.create({
      action,
      performedBy,
      targetModel,
      targetId,
      details
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

module.exports = logActivity;
logger.js