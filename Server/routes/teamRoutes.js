const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const Team = require("../models/team");
const logActivity = require("../utils/activityLogger");

const router = express.Router();

//create team only admin & pm
router.post("/", protect, authorize("Admin", "ProjectManager"), async (req, res) => {
  try {
    const team = await Team.create({
      name: req.body.name,
      createdBy: req.user._id,
      members: req.body.members || []
    });
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: "Failed to create team" });
  }
  await logActivity(req.user._id, `Created team: ${team.name}`);

});

//join team
router.post("/join/:teamId", protect, authorize("TeamMember"), async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });

    if (!team.members.includes(req.user._id)) {
      team.members.push(req.user._id);
      await team.save();
    }
    await logActivity(req.user._id, `Joined team: ${team.name}`);

    res.json({ msg: "Joined the team", team });
  } catch (error) {
    res.status(500).json({ error: "Failed to join team" });
  }
});

//get all teams
router.get("/my-teams", protect, async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id }).populate("members", "name email role");
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

router.delete("/:teamId", protect, authorize("Admin"), async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });

    await team.remove();
    res.json({ msg: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete team" });
  }
  await logActivity(req.user._id, `Deleted team: ${team.name}`);

});


module.exports = router;
