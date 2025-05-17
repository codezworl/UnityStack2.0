import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bgLogo from "../assets/Vector.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Header = () => {
  const [isExploreDropdownOpen, setIsExploreDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true,
        });

        if (response.data) {
          console.log("Header - Fetched user:", response.data);
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, {
        withCredentials: true,
      });

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Get display name based on user data
  const getDisplayName = () => {
    if (!user) return "";
    return user.displayName || 
      (user.role === 'organization' 
        ? user.companyName 
        : `${user.firstName || ''} ${user.lastName || ''}`.trim());
  };

  // Add function to handle header login click
  const handleHeaderLogin = () => {
    // Clear any stored return location when clicking login from header
    localStorage.removeItem('returnTo');
    localStorage.removeItem('returnAction');
    localStorage.removeItem('selectedChatDeveloper');
    navigate('/login');
  };

  return (
    <header
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f9fafb",
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/">
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
          </Link>
        </div>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "#64748b" }}>Home</Link>
          <Link to="/aboutus" style={{ textDecoration: "none", color: "#64748b" }}>About Us</Link>
          <Link to="/Getexperthelp" style={{ textDecoration: "none", color: "#64748b" }}>Get Help</Link>

          {/* Explore Dropdown */}
          <div
            style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={() => setIsExploreDropdownOpen(true)}
            onMouseLeave={() => setIsExploreDropdownOpen(false)}
          >
            <span style={{ cursor: "pointer", color: "#64748b", fontWeight: "500" }}>
              Explore
            </span>
            {isExploreDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <Link to="/question" style={{ display: "block", textDecoration: "none", color: "#64748b", padding: "8px 10px" }}>Questions</Link>
                <Link to="/companies" style={{ display: "block", textDecoration: "none", color: "#64748b", padding: "8px 10px" }}>Companies</Link>
              </div>
            )}
          </div>

          {/* User Dropdown */}
          {user ? (
            <div
              style={{ position: "relative", display: "inline-block" }}
              onMouseEnter={() => setIsUserDropdownOpen(true)}
              onMouseLeave={() => setIsUserDropdownOpen(false)}
            >
              <span style={{ cursor: "pointer", color: "#64748b" }}>{getDisplayName()}</span>
              {isUserDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    padding: "10px",
                    borderRadius: "5px",
                    minWidth: "150px"
                  }}
                >
                  {/* Show Profile Option Based on Role */}
                  {user?.role === "student" ? (
                    <>
                      <Link
                        to="/studentprofile"
                        style={{ display: "block", textDecoration: "none", color: "#64748b", padding: "8px 10px" }}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/studentdashboard"
                        style={{ 
                          display: "block", 
                          textDecoration: "none", 
                          color: "#2563EB", 
                          padding: "8px 10px",
                          fontWeight: "500",
                          borderBottom: "1px solid #E5E7EB",
                          marginBottom: "8px"
                        }}
                      >
                        <i className="fas fa-tachometer-alt" style={{ marginRight: "8px" }}></i>
                        My Dashboard
                      </Link>
                    </>
                  ) : user?.role === "developer" ? (
                    <>
                      <Link
                        to={`/profile/${user._id}`}
                        style={{ display: "block", textDecoration: "none", color: "#64748b", padding: "8px 10px" }}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/developerdashboard"
                        style={{ 
                          display: "block", 
                          textDecoration: "none", 
                          color: "#2563EB", 
                          padding: "8px 10px",
                          fontWeight: "500",
                          borderBottom: "1px solid #E5E7EB",
                          marginBottom: "8px"
                        }}
                      >
                        <i className="fas fa-tachometer-alt" style={{ marginRight: "8px" }}></i>
                        My Dashboard
                      </Link>
                    </>
                  ) : user?.role === "organization" ? (
                    <>
                      <Link
                        to={`/companiesprofile/${user._id}`}
                        style={{ display: "block", textDecoration: "none", color: "#64748b", padding: "8px 10px" }}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/companydashboard"
                        style={{ 
                          display: "block", 
                          textDecoration: "none", 
                          color: "#2563EB", 
                          padding: "8px 10px",
                          fontWeight: "500",
                          borderBottom: "1px solid #E5E7EB",
                          marginBottom: "8px"
                        }}
                      >
                        <i className="fas fa-tachometer-alt" style={{ marginRight: "8px" }}></i>
                        My Dashboard
                      </Link>
                    </>
                  ) : null}

                  {/* Logout Button */}
                  <button 
                    onClick={handleLogout} 
                    style={{ 
                      border: "none", 
                      background: "none", 
                      color: "#64748b", 
                      padding: "8px 10px", 
                      width: "100%", 
                      textAlign: "left" 
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={handleHeaderLogin}
              style={{ 
                textDecoration: "none", 
                color: "#ffffff", 
                backgroundColor: "#1d4ed8", 
                padding: "8px 20px", 
                borderRadius: "5px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Log in
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
