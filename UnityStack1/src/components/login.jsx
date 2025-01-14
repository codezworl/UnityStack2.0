import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../assets/vector.png";
import GoogleSvg from "../assets/icons8-google.svg";
import LinkedInSvg from "../assets/linkedin.png";
import LoginPic from "../assets/loginpic.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const response = await fetch("http://localhost:5000/api/students/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in local storage (or cookies if preferred)
        localStorage.setItem("token", data.token);

        // Redirect to student dashboard
        navigate("/studentdashboard");
      } else {
        // Display error message
        setError(data.message || "Invalid login credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row vh-100">
      {/* Left Section - Form */}
      <div
        className="col-12 col-md-6 d-flex justify-content-center align-items-center"
        style={{
          overflowY: "hidden",
          marginTop: "20px",
          marginBottom: "0px",
        }}
      >
        <div
          className="w-75 shadow"
          style={{
            borderRadius: "30px",
            backgroundColor: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "20px",
            border: "2px solid black",
            boxSizing: "border-box",
            height: "95%",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-3">
            <img
              src={Logo}
              alt="Logo"
              className="img-fluid"
              style={{
                maxWidth: "25%",
              }}
            />
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-4">
            <h2 className="mb-2" style={{ fontSize: "3rem" }}>
              Welcome back!
            </h2>
            <p>Please enter your details here</p>

            {/* Social Login Options */}
            <div className="d-flex justify-content-center gap-4 mt-3">
              <a
                href="#"
                className="d-flex align-items-center shadow p-3 rounded"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  gap: "8px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  borderRadius: "50px",
                }}
              >
                <img
                  src={GoogleSvg}
                  alt="Google"
                  style={{ maxWidth: "30px" }}
                />
                <span>Login with Google</span>
              </a>
              <a
                href="#"
                className="d-flex align-items-center shadow p-3 rounded"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  gap: "8px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  borderRadius: "50px",
                }}
              >
                <img
                  src={LinkedInSvg}
                  alt="LinkedIn"
                  style={{ maxWidth: "30px" }}
                />
                <span>Login with LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Login Form */}
          <form style={{ flexGrow: 1 }} onSubmit={handleLogin}>
            {error && (
              <div
                className="alert alert-danger text-center"
                style={{ fontSize: "1rem" }}
              >
                {error}
              </div>
            )}
            {/* Email Input */}
            <div className="mb-3">
              <input
                type="email"
                className="form-control mx-auto"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "85%",
                  border: "1px solid black",
                }}
                onFocus={(e) => (e.target.style.border = "2px solid darkblue")}
                onBlur={(e) => (e.target.style.border = "1px solid black")}
              />
            </div>

            {/* Password Input */}
            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control mx-auto"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "85%",
                  border: "1px solid black",
                }}
                onFocus={(e) => (e.target.style.border = "2px solid darkblue")}
                onBlur={(e) => (e.target.style.border = "1px solid black")}
              />
              <span
                className="position-absolute"
                style={{
                  right: "10%",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Options */}
            <div
              className="d-flex justify-content-between align-items-center mb-4 flex-column flex-md-row gap-2"
              style={{ fontSize: "1.3rem" }}
            >
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="remember-checkbox"
                  style={{
                    border: "1px solid black",
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor="remember-checkbox"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
              >
                <a href="/forgotpassword">Forgot password?</a>
              </button>
            </div>

            {/* Buttons */}
            <div className="d-grid gap-3">
              <button
                type="submit"
                className="btn mx-auto"
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  padding: "10px 20px",
                  border: "none",
                  width: "50%",
                }}
              >
                Log In
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-4">
            <p style={{ marginBottom: "0" }}>
              Don't have an account?{" "}
              <a
                href="/optionsighn"
                className="btn btn-link text-decoration-none"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div
        className="col-md-6 d-none d-md-flex justify-content-center align-items-center position-relative"
        style={{
          backgroundImage: `url(${LoginPic})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};

export default Login;
