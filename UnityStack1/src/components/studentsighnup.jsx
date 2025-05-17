import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import SignupImage from "../assets/student.png"; // Replace with the correct image path
import { useNavigate } from "react-router-dom";  // ✅ Import for navigation


const StudentSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    university: "",
    universityEmail: "",
    semester: "",
    domain: "",
    linkedIn: "",
    github: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempFormData, setTempFormData] = useState(null);
  const navigate = useNavigate(); // ✅ Hook for navigation


  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
  
    // ✅ Check required fields
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });
  
    // ✅ Enhanced password validation - at least 8 chars, must contain letters and numbers
    if (formData.password) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = "Password must be at least 8 characters and contain both letters and numbers";
      }
    }
  
    // ✅ Ensure passwords match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
  
    // ✅ Validate email format
    if (formData.universityEmail && !/\S+@\S+\.\S+/.test(formData.universityEmail)) {
      newErrors.universityEmail = "Invalid email format";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Request OTP - doesn't submit data to backend yet
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Store form data temporarily without submitting to backend
        setTempFormData({...formData});
        
        // Request OTP
        const response = await fetch(
          "http://localhost:5000/api/students/request-otp",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: formData.email }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setShowOtpModal(true); // Show OTP modal
        } else {
          // Display server error in the form
          setErrors(prev => ({
            ...prev,
            email: data.message || "Error sending OTP."
          }));
          
          // Also show an alert for visibility
          alert(data.message || "Error sending OTP.");
        }
      } catch (error) {
        console.error("Error requesting OTP:", error.message);
        setErrors(prev => ({
          ...prev,
          email: "Network error. Please try again later."
        }));
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  // Verify OTP and submit user data
  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/students/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            code: otp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // OTP verified successfully, now register the user
        await registerUser();
      } else {
        alert(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error.message);
      alert("Something went wrong. Please try again later.");
    }
  };

  // Register user after OTP verification
  const registerUser = async () => {
    try {
      // Format LinkedIn and GitHub URLs properly if they don't have https:// prefix
      let formattedData = {...formData};
      
      // Add https:// prefix to LinkedIn if it's missing
      if (formattedData.linkedIn && !formattedData.linkedIn.startsWith('http')) {
        formattedData.linkedIn = `https://${formattedData.linkedIn}`;
      }
      
      // Add https:// prefix to GitHub if it's missing
      if (formattedData.github && !formattedData.github.startsWith('http')) {
        formattedData.github = `https://${formattedData.github}`;
      }
      
      // The user has been verified, now we can register them
      const response = await fetch(
        "http://localhost:5000/api/students/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formattedData,
            verified: true  // Indicate this user has been pre-verified
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsOtpVerified(true);
        setShowOtpModal(false);
        setShowModal(true); // Show success modal
      } else {
        alert(data.message || "An error occurred during signup.");
      }
    } catch (error) {
      console.error("Error during signup:", error.message);
      alert("Something went wrong. Please try again later.");
    }
  };

  // Common styles for input fields
  const inputStyle = {
    border: "1px solid black",
    borderRadius: "5px",
    transition: "border-color 0.3s ease",
  };

  const focusStyle = (e) => (e.target.style.border = "2px solid blue");
  const blurStyle = (e) => (e.target.style.border = "1px solid black");

  return (
    <div
      className="d-flex vh-100"
      style={{ backgroundColor: "#f8f9fa", overflow: "hidden" }}
    >
      {/* Left Side: Form */}
      <div
        className="d-flex flex-column p-4 position-relative"
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          margin: "20px",
          overflowY: "auto",
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => (window.location.href = "/")}
          className="position-absolute"
          style={{
            top: "25px", // Position close to the top
            right: "10px", // Position close to the right edge
            background: "none",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
            color: "black",
          }}
        >
          ✖
        </button>
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              marginBottom: "5px",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            Student Register
          </h2>
          <div
            style={{
              width: "100px",
              height: "3px",
              backgroundColor: "#007bff",
              borderRadius: "3px",
            }}
          ></div>
        </div>

        <form
          style={{ width: "100%", maxWidth: "350px" }}
          onSubmit={handleRequestOtp}
        >
          {/* First Name and Last Name */}
          <div className="d-flex gap-3 mb-3">
            <input
              type="text"
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onFocus={focusStyle}
              onBlur={blurStyle}
              style={inputStyle}
            />
            <input
              type="text"
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onFocus={focusStyle}
              onBlur={blurStyle}
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={focusStyle}
              onBlur={blurStyle}
              style={inputStyle}
            />
          </div>

          {/* University */}
          <div className="mb-3">
            <input
              type="text"
              className={`form-control ${
                errors.university ? "is-invalid" : ""
              }`}
              placeholder="University"
              name="university"
              value={formData.university}
              onChange={handleChange}
              onFocus={focusStyle}
              onBlur={blurStyle}
              style={inputStyle}
            />
          </div>

          {/* University Email */}
          <div className="mb-3">
            <input
              type="email"
              className={`form-control ${
                errors.universityEmail ? "is-invalid" : ""
              }`}
              placeholder="University Email"
              name="universityEmail"
              value={formData.universityEmail}
              onChange={handleChange}
              onFocus={focusStyle}
              onBlur={blurStyle}
              style={inputStyle}
            />
          </div>

          {/* Semester Dropdown */}
          <div className="mb-3">
            <select
              className={`form-control ${errors.semester ? "is-invalid" : ""}`}
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              onFocus={focusStyle}
              onBlur={blurStyle}
              style={inputStyle}
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Domain Dropdown */}
          <div className="mb-3">
            <select
              className={`form-control ${errors.domain ? "is-invalid" : ""}`}
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              onFocus={focusStyle}
              onBlur={blurStyle}
              style={inputStyle}
            >
              <option value="">Select Domain</option>
              {["Web Development", "AI", "Data Science", ".NET"].map(
                (domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                )
              )}
            </select>
          </div>

          {/* LinkedIn Profile */}
          <div className="mb-3">
            <input
              type="text"
              className={`form-control ${errors.linkedIn ? "is-invalid" : ""}`}
              placeholder="LinkedIn Profile"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleChange}
              onFocus={focusStyle}
              onBlur={blurStyle}
              style={inputStyle}
            />
            <small className="text-muted">
              Example: www.linkedin.com/in/username
            </small>
          </div>

          {/* GitHub Profile */}
          <div className="mb-3">
            <input
              type="text"
              className={`form-control ${errors.github ? "is-invalid" : ""}`}
              placeholder="GitHub Profile"
              name="github"
              value={formData.github}
              onChange={handleChange}
              onFocus={focusStyle}
              onBlur={blurStyle}
              style={inputStyle}
            />
            <small className="text-muted">
              Example: www.github.com/username
            </small>
          </div>

          
          {/* Password Field */}
<div className="mb-3 position-relative">
  <input
    type={showPassword ? "text" : "password"}
    className={`form-control ${errors.password ? "is-invalid" : ""}`}
    placeholder="Password (Min 8 characters with letters and numbers)"
    name="password"
    value={formData.password}
    onChange={handleChange}
    style={{
      border: errors.password ? "2px solid red" : "1px solid black", // ✅ Red border if invalid
    }}
  />
  <button
    type="button"
    className="btn btn-link position-absolute"
    style={{ top: "50%", right: "10px", transform: "translateY(-50%)" }}
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "🙈" : "👁"}
  </button>
  {errors.password && <div className="text-danger">{errors.password}</div>} {/* ✅ Show error text */}
</div>


         
         {/* Confirm Password Field */}
<div className="mb-3 position-relative">
  <input
    type={showConfirmPassword ? "text" : "password"}
    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
    placeholder="Confirm Password"
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
    style={{
      border: errors.confirmPassword ? "2px solid red" : "1px solid black", // ✅ Red border if mismatch
    }}
  />
  <button
    type="button"
    className="btn btn-link position-absolute"
    style={{ top: "50%", right: "10px", transform: "translateY(-50%)" }}
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  >
    {showConfirmPassword ? "🙈" : "👁"}
  </button>
  {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>} {/* ✅ Show error text */}
</div>


          <button
            className="btn btn-primary w-100 mb-3"
            style={{ borderRadius: "5px" }}
            type="submit"
          >
            Create Account
          </button>
        </form>
      </div>

      {/* Right Side: Image */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          flex: 1,
          backgroundColor: "#e9ecef",
        }}
      >
        <img
          src={SignupImage}
          alt="Sign Up"
          style={{
            width: "80%",
            height: "90%",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      </div>

      {/* OTP Modal */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Verify OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>A verification code has been sent to your email address. Please enter it below.</p>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOtpModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleVerifyOtp}>
            Verify OTP
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
<Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>🎉 Account Created Successfully!</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Your account has been successfully created. Click below to go to the login page.
  </Modal.Body>
  <Modal.Footer>
    <Button 
      variant="primary" 
      onClick={() => navigate("/login")} // ✅ Navigate user to login page
    >
      🔄 Back to Login
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
};

export default StudentSignUp;
