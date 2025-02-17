import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./header";
import StudentSidebar from "../pages/StudentSidebar";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const [activeRequestTab, setActiveRequestTab] = useState("open");
  const navigate = useNavigate();

  const handleSidebarSelection = (page) => {
    setSelectedPage(page);
  };

  // Handler functions for card clicks
  const handleLiveHelpClick = () => {
    navigate("/livesessionform"); 
  };

  const handleProjectHelpClick = () => {
    navigate("/project-help"); 
  };

  const handleCodeReviewClick = () => {
    navigate("/code-review"); 
  };

  const renderContent = () => {
    if (selectedPage === "requests") {
      return (
        <div className="requests-content">
          {/* Requests Tab Navigation */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeRequestTab === "open" ? "active" : ""}`}
                    onClick={() => setActiveRequestTab("open")}
                  >
                    Open
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeRequestTab === "closed" ? "active" : ""}`}
                    onClick={() => setActiveRequestTab("closed")}
                  >
                    Closed
                  </button>
                </li>
              </ul>

              <div className="tab-content mt-3">
                {activeRequestTab === "open" ? (
                  <div className="open-requests">
                    {/* Sample Open Request Card */}
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-1">Live Session Request</h6>
                          <span className="badge bg-primary">Open</span>
                        </div>
                        <p className="text-muted mb-2">React Native Development Help</p>
                        <small className="text-muted">Submitted: 2 days ago</small>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="closed-requests">
                    {/* Sample Closed Request Card */}
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-1">Code Review Request</h6>
                          <span className="badge bg-secondary">Closed</span>
                        </div>
                        <p className="text-muted mb-2">Vue.js Component Review</p>
                        <small className="text-muted">Completed: 5 days ago</small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="dashboard-content">
        {/* Top Section */}
        <div className="row g-4">
          <div className="col-lg-4">
            <div 
              className="card text-center shadow-sm p-3" 
              onClick={handleLiveHelpClick}
              style={{
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                height: "100%"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              <i className="bi bi-chat-dots fs-1 text-primary"></i>
              <h5 className="mt-2">Get live help</h5>
              <p className="text-muted">1 to 1 live session</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div 
              className="card text-center shadow-sm p-3"
              onClick={handleProjectHelpClick}
              style={{
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                height: "100%"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              <i className="bi bi-tools fs-1 text-success"></i>
              <h5 className="mt-2">Get project help</h5>
              <p className="text-muted">Find best developer for help</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div 
              className="card text-center shadow-sm p-3"
              onClick={handleCodeReviewClick}
              style={{
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                height: "100%"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              <i className="bi bi-check-circle fs-1 text-warning"></i>
              <h5 className="mt-2">Get code reviewed</h5>
              <p className="text-muted">Take expert opinion</p>
            </div>
          </div>
        </div>

        {/* Membership Promo Section */}
        <div className="row g-4 mt-4">
          <div className="col-lg-8">
            <div className="card mb-4 shadow-sm">
              <div className="card-body d-flex align-items-center">
                <i className="bi bi-gift-fill fs-1 text-info"></i>
                <div className="ms-3">
                  <h5>Enhance your skill With us</h5>
                  <p className="text-muted">
                   Maximize develpors of evey domain always available for you.
                  </p>
                  <a href="#learn-more" className="text-primary">
                    Learn more about Us →
                  </a>
                </div>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">Find Mentors</h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Mentor"
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <h6 className="mb-1">Samir Habib Zahmani</h6>
                    <p className="text-muted mb-1">
                      Senior Fullstack Node.js Developer
                    </p>
                    <p className="mb-0 text-warning">
                      ★★★★★ <span className="text-muted">(382 reviews)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-lg-4">
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h6>Finish Setting Up Your Account</h6>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="confirmEmail"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="confirmEmail">
                    Confirm your email
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="trySession"
                  />
                  <label className="form-check-label" htmlFor="trySession">
                    Try out our session room (5 mins)
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="downloadZoom"
                  />
                  <label className="form-check-label" htmlFor="downloadZoom">
                    Download Zoom (3 mins)
                  </label>
                </div>
              </div>
            </div>

            <div className="card mb-4 shadow-sm">
              <div className="card-body text-center">
                <h6 className="mb-3">Payment Method</h6>
                <button className="btn btn-primary">Add Card & Buy Credits</button>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body">
                <h6>Help & Support</h6>
                <ul className="list-unstyled mb-0">
                  <li>
                    <a href="#help" className="text-primary">
                      How do live 1:1 sessions work?
                    </a>
                  </li>
                  <li>
                    <a href="#hire" className="text-primary">
                      How do I hire for freelance work?
                    </a>
                  </li>
                  <li>
                    <a href="#support" className="text-primary">
                      Contact our support team
                    </a>
                  </li>
                  <li>
                    <a href="#feedback" className="text-primary">
                      Share your feedback
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Updated Sidebar */}
        <div
          style={{
            width: "250px",
            backgroundColor: "#f8f9fa",
            borderRight: "1px solid #ddd",
            height: "calc(100vh - 60px)",
            position: "sticky",
            top: "60px",
            overflowY: "auto",
            msOverflowStyle: "none", // Hide scrollbar for IE and Edge
            scrollbarWidth: "none", // Hide scrollbar for Firefox
            "&::-webkit-scrollbar": { // Hide scrollbar for Chrome, Safari, and Opera
              display: "none"
            }
          }}
        >
          <style>
            {`
              .sidebar-container::-webkit-scrollbar {
                display: none;
              }
              .sidebar-container {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}
          </style>
          <div className="sidebar-container">
            <StudentSidebar onSelectPage={handleSidebarSelection} />
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            backgroundColor: "#f4f6f9",
            height: "calc(100vh - 60px)",
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
