import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams(); // ✅ Get developer ID from URL
  const [developer, setDeveloper] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token"); // ✅ Get token from localStorage

  // ✅ Fetch Developer Profile from Backend
  useEffect(() => {
    fetch(`http://localhost:5000/api/developers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDeveloper(data);
        setFormData(data);
      })
      .catch((error) => console.error("Error fetching developer:", error));
  }, [id]);

  // ✅ Handle Form Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save Profile Updates to Backend
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setDeveloper(data.developer);
        setEditMode(false);
      } else {
        console.error("Error updating profile:", data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!developer) return <p>Loading...</p>;

  return (
    <div>
      <h2>{developer.firstName} {developer.lastName}</h2>
      <p>{editMode ? <input name="about" value={formData.about} onChange={handleChange} /> : developer.about}</p>
      <p>Hourly Rate: {editMode ? <input name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} /> : developer.hourlyRate}</p>
      <p>Availability: {editMode ? <input name="availability" value={formData.availability} onChange={handleChange} /> : developer.availability}</p>
      <p>GitHub: {editMode ? <input name="github" value={formData.github} onChange={handleChange} /> : <a href={developer.github} target="_blank">GitHub</a>}</p>

      {editMode ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={() => setEditMode(true)}>Edit Profile</button>
      )}
    </div>
  );
};

export default Profile;
