import React, { useState } from "react";
import forgotpassword from "../assets/ForgotPassword.png";
import { useNavigate } from "react-router-dom"; // For navigation

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Inline CSS for the page
  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f8f9fa",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      display: "flex",
      flexDirection: "row",
      maxWidth: "1200px",
      backgroundColor: "#fff",
      borderRadius: "15px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      width: "90%",
    },
    leftPane: {
      flex: 1,
      padding: "40px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    backLink: {
      fontSize: "14px",
      color: "#6c757d",
      marginBottom: "20px",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
    },
    backIcon: {
      marginRight: "8px",
      fontSize: "16px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "600",
      color: "#212529",
      marginBottom: "10px",
    },
    description: {
      fontSize: "16px",
      color: "#6c757d",
      marginBottom: "30px",
    },
    formGroup: {
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
    },
    input: {
      width: "100%",
      padding: "12px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "1px solid #ced4da",
      outline: "none",
      marginBottom: "10px",
    },
    button: {
      width: "100%",
      padding: "12px",
      fontSize: "16px",
      color: "#fff",
      backgroundColor: "#007BFF",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      marginRight: "100px",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    rightPane: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f1f3f5",
    },
    image: {
      maxWidth: "100%",
      height: "auto",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Left Pane */}
        <div style={styles.leftPane}>
          <div
            style={styles.backLink}
            onClick={() => navigate("/login")} // Navigate to the login page
          >
            <span style={styles.backIcon}>←</span> Back to login
          </div>

          <h1 style={styles.title}>Forgot your password?</h1>
          <p style={styles.description}>
            Don’t worry, happens to all of us. Enter your email below to recover
            your password.
          </p>
          <form>
            <div style={styles.formGroup}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>
            <button
              type="submit"
              disabled={email === ""} // Disable if email is empty
              onClick={() => navigate("/otpVerification")} // Navigate to OTP Verification page
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                color: "#fff",
                backgroundColor: email === "" ? "#ccc" : "#007BFF", // Disabled state color
                border: "none",
                borderRadius: "8px",
                cursor: email === "" ? "not-allowed" : "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => {
                if (email !== "") {
                  e.target.style.backgroundColor = "#0056b3";
                }
              }}
              onMouseOut={(e) => {
                if (email !== "") {
                  e.target.style.backgroundColor = "#007BFF";
                }
              }}
            >
              Submit
            </button>
          </form>
        </div>

        {/* Right Pane */}
        <div style={styles.rightPane}>
          <img
            src={forgotpassword}
            alt="Forgot password illustration"
            style={styles.image}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
