const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  user_id:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  logged_at:      { type: Date, default: Date.now },
  meal_type:      String,
  foods:          Array,
  total_calories: Number,
});

module.exports = mongoose.model("MealLog", mealSchema, "meal_logs");