import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate email sending
    setIsEmailSent(true);
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
      {isEmailSent ? (
        <div
          style={{
            textAlign: "center",
            backgroundColor: "#ffffff",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ color: "#0074D9" }}>Password Reset Email Sent</h2>
          <p style={{ color: "#555" }}>
            We have sent a password reset email to <strong>{email}</strong>. Please check your inbox and follow the instructions to reset your password.
          </p>
        </div>
      ) : (
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
          <h2 style={{ marginBottom: "20px", color: "#0074D9" }}>Forgot Password</h2>
          <p style={{ marginBottom: "20px", color: "#555" }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#0074D9",
              color: "#ffffff",
              border: "none",
              borderRadius: "5px",
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
