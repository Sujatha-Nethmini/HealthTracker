import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/",         label: "Dashboard", icon: "📊" },
  { to: "/workouts", label: "Workouts",  icon: "🏃" },
  { to: "/sleep",    label: "Sleep",     icon: "😴" },
  { to: "/meals",    label: "Meals",     icon: "🍽️" },
];

function Navbar() {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  return (
    <>
      {/* Top navbar — visible on desktop */}
      <nav style={{
        display: "flex", gap: "0.5rem", alignItems: "center",
        background: "#1a1a2e", padding: "1rem 2rem",
      }}>
        <Link to="/" style={{
          color: "#e94560", fontWeight: "bold", fontSize: "1.3rem",
          textDecoration: "none", marginRight: "1rem",
        }}>
          <Link to="/" style={{ textDecoration: "none", marginRight: "1rem", display: "flex", alignItems: "center", gap: "10px" }}>
  <img src="/logo.jpeg" alt="logo" style={{ height: "36px", width: "36px", borderRadius: "8px" }} />
  <span style={{ color: "#e94560", fontWeight: "bold", fontSize: "1.3rem" }}>HealthTracker</span>
</Link>
        </Link>

        <div className="nav-links" style={{ display: "flex", gap: "0.5rem" }}>
          {links.map(link => {
            const isActive  = location.pathname === link.to;
            const isHovered = hovered === link.to;
            return (
              <Link key={link.to} to={link.to}
                onMouseEnter={() => setHovered(link.to)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  color: isActive || isHovered ? "#e94560" : "#ccc",
                  textDecoration: "none", fontSize: "0.95rem",
                  padding: "6px 16px", borderRadius: "8px",
                  background: isActive  ? "rgba(233,69,96,0.15)"
                            : isHovered ? "rgba(233,69,96,0.08)"
                            : "transparent",
                  borderBottom: isActive ? "2px solid #e94560" : "2px solid transparent",
                  transition: "all 0.2s ease",
                }}>
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom navbar — visible on mobile */}
      <div className="bottom-nav">
        {links.map(link => {
          const isActive = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              textDecoration: "none", gap: "3px",
              color: isActive ? "#e94560" : "#888",
              fontSize: "10px", minWidth: "60px",
            }}>
              <span style={{ fontSize: "22px" }}>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default Navbar;