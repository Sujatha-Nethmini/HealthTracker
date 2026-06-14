const express = require("express");
const router = express.Router();
const SleepLog = require("../models/SleepLog");

// GET all sleep logs for a user
router.get("/:userId", async (req, res) => {
  const logs = await SleepLog.find({ user_id: req.params.userId })
    .sort({ date: -1 });
  res.json(logs);
});

// POST log a new sleep entry
router.post("/", async (req, res) => {
  try {
    const log = new SleepLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;