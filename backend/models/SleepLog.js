const mongoose = require("mongoose");

const sleepSchema = new mongoose.Schema({
  user_id:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date:           String,
  duration_hours: Number,
  quality:        String,
});

module.exports = mongoose.model("SleepLog", sleepSchema, "sleep_logs");