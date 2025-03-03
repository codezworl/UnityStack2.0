import React, { useState, useEffect } from "react";
import { FaUser, FaBook, FaHistory, FaSignOutAlt } from "react-icons/fa";
import BlogsAndEvents from "../pages/Blogs&event";
import Profile from "../pages/companyAccount";
import FindDeveloper from "../pages/finddevelpor";
import ComChat from "../pages/ComChat";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const CompanyDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("blogs"); // Default page
  const [companyName, setCompanyName] = useState(""); // State for Company Name
  const navigate = useNavigate();

  // ✅ Fetch only the company name
  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/organizations/company-name", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanyName(response.data.companyName);
      } catch (error) {
        console.error("❌ Error fetching company name:", error);
      }
    };

    fetchCompanyName();
  }, []);

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove token
    navigate("/login"); // ✅ Navigate to login page
    setTimeout(() => {
      window.location.href = "/login"; // ✅ Ensure full reload for session reset
    }, 100); // Small delay to let navigate() execute first
  };
  

  const renderContent = () => {
    switch (selectedPage) {
      case "blogs":
        return <BlogsAndEvents />;
      case "profile":
        return <Profile />;
      case "findDeveloper":
        return <FindDeveloper />;
      case "ComChat":
        return <ComChat />;
      default:
        return <BlogsAndEvents />;
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          height: "100vh",
          backgroundColor: "#003366",
          color: "#fff",
          padding: "20px",
        }}
      >
        <h4 className="text-center mb-4">
          {companyName ? companyName : "Company Dashboard"} {/* ✅ Show Company Name */}
        </h4>
        <ul className="list-unstyled">
          <li onClick={() => setSelectedPage("blogs")} className="mb-3 d-flex align-items-center" style={{ cursor: "pointer" }}>
            <FaBook className="me-2" />
            Blogs & Events
          </li>
          <li onClick={() => setSelectedPage("profile")} className="mb-3 d-flex align-items-center" style={{ cursor: "pointer" }}>
            <FaUser className="me-2" />
            Profile
          </li>
          <li onClick={() => setSelectedPage("findDeveloper")} className="mb-3 d-flex align-items-center" style={{ cursor: "pointer" }}>
            <FaHistory className="me-2" />
            Find Developer
          </li>
          <li onClick={() => setSelectedPage("ComChat")} className="mb-3 d-flex align-items-center" style={{ cursor: "pointer" }}>
            <FaHistory className="me-2" />
            Chat
          </li>
          <li onClick={handleLogout} className="mt-auto d-flex align-items-center" style={{ cursor: "pointer" }}>
            <FaSignOutAlt className="me-2" />
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: "#fff", padding: "20px" }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default CompanyDashboard;
