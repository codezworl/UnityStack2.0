import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CompanyImage from "../assets/organization.jpg";
import { Modal, Button } from "react-bootstrap";

const OrganizationRegister = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    branches: "",
    operatingCities: [],
    website: "",
    companyEmail: "",
    logo: null,
    password: "",
    confirmPassword: "",
    whoYouAre: "",
    selectedServices: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const cities = ["Lahore", "Karachi", "Islamabad", "Peshawar", "Quetta"];
  const services = [
    { name: "Web Development", logo: "🌐" },
    { name: "App Development", logo: "📱" },
    { name: "Cloud Solutions", logo: "☁️" },
    { name: "AI Integration", logo: "🤖" },
    { name: "Data Analytics", logo: "📊" },
    { name: "Cybersecurity", logo: "🔒" },
    { name: "Blockchain", logo: "⛓️" },
    { name: "UI/UX Design", logo: "🎨" },
    { name: "IoT Solutions", logo: "🌐" },
    { name: "DevOps", logo: "⚙️" },
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleCityToggle = (city) => {
    setFormData((prev) => {
      const updatedCities = prev.operatingCities.includes(city)
        ? prev.operatingCities.filter((c) => c !== city)
        : [...prev.operatingCities, city];
      return { ...prev, operatingCities: updatedCities };
    });
  };

  const handleServiceToggle = (service) => {
    setFormData((prev) => {
      const updatedServices = prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service];
      return { ...prev, selectedServices: updatedServices };
    });
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const renderProgressBar = () => (
    <div className="d-flex justify-content-between align-items-center mb-4">
      {["Company Info", "Services", "Review & Submit"].map((step, index) => (
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

  const renderHeadingAndProgress = () => (
    <>
      <div style={{ marginBottom: "20px", textAlign: "left" }}>
        <h2>
          <span style={{ color: "black", fontWeight: "bold" }}>Company</span> <span style={{ color: "#007bff" }}>Registration</span>
        </h2>
      </div>
      {renderProgressBar()}
    </>
  );

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div>
            {renderHeadingAndProgress()}
            <h5 className="mb-4">Company Information</h5>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">No. of Branches</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  name="branches"
                  value={formData.branches}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label className="form-label">Website</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Operating Cities</label>
              <div className="d-flex flex-wrap">
                {cities.map((city) => (
                  <div key={city} className="form-check me-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={formData.operatingCities.includes(city)}
                      onChange={() => handleCityToggle(city)}
                    />
                    <label className="form-check-label">{city}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Who You Are</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  name="whoYouAre"
                  value={formData.whoYouAre}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label className="form-label">Company Email</label>
                <input
                  type="email"
                  className="form-control rounded-pill"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Upload Logo</label>
              <input
                type="file"
                className="form-control rounded-pill"
                name="logo"
                onChange={handleChange}
              />
            </div>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control rounded-pill"
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
          <div>
            {renderHeadingAndProgress()}
            <h5 className="mb-4">Select Services</h5>
            <div className="mb-3">
              {formData.selectedServices.map((service, idx) => (
                <span
                  key={idx}
                  className="badge bg-primary text-white me-2 rounded-pill"
                >
                  {service}
                </span>
              ))}
            </div>
            <div className="row">
              {services.map((service, idx) => (
                <div key={idx} className="col-3 mb-4">
                  <div
                    className={`card text-center p-3 ${
                      formData.selectedServices.includes(service.name)
                        ? "border-primary"
                        : "border-secondary"
                    }`}
                    onClick={() => handleServiceToggle(service.name)}
                    style={{ cursor: "pointer" }}
                  >
                    <h2>{service.logo}</h2>
                    <h5>{service.name}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            {renderHeadingAndProgress()}
            <h5 className="mb-4">Review & Submit</h5>
            <p>
              <strong>Company Name:</strong> {formData.companyName}
            </p>
            <p>
              <strong>Address:</strong> {formData.address}
            </p>
            <p>
              <strong>Branches:</strong> {formData.branches}
            </p>
            <p>
              <strong>Operating Cities:</strong> {formData.operatingCities.join(", ")}
            </p>
            <p>
              <strong>Website:</strong> {formData.website}
            </p>
            <p>
              <strong>Who You Are:</strong> {formData.whoYouAre}
            </p>
            <p>
              <strong>Selected Services:</strong> {formData.selectedServices.join(", ")}
            </p>
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
              onClick={() => {
                setShowModal(true);
                setFormData({
                  companyName: "",
                  address: "",
                  branches: "",
                  operatingCities: [],
                  website: "",
                  companyEmail: "",
                  logo: null,
                  password: "",
                  confirmPassword: "",
                  whoYouAre: "",
                  selectedServices: [],
                });
              }}
            >
              Submit
            </button>
          )}
        </div>
      </div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ flex: 1, backgroundColor: "#e9ecef" }}
      >
        <img
          src={CompanyImage}
          alt="Company"
          style={{
            width: "80%",
            height: "90%",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registration Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Thank you for registering! Our team will review your application shortly.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrganizationRegister;
