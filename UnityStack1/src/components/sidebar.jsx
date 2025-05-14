import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faChartSimple,
  faComments,
  faProjectDiagram,
  faVideo,
  faSignOutAlt,
  faUser,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import profileBg from "../assets/silver1.jpeg"; // Background Image
import defaultProfile from "../assets/logo.jpg"; // Default Profile Image

const Sidebar = ({ onSelectPage, selectedPage }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(""); // "developer" or "student"
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const sessionRes = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true,
        });

        const sessionUser = sessionRes.data;
        console.log("Session user:", sessionUser);
        setUserType(sessionUser.role);

        // Set user data from session response
        setUser({
          ...sessionUser,
          displayName:
            sessionUser.displayName ||
            (sessionUser.role === "organization"
              ? sessionUser.companyName
              : `${sessionUser.firstName || ""} ${
                  sessionUser.lastName || ""
                }`.trim()),
        });
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // ✅ Handle Logout
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  // ✅ Determine User Role
  const roleLabel = userType === "developer" ? "Developer" : "Student";

  // ✅ Profile Image Handling
  const profileImage = user?.profileImage
    ? `http://localhost:5000${user.profileImage}`
    : defaultProfile;

  // ✅ Navigation Options for Developer and Student
  const navigationLinks =
    userType === "developer"
      ? [
          { icon: faHouse, label: "Home", page: "home" },
          {
            icon: faChartSimple,
            label: "Dashboard",
            page: "dashboard",
          },
          { icon: faComments, label: "Chat", page: "chat" },
          { icon: faBriefcase, label: "Work", page: "work" },
          { icon: faVideo, label: "Sessions", page: "sessions" },
          {
            icon: faUser,
            label: "Find Developer",
            page: "finddeveloper",
          },
          { icon: faBriefcase, label: "Find Work", page: "findwork" },
        ]
      : [
          { icon: faHouse, label: "Dashboard", page: "studentdashboard" },
          { icon: faChartSimple, label: "Account", page: "account" },
          { icon: faComments, label: "Chat", page: "chat" },
          {
            icon: faUser,
            label: "Find Developer",
            page: "finddeveloper",
          },
          {
            icon: faProjectDiagram,
            label: "Schedule Session",
            page: "sessionSchedule",
          },
          { icon: faVideo, label: "Session History", page: "SessionHistory" },
        ];

  return (
    <>
      {/* Sidebar for Larger Screens */}
      <aside
        className="d-none d-lg-block bg-light shadow-sm"
        style={{
          width: "270px",
          height: "calc(100vh - 120px)",
          margin: "24px",
          borderRight: "2px solid #e5e7eb",
          boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
          background: "#f8fafc",
          borderRadius: "18px",
        }}
      >
        {/* Profile Section */}
        <div className="text-center position-relative">
          <img
            src={profileBg}
            alt="Profile Background"
            className="img-fluid"
            style={{
              width: "100%",
              height: "120px",
              objectFit: "cover",
            }}
          />
          <img
            src={
              user?.profileImage
                ? `http://localhost:5000${user.profileImage}` // ✅ Use full image path from DB
                : defaultProfile
            }
            alt="Profile"
            className="rounded-circle border border-3 border-white position-absolute"
            style={{
              width: "70px",
              height: "70px",
              top: "70px",
              left: "50%",
              transform: "translateX(-50%)",
              objectFit: "cover",
            }}
          />

          <div className="mt-5">
            <p className="fw-bold mb-0" style={{ fontSize: "1.2rem" }}>
              {user
                ? `${user.firstName || ""} ${user.lastName || ""}`
                : "Loading..."}
            </p>

            <p className="text-muted small" style={{ fontSize: "1rem" }}>
              {roleLabel}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4">
          <ul className="list-unstyled">
            {navigationLinks.map(({ icon, label, page }) => (
              <li
                key={page}
                className={`d-flex align-items-center px-4 py-2 text-dark sidebar-link${selectedPage === page ? ' active' : ''}`}
                style={{
                  cursor: "pointer",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  transition: "background 0.2s, color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  fontSize: "1.08rem",
                  fontWeight: 500,
                  minHeight: "44px",
                  background: selectedPage === page ? '#e0e7ef' : 'transparent',
                  color: selectedPage === page ? '#2563eb' : 'black',
                }}
                onClick={() => onSelectPage && onSelectPage(page)}
              >
                <FontAwesomeIcon
                  icon={icon}
                  className="me-3"
                  style={{ minWidth: "22px", fontSize: "1.2rem" }}
                />
                <span
                  style={{
                    textDecoration: "none",
                    color: selectedPage === page ? '#2563eb' : 'black',
                    fontWeight: 500,
                  }}
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Log Out Button */}
        <div className="mt-5 px-4">
          <button
            className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Bottom Navbar for Smaller Screens */}
      <nav
        className="d-lg-none bg-light border-top position-fixed bottom-0 w-100"
        style={{ height: "60px", zIndex: 999 }}
      >
        <ul className="d-flex justify-content-around align-items-center list-unstyled m-0 p-0 h-100">
          {navigationLinks.map(({ icon, label, page }) => (
            <li
              key={page}
              className="d-flex flex-column align-items-center justify-content-center"
              style={{ cursor: "pointer", width: "20%" }}
              onClick={() => onSelectPage && onSelectPage(page)}
            >
              <FontAwesomeIcon icon={icon} style={{ fontSize: "1.5rem" }} />
              <span className="small" style={{ fontSize: "0.85rem" }}>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
