const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users",    require("./routes/users"));
app.use("/api/workouts", require("./routes/workouts"));
app.use("/api/sleep",    require("./routes/sleep"));
app.use("/api/meals",    require("./routes/meals"));

// Health check
app.get("/", (req, res) => res.send("✅ Health Tracker API is running"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));