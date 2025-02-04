import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SignUpImage from "../assets/sighnup.png";
import StudentLogo from "../assets/Student.png";
import DeveloperLogo from "../assets/develpor.png";
import OrganizationLogo from "../assets/organization.jpg";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import logo from "../assets/vector.png";

const SignUp = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: "student",
      label: "I’m a Student",
      logo: StudentLogo,
    },
    {
      id: "developer",
      label: "I’m a Developer",
      logo: DeveloperLogo,
    },
    {
      id: "organization",
      label: "As an Organization",
      logo: OrganizationLogo,
    },
  ];

  return (
    <div className="vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#ffffff",
          zIndex: 10,
          padding: "12px 16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Unity Stack</div>
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              padding: "8px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
          >
            <IoMdClose size={24} />
          </button>
        </div>
      </motion.header>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="d-flex flex-row align-items-center justify-content-center vh-100"
        style={{ paddingTop: "70px", width: "100%" }}
      >
        {/* Left Side: Image */}
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            flex: 1,
            height: "100%",
          }}
        >
          <img
            src={SignUpImage}
            alt="Sign Up"
            style={{
              width: "85%",
              maxWidth: "500px",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Right Side: Form */}
        <div
          className="shadow d-flex flex-column align-items-center justify-content-start"
          style={{
            flex: 1,
            maxWidth: "600px",
            backgroundColor: "#ffffff",
            borderRadius: "15px",
            padding: "30px",
            height: "auto",
          }}
        >
          {/* Form Header */}
          <h2 className="text-center mb-3" style={{ fontWeight: "bold" }}>
            Sign up to
          </h2>
          <img
            src={logo}
            alt="Unity Stack Logo"
            style={{
              height: "40px",
              marginBottom: "10px",
            }}
          />
          <p
            className="text-center text-muted mb-4"
            style={{
              fontSize: "1.2rem",
            }}
          >
            Who Are You?
          </p>

          {/* Role Selection */}
          <div className="d-flex flex-column gap-3 w-100">
            {roles.map((role) => (
              <a
                key={role.id}
                href={
                  role.id === "student"
                    ? "/studentsighnup"
                    : role.id === "developer"
                    ? "/develporsighn1"
                    : "/organizationsighnup"
                }
                style={{ textDecoration: "none" }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0px 8px 15px rgba(0, 123, 255, 0.2)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className={`d-flex align-items-center p-3 role-option ${
                    selectedRole === role.id ? "border-primary" : ""
                  }`}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    border:
                      selectedRole === role.id
                        ? "2px solid #007bff"
                        : "2px solid #ddd",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow:
                      selectedRole === role.id
                        ? "0px 4px 8px rgba(0, 123, 255, 0.2)"
                        : "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#ffffff",
                  }}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <img
                    src={role.logo}
                    alt={role.label}
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "15px",
                      borderRadius: "50%",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "500",
                      color: "#000",
                    }}
                  >
                    {role.label}
                  </span>
                </motion.div>
              </a>
            ))}
          </div>

          {/* Footer */}
          <p
            className="text-center mt-4"
            style={{
              fontSize: "1rem",
              color: "#6c757d",
            }}
          >
            Already have an account?{" "}
            <a href="/login" style={{ color: "#007bff" }}>
              Log in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
