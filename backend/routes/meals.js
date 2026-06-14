const express = require("express");
const router = express.Router();
const MealLog = require("../models/MealLog");

// GET all meal logs for a user
router.get("/:userId", async (req, res) => {
  const meals = await MealLog.find({ user_id: req.params.userId })
    .sort({ logged_at: -1 });
  res.json(meals);
});

// POST log a new meal
router.post("/", async (req, res) => {
  try {
    const meal = new MealLog(req.body);
    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;