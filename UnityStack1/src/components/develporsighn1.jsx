import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SignupImage from "../assets/develpor.png";
import { Modal, Button } from "react-bootstrap";

const DeveloperSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    homeNumber: "",
    dateOfBirth: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    password: "",
    confirmPassword: "",
    experience: "",
    domainTags: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5000/api/developers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowOtpModal(false);
        setShowSuccessModal(true);
      } else {
        const result = await response.json();
        alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const renderProgressBar = () => (
    <div className="d-flex justify-content-between align-items-center mb-4">
      {["Personal & Contact Info", "Domains", "Review & Submit"].map(
        (step, index) => (
          <div
            key={index}
            className={`text-center flex-fill ${
              currentPage === index + 1 ? "text-primary fw-bold" : "text-muted"
            }`}
          >
            <div
              className={`rounded-circle d-inline-flex justify-content-center align-items-center ${
                currentPage === index + 1 ? "bg-primary text-white" : "bg-light"
              }`}
              style={{
                width: "30px",
                height: "30px",
                border: "2px solid",
                borderColor: currentPage === index + 1 ? "#007bff" : "#dee2e6",
              }}
            >
              {index + 1}
            </div>
            <div>{step}</div>
          </div>
        )
      )}
    </div>
  );

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div style={{ paddingBottom: "20px" }}>
            <h2>
              <span style={{ color: "black", fontWeight: "bold" }}>Developer</span>{" "}
              <span style={{ color: "#007bff" }}>Register</span>
            </h2>
            {renderProgressBar()}
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control rounded-pill"
                  placeholder="Date of Birth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control rounded-pill"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control rounded-pill"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control rounded-pill"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ paddingBottom: "20px" }}>
            <h2>
              <span style={{ color: "black", fontWeight: "bold" }}>Developer</span>{" "}
              <span style={{ color: "#007bff" }}>Domains</span>
            </h2>
            {renderProgressBar()}
            <h5 className="mb-4">Select Your Domains</h5>
            <div className="row">
              {["MERN", "Django", "Data Analyst", "AI/ML"].map((domain, idx) => (
                <div key={idx} className="col-3">
                  <div
                    className={`card p-3 text-center rounded ${
                      formData.domainTags.includes(domain)
                        ? "border-primary"
                        : "border-secondary"
                    }`}
                    onClick={() => {
                      const tags = formData.domainTags.includes(domain)
                        ? formData.domainTags.filter((tag) => tag !== domain)
                        : [...formData.domainTags, domain];
                      setFormData({ ...formData, domainTags: tags });
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {domain}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{ paddingBottom: "20px" }}>
            <h2>
              <span style={{ color: "black", fontWeight: "bold" }}>Review</span>{" "}
              <span style={{ color: "#007bff" }}>Your Details</span>
            </h2>
            {renderProgressBar()}
            <h5 className="mb-4">Personal Information</h5>
            <p>
              <strong>First Name:</strong> {formData.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {formData.lastName}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {formData.phoneNumber}
            </p>
            <p>
              <strong>Date of Birth:</strong> {formData.dateOfBirth}
            </p>
            <h5 className="mt-4">Domain Tags</h5>
            <p>{formData.domainTags.join(", ")}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="d-flex vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div
        className="d-flex flex-column p-4"
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          margin: "20px",
          overflowY: "auto",
        }}
      >
        {renderPageContent()}
        <div className="d-flex justify-content-between mt-4">
          {currentPage > 1 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
          )}
          {currentPage < 3 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, 3))}
            >
              Next
            </button>
          ) : (
            <button
              className="btn btn-success"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          flex: 1,
          backgroundColor: "#e9ecef",
        }}
      >
        <img
          src={SignupImage}
          alt="Developer"
          style={{
            width: "80%",
            height: "90%",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      </div>

      {/* OTP Modal */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please enter the OTP sent to your email address.</p>
          <input
            type="text"
            className="form-control"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowOtpModal(false);
              setShowSuccessModal(true);
            }}
          >
            Verify OTP
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registration Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your registration has been successfully completed!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              window.location.href = "/developer/login";
            }}
          >
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeveloperSignUp;
