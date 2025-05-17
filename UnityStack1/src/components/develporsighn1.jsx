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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone numbers to auto-format them
    if (name === 'phoneNumber' || name === 'homeNumber') {
      // Remove all non-digits
      const digitsOnly = value.replace(/\D/g, '');
      
      // Format as XXXX-XXXXXXX if we have enough digits
      if (digitsOnly.length <= 4) {
        setFormData({
          ...formData,
          [name]: digitsOnly
        });
      } else {
        const formattedNumber = `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 11)}`;
        setFormData({
          ...formData,
          [name]: formattedNumber
        });
      }
    } else {
      // Normal handling for other fields
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Validate form page 1 (personal details)
  const validatePage1 = () => {
    const newErrors = {};
    const requiredFields = [
      "firstName", "lastName", "email", "password", "confirmPassword",
      "phoneNumber", "dateOfBirth", "address", "city", 
      "state", "country", "zipCode"
    ];
    
    // Remove homeNumber from required fields
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    // Validate email format
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Validate phone number format (0321-5953600)
    if (formData.phoneNumber && !/^\d{4}-\d{7}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be in format 0321-5953600";
    }
    
    // Validate home number format (same as phone) - only if provided
    if (formData.homeNumber && formData.homeNumber.trim() !== '' && !/^\d{4}-\d{7}$/.test(formData.homeNumber)) {
      newErrors.homeNumber = "Home number must be in format 0321-5953600";
    }
    
    // Validate password - must be at least 8 chars with letters and numbers
    if (formData.password) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = "Password must be at least 8 characters and contain both letters and numbers";
      }
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate form page 2 (domains)
  const validatePage2 = () => {
    const newErrors = {};
    
    if (formData.domainTags.length === 0) {
      newErrors.domainTags = "Please select at least one domain";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    
    if (!validatePage1()) return false;
    if (!validatePage2()) return false;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next button click
  const handleNext = () => {
    if (currentPage === 1 && !validatePage1()) {
      return; // Don't proceed if validation fails
    }
    
    if (currentPage === 2 && !validatePage2()) {
      return; // Don't proceed if validation fails
    }
    
    setCurrentPage((prev) => Math.min(prev + 1, 3));
  };

  // Request OTP without saving data
  const handleRequestOtp = async () => {
    if (!validateForm()) return;

    try {
      // Only request OTP, don't save data yet
      const response = await fetch("http://localhost:5000/api/developers/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();

      if (response.ok) {
        setShowOtpModal(true); // Show OTP Modal
      } else {
        // Show more descriptive error from server
        setErrors(prev => ({
          ...prev,
          email: result.message || "Failed to send verification code."
        }));
        
        // Alert for visibility
        alert(result.message || "Failed to send verification code.");
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      setErrors(prev => ({
        ...prev,
        email: "Network error. Please try again."
      }));
      alert("Something went wrong. Please try again.");
    }
  };

  // Verify OTP then save data
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
        // OTP verified successfully, now register the user
        await registerDeveloper();
      } else {
        alert(result.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Register developer after OTP verification
  const registerDeveloper = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/developers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          verified: true  // Indicate this developer is pre-verified
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setShowOtpModal(false);
        setShowSuccessModal(true);
      } else {
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
    <div>
      <h2>Personal & Contact Info</h2>
      {renderProgressBar()}
      <div className="row">
        <div className="col-md-6">
          <label>First Name <span className="text-danger">*</span></label>
          <input
            type="text"
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <div className="invalid-feedback">{errors.firstName}</div>
          )}
        </div>
        <div className="col-md-6">
          <label>Last Name <span className="text-danger">*</span></label>
          <input
            type="text"
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <div className="invalid-feedback">{errors.lastName}</div>
          )}
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label>Phone Number <span className="text-danger">*</span></label>
          <input
            type="text"
            className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
            name="phoneNumber"
            placeholder="Format: 0321-5953600"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && (
            <div className="invalid-feedback">{errors.phoneNumber}</div>
          )}
          <small className="text-muted">Enter phone number in format 0321-5953600</small>
        </div>
        <div className="col-md-6">
          <label>Home Number <span className="text-muted">(Optional)</span></label>
          <input
            type="text"
            className={`form-control ${errors.homeNumber ? "is-invalid" : ""}`}
            name="homeNumber"
            placeholder="Format: 0321-5953600 (Optional)"
            value={formData.homeNumber}
            onChange={handleChange}
          />
          {errors.homeNumber && (
            <div className="invalid-feedback">{errors.homeNumber}</div>
          )}
          <small className="text-muted">Enter home number in format 0321-5953600 (Optional)</small>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label>Date of Birth <span className="text-danger">*</span></label>
          <input
            type="date"
            className={`form-control ${errors.dateOfBirth ? "is-invalid" : ""}`}
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          {errors.dateOfBirth && (
            <div className="invalid-feedback">{errors.dateOfBirth}</div>
          )}
        </div>
        <div className="col-md-6">
          <label>Email <span className="text-danger">*</span></label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <label>Address <span className="text-danger">*</span></label>
          <input
            type="text"
            className={`form-control ${errors.address ? "is-invalid" : ""}`}
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && (
            <div className="invalid-feedback">{errors.address}</div>
          )}
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label>City <span className="text-danger">*</span></label>
          <input
            type="text"
            className={`form-control ${errors.city ? "is-invalid" : ""}`}
            name="city"
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && (
            <div className="invalid-feedback">{errors.city}</div>
          )}
        </div>
        <div className="col-md-6">
          <label>State <span className="text-danger">*</span></label>
          <input
            type="text"
            className={`form-control ${errors.state ? "is-invalid" : ""}`}
            name="state"
            placeholder="Enter your state"
            value={formData.state}
            onChange={handleChange}
          />
          {errors.state && (
            <div className="invalid-feedback">{errors.state}</div>
          )}
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label>Country <span className="text-danger">*</span></label>
          <input
            type="text"
            className={`form-control ${errors.country ? "is-invalid" : ""}`}
            name="country"
            placeholder="Enter your country"
            value={formData.country}
            onChange={handleChange}
          />
          {errors.country && (
            <div className="invalid-feedback">{errors.country}</div>
          )}
        </div>
        <div className="col-md-6">
          <label>Zip Code <span className="text-danger">*</span></label>
          <input
            type="text"
            className={`form-control ${errors.zipCode ? "is-invalid" : ""}`}
            name="zipCode"
            placeholder="Enter your zip code"
            value={formData.zipCode}
            onChange={handleChange}
          />
          {errors.zipCode && (
            <div className="invalid-feedback">{errors.zipCode}</div>
          )}
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-6">
          <label>Password <span className="text-danger">*</span></label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            name="password"
            placeholder="Enter your password (min 8 chars with letters and numbers)"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>
        <div className="col-md-6">
          <label>Confirm Password <span className="text-danger">*</span></label>
          <input
            type="password"
            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          )}
        </div>
      </div>
    </div>
  );

      case 2:
        return (
          <div>
            <h2>Domains</h2>
            {renderProgressBar()}
            <p className="mb-3">Select at least one domain <span className="text-danger">*</span></p>
            {errors.domainTags && (
              <div className="alert alert-danger" role="alert">
                {errors.domainTags}
              </div>
            )}
            <div className="row">
              {["MERN", "Django", "AI/ML", "Data Analyst"].map((domain, index) => (
                <div className="col-3" key={index}>
                  <div
                    className={`card p-3 mb-3 ${
                      formData.domainTags.includes(domain)
                        ? "border-primary"
                        : "border-secondary"
                    }`}
                    style={{ cursor: "pointer" }}
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
            <div className="card p-3">
              <h4>Personal Information</h4>
              <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phoneNumber || "Not provided"}</p>
              
              <h4 className="mt-3">Address</h4>
              <p>{formData.address || "Not provided"}</p>
              <p>{formData.city}{formData.city && formData.state ? ", " : ""}{formData.state} {formData.zipCode}</p>
              <p>{formData.country || "Not provided"}</p>
              
              <h4 className="mt-3">Domains</h4>
              <p>{formData.domainTags.join(", ")}</p>
            </div>
            <p className="mt-3 text-muted">Please review your information carefully before submitting.</p>
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
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              className="btn btn-success"
              type="button"
              onClick={handleRequestOtp}
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
      onClick={handleOtpVerification}
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
