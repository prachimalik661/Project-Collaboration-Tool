const ActivityLog = require("../models/Activity");

const logActivity = async (userId, action, taskId = null, projectId = null) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      task: taskId,
      project: projectId,
    });
  } catch (error) {
    console.error("Error logging activity:", error.message);
  }
};

module.exports = logActivity;
