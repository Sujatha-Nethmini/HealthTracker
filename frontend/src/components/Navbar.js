import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/",         label: "Dashboard" },
  { to: "/workouts", label: "Workouts"  },
  { to: "/sleep",    label: "Sleep"     },
  { to: "/meals",    label: "Meals"     },
];

function Navbar() {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  return (
    <nav style={{
      display: "flex", gap: "0.5rem", alignItems: "center",
      background: "#1a1a2e", padding: "1rem 2rem",
    }}>
      {/* Brand */}
      <Link to="/" style={{
        color: "#e94560", fontWeight: "bold", fontSize: "1.3rem",
        textDecoration: "none", marginRight: "1rem",
      }}>
        💪 HealthTracker
      </Link>

      {/* Nav links */}
      {links.map(link => {
        const isActive  = location.pathname === link.to;
        const isHovered = hovered === link.to;
        return (
          <Link key={link.to} to={link.to}
            onMouseEnter={() => setHovered(link.to)}
            onMouseLeave={() => setHovered(null)}
            style={{
              color: isActive ? "#e94560" : isHovered ? "#e94560" : "#ccc",
              textDecoration: "none",
              fontSize: "0.95rem",
              padding: "6px 16px",
              borderRadius: "8px",
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
    </nav>
  );
}

export default Navbar;