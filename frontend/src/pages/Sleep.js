import React, { useEffect, useState } from "react";
import API from "../api";

const USER_ID = "6a2eeed545bb96093aae8793";

function Sleep() {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ date: "", duration_hours: "", quality: "good" });

  const fetchLogs = () => API.get(`/sleep/${USER_ID}`).then(r => setLogs(r.data));
  useEffect(() => { fetchLogs(); }, []);

  const [prediction, setPrediction] = useState(null);

const handleSubmit = async () => {
  // Get AI prediction
  try {
    const mlRes = await fetch("http://localhost:8000/predict/sleep-quality", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duration_hours: Number(form.duration_hours) }),
    });
    const mlData = await mlRes.json();
    setPrediction(mlData);
  } catch {
    setPrediction(null);
  }

  await API.post("/sleep", { ...form, user_id: USER_ID });
  setForm({ date: "", duration_hours: "", quality: "good" });
  fetchLogs();
};

  const qualityColor = { good: "#4caf50", fair: "#ff9800", poor: "#f44336" };
  const inputStyle = { padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" };

  return (
    <div>
      <h1>😴 Sleep Logs</h1>
      <div style={{ background: "#f9f9f9", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
        <h3>Log Sleep</h3>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <input style={inputStyle} type="date" value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })} />
          <input style={inputStyle} type="number" placeholder="Hours slept"
            value={form.duration_hours} onChange={e => setForm({ ...form, duration_hours: e.target.value })} />
          <select style={inputStyle} value={form.quality}
            onChange={e => setForm({ ...form, quality: e.target.value })}>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>
                {prediction && (
        <div style={{
            background: "#e8f5e9", border: "1px solid #4caf50",
            borderRadius: "8px", padding: "12px 16px",
            marginBottom: "1rem", fontSize: "14px"
        }}>
            <strong>AI Prediction:</strong> {prediction.duration_hours} hours of sleep → <strong>{prediction.predicted_quality}</strong> quality
            ({prediction.confidence_percent}% confidence)
        </div>
        )}
        <button onClick={handleSubmit}
          style={{ background: "#0f3460", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer" }}>
          + Log Sleep
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#1a1a2e", color: "#fff" }}>
            {["Date", "Hours", "Quality"].map(h => (
              <th key={h} style={{ padding: "12px 16px", textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((s, i) => (
            <tr key={s._id} style={{ background: i % 2 === 0 ? "#fff" : "#f5f5f5" }}>
              <td style={{ padding: "10px 16px" }}>{s.date}</td>
              <td style={{ padding: "10px 16px" }}>{s.duration_hours} hrs</td>
              <td style={{ padding: "10px 16px" }}>
                <span style={{ background: qualityColor[s.quality], color: "#fff", padding: "3px 10px", borderRadius: "99px", fontSize: "12px" }}>
                  {s.quality}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Sleep;