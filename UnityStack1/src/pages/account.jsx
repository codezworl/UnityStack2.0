import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaEnvelope, FaLanguage, FaGlobe, FaUniversity } from "react-icons/fa";
import Header from "../components/header";
import StudentSidebar from "./StudentSidebar";
import profileImage from "../assets/logo.jpg"; // Importing the profile image

const Account = () => {
  const [editMode, setEditMode] = useState(false);

  const [profileInfo, setProfileInfo] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    language: "English (US)",
    country: "United States",
    city: "New York",
    university: "Harvard University",
    universityEmail: "student@harvard.edu",
    domain: "Web Development",
  });

  const handleEdit = () => setEditMode(true);
  const handleSave = () => setEditMode(false);

  const handleChange = (field, value) => {
    setProfileInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Header */}
      <Header />

      <div className="d-flex">
        {/* Sidebar */}
        <div
          style={{
            width: "243px",
            backgroundColor: "#f8f9fa",
            height: "100vh",
            borderRight: "1px solid #ddd",
          }}
        >
          <StudentSidebar />
        </div>

        {/* Main Content */}
        <div
          className="container"
          style={{
            maxWidth: "800px",
            padding: "40px 20px",
            marginLeft: "30px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  color: "#1a1a1a",
                }}
              >
                Personal Information
              </h1>

              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "32px",
                }}
              >
                Manage your personal information, including email and address details.
              </p>
            </div>

            {/* Profile Photo */}
            <div>
              <img
                src={profileImage} // Using the imported image
                alt="Profile"
                style={{
                  borderRadius: "50%",
                  border: "2px solid #ddd",
                  width: "100px",
                  height: "100px",
                }}
              />
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="row g-4">
            {/* Name Field */}
            <div className="col-md-6">
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <label>Name</label>
                {editMode ? (
                  <input
                    type="text"
                    value={profileInfo.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <p>{profileInfo.name}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="col-md-6">
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <label>Email</label>
                {editMode ? (
                  <input
                    type="email"
                    value={profileInfo.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <p>{profileInfo.email}</p>
                )}
              </div>
            </div>

            {/* Language Field */}
            <div className="col-md-6">
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <label>Language</label>
                {editMode ? (
                  <input
                    type="text"
                    value={profileInfo.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <p>{profileInfo.language}</p>
                )}
              </div>
            </div>

            {/* Country Field */}
            <div className="col-md-6">
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <label>Country</label>
                {editMode ? (
                  <input
                    type="text"
                    value={profileInfo.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <p>{profileInfo.country}</p>
                )}
              </div>
            </div>

            {/* City Field */}
            <div className="col-md-6">
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <label>City</label>
                {editMode ? (
                  <input
                    type="text"
                    value={profileInfo.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <p>{profileInfo.city}</p>
                )}
              </div>
            </div>
          </div>

          {/* Educational Information Section */}
          <h2
            style={{
              marginTop: "40px",
              fontWeight: "600",
              color: "#1a1a1a",
            }}
          >
            Educational Information
          </h2>

          <div className="row g-4">
            {/* University Name Field */}
            <div className="col-md-6">
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <label>University Name</label>
                {editMode ? (
                  <input
                    type="text"
                    value={profileInfo.university}
                    onChange={(e) => handleChange("university", e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <p>{profileInfo.university}</p>
                )}
              </div>
            </div>

            {/* University Email Field */}
            <div className="col-md-6">
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <label>University Email</label>
                {editMode ? (
                  <input
                    type="email"
                    value={profileInfo.universityEmail}
                    onChange={(e) =>
                      handleChange("universityEmail", e.target.value)
                    }
                    className="form-control"
                  />
                ) : (
                  <p>{profileInfo.universityEmail}</p>
                )}
              </div>
            </div>

            {/* Domain Field */}
            <div className="col-md-6">
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <label>Domain</label>
                {editMode ? (
                  <input
                    type="text"
                    value={profileInfo.domain}
                    onChange={(e) => handleChange("domain", e.target.value)}
                    className="form-control"
                  />
                ) : (
                  <p>{profileInfo.domain}</p>
                )}
              </div>
            </div>
          </div>

          {/* Edit and Save Buttons */}
          <div className="mt-4 text-end">
            {!editMode ? (
              <button className="btn btn-primary" onClick={handleEdit}>
                Edit
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleSave}>
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
