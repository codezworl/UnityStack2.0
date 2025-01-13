import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./header";
import StudentSidebar from "../pages/StudentSidebar";

const StudentDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("dashboard"); // Default page

  const handleSidebarSelection = (page) => {
    setSelectedPage(page); // Update selected page based on sidebar selection
  };

  const renderContent = () => {
    return (
      <div className="dashboard-content">
        {/* Top Section */}
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card text-center shadow-sm p-3">
              <i className="bi bi-chat-dots fs-1 text-primary"></i>
              <h5 className="mt-2">Get live help</h5>
              <p className="text-muted">1:1 mentorship session</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card text-center shadow-sm p-3">
              <i className="bi bi-code-slash fs-1 text-success"></i>
              <h5 className="mt-2">Get project help</h5>
              <p className="text-muted">Find best develpor for help</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card text-center shadow-sm p-3">
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
    <>
      <Header />

      <div className="d-flex">
        {/* Sidebar */}
        <div
          style={{
            width: "20%",
            backgroundColor: "#f8f9fa",
            height: "100vh",
            borderRight: "1px solid #ddd",
          }}
        >
          <StudentSidebar onSelectPage={handleSidebarSelection} />
        </div>

        {/* Main Content */}
        <div
          className="flex-grow-1"
          style={{
            padding: "20px",
            overflowY: "auto",
            backgroundColor: "#f4f6f9",
          }}
        >
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
