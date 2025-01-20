import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [serverOtp, setServerOtp] = useState(""); // Optional for debugging
  const navigate = useNavigate();

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

      const result = await response.json();

      if (response.ok) {
        setServerOtp(result.otp); // Store OTP for debugging (optional)
        setShowOtpModal(true); // Show OTP Modal
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleOtpVerification = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/developers/verifyemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          code: otp,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setShowOtpModal(false);
        setShowSuccessModal(true);
      } else {
        alert(result.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
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
    <div>
      <h2>Personal & Contact Info</h2>
      {renderProgressBar()}
      <div className="row">
        <div className="col-md-6">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label>Phone Number</label>
          <input
            type="text"
            className="form-control"
            name="phoneNumber"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label>Home Number</label>
          <input
            type="text"
            className="form-control"
            name="homeNumber"
            placeholder="Enter your home number"
            value={formData.homeNumber}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label>Date of Birth</label>
          <input
            type="date"
            className="form-control"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <label>Address</label>
          <input
            type="text"
            className="form-control"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label>City</label>
          <input
            type="text"
            className="form-control"
            name="city"
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label>State</label>
          <input
            type="text"
            className="form-control"
            name="state"
            placeholder="Enter your state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label>Country</label>
          <input
            type="text"
            className="form-control"
            name="country"
            placeholder="Enter your country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label>Zip Code</label>
          <input
            type="text"
            className="form-control"
            name="zipCode"
            placeholder="Enter your zip code"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );

      case 2:
        return (
          <div>
            <h2>Domains</h2>
            {renderProgressBar()}
            <div className="row">
              {["MERN", "Django", "AI/ML", "Data Analyst"].map((domain, index) => (
                <div className="col-3" key={index}>
                  <div
                    className={`card p-3 ${
                      formData.domainTags.includes(domain)
                        ? "border-primary"
                        : "border-secondary"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        domainTags: formData.domainTags.includes(domain)
                          ? formData.domainTags.filter((d) => d !== domain)
                          : [...formData.domainTags, domain],
                      }))
                    }
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
          <div>
            <h2>Review & Submit</h2>
            {renderProgressBar()}
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="d-flex vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Left Side: Form */}
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
          alt="Developer Signup"
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
      onClick={handleOtpVerification} // Use the correct function name
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
            onClick={() => navigate("/login")} // Redirect to login
          >
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeveloperSignUp;
