import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CodeVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    let newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.join("").length !== 4) {
      alert("Please enter a valid 4-digit code.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join("") }), // Correctly send OTP and email
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("OTP verified successfully!");
        navigate("/resetPassword", { state: { email } }); // Redirect to reset password
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#f8f9fa",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#0074D9" }}>Enter Code</h2>
        <p style={{ marginBottom: "20px", color: "#555" }}>
          Please enter the 4-digit verification code sent to your email.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              maxLength="1"
              required
              style={{
                width: "40px",
                height: "40px",
                textAlign: "center",
                fontSize: "18px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? "#aaa" : "#0074D9",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "20px",
          }}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default CodeVerification;
