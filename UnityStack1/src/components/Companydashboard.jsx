import React, { useState, useEffect } from "react";
import { 
  FiMenu, 
  FiBookOpen, 
  FiUser, 
  FiMessageSquare, 
  FiBriefcase,
  FiUsers,
  FiLogOut,
  FiBell,
  FiSettings,
  FiHome
} from 'react-icons/fi';
import BlogsAndEvents from "../pages/Blogs&event";
import Profile from "../pages/companyAccount";
import FindDeveloper from "../pages/finddevelpor";
import ComChat from "../pages/ComChat";
import FindWork from "../pages/findwork";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const CompanyDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("blogs");
  const [companyName, setCompanyName] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/organizations/company-name",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompanyName(response.data.companyName);
      } catch (error) {
        console.error("Error fetching company name:", error);
      }
    };
    fetchCompanyName();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderContent = () => {
    switch (selectedPage) {
      case "blogs":
        return <BlogsAndEvents />;
      case "profile":
        return <Profile />;
      case "findDeveloper":
        return <FindDeveloper />;
      case "findWork":
        return <FindWork />; // ✅ No fade-in wrapper
      case "ComChat":
        return <ComChat />;
      default:
        return <BlogsAndEvents />;
    }
  };

  const sidebarItems = [
    { icon: <FiBookOpen />, label: "Blogs & Events", page: "blogs", description: "View and manage content" },
    { icon: <FiUser />, label: "Profile", page: "profile", description: "Manage company profile" },
    { icon: <FiUsers />, label: "Find Developer", page: "findDeveloper", description: "Assign work to developers" },
    { icon: <FiBriefcase />, label: "Find Work", page: "findWork", description: "Browse available projects" },
    { icon: <FiMessageSquare />, label: "Chat", page: "ComChat", description: "Message developers" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Top Navigation */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "60px",
        backgroundColor: "#ffffff", display: "flex", justifyContent: "space-between",
        alignItems: "center", padding: "0 20px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", zIndex: 1001
      }}>
        <h3 style={{ fontSize: "18px", margin: 0, color: "#1a1a1a" }}>{companyName || "Company Dashboard"}</h3>
        <div style={{ display: "flex", gap: "20px" }}>
          {[
            { icon: <FiHome />, label: "Home", path: "/" },
            { icon: <FiBell />, label: "Notifications", path: "/companydashboard/notifications" },
            { icon: <FiSettings />, label: "Settings", page: "profile" }
          ].map((btn, i) => (
            <button key={i} style={{
              background: "transparent", border: "none", display: "flex", alignItems: "center",
              gap: "8px", color: "#4B5563", cursor: "pointer", padding: "8px 12px", borderRadius: "4px"
            }}
              onClick={() => btn.page ? setSelectedPage(btn.page) : navigate(btn.path)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#F3F4F6"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div style={{
        width: isSidebarCollapsed ? "80px" : "240px",
        height: "calc(100vh - 60px)",
        backgroundColor: "#ffffff",
        color: "#4B5563",
        padding: "20px",
        transition: "all 0.3s ease",
        position: "fixed",
        top: "60px",
        left: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid #E5E7EB"
      }}>
        {/* Top - Menu & Pages */}
        <div>
          {/* Hamburger */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "30px", cursor: "pointer" }} onClick={toggleSidebar}>
            <FiMenu size={24} color="#4B5563" />
            {!isSidebarCollapsed && <h4 style={{ marginLeft: "15px", fontSize: "16px", color: "#1a1a1a" }}>{companyName || "Dashboard"}</h4>}
          </div>

          {/* Menu */}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {sidebarItems.map((item, index) => (
              <li
                key={index}
                onClick={() => setSelectedPage(item.page)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 15px",
                  marginBottom: "8px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  backgroundColor: selectedPage === item.page ? "#F3F4F6" : "transparent",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#F3F4F6"}
                onMouseOut={(e) => {
                  if (selectedPage !== item.page) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <span style={{ fontSize: "20px", color: selectedPage === item.page ? "#2563EB" : "#4B5563" }}>
                  {item.icon}
                </span>
                {!isSidebarCollapsed && (
                  <div style={{ marginLeft: "12px" }}>
                    <span style={{ 
                      fontSize: "14px", 
                      fontWeight: selectedPage === item.page ? "600" : "normal",
                      color: selectedPage === item.page ? "#2563EB" : "#4B5563"
                    }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: "11px", color: "#6B7280", display: "block" }}>
                      {item.description}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom - Logout */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 15px",
              borderRadius: "8px",
              backgroundColor: "#2563EB",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1D4ED8"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563EB"}
          >
            <span style={{ fontSize: "20px", color: "#ffffff" }}><FiLogOut /></span>
            {!isSidebarCollapsed && (
              <div style={{ marginLeft: "12px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff" }}>Logout</span>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div style={{
        marginLeft: isSidebarCollapsed ? "80px" : "240px",
        padding: "20px",
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
        marginTop: "60px",
        transition: "all 0.3s ease"
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default CompanyDashboard;