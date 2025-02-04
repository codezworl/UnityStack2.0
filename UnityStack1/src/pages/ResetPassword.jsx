import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router navigation
import passwordIllustration from "../assets/Resetpassword.png"; 
import logo from "../assets/vector.png"; 

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === confirmPassword && password !== "") {
      alert("Password successfully created!");
      navigate("/login"); // Navigate to login after password creation
    } else {
      alert("Passwords do not match. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          maxWidth: "1200px",
          backgroundColor: "#fff",
          borderRadius: "20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          width: "90%",
        }}
      >
        {/* Left Pane */}
        <div
          style={{
            flex: 1,
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              width: "140px",
              height: "auto",
            }}
          />

          {/* Back to Login Link */}
          <div
            style={{
              fontSize: "14px",
              color: "#6c757d",
              marginBottom: "20px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
            }}
            onClick={() => navigate("/login")} // Navigate to login
          >
            <span
              style={{
                marginRight: "8px",
                fontSize: "16px",
              }}
            >
              ←
            </span>
            Back to login
          </div>

          {/* Form */}
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#212529",
                marginBottom: "10px",
              }}
            >
              Set a password
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "#6c757d",
                marginBottom: "30px",
              }}
            >
              Your previous password has been reset. Please set a new password
              for your account.
            </p>
            <form onSubmit={handleSubmit}>
              {/* Create Password Field */}
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ced4da",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    fontSize: "16px",
                    border: "none",
                    outline: "none",
                  }}
                />
                <span
                  style={{
                    padding: "12px",
                    cursor: "pointer",
                    color: "#6c757d",
                    backgroundColor: "#f8f9fa",
                    fontSize: "18px",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {/* Confirm Password Field */}
              <div
                style={{
                  marginBottom: "30px",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ced4da",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    fontSize: "16px",
                    border: "none",
                    outline: "none",
                  }}
                />
                <span
                  style={{
                    padding: "12px",
                    cursor: "pointer",
                    color: "#6c757d",
                    backgroundColor: "#f8f9fa",
                    fontSize: "18px",
                  }}
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "#007BFF",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#0056b3")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#007BFF")
                }
              >
                Set password
              </button>
            </form>
          </div>
        </div>

        {/* Right Pane */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f1f3f5",
          }}
        >
          <img
            src={passwordIllustration}
            alt="Password Illustration"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
