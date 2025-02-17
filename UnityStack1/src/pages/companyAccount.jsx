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
    website: "",
    aboutUs: "",
    socialMedia: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [newSocial, setNewSocial] = useState({ platform: "LinkedIn", link: "" });
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

    const response = await axios.post("http://localhost:5000/api/organizations/upload-logo", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

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
  
      const response = await axios.get("http://localhost:5000/api/organizations/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("✅ Fetched Data:", response.data); // Debugging
  
      setCompanyInfo({
        companyName: response.data.companyName || "",
        website: response.data.website || "",
        aboutUs: response.data.aboutUs || "",
        socialMedia: response.data.socialMedia || [],
        logo: response.data.logo || "",
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
      await axios.put(
        "http://localhost:5000/api/organizations/profile",
        { ...companyInfo },
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
    if (!window.confirm(`Are you sure you want to delete the service: ${service}?`)) {
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized! Please login again.");
        return;
      }
  
      const response = await axios.delete("http://localhost:5000/api/organizations/services", {
        headers: { Authorization: `Bearer ${token}` },
        data: { service },
      });
  
      alert("✅ Service deleted successfully!");
      fetchCompanyData(); // Refresh to update the UI
    } catch (error) {
      console.error("❌ Error deleting service:", error.response?.data || error.message);
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
    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
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
    <div className="container mt-4">
      <h3>Company Profile</h3>
      <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key)} className="mb-4">
        
        {/* ✅ Information Tab (Now Includes Logo Upload) */}
        <Tab eventKey="info" title="Information">
  <h5>About Us</h5>
  <ReactQuill value={companyInfo.aboutUs} onChange={(value) => setCompanyInfo({ ...companyInfo, aboutUs: value })} readOnly={!isEditing} />

  <h5 className="mt-4">Company Logo</h5>
  <div className="d-flex align-items-center mt-4">
  <img
  src={companyInfo.logo ? `http://localhost:5000/uploads/${companyInfo.logo}` : "/default-logo.png"}
  alt="Company Logo"
  className="rounded-circle"
  style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "15px" }}
/>

    {isEditing && (
      <input
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        className="ml-3"
      />
    )}
  </div>

  <Button className="mt-3" onClick={() => setIsEditing(!isEditing)}>
    {isEditing ? "Save Changes" : "Edit About Us"}
  </Button>

  {/* ✅ Only show Save button when editing */}
  {isEditing && <Button className="mt-3 ml-2" onClick={handleSaveProfile}>Save Profile</Button>}

  <h5 className="mt-4">Social Media Links</h5>
  {companyInfo.socialMedia.length === 0 ? (
    <p className="text-muted">No social media links added yet.</p>
  ) : (
    <ul className="list-group">
      {companyInfo.socialMedia.map((link, index) => (
        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
          {link.platform}: <a href={link.link} target="_blank" rel="noopener noreferrer">{link.link}</a>
        </li>
      ))}
    </ul>
  )}
  <Button className="mt-3" onClick={() => setShowSocialModal(true)}>+ Add Social Link</Button>
</Tab>

  
        {/* ✅ Password Tab */}
        <Tab eventKey="password" title="Password">
          <h5>🔒 Change Password</h5>
          <Form className="mt-3">
            <Form.Group>
              <Form.Label>Old Password</Form.Label>
              <Form.Control type="password" onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control type="password" onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
            </Form.Group>
            <Button className="mt-3" onClick={handleUpdatePassword}>Update Password</Button>
          </Form>
        </Tab>
  
        {/* ✅ Services Tab */}
        <Tab eventKey="services" title="Services">
  <h5>Our Services</h5>
  {services.length === 0 ? (
    <p className="text-muted">No services added yet.</p>
  ) : (
    <ul className="list-group">
      {services.map((service, index) => (
        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
          {service}
          <FaTrashAlt onClick={() => handleDeleteService(service)} style={{ cursor: "pointer", color: "red" }} />
        </li>
      ))}
    </ul>
  )}
  <Button className="mt-3" onClick={() => setShowServiceModal(true)}>+ Add Service</Button>
</Tab>


      </Tabs>
  
      {/* ✅ Add Social Media Modal */}
      <Modal show={showSocialModal} onHide={() => setShowSocialModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Social Media Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Platform</Form.Label>
            <Form.Select onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}>
              <option>LinkedIn</option>
              <option>Twitter</option>
              <option>Instagram</option>
              <option>YouTube</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>URL</Form.Label>
            <Form.Control type="text" placeholder="Enter your social media profile link" onChange={(e) => setNewSocial({ ...newSocial, link: e.target.value })} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSocialModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddSocialLink}>Add Social Link</Button>
        </Modal.Footer>
      </Modal>
  
      {/* ✅ Add Service Modal */}
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
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="DevOps Services">DevOps Services</option>
              <option value="E-Commerce Development">E-Commerce Development</option>
              <option value="API Development">API Development</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowServiceModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddService}>Add Service</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
  
};

export default Profile;
