import React, { useState } from "react";
import otpIllustration from "../assets/OTP.png"; // Replace with your illustration path
import logo from "../assets/vector.png"; // Replace with your logo path
import { useNavigate } from "react-router-dom"; // For navigation

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

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
          maxWidth: "1100px",
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
            onClick={() => navigate("/login")}
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

          {/* OTP Form */}
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#212529",
                marginBottom: "10px",
              }}
            >
              Verify code
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "#6c757d",
                marginBottom: "30px",
              }}
            >
              An authentication code has been sent to your email.
            </p>
            <form>
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
                  type={showOtp ? "text" : "password"}
                  placeholder="Enter Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
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
                  onClick={() => setShowOtp(!showOtp)}
                >
                  {showOtp ? "🙈" : "👁️"}
                </span>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "black",
                  cursor: "pointer",
                  marginBottom: "30px",
                }}
              >
                Didn’t receive a code? 
                <p
                style={{
                  fontSize: "14px",
                  color: "#ff4d4f",
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginBottom: "30px",
                }}
                onClick={() => alert("Resend Code!")}
              >
                Resend
              </p>
              </p>
            
              <button
              type="submit"
              disabled={otp === ""} // Disable if email is empty
              onClick={() => navigate("/setpassword")} // Navigate to OTP Verification page
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                color: "#fff",
                backgroundColor: otp === "" ? "#ccc" : "#007BFF", // Disabled state color
                border: "none",
                borderRadius: "8px",
                cursor: otp === "" ? "not-allowed" : "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => {
                if (otp !== "") {
                  e.target.style.backgroundColor = "#0056b3";
                }
              }}
              onMouseOut={(e) => {
                if (otp !== "") {
                  e.target.style.backgroundColor = "#007BFF";
                }
              }}
            >
              Verify
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
            src={otpIllustration}
            alt="OTP Verification Illustration"
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

export default OtpVerification;
