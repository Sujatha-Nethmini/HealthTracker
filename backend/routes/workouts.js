const express = require("express");
const router = express.Router();
const WorkoutLog = require("../models/WorkoutLog");

// GET all workouts for a user
router.get("/:userId", async (req, res) => {
  const workouts = await WorkoutLog.find({ user_id: req.params.userId })
    .sort({ logged_at: -1 });
  res.json(workouts);
});

// POST log a new workout
router.post("/", async (req, res) => {
  try {
    const workout = new WorkoutLog(req.body);
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a workout
router.delete("/:id", async (req, res) => {
  await WorkoutLog.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;