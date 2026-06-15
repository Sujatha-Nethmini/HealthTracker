import React, { useEffect, useState } from "react";
import API from "../api";

const USER_ID = "6a2eeed545bb96093aae8793";

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    activity: "", duration_minutes: "", calories_burned: "", heart_rate_avg: ""
  });

  const fetchWorkouts = () => {
    API.get(`/workouts/${USER_ID}`).then(r => setWorkouts(r.data));
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const [prediction, setPrediction] = useState(null);

const handleSubmit = async () => {
  // Get AI prediction first
  try {
    const mlRes = await fetch("http://localhost:8000/predict/calories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        duration_minutes: Number(form.duration_minutes),
        heart_rate_avg:   Number(form.heart_rate_avg),
        activity:         form.activity,
      }),
    });
    const mlData = await mlRes.json();
    setPrediction(mlData.predicted_calories);
  } catch {
    setPrediction(null);
  }

  // Log to database
  await API.post("/workouts", { ...form, user_id: USER_ID, type: "cardio" });
  setForm({ activity: "", duration_minutes: "", calories_burned: "", heart_rate_avg: "" });
  fetchWorkouts();
};

  const inputStyle = {
  padding: "8px 10px", borderRadius: "8px",
  border: "1px solid #ddd", fontSize: "13px",
  width: "100%", boxSizing: "border-box",
};

  return (
    <div>
      <h1>🏃 Workouts</h1>

      {/* Log form */}
      <div style={{ background: "#f9f9f9", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
        <h3>Log a Workout</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1rem"}}>
          <input style={inputStyle} placeholder="Activity (e.g. running)"
            value={form.activity} onChange={e => setForm({ ...form, activity: e.target.value })} />
          <input style={inputStyle} placeholder="Duration (mins)" type="number"
            value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: e.target.value })} />
          <input style={inputStyle} placeholder="Calories burned" type="number"
            value={form.calories_burned} onChange={e => setForm({ ...form, calories_burned: e.target.value })} />
          <input style={inputStyle} placeholder="Avg heart rate" type="number"
            value={form.heart_rate_avg} onChange={e => setForm({ ...form, heart_rate_avg: e.target.value })} />
        </div>
                {prediction && (
        <div style={{
            background: "#fff3cd", border: "1px solid #ffc107",
            borderRadius: "8px", padding: "12px 16px",
            marginBottom: "1rem", fontSize: "14px"
        }}>
            <strong>AI Prediction:</strong> Based on your input, you'll burn approximately <strong>{prediction} calories</strong>
        </div>
        )}
        <button onClick={handleSubmit}
          style={{ background: "#e94560", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
          + Log Workout
        </button>
      </div>

      {/* Workout list */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#1a1a2e", color: "#fff" }}>
            {["Date", "Activity", "Duration", "Calories", "Heart Rate"].map(h => (
              <th key={h} style={{ padding: "12px 16px", textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {workouts.map((w, i) => (
            <tr key={w._id} style={{ background: i % 2 === 0 ? "#fff" : "#f5f5f5" }}>
              <td style={{ padding: "10px 16px" }}>{w.logged_at.slice(0, 10)}</td>
              <td style={{ padding: "10px 16px", textTransform: "capitalize" }}>{w.activity}</td>
              <td style={{ padding: "10px 16px" }}>{w.duration_minutes} mins</td>
              <td style={{ padding: "10px 16px" }}>{w.calories_burned} cal</td>
              <td style={{ padding: "10px 16px" }}>{w.heart_rate_avg} bpm</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Workouts;