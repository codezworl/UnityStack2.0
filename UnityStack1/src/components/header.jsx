import React, { useState } from "react";
import { Link } from "react-router-dom";
import bgLogo from "../assets/Vector.png"; // Replace with your actual logo path
import "@fortawesome/fontawesome-free/css/all.min.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f9fafb", // Light background
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        position: "relative",
        zIndex: "1000",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Logo Section */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={bgLogo}
            alt="Logo"
            style={{
              width: "120px",
              height: "auto",
              objectFit: "contain",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          {["Home", "Explore", "Expert Help", "Projects"].map((text, index) => (
            <Link
              key={index}
              to={`/${text.toLowerCase().replace(" ", "")}`}
              style={{
                textDecoration: "none",
                color: "#64748b", // Gray shade for text
                position: "relative",
                overflow: "hidden",
                transition: "color 0.3s ease-in-out",
                fontWeight: "500",
              }}
              onMouseOver={(e) => (e.target.style.color = "#1d4ed8")} // Blue on hover
              onMouseOut={(e) => (e.target.style.color = "#64748b")} // Back to gray
            >
              {text}
              <span
                style={{
                  position: "absolute",
                  left: "0",
                  bottom: "-2px",
                  width: "100%",
                  height: "2px",
                  backgroundColor: "#1d4ed8", // Blue underline
                  transform: "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform 0.3s ease-in-out",
                }}
                className="underline"
              ></span>
            </Link>
          ))}
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "#ffffff",
              backgroundColor: "#1d4ed8", // Blue background for button
              padding: "8px 20px",
              borderRadius: "5px",
              fontWeight: "500",
              transition: "all 0.3s ease-in-out",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          >
            Log in
          </Link>
        </nav>

        {/* Mobile Menu Icon */}
        <div style={{ display: "none", cursor: "pointer" }}>
          <button
            onClick={handleMenuToggle}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "24px",
            }}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "20px",
            position: "absolute",
            top: "100%",
            left: "0",
            width: "100%",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {["Home", "Explore", "Expert Help", "Projects", "Log in"].map(
            (text, index) => (
              <Link
                key={index}
                to={`/${text.toLowerCase().replace(" ", "")}`}
                style={{
                  display: "block",
                  padding: "10px 0",
                  color: "#64748b", // Gray text
                  textDecoration: "none",
                  fontWeight: "500",
                }}
                onMouseOver={(e) => (e.target.style.color = "#1d4ed8")}
                onMouseOut={(e) => (e.target.style.color = "#64748b")}
              >
                {text}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
