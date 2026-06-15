import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import API from "../api";

const USER_ID = "6a2eeed545bb96093aae8793";

const cardStyle = {
  background: "#f9f9f9", borderRadius: "12px",
  padding: "1.5rem", marginBottom: "1.5rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
};

function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [sleep,    setSleep]    = useState([]);
  const [meals,    setMeals]    = useState([]);

  useEffect(() => {
    API.get(`/workouts/${USER_ID}`).then(r => setWorkouts(r.data));
    API.get(`/sleep/${USER_ID}`).then(r => setSleep(r.data));
    API.get(`/meals/${USER_ID}`).then(r => setMeals(r.data));
  }, []);

  // Prepare chart data — last 7 workouts
  const workoutChart = workouts.slice(0, 7).reverse().map(w => ({
    date:     w.logged_at.slice(5, 10),
    calories: w.calories_burned,
    minutes:  w.duration_minutes,
  }));

  // Prepare sleep chart data
  const sleepChart = sleep.slice(0, 7).reverse().map(s => ({
    date:  s.date.slice(5),
    hours: s.duration_hours,
  }));

  // Summary stats
  const totalCaloriesBurned = workouts.reduce((sum, w) => sum + w.calories_burned, 0);
  const avgSleep = sleep.length
    ? (sleep.reduce((sum, s) => sum + s.duration_hours, 0) / sleep.length).toFixed(1)
    : 0;
  const totalMeals = meals.length;

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>👋 Welcome, Test User</h1>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ ...cardStyle, borderLeft: "4px solid #e94560" }}>
          <h3 style={{ margin: 0, color: "#e94560" }}> Total Calories Burned</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0" }}>{totalCaloriesBurned}</p>
          <p style={{ color: "#888", margin: 0 }}>across {workouts.length} workouts</p>
        </div>
        <div style={{ ...cardStyle, borderLeft: "4px solid #0f3460" }}>
          <h3 style={{ margin: 0, color: "#0f3460" }}> Avg Sleep</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0" }}>{avgSleep} hrs</p>
          <p style={{ color: "#888", margin: 0 }}>per night average</p>
        </div>
        <div style={{ ...cardStyle, borderLeft: "4px solid #16213e" }}>
          <h3 style={{ margin: 0, color: "#16213e" }}> Meals Logged</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0" }}>{totalMeals}</p>
          <p style={{ color: "#888", margin: 0 }}>total entries</p>
        </div>
      </div>

      {/* Workout Chart */}
      <div style={cardStyle}>
        <h2> Calories Burned — Last 7 Workouts</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={workoutChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="calories" stroke="#e94560" strokeWidth={2} />
            <Line type="monotone" dataKey="minutes"  stroke="#0f3460" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sleep Chart */}
      <div style={cardStyle}>
        <h2> Sleep Duration — Last 7 Nights</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={sleepChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="hours" stroke="#16213e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;