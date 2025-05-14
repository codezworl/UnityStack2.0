import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Modal, Tabs, Tab } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    industry: "",
    aboutUs: "",
    foundedYear: "",
    companySize: "",
    location: "",
    website: "",
    phone: "",
    email: "",
    socialMedia: [],
    branches: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [newSocial, setNewSocial] = useState({
    platform: "LinkedIn",
    link: "",
  });
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");
  // ✅ Define Password State Properly
const [passwords, setPasswords] = useState({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

  useEffect(() => {
    fetchCompanyData();
  }, []);
// ✅ Handle Logo Upload
const handleLogoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) {
    alert("❌ No file selected.");
    return;
  }

  const formData = new FormData();
  formData.append("logo", file);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! Please login again.");
      return;
    }

      const response = await axios.post(
        "http://localhost:5000/api/organizations/upload-logo",
        formData,
        {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
        }
      );

    alert("✅ Logo uploaded successfully!");

    // ✅ Update the UI immediately without refresh
    setCompanyInfo((prevInfo) => ({
      ...prevInfo,
      logo: `http://localhost:5000/uploads/${response.data.logo}`, // ✅ Ensure correct URL
    }));

    fetchCompanyData(); // ✅ Fetch updated profile to ensure changes are saved
  } catch (error) {
    console.error("❌ Error uploading logo:", error);
    alert("❌ Failed to upload logo.");
  }
};

  // ✅ Fetch Company Profile
  const fetchCompanyData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized! Please login again.");
        return;
      }
  
      const response = await axios.get(
        "http://localhost:5000/api/organizations/profile",
        {
        headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("✅ Fetched Data:", response.data); // Debugging
  
      setCompanyInfo({
        ...response.data,
        branches:
          typeof response.data.branches === "string"
            ? response.data.branches
            : Array.isArray(response.data.branches)
            ? response.data.branches.join(", ")
            : "",
      });
  
      // ✅ Fix: Ensure services update correctly
      setServices(response.data.selectedServices || []);
    } catch (error) {
      console.error("❌ Error fetching company data:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      }
    }
  };

  // ✅ Handle Save Profile
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      // Always send branches as a string
      const saveData = {
        ...companyInfo,
        branches: String(companyInfo.branches),
      };
      await axios.put(
        "http://localhost:5000/api/organizations/profile",
        saveData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      fetchCompanyData();
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("❌ Failed to update profile.");
    }
  };
  const handleDeleteService = async (service) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the service: ${service}?`
      )
    ) {
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized! Please login again.");
        return;
      }
  
      const response = await axios.delete(
        "http://localhost:5000/api/organizations/services",
        {
        headers: { Authorization: `Bearer ${token}` },
        data: { service },
        }
      );
  
      alert("✅ Service deleted successfully!");
      fetchCompanyData(); // Refresh to update the UI
    } catch (error) {
      console.error(
        "❌ Error deleting service:",
        error.response?.data || error.message
      );
      alert("❌ Failed to delete service.");
    }
  };

  // ✅ Handle Adding Social Media Link
  const handleAddSocialLink = async () => {
    if (!newSocial.link.match(/^https?:\/\/(www\.)?\w+\.\w+/)) {
      alert("❌ Please enter a valid URL.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/organizations/social-media",
        newSocial,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowSocialModal(false);
      fetchCompanyData();
      alert("✅ Social media link added successfully!");
    } catch (error) {
      console.error("❌ Error adding social media link:", error);
      alert("❌ Failed to add social link.");
    }
  };
  // ✅ Handle Password Update
  const handleUpdatePassword = async () => {
    if (
      !passwords.oldPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      alert("❌ Please fill in all password fields.");
      return;
    }
  
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("❌ New passwords do not match.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized! Please login again.");
        return;
      }
  
      await axios.put(
        "http://localhost:5000/api/organizations/update-password",
        passwords,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert("✅ Password updated successfully!");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("❌ Error updating password:", error);
      alert("❌ Failed to update password.");
    }
  };

  // ✅ Handle Adding Service
  const handleAddService = async () => {
    if (services.includes(newService)) {
      alert("❌ This service already exists.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/organizations/services",
        { service: newService },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowServiceModal(false);
      fetchCompanyData();
      alert("✅ Service added successfully!");
    } catch (error) {
      console.error("❌ Error adding service:", error);
      alert("❌ Failed to add service.");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 950 }}>
      {/* Header Section */}
      <div className="card p-4 mb-4 shadow-sm" style={{ borderRadius: 16 }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <div className="d-flex align-items-center gap-4">
            <img
              src={
                companyInfo.logo
                  ? `http://localhost:5000/uploads/${companyInfo.logo}`
                  : "/default-logo.png"
              }
      alt="Company Logo"
              className="rounded-circle bg-light"
              style={{
                width: 90,
                height: 90,
                objectFit: "cover",
                border: "2px solid #e5e7eb",
              }}
            />
            <div>
              <h3 className="mb-1">
                {companyInfo.companyName || "Company Name"}
              </h3>
              <div className="text-muted mb-1" style={{ fontSize: 16 }}>
                <span className="me-2">
                  <i className="fas fa-map-marker-alt"></i> New York, NY
                </span>
                {companyInfo.website && (
                  <>
                    ·{" "}
                    <a
                      href={companyInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#2563eb",
                        textDecoration: "none",
                        marginLeft: 8,
                      }}
                    >
                      {companyInfo.website}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <Button variant="outline-dark" onClick={() => setIsEditing(true)}><i className="fas fa-pen"></i> Edit Profile</Button>
            <Button variant="primary"><i className="fas fa-shield-alt"></i> Verify Company</Button>
          </div>
        </div>
        <div className="mt-3 border-bottom" />
        <div className="d-flex gap-4 mt-3">
          <div className="nav nav-tabs border-0">
            <button
              className={`nav-link ${activeTab === "info" ? "active" : ""}`}
              style={{ border: "none", background: "none" }}
              onClick={() => setActiveTab("info")}
            >
              Information
            </button>
            <button
              className={`nav-link ${activeTab === "password" ? "active" : ""}`}
              style={{ border: "none", background: "none" }}
              onClick={() => setActiveTab("password")}
            >
              Security
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <>
          {/* About Section */}
          <div className="card p-4 mb-4 shadow-sm" style={{ borderRadius: 16 }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">About</h5>
            </div>
            <div className="text-muted" dangerouslySetInnerHTML={{ __html: companyInfo.aboutUs || "We are a technology company focused on delivering innovative solutions for businesses of all sizes." }} />
          </div>

          {/* Company Details Section */}
          <div className="card p-4 mb-4 shadow-sm" style={{ borderRadius: 16 }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Company Details</h5>
            </div>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="mb-2"><i className="fas fa-industry me-2"></i> <b>Industry:</b> {companyInfo.industry}</div>
                <div className="mb-2"><i className="fas fa-calendar-alt me-2"></i> <b>Founded:</b> {companyInfo.foundedYear}</div>
                <div className="mb-2"><i className="fas fa-users me-2"></i> <b>Company Size:</b> {companyInfo.companySize}</div>
              </div>
              <div className="col-md-6">
                <div className="mb-2"><i className="fas fa-map-marker-alt me-2"></i> <b>Location:</b> {companyInfo.location}</div>
                <div className="mb-2"><i className="fas fa-phone me-2"></i> <b>Phone:</b> {companyInfo.phone}</div>
                <div className="mb-2"><i className="fas fa-envelope me-2"></i> <b>Email:</b> {companyInfo.email}</div>
              </div>
            </div>
  </div>

          {/* Social Media Section */}
          <div className="card p-4 mb-4 shadow-sm" style={{ borderRadius: 16 }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Social Media</h5>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => setShowSocialModal(true)}
              >
                + Add Link
    </Button>
            </div>
  {companyInfo.socialMedia.length === 0 ? (
    <p className="text-muted">No social media links added yet.</p>
  ) : (
    <ul className="list-group">
      {companyInfo.socialMedia.map((link, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      <b>{link.platform}:</b>{" "}
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.link}
                      </a>
                    </span>
        </li>
      ))}
    </ul>
  )}
          </div>

          {/* Languages & Tech Stacks Section */}
          <div className="card p-4 mb-4 shadow-sm" style={{ borderRadius: 16 }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Languages & Tech Stacks</h5>
              <Button size="sm" variant="outline-primary">
                + Add Technology
              </Button>
            </div>
            <div>
              <div className="mb-2">
                <b>Programming Languages</b>
              </div>
              <span className="badge bg-primary me-2 mb-2">JavaScript</span>
              <span className="badge bg-primary me-2 mb-2">TypeScript</span>
              <span className="badge bg-primary me-2 mb-2">Python</span>
              <span className="badge bg-primary me-2 mb-2">Java</span>
              <span className="badge bg-primary me-2 mb-2">PHP</span>
              <div className="mb-2 mt-3">
                <b>Frameworks & Libraries</b>
              </div>
              <span className="badge bg-success me-2 mb-2">React</span>
              <span className="badge bg-success me-2 mb-2">Next.js</span>
              <span className="badge bg-success me-2 mb-2">Node.js</span>
              <span className="badge bg-success me-2 mb-2">Express</span>
              <span className="badge bg-success me-2 mb-2">Laravel</span>
              <span className="badge bg-success me-2 mb-2">Django</span>
              <div className="mb-2 mt-3">
                <b>Tools & Platforms</b>
              </div>
              <span
                className="badge bg-purple me-2 mb-2"
                style={{ background: "#a78bfa" }}
              >
                AWS
              </span>
              <span
                className="badge bg-purple me-2 mb-2"
                style={{ background: "#a78bfa" }}
              >
                Docker
              </span>
              <span
                className="badge bg-purple me-2 mb-2"
                style={{ background: "#a78bfa" }}
              >
                Git
              </span>
              <span
                className="badge bg-purple me-2 mb-2"
                style={{ background: "#a78bfa" }}
              >
                GitHub
              </span>
              <span
                className="badge bg-purple me-2 mb-2"
                style={{ background: "#a78bfa" }}
              >
                Vercel
              </span>
              <span
                className="badge bg-purple me-2 mb-2"
                style={{ background: "#a78bfa" }}
              >
                Firebase
              </span>
            </div>
          </div>
        </>
      )}

      {activeTab === "password" && (
        <div className="card p-4 mb-4 shadow-sm" style={{ borderRadius: 16 }}>
          <h5 className="mb-3">Change Password</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwords.oldPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, oldPassword: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button variant="primary" onClick={handleUpdatePassword}>
              Update Password
            </Button>
          </Form>
        </div>
      )}

      {/* Modals (unchanged) */}
      <Modal show={showSocialModal} onHide={() => setShowSocialModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Social Media Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Platform</Form.Label>
            <Form.Select
              onChange={(e) =>
                setNewSocial({ ...newSocial, platform: e.target.value })
              }
            >
              <option>LinkedIn</option>
              <option>Twitter</option>
              <option>Instagram</option>
              <option>YouTube</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your social media profile link"
              onChange={(e) =>
                setNewSocial({ ...newSocial, link: e.target.value })
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSocialModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddSocialLink}>
            Add Social Link
          </Button>
        </Modal.Footer>
      </Modal>
  
      <Modal show={showServiceModal} onHide={() => setShowServiceModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select a Service</Form.Label>
            <Form.Select onChange={(e) => setNewService(e.target.value)}>
              <option value="">-- Choose a Service --</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile App Development">
                Mobile App Development
              </option>
              <option value="AI & Machine Learning">
                AI & Machine Learning
              </option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="DevOps Services">DevOps Services</option>
              <option value="E-Commerce Development">
                E-Commerce Development
              </option>
              <option value="API Development">API Development</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowServiceModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddService}>
            Add Service
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal show={isEditing} onHide={() => setIsEditing(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Company Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-muted mb-4" style={{ fontSize: 18 }}>Update your company information</div>
          <Form>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control type="text" value={companyInfo.companyName} onChange={e => setCompanyInfo({ ...companyInfo, companyName: e.target.value })} />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Industry</Form.Label>
                  <Form.Control type="text" value={companyInfo.industry} onChange={e => setCompanyInfo({ ...companyInfo, industry: e.target.value })} />
                </Form.Group>
              </div>
              <div className="col-12">
                <Form.Group>
                  <Form.Label>Company Description</Form.Label>
                  <Form.Control as="textarea" rows={3} value={companyInfo.aboutUs} onChange={e => setCompanyInfo({ ...companyInfo, aboutUs: e.target.value })} />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Founded Year</Form.Label>
                  <Form.Control type="text" value={companyInfo.foundedYear} onChange={e => setCompanyInfo({ ...companyInfo, foundedYear: e.target.value })} />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Company Size</Form.Label>
                  <Form.Control type="text" value={companyInfo.companySize} onChange={e => setCompanyInfo({ ...companyInfo, companySize: e.target.value })} />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Control type="text" value={companyInfo.location} onChange={e => setCompanyInfo({ ...companyInfo, location: e.target.value })} />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Website</Form.Label>
                  <Form.Control type="text" value={companyInfo.website} onChange={e => setCompanyInfo({ ...companyInfo, website: e.target.value })} />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" value={companyInfo.phone} onChange={e => setCompanyInfo({ ...companyInfo, phone: e.target.value })} />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={companyInfo.email} onChange={e => setCompanyInfo({ ...companyInfo, email: e.target.value })} />
                </Form.Group>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <Button variant="outline-secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveProfile}>Save Changes</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
