import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaUser, FaBook, FaHistory, FaSignOutAlt } from "react-icons/fa";
import BlogsAndEvents from "../pages/Blogs&event";
import Profile from "../pages/companyAccount";
import FindDeveloper from "../pages/finddevelpor";
import ComChat from "../pages/ComChat";
import "bootstrap/dist/css/bootstrap.min.css";

const CompanyDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("blogs"); // Default page

  const renderContent = () => {
    switch (selectedPage) {
      case "blogs":
        return <BlogsAndEvents />;
      case "profile":
        return <Profile />;
      case "findDeveloper":
        return <FindDeveloper />;
      case "ComChat": // Added case for ComChat
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
        <h4 className="text-center mb-4">Company Dashboard</h4>
        <ul className="list-unstyled">
          <li
            onClick={() => setSelectedPage("blogs")}
            className="mb-3 d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <FaBook className="me-2" />
            Blogs & Events
          </li>
          <li
            onClick={() => setSelectedPage("profile")}
            className="mb-3 d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <FaUser className="me-2" />
            Profile
          </li>
          <li
            onClick={() => setSelectedPage("findDeveloper")}
            className="mb-3 d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <FaHistory className="me-2" />
            Find Developer
          </li>
          <li
            onClick={() => setSelectedPage("ComChat")} // Corrected to set "ComChat"
            className="mb-3 d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <FaHistory className="me-2" />
            Chat
          </li>
          <li
            onClick={() => alert("Logged out")}
            className="mt-auto d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#fff",
          padding: "20px",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default CompanyDashboard;
