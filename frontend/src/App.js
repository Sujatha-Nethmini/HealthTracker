import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Sleep from "./pages/Sleep";
import Meals from "./pages/Meals";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/"         element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/sleep"    element={<Sleep />} />
          <Route path="/meals"    element={<Meals />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;