const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  user_id:          { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  logged_at:        { type: Date, default: Date.now },
  type:             String,
  activity:         String,
  duration_minutes: Number,
  calories_burned:  Number,
  heart_rate_avg:   Number,
});

module.exports = mongoose.model("WorkoutLog", workoutSchema, "workout_logs");