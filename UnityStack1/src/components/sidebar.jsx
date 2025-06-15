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
  const [unreadChats, setUnreadChats] = useState(0);
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

  // Add useEffect for fetching unread chats
  useEffect(() => {
    const fetchUnreadChats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/unread-count/${user?._id}`, {
          withCredentials: true,
        });
        console.log("Unread chats response:", response.data);
        if (response.data && response.data.count > 0) {
          setUnreadChats(response.data.count);
        } else {
          setUnreadChats(0);
        }
      } catch (error) {
        console.error("Error fetching unread chats:", error);
        setUnreadChats(0);
      }
    };

    // Fetch initially
    if (user?._id) {
      fetchUnreadChats();
    }

    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      if (user?._id) {
        fetchUnreadChats();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user?._id]);

  // Debug log for unreadChats state
  useEffect(() => {
    console.log("Current unread chats:", unreadChats);
  }, [unreadChats]);

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
          {
            icon: faChartSimple,
            label: "Dashboard",
            page: "dashboard"
          },
          { 
            icon: faComments, 
            label: "Chat", 
            page: "/chat",
            notification: unreadChats > 0 ? unreadChats : null
          },
          { 
            icon: faVideo, 
            label: "Sessions", 
            page: "devsessions" 
          },
          {
            icon: faUser,
            label: "Find Developer",
            page: "finddeveloper"
          },
          { 
            icon: faBriefcase, 
            label: "Find Work", 
            page: "findwork" 
          },
        ]
      : [
          { icon: faHouse, label: "Dashboard", page: "studentdashboard" },
          { 
            icon: faComments, 
            label: "Chat", 
            page: "/chat",
            notification: unreadChats > 0 ? unreadChats : null
          },
          {
            icon: faUser,
            label: "Find Developer",
            page: "finddeveloper"
          },
          {
            icon: faProjectDiagram,
            label: "Schedule Session",
            page: "sessionSchedule"
          }
        ];

  const handleNavigation = (page) => {
    if (page.startsWith('/')) {
      navigate(page);  // Use navigate for absolute paths
    } else if (page === 'devsessions') {
      onSelectPage('devsessions');  // Use onSelectPage to show devsessions content without changing route
    } else if (page === 'sessionSchedule') {
      onSelectPage('sessionSchedule');  // Use onSelectPage to show schedule session content without changing route
    } else if (page === 'studentdashboard') {
      navigate('/studentdashboard');
    } else {
      onSelectPage(page);  // Use onSelectPage for relative paths
    }
  };

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
            src={profileImage}
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
          {navigationLinks.map((link, index) => (
            <div
              key={index}
              className={`d-flex align-items-center px-4 py-3 cursor-pointer ${
                selectedPage === link.page ? "bg-primary text-white" : ""
              }`}
              onClick={() => handleNavigation(link.page)}
              style={{
                cursor: "pointer",
                transition: "all 0.2s",
                borderRadius: "8px",
                margin: "4px 12px",
                position: "relative"
              }}
            >
              <FontAwesomeIcon
                icon={link.icon}
                className="me-3"
                style={{ width: "20px" }}
              />
              <span>{link.label}</span>
              {link.notification && link.notification > 0 && (
                <span
                  className="ms-auto bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "24px",
                    height: "24px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    zIndex: 1
                  }}
                >
                  {link.notification}
                </span>
              )}
            </div>
          ))}
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