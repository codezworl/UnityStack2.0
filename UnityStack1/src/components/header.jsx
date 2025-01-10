import React, { useState } from "react";
import { Link } from "react-router-dom";
import bgLogo from "../assets/Vector.png"; // Assuming this is the correct path for your logo
import "@fortawesome/fontawesome-free/css/all.min.css"; // Importing Font Awesome

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control mobile menu visibility

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
  };

  return (
    <header className="bg-white py-3 border-bottom">
      <div className="container-fluid d-flex align-items-center justify-content-between px-0">
        {/* Logo Section */}
        <div className="d-flex align-items-center ms-3">
          <img src={bgLogo} alt="Logo" className="me-2" style={{ width: "200px", height: "40px",objectFit:"cover" }} />
          
        </div>

        {/* Search Bar (Hidden on Mobile) */}
        <div
          className="d-flex flex-grow-1 mx-3 d-none d-lg-flex"
          style={{ maxWidth: "600px", marginLeft: "20px", marginRight: "20px" }}
        >
          <div className="input-group">
            <input
              type="text"
              className="form-control border-end-0"
              placeholder="What service are you looking for today?"
              style={{ paddingLeft: "20px", paddingRight: "20px" }}
            />
            <button
              className="btn"
              style={{
                backgroundColor: "blue",
                color: "white",
                borderColor: "blue",
              }}
            >
              <i className="fas fa-search" style={{ color: "white" }}></i>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="d-flex align-items-center d-none d-lg-flex me-3">
          <Link
            to="/question"
            className="text-decoration-none me-3"
            style={{ color: "blue" }}
          >
            Questions
          </Link>
          <Link
            to="/alldevelopers"
            className="text-decoration-none me-3"
            style={{ color: "blue" }}
          >
            All Developers
          </Link>
          <Link
            to="/projects"
            className="text-decoration-none me-3"
            style={{ color: "blue" }}
          >
            Projects
          </Link>
          <Link
            to="/login"
            className="text-decoration-none me-3"
            style={{
              color: "blue",
              border: "1px solid blue",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "blue";
              e.target.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.color = "blue";
            }}
          >
            Join
          </Link>
        </div>

        {/* Mobile Menu Icon (Visible on Mobile) */}
        <div className="d-flex d-lg-none">
          <button onClick={handleMenuToggle} className="btn btn-light">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu bg-light p-3 d-lg-none">
          <div className="d-flex flex-column">
            <Link to="/questions" className="text-decoration-none text-dark py-2">
              Questions
            </Link>
            <Link to="/alldevelopers" className="text-decoration-none text-dark py-2">
              All Developers
            </Link>
            <Link to="/projects" className="text-decoration-none text-dark py-2">
              Projects
            </Link>
            <Link to="/login" className="text-decoration-none text-dark py-2">
              Join
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
