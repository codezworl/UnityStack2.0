import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SignupImage from "../assets/student.png"; // Replace with the correct path to your image

const StudentSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    university: "",
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
  const [showModal, setShowModal] = useState(false); // Success modal visibility state
  const [showOtpModal, setShowOtpModal] = useState(false); // OTP modal visibility state
  const [otp, setOtp] = useState(""); // State to manage OTP input

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowOtpModal(true); // Show OTP modal on successful validation
    }
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    if (otp === "123456") { // Dummy OTP for frontend
      setShowOtpModal(false); // Close OTP modal
      setShowModal(true); // Show success modal
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  // Common style for input fields
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
        {/* Left Side Heading */}
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

        {/* Form Content */}
        <div className="d-flex flex-column justify-content-center align-items-center">
          <form
            style={{ width: "100%", maxWidth: "350px" }}
            onSubmit={handleSubmit}
          >
            {/* Add original form fields */}
            <div className="d-flex gap-3 mb-3">
              <input
                type="text"
                className={`form-control ${
                  errors.firstName ? "is-invalid" : ""
                }`}
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
                className={`form-control ${
                  errors.lastName ? "is-invalid" : ""
                }`}
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onFocus={focusStyle}
                onBlur={blurStyle}
                style={inputStyle}
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Email address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={focusStyle}
                onBlur={blurStyle}
                style={inputStyle}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className={`form-control ${
                  errors.university ? "is-invalid" : ""
                }`}
                placeholder="Your University"
                name="university"
                value={formData.university}
                onChange={handleChange}
                onFocus={focusStyle}
                onBlur={blurStyle}
                style={inputStyle}
              />
            </div>
            <div className="mb-3">
              <select
                className={`form-control ${
                  errors.semester ? "is-invalid" : ""
                }`}
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
                    {sem}
                  </option>
                ))}
              </select>
            </div>
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
                <option value="">Select Your Domain</option>
                {["Web Development", ".NET", "AI", "Data Science"].map(
                  (domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="d-flex gap-3 mb-3">
              <input
                type="text"
                className={`form-control ${
                  errors.linkedIn ? "is-invalid" : ""
                }`}
                placeholder="LinkedIn Profile"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                onFocus={focusStyle}
                onBlur={blurStyle}
                style={inputStyle}
              />
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
            </div>
            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={focusStyle}
                onBlur={blurStyle}
                style={inputStyle}
              />
              <button
                type="button"
                className="btn btn-link position-absolute"
                style={{ top: "50%", right: "10px", transform: "translateY(-50%)" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            <div className="mb-3 position-relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control ${
                  errors.confirmPassword ? "is-invalid" : ""
                }`}
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={focusStyle}
                onBlur={blurStyle}
                style={inputStyle}
              />
              <button
                type="button"
                className="btn btn-link position-absolute"
                style={{ top: "50%", right: "10px", transform: "translateY(-50%)" }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁"}
              </button>
            </div>

            {/* Create Account Button */}
            <button
              className="btn btn-primary w-100 mb-3"
              style={{ borderRadius: "5px" }}
              type="submit"
            >
              Create account
            </button>
          </form>
        </div>
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
      {showOtpModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Verify OTP</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowOtpModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Please enter the 6-digit OTP sent to your email.</p>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowOtpModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Your account has been created successfully!</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => alert("Navigate to dashboard")}
                >
                  Go to Dashboard
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSignUp;
