import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("info"); // Active tab state
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "ABC Company",
    branchName: "Main Branch",
    numBranches: 5,
    operateCities: "New York, Los Angeles, Chicago",
    email: "contact@abccompany.com",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [services, setServices] = useState([
    { id: 1, name: "Web Development", logo: "https://via.placeholder.com/100" },
    { id: 2, name: "Mobile App Development", logo: "https://via.placeholder.com/100" },
    { id: 3, name: "AI & Machine Learning", logo: "https://via.placeholder.com/100" },
    { id: 4, name: "UI/UX Design", logo: "https://via.placeholder.com/100" },
    { id: 5, name: "Cloud Computing", logo: "https://via.placeholder.com/100" },
    { id: 6, name: "DevOps Services", logo: "https://via.placeholder.com/100" },
    { id: 7, name: "E-Commerce Development", logo: "https://via.placeholder.com/100" },
    { id: 8, name: "API Development", logo: "https://via.placeholder.com/100" },
  ]);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo({ ...companyInfo, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleAddService = () => {
    const newService = {
      id: services.length + 1,
      name: "New Service",
      logo: "https://via.placeholder.com/100",
    };
    setServices([...services, newService]);
  };

  return (
    <div>
      <h3>Company Profile</h3>

      {/* Tabs */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
            style={{ cursor: "pointer" }}
          >
            Information
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
            style={{ cursor: "pointer" }}
          >
            Passwords
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
            style={{ cursor: "pointer" }}
          >
            Services
          </a>
        </li>
      </ul>

      <div className="tab-content mt-4">
        {/* Information Tab */}
        {activeTab === "info" && (
          <div className="tab-pane fade show active">
            <h5>Company Information</h5>
            <form>
              <div className="mb-3">
                <label>Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="companyName"
                  value={companyInfo.companyName}
                  onChange={handleInfoChange}
                />
              </div>
              <div className="mb-3">
                <label>Company Branch</label>
                <input
                  type="text"
                  className="form-control"
                  name="branchName"
                  value={companyInfo.branchName}
                  onChange={handleInfoChange}
                />
              </div>
              <div className="mb-3">
                <label>Number of Branches</label>
                <input
                  type="number"
                  className="form-control"
                  name="numBranches"
                  value={companyInfo.numBranches}
                  onChange={handleInfoChange}
                />
              </div>
              <div className="mb-3">
                <label>Operate Cities</label>
                <input
                  type="text"
                  className="form-control"
                  name="operateCities"
                  value={companyInfo.operateCities}
                  onChange={handleInfoChange}
                />
              </div>
              <div className="mb-3">
                <label>Company Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={companyInfo.email}
                  onChange={handleInfoChange}
                />
              </div>
              <button className="btn btn-success">Save Changes</button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="tab-pane fade show active">
            <h5>Change Password</h5>
            <div className="mb-3">
              <label>Old Password</label>
              <div className="input-group">
                <input
                  type={showPassword.oldPassword ? "text" : "password"}
                  className="form-control"
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => togglePasswordVisibility("oldPassword")}
                >
                  {showPassword.oldPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label>New Password</label>
              <div className="input-group">
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  className="form-control"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label>Confirm Password</label>
              <div className="input-group">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  className="form-control"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button className="btn btn-success">Save Changes</button>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="tab-pane fade show active">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5>Services You Provide</h5>
              <button className="btn btn-primary" onClick={handleAddService}>
                + Add Service
              </button>
            </div>
            <div className="row g-4">
              {services.map((service) => (
                <div className="col-md-3" key={service.id}>
                  <div className="card shadow-sm text-center">
                    <img
                      src={service.logo}
                      alt={service.name}
                      className="card-img-top p-3"
                      style={{ height: "120px", objectFit: "contain" }}
                    />
                    <div className="card-body">
                      <h6 className="card-title">{service.name}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
