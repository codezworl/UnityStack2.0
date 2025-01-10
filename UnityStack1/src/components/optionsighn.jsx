import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SignUpImage from "../assets/sighnup.png"; // Add your image path
import StudentLogo from "../assets/Student.png";
import DeveloperLogo from "../assets/develpor.png";
import OrganizationLogo from "../assets/organization.jpg";

const SignUp = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: "student",
      label: (
        <a
          href="/studentsighnup"
          style={{ textDecoration: "none", color: "black" }} // Ensures black text and no underline
        >
          I’m a Student
        </a>
      ),
      logo: StudentLogo,
    },
    {
      id: "developer",
      label:  <a
      href="/develporsighn1"
      style={{ textDecoration: "none", color: "black" }} // Ensures black text and no underline
    >
      I’m a Develpor
    </a>,
      logo: DeveloperLogo,
    },
    {
      id: "organization",
      label: "As an Organization",
      logo: OrganizationLogo,
    },
  ];

  return (
    <div className="d-flex vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Left Side: Image */}
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          flex: 1,
          height: "80%", // Reduced height
          margin: "auto",
        }}
      >
        <img
          src={SignUpImage}
          alt="Sign Up"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // Ensures the image fills the space proportionally
            borderRadius: "15px", // Optional rounded corners
          }}
        />
      </div>

      {/* Right Side: Sign-Up Form */}
      <div
        className="shadow p-4"
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          borderRadius: "15px",
          width: "70%",
          height: "90%",
          border: "2px solid black",
          margin: "auto",
          marginLeft:"25px",
          marginRight:"25px",
        }}
      >
        <h2 className="text-center mb-4">Sign up to</h2>
        <p className="text-center text-muted mb-5" style={{ fontSize: "1.2rem" }}>
          Who Are You?
        </p>

        <div className="d-flex flex-column align-items-center gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`d-flex align-items-center p-3 role-option shadow-sm ${
                selectedRole === role.id ? "border-primary" : ""
              }`}
              style={{
                width: "80%", // Ensures the width is 80%
                borderRadius: "10px",
                border: selectedRole === role.id ? "2px solid #007bff" : "2px solid #ddd",
                cursor: "pointer",
                transition: "border-color 0.3s",
              }}
              onClick={() => setSelectedRole(role.id)}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#007bff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor =
                  selectedRole === role.id ? "#007bff" : "#ddd")
              }
            >
              <img
                src={role.logo}
                alt={role.label}
                style={{ width: "60px", height: "60px", marginRight: "15px" }}
              />
              <span style={{ fontSize: "1.5rem", fontWeight: "500" }}>{role.label}</span>
            </div>
          ))}
        </div>

        <p className="text-center mt-4">
          Already have an account? <a href="/login" style={{ color: "#007bff" }}>Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
