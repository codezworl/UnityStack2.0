import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/students/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudent(response.data);
        setUpdatedData(response.data);
      } catch (error) {
        console.error("❌ Error fetching student data:", error);
        alert("Failed to fetch student profile. Please try again.");
      }
    };
    fetchStudentData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/students/profile", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(updatedData);
      setIsEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("⚠ Are you sure you want to delete your account? This action is irreversible!")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete("http://localhost:5000/api/students/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem("token");
        navigate("/login");
        alert("🚨 Account deleted successfully!");
      } catch (error) {
        console.error("❌ Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setProfileImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("http://localhost:5000/api/students/profile-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Profile picture updated successfully!");
      setStudent({ ...student, profileImage: response.data.profileImage });
    } catch (error) {
      console.error("❌ Error uploading profile image:", error);
      alert("Failed to upload profile picture. Please try again.");
    }
  };

  if (!student) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Left Side - Profile Image & Actions */}
        <div className="col-md-4 text-center">
          <div className="profile-image-container">
            <img
              src={student.profileImage || profileImage || "https://via.placeholder.com/150"}
              alt="Profile"
              className="rounded-circle img-fluid shadow"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <div className="mt-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="form-control"
              />
            </div>
          </div>

          <h3 className="mt-3">{student.firstName} {student.lastName}</h3>
          <p className="text-muted">🎓 Student</p>

          <button className="btn btn-primary w-100 mb-2" onClick={handleEdit}>
            ✏ Edit Profile
          </button>
          <button className="btn btn-danger w-100" onClick={handleDelete}>
            🗑 Delete Account
          </button>
        </div>

        {/* Right Side - Profile Details */}
        <div className="col-md-8">
          <h4 className="mb-3">👤 Profile Information</h4>
          {isEditing ? (
            <>
              {Object.entries(updatedData).map(([key, value]) => (
                key !== "_id" && key !== "password" && key !== "profileImage" && (
                  <div key={key} className="mb-2">
                    <label className="form-label">
                      <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={value || ""}
                      onChange={(e) => setUpdatedData({ ...updatedData, [key]: e.target.value })}
                    />
                  </div>
                )
              ))}
              <button className="btn btn-success mt-2 w-100" onClick={handleSave}>
                ✅ Save Changes
              </button>
            </>
          ) : (
            <ul className="list-group">
              <li className="list-group-item"><strong>Email:</strong> {student.email}</li>
              <li className="list-group-item"><strong>University:</strong> {student.university}</li>
              <li className="list-group-item"><strong>University Email:</strong> {student.universityEmail}</li>
              <li className="list-group-item"><strong>Semester:</strong> {student.semester}</li>
              <li className="list-group-item"><strong>Domain:</strong> {student.domain}</li>
              <li className="list-group-item">
                <strong>LinkedIn:</strong> 
                <a href={student.linkedIn} target="_blank" rel="noopener noreferrer"> View Profile</a>
              </li>
              <li className="list-group-item">
                <strong>GitHub:</strong> 
                <a href={student.github} target="_blank" rel="noopener noreferrer"> View Profile</a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
