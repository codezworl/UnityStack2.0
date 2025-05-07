import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faChartSimple,
  faComments,
  faProjectDiagram,
  faVideo,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import profileBg from "../assets/silver1.jpeg"; // Background Image
import defaultProfile from "../assets/logo.jpg"; // Default Profile Image

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(""); // "developer" or "student"
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const sessionRes = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true, // Ensures the cookie is sent for authenticated requests
        });
  
        const sessionUser = sessionRes.data;
        setUserType(sessionUser.role);  // Store user role (developer or student)
  
        // Fetch full profile data based on user role
        if (sessionUser.role === "developer") {
          // If user is a developer, fetch their profile data
          const fullDevRes = await axios.get(
            `http://localhost:5000/api/developers/${sessionUser.id}`,
            { withCredentials: true }
          );
          setUser(fullDevRes.data);  // Set developer profile data (name, image, etc.)
        } else if (sessionUser.role === "Student") {
          // If user is a student, fetch their profile data
          const fullStudentRes = await axios.get(
            `http://localhost:5000/api/students/${sessionUser.id}`, // Fetch student profile using sessionUser.id
            { withCredentials: true }
          );
          setUser(fullStudentRes.data);  // Set student profile data (name, image, etc.)
        } else {
          // Handle other roles if needed (optional)
          setUser(sessionUser);
        }
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      }
    };
  
    fetchUserProfile();
  }, []);
  
  
  
  
  

  // ✅ Handle Logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
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

  // ✅ Profile Image Handling (Use DB Image if Available)
  const profileImage = user?.profileImage
  ? `http://localhost:5000${user.profileImage}` // Already starts with /uploads/
  : defaultProfile;
 // Fallback to default

  // ✅ Navigation Options for Developer and Student
  const navigationLinks = userType === "developer"
    ? [
        { icon: faHouse, label: "Home", path: "/" },
        { icon: faChartSimple, label: "Dashboard", path: "/developerdashboard" },
        { icon: faComments, label: "Chat", path: "/chat" },
        { icon: faProjectDiagram, label: "Work", path: "/project" },
        { icon: faVideo, label: "Sessions", path: "/sessions" },
      ]
    : [
        { icon: faHouse, label: "Dashboard", path: "/studentdashboard" },
        { icon: faChartSimple, label: "Account", path: "/account" },
        { icon: faComments, label: "Chat", path: "/chat" },
        { icon: faProjectDiagram, label: "Schedule Session", path: "/sessionSchedule" },
        { icon: faVideo, label: "Session History", path: "/SessionHistory" },
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
  {user ? `${user.firstName || ""} ${user.lastName || ""}` : "Loading..."}
</p>

            <p className="text-muted small" style={{ fontSize: "1rem" }}>
              {roleLabel}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4">
          <ul className="list-unstyled">
            {navigationLinks.map(({ icon, label, path }) => (
              <li
                key={path}
                className="d-flex align-items-center px-4 py-2 text-dark"
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon icon={icon} className="me-3" />
                <a href={path} style={{ textDecoration: "none", color: "black" }}>
                  {label}
                </a>
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
          {navigationLinks.map(({ icon, label, path }) => (
            <li
              key={path}
              className="d-flex flex-column align-items-center justify-content-center"
              style={{ cursor: "pointer", width: "20%" }}
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
