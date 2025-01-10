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
    selectPosition: "",
    selectDivision: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
    experience: "",
    degrees: [
      {
        type: "",
        startYear: "",
        endYear: "",
        degreeImage: null,
      },
    ],
    domainTags: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const addDegree = () => {
    setFormData({
      ...formData,
      degrees: [
        ...formData.degrees,
        {
          type: "",
          startYear: "",
          endYear: "",
          degreeImage: null,
        },
      ],
    });
  };

  const handleNext = () => {
    if (currentPage === 4) {
      setShowOtpModal(true);
    } else {
      setCurrentPage((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const renderProgressBar = () => {
    const steps = [
      "Contact Information",
      "Personal Information",
      "Domains",
      "Review",
    ];

    return (
      <div className="d-flex justify-content-between align-items-center mb-4">
        {steps.map((step, index) => (
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
        ))}
      </div>
    );
  };

  const renderHeadingAndProgress = () => (
    <>
      <div style={{ marginBottom: "20px", textAlign: "left" }}>
        <h2>
          <span style={{ color: "black", fontWeight: "bold" }}>Developer</span> <span style={{ color: "#007bff" }}>Register</span>
        </h2>
      </div>
      {renderProgressBar()}
    </>
  );

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div style={{ paddingBottom: "20px" }}>
            {renderHeadingAndProgress()}
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
                <label className="form-label">Home Number</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Home Number"
                  name="homeNumber"
                  value={formData.homeNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
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
            </div>
            <div className="row mb-3">
              <label className="form-label">Profile Photo</label>
              <input
                type="file"
                className="form-control rounded-pill"
                name="profileImage"
                onChange={handleChange}
              />
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
            {renderHeadingAndProgress()}
            <h5 className="mb-4">Personal Information</h5>
            <div className="mb-3">
              <label>Year of Experience</label>
              <select
                className="form-control rounded-pill"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
              </select>
            </div>
            <h5 className="text-primary mb-3">Educational Details</h5>
            {formData.degrees.map((degree, index) => (
              <div key={index} className="mb-4">
                <div className="row mb-3">
                  <div className="col">
                    <select
                      className="form-control rounded-pill"
                      value={degree.type}
                      onChange={(e) => {
                        const updatedDegrees = [...formData.degrees];
                        updatedDegrees[index].type = e.target.value;
                        setFormData({ ...formData, degrees: updatedDegrees });
                      }}
                    >
                      <option value="">Select Degree</option>
                      <option value="BS">BS</option>
                      <option value="MS">MS</option>
                      <option value="Diploma">Diploma</option>
                    </select>
                  </div>
                  <div className="col">
                    <input
                      type="date"
                      className="form-control rounded-pill"
                      placeholder="Start Year"
                      value={degree.startYear}
                      onChange={(e) => {
                        const updatedDegrees = [...formData.degrees];
                        updatedDegrees[index].startYear = e.target.value;
                        setFormData({ ...formData, degrees: updatedDegrees });
                      }}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="date"
                      className="form-control rounded-pill"
                      placeholder="End Year"
                      value={degree.endYear}
                      onChange={(e) => {
                        const updatedDegrees = [...formData.degrees];
                        updatedDegrees[index].endYear = e.target.value;
                        setFormData({ ...formData, degrees: updatedDegrees });
                      }}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label>Upload Certificate</label>
                  <input
                    type="file"
                    className="form-control rounded-pill"
                    onChange={(e) => {
                      const updatedDegrees = [...formData.degrees];
                      updatedDegrees[index].degreeImage = e.target.files[0];
                      setFormData({ ...formData, degrees: updatedDegrees });
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addDegree}
            >
              + Add Another Degree
            </button>
          </div>
        );
      case 3:
        return (
          <div style={{ paddingBottom: "20px" }}>
            {renderHeadingAndProgress()}
            <h5 className="mb-4">Domains</h5>
            <div className="mb-3">
              {formData.domainTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="badge bg-primary text-white me-2 rounded-pill"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="row">
              {["MERN", "Django", "Data Analyst", "AI/ML"].map(
                (domain, idx) => (
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
                )
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div style={{ paddingBottom: "20px" }}>
            {renderHeadingAndProgress()}
            <h5 className="mb-4">Review Your Details</h5>
            <p>
              <strong>Name:</strong> {formData.firstName} {formData.lastName}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>City:</strong> {formData.city}
            </p>
            <p>
              <strong>Experience:</strong> {formData.experience}
            </p>
            <h6>Degrees:</h6>
            {formData.degrees.map((degree, idx) => (
              <div key={idx}>
                <p>
                  {degree.type} ({degree.startYear} - {degree.endYear})
                </p>
              </div>
            ))}
            <h6>Domain Tags:</h6>
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
              onClick={handlePrevious}
            >
              Previous
            </button>
          )}
          {currentPage < 4 ? (
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
              onClick={() => setShowOtpModal(true)}
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
            onClick={() => alert("Redirecting to Dashboard")}
          >
            <a
          href="/develpordashboard"
          style={{ textDecoration: "none", color: "black" }} // Ensures black text and no underline
        >
          Go to Dashboard
        </a>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeveloperSignUp;
