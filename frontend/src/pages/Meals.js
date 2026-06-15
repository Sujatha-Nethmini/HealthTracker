import React, { useEffect, useState } from "react";
import API from "../api";

const USER_ID = "6a2eeed545bb96093aae8793";

const FOODS_DB = [
  { name: "Rice", calories: 260, protein_g: 5, carbs_g: 57, fat_g: 0.4 },
  { name: "Chicken curry", calories: 210, protein_g: 28, carbs_g: 4, fat_g: 9 },
  { name: "Egg", calories: 70, protein_g: 6, carbs_g: 0, fat_g: 5 },
  { name: "Bread", calories: 80, protein_g: 3, carbs_g: 15, fat_g: 1 },
  { name: "Banana", calories: 90, protein_g: 1, carbs_g: 23, fat_g: 0 },
  { name: "Milk", calories: 120, protein_g: 8, carbs_g: 12, fat_g: 5 },
  { name: "Oats", calories: 150, protein_g: 5, carbs_g: 27, fat_g: 3 },
  { name: "Salad", calories: 50, protein_g: 2, carbs_g: 8, fat_g: 1 },
];

const inputStyle = {
  padding: "8px 12px", borderRadius: "8px",
  border: "1px solid #ddd", fontSize: "14px",
};

function Meals() {
  const [meals, setMeals]       = useState([]);
  const [mealType, setMealType] = useState("breakfast");
  const [selected, setSelected] = useState([]);
  const [customFood, setCustomFood] = useState({ name: "", calories: "" });

  const fetchMeals = () => API.get(`/meals/${USER_ID}`).then(r => setMeals(r.data));
  useEffect(() => { fetchMeals(); }, []);

  // Toggle a food from the quick-pick list
  const toggleFood = (food) => {
    setSelected(prev =>
      prev.find(f => f.name === food.name)
        ? prev.filter(f => f.name !== food.name)
        : [...prev, food]
    );
  };

  // Add a custom food entry
  const addCustomFood = () => {
    if (!customFood.name || !customFood.calories) return;
    setSelected(prev => [...prev, { name: customFood.name, calories: Number(customFood.calories) }]);
    setCustomFood({ name: "", calories: "" });
  };

  const totalCalories = selected.reduce((sum, f) => sum + f.calories, 0);

  const handleSubmit = async () => {
    if (selected.length === 0) return alert("Please select at least one food.");
    await API.post("/meals", {
      user_id: USER_ID,
      meal_type: mealType,
      foods: selected,
      total_calories: totalCalories,
    });
    setSelected([]);
    setMealType("breakfast");
    fetchMeals();
  };

  return (
    <div>
      <h1>🍽️ Meal Logs</h1>

      {/* Log form */}
      <div style={{ background: "#f9f9f9", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
        <h3>Log a Meal</h3>

        {/* Meal type selector */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ marginRight: "1rem", fontWeight: "500" }}>Meal type:</label>
          {["breakfast", "lunch", "dinner", "snack"].map(type => (
            <button key={type} onClick={() => setMealType(type)}
              style={{
                marginRight: "8px", padding: "6px 16px", borderRadius: "99px", cursor: "pointer",
                border: "1px solid #ddd", fontSize: "13px", textTransform: "capitalize",
                background: mealType === type ? "#1a1a2e" : "#fff",
                color: mealType === type ? "#fff" : "#333",
              }}>
              {type}
            </button>
          ))}
        </div>

        {/* Quick pick foods */}
        <p style={{ fontWeight: "500", marginBottom: "8px" }}>Quick pick foods:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1rem" }}>
          {FOODS_DB.map(food => {
            const isSelected = selected.find(f => f.name === food.name);
            return (
              <button key={food.name} onClick={() => toggleFood(food)}
                style={{
                  padding: "6px 14px", borderRadius: "99px", cursor: "pointer",
                  border: "1px solid #ddd", fontSize: "13px",
                  background: isSelected ? "#e94560" : "#fff",
                  color: isSelected ? "#fff" : "#333",
                }}>
                {food.name} ({food.calories} cal)
              </button>
            );
          })}
        </div>

        {/* Custom food input */}
        <p style={{ fontWeight: "500", marginBottom: "8px" }}>Add custom food:</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
          <input style={inputStyle} placeholder="Food name"
            value={customFood.name}
            onChange={e => setCustomFood({ ...customFood, name: e.target.value })} />
          <input style={{ ...inputStyle, width: "140px" }} placeholder="Calories" type="number"
            value={customFood.calories}
            onChange={e => setCustomFood({ ...customFood, calories: e.target.value })} />
          <button onClick={addCustomFood}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #ddd", cursor: "pointer", background: "#fff" }}>
            + Add
          </button>
        </div>

        {/* Selected summary */}
        {selected.length > 0 && (
          <div style={{ background: "#fff", borderRadius: "8px", padding: "1rem", marginBottom: "1rem", border: "1px solid #eee" }}>
            <p style={{ margin: "0 0 8px", fontWeight: "500" }}>Selected foods:</p>
            {selected.map((f, i) => (
              <span key={i} style={{ display: "inline-block", background: "#f0f0f0", borderRadius: "99px", padding: "4px 12px", marginRight: "6px", marginBottom: "6px", fontSize: "13px" }}>
                {f.name} — {f.calories} cal
                <span onClick={() => setSelected(selected.filter((_, j) => j !== i))}
                  style={{ marginLeft: "8px", cursor: "pointer", color: "#e94560" }}>×</span>
              </span>
            ))}
            <p style={{ margin: "8px 0 0", fontWeight: "bold", color: "#e94560" }}>
              Total: {totalCalories} calories
            </p>
          </div>
        )}

        <button onClick={handleSubmit}
          style={{ background: "#e94560", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
          + Log Meal
        </button>
      </div>

      {/* Meal history table */}
      <h3>Meal History</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#1a1a2e", color: "#fff" }}>
            {["Date", "Meal Type", "Foods", "Total Calories"].map(h => (
              <th key={h} style={{ padding: "12px 16px", textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {meals.map((m, i) => (
            <tr key={m._id} style={{ background: i % 2 === 0 ? "#fff" : "#f5f5f5" }}>
              <td style={{ padding: "10px 16px" }}>{m.logged_at.slice(0, 10)}</td>
              <td style={{ padding: "10px 16px", textTransform: "capitalize" }}>{m.meal_type}</td>
              <td style={{ padding: "10px 16px" }}>{m.foods.map(f => f.name).join(", ")}</td>
              <td style={{ padding: "10px 16px" }}>{m.total_calories} cal</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Meals;