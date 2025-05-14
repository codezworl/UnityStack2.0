import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../assets/vector.png";
import GoogleSvg from "../assets/icons8-google.svg";
import LinkedInSvg from "../assets/linkedin.png";
import LoginPic from "../assets/loginpic.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      // ✅ Extract token and role from response
      const { token, role } = data;
  
      // ✅ Store token and role
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Check for return URL
      const returnTo = localStorage.getItem('returnTo');
      const returnAction = localStorage.getItem('returnAction');
      
      if (returnTo && returnAction === 'chat') {
        // Clear the return info
        localStorage.removeItem('returnTo');
        localStorage.removeItem('returnAction');
        // Navigate to chat page (the selectedChatDeveloper is already stored)
        navigate('/chat');
      } else if (returnTo) {
        // Clear return info and go back to the stored page
        localStorage.removeItem('returnTo');
        localStorage.removeItem('returnAction');
        navigate(returnTo);
      } else {
        // Default dashboard navigation when clicking login from header
        if (role === "student") {
          navigate("/studentdashboard");
        } else if (role === "developer") {
          navigate("/developerdashboard");
        } else if (role === "organization") {
          navigate("/companydashboard");
        }
      }
  
      toast.success("Login successful");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row vh-100">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-100"
        style={{
          position: "fixed",
          top: 0,
          zIndex: 10,
          background: "#ffffff",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <img src={Logo} alt="Logo" style={{ height: "40px" }} />
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          <IoMdClose />
        </button>
      </motion.header>

      {/* Left Section - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="col-12 col-md-6 d-flex justify-content-center align-items-center"
        style={{
          marginTop: "70px",
          marginBottom: "0px",
        }}
      >
        <div
          className="w-75 shadow"
          style={{
            borderRadius: "20px",
            backgroundColor: "#f9f9f9",
            padding: "30px",
            border: "1px solid #e0e0e0",
          }}
        >
          {/* Welcome Text */}
          <div className="text-center mb-4">
            <h2 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
              Login Into Your Account
            </h2>
            <p style={{ color: "#6c757d" }}>
              Welcome Back! Select method to Login:
            </p>
          </div>

          {/* Social Login Options */}
          <div className="d-flex justify-content-center gap-3 mb-4">
            <button
              className="btn shadow-sm"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img src={GoogleSvg} alt="Google" style={{ width: "20px" }} />
              Google
            </button>
            <button
              className="btn shadow-sm"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img src={LinkedInSvg} alt="LinkedIn" style={{ width: "20px" }} />
              LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div className="text-center mb-4">
            <div
              style={{
                borderTop: "1px solid #e0e0e0",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "-10px",
                  background: "#f9f9f9",
                  padding: "0 10px",
                  fontSize: "0.9rem",
                  color: "#6c757d",
                }}
              >
                or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            {error && (
              <div className="alert alert-danger mb-3">{error}</div>
            )}
            <input
              type="email"
              placeholder="Email"
              className="form-control mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderRadius: "8px",
                padding: "10px",
                border: "1px solid #e0e0e0",
              }}
            />
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="form-control mb-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  borderRadius: "8px",
                  padding: "10px",
                  border: "1px solid #e0e0e0",
                }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <input type="checkbox" id="remember" />{" "}
                <label htmlFor="remember">Remember Me</label>
              </div>
              <a href="/forgotpassword" className="text-primary">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{
                borderRadius: "8px",
                fontWeight: "bold",
              }}
            >
              Log In
            </button>
          </form>
           {/* Sign Up Link */}
           <div className="text-center mt-4">
          <p className="text-center mt-3"
          style={{
            fontSize: "1.1rem",
            color: "#6c757d",
            marginTop: "20px",
            marginBottom: "10px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}>
            Don't have an account?{" "}
            <a href="/optionsighn" className="text-primary">
              Create an account
            </a>
          </p>
          </div>
        </div>
      </motion.div>

      {/* Right Section */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="col-md-6 d-none d-md-flex"
        style={{
          backgroundImage: `url(${LoginPic})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

export default Login;
