import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaEdit, FaPlus, FaCamera, FaLinkedin, FaGithub, FaClock, FaDollarSign, FaBriefcase, FaCode } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Header from "../components/header";
const expertiseOptions = ["JavaScript", "Python", "React", "Node.js", "Django", "Java", "SQL", "C++", "Swift", "Go"];

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [expertise, setExpertise] = useState([]);
  const [showExpertisePopup, setShowExpertisePopup] = useState(false);
  const [newExpertise, setNewExpertise] = useState({ domain: "", experienceYears: "", projects: "" });
  const [jobExperience, setJobExperience] = useState([]);
  const [showJobPopup, setShowJobPopup] = useState(false);
  const [newJob, setNewJob] = useState({ companyName: "", position: "", startDate: "", endDate: "" });
  const [showEditExpertisePopup, setShowEditExpertisePopup] = useState(false);
const [editExpertise, setEditExpertise] = useState({});
const [showEditJobPopup, setShowEditJobPopup] = useState(false);
const [editJob, setEditJob] = useState({});
const [showLoginModal, setShowLoginModal] = useState(false);
const [reviews, setReviews] = useState([]);
const [averageRating, setAverageRating] = useState(0);
const [totalRatings, setTotalRatings] = useState(0);

// ✅ Open Edit Expertise Modal
const handleEditExpertise = (expertise) => {
    setEditExpertise(expertise);
    setShowEditExpertisePopup(true);
};

// ✅ Save Edited Expertise
const handleUpdateExpertise = async () => {
    if (!editExpertise._id) {
        console.error("❌ Expertise ID is missing.");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to update expertise.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/developers/expertise/${editExpertise._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                domain: editExpertise.domain,
                experienceYears: editExpertise.experienceYears,
                projects: editExpertise.projects
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update expertise.");
        }

        const updatedData = await response.json();
        setExpertise(updatedData.expertise);
        setShowEditExpertisePopup(false);
        alert("Expertise updated successfully!");
    } catch (error) {
        console.error("❌ Error updating expertise:", error);
        alert("Failed to update expertise. Please try again.");
    }
};

  

// ✅ Open Edit Job Experience Modal
const handleEditJobExperience = (job) => {
    console.log("Selected Job for Editing:", job); // ✅ Log job before setting state
    setEditJob(job); // ✅ Set job for editing
    setShowEditJobPopup(true);
};


// ✅ Save Edited Job Experience
const handleUpdateJobExperience = async () => {
    console.log("Editing Job:", editJob);

    if (!editJob._id) {
        console.error("❌ Job ID is missing.");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to update job experience.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/developers/job/${editJob._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                companyName: editJob.companyName,
                position: editJob.position,
                startDate: editJob.startDate,
                endDate: editJob.endDate
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update job experience.");
        }

        const updatedData = await response.json();
        setJobExperience(updatedData.employment);
        setShowEditJobPopup(false);
        alert("Job experience updated successfully!");
    } catch (error) {
        console.error("❌ Error updating job experience:", error);
        alert("Failed to update job experience. Please try again.");
    }
};





  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First try to get user from localStorage token
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found in localStorage");
          return;
        }

        const response = await fetch("http://localhost:5000/api/user", { 
          method: "GET", 
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error("Error fetching logged-in user");
        const userData = await response.json();
        console.log("Logged-in user data:", userData);
        setLoggedInUser(userData);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/developers/${id}`);
        if (!response.ok) throw new Error("Error fetching profile");
        const data = await response.json();
        console.log("Developer profile data:", data);
        setDeveloper(data);
        setFormData({
          about: data.about || "",
          hourlyRate: data.hourlyRate || "",
          workingHours: data.workingHours || { from: "", to: "" },
          linkedIn: data.linkedIn || "",
          github: data.github || "",
        });
        setExpertise(data.expertise || []);
        setJobExperience(data.employment || []);
      } catch (error) {
        console.error("❌ Error fetching developer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // Fetch developer reviews and ratings
  useEffect(() => {
    const fetchDeveloperReviews = async () => {
      try {
        console.log('Fetching reviews for developer:', id);
        
        // Use the public endpoint to get reviews for this specific developer
        const response = await fetch(`http://localhost:5000/api/reviews/developer/${id}`);
        
        if (!response.ok) {
          console.error('Failed to fetch reviews:', response.status, response.statusText);
          return;
        }
        
        const data = await response.json();
        console.log('Reviews data received:', data);
        
        setReviews(data.reviews || []);
        setAverageRating(data.stats?.averageRating || 0);
        setTotalRatings(data.stats?.totalReviews || 0);
        
        console.log('Reviews set:', data.reviews?.length || 0);
        console.log('Average rating set:', data.stats?.averageRating || 0);
        console.log('Total ratings set:', data.stats?.totalReviews || 0);
        
      } catch (error) {
        console.error('Error fetching developer reviews:', error);
        setReviews([]);
        setAverageRating(0);
        setTotalRatings(0);
      }
    };

    if (id) {
      fetchDeveloperReviews();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;

  // Check if the current user is the owner of this profile
  const isOwner = loggedInUser && developer && 
                 (String(loggedInUser.id) === String(developer._id) || 
                  String(loggedInUser._id) === String(developer._id));

  console.log("isOwner check:", {
    loggedInUserId: loggedInUser?.id || loggedInUser?._id,
    developerId: developer?._id,
    isOwner: isOwner
  });

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone!")) {
        return;
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to delete your account.");
            return;
        }

        const response = await fetch("http://localhost:5000/api/developers/delete-account", {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to delete account.");

        // Clear token and redirect
        localStorage.removeItem("token");
        alert("Your account has been deleted successfully.");
        navigate("/"); // Use navigate instead of window.location for React Router
    } catch (error) {
        console.error("❌ Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
    }
};


  const handleProfileUpdate = async () => {
    console.log("Saving Changes...");
    
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to update your profile.");
        return;
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append("about", formData.about);
    formDataToSend.append("hourlyRate", formData.hourlyRate);
    formDataToSend.append("workingHours", JSON.stringify(formData.workingHours));
    formDataToSend.append("expertise", JSON.stringify(expertise));
    formDataToSend.append("linkedIn", formData.linkedIn);
    formDataToSend.append("github", formData.github);
    formDataToSend.append("employment", JSON.stringify(jobExperience));
    if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
    }

    try {
        const response = await fetch("http://localhost:5000/api/developers/profile", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
                // Note: Don't set Content-Type for FormData
            },
            body: formDataToSend,
        });

        if (!response.ok) {
            throw new Error("Failed to update profile");
        }

        const updatedData = await response.json();

        // Show success message
        alert("Profile updated successfully!");
        
        // Update the local state to reflect the new changes
        setDeveloper(prevDeveloper => ({
            ...prevDeveloper,
            ...updatedData
        }));
        setEditMode(false); // Exit edit mode on successful update
    } catch (error) {
        console.error("❌ Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
    }
};




  const addExpertise = () => {
    if (newExpertise.domain && newExpertise.experienceYears && newExpertise.projects) {
      setExpertise([...expertise, newExpertise]);
      setNewExpertise({ domain: "", experienceYears: "", projects: "" });
      setShowExpertisePopup(false);
    }
  };
  const addJobExperience = () => {
    if (newJob.companyName && newJob.position && newJob.startDate && newJob.endDate) {
      setJobExperience([...jobExperience, newJob]);
      setNewJob({ companyName: "", position: "", startDate: "", endDate: "" });
      setShowJobPopup(false);
    }
  };
  // ✅ Remove an Expertise
  const handleDeleteExpertise = async (expertiseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to delete expertise.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/developers/expertise/${expertiseId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to delete expertise.");

        setExpertise(prevExpertise => prevExpertise.filter(exp => exp._id !== expertiseId));
        alert("Expertise deleted successfully!");
    } catch (error) {
        console.error("❌ Error removing expertise:", error);
        alert("Failed to delete expertise. Please try again.");
    }
};


// ✅ Remove a Job Experience
const handleDeleteJobExperience = async (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to delete job experience.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/developers/job/${jobId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to delete job experience.");

        setJobExperience(prevJobs => prevJobs.filter(job => job._id !== jobId));
        alert("Job experience deleted successfully!");
    } catch (error) {
        console.error("❌ Error removing job experience:", error);
        alert("Failed to delete job experience. Please try again.");
    }
};
const convertTo12Hour = (time24) => {
    const [hour, minute] = time24.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "pm" : "am";
    const adjustedHour = h % 12 || 12;
    return `${adjustedHour}:${minute} ${ampm}`;
  };
  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(isoDate).toLocaleDateString("en-US", options);
  };
  

  const handleMessageClick = () => {
    if (!loggedInUser) {
      setShowLoginModal(true);
    } else {
      // Store the developer ID in localStorage and navigate to chat
      localStorage.setItem('selectedChatDeveloper', developer._id);
      navigate('/chat');
    }
  };

  return (
    <div className="profile-page" style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Header />
      <div className="container py-5">
        <div className="row">
          {/* Left Column - Profile Info */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm" style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: "15px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "2rem"
            }}>
              <div className="text-center">
                <label htmlFor="profileImageUpload" style={{ cursor: "pointer", position: "relative", display: "inline-block" }}>
                  <div style={{
                    width: "180px",
                    height: "180px",
                    margin: "0 auto",
                    position: "relative",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid #fff",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                  }}>
                    <img
                      src={profileImage ? URL.createObjectURL(profileImage) : developer?.profileImage || "/default-avatar.png"}
                      alt="Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {editMode && (
                      <div style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        background: "rgba(0,0,0,0.6)",
                        padding: "8px",
                        color: "white"
                      }}>
                        <FaCamera size={20} />
                      </div>
                    )}
                  </div>
                </label>
                {editMode && (
                  <input
                    type="file"
                    id="profileImageUpload"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        setProfileImage(e.target.files[0]);
                      }
                    }}
                  />
                )}

                <h2 className="mt-3 mb-1" style={{ fontWeight: "600" }}>{developer?.firstName || "No Name"}</h2>
                <p className="text-muted mb-3">Developer</p>

                {/* Rating Display */}
                <div className="d-flex align-items-center justify-content-center mb-3" style={{ gap: "8px" }}>
                  <span style={{ fontSize: "24px", color: "#FFD600" }}>
                    {'★'.repeat(Math.floor(averageRating))}
                    {averageRating % 1 >= 0.5 ? '★' : ''}
                    <span style={{ color: "#E5E7EB" }}>{'★'.repeat(5 - Math.ceil(averageRating))}</span>
                  </span>
                  <span style={{ fontSize: "18px", fontWeight: "600", color: "#111" }}>
                    {averageRating.toFixed(1)}
                  </span>
                  <span style={{ color: "#6B7280", fontSize: "14px" }}>
                    ({totalRatings} reviews)
                  </span>
                </div>

                <div className="d-flex justify-content-center gap-2 mb-4">
                  <button
                    className="btn btn-primary px-4"
                    onClick={handleMessageClick}
                    style={{
                      borderRadius: "25px",
                      background: "linear-gradient(135deg, #007bff, #0056b3)",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(0,123,255,0.2)"
                    }}
                  >
                    Message
                  </button>

                  {isOwner && (
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="btn btn-outline-primary px-4"
                      style={{ borderRadius: "25px" }}
                    >
                      <FaEdit /> Edit
                    </button>
                  )}
                </div>

                {loggedInUser && loggedInUser.role === 'student' && (
                  <button
                    onClick={() => navigate(`/booksession/${developer._id}`)}
                    className="btn btn-success w-100 mb-3"
                    style={{
                      borderRadius: "25px",
                      background: "linear-gradient(135deg, #28a745, #1e7e34)",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(40,167,69,0.2)"
                    }}
                  >
                    Book Session
                  </button>
                )}

                {/* Quick Info Section */}
                <div className="quick-info mt-4">
                  {editMode ? (
                    <div className="p-3" style={{
                      background: "rgba(255, 255, 255, 0.5)",
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}>
                      <div className="mb-3">
                        <label className="d-flex align-items-center mb-2">
                          <FaDollarSign className="text-primary me-2" />
                          <span>Hourly Rate (PKR/hr)</span>
                        </label>
                        <input
                          type="number"
                          placeholder="Hourly Rate"
                          value={formData.hourlyRate}
                          onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                          className="form-control"
                          style={{
                            borderRadius: "10px",
                            padding: "10px",
                            border: "1px solid rgba(0,0,0,0.1)"
                          }}
                        />
                      </div>
                      <div>
                        <label className="d-flex align-items-center mb-2">
                          <FaClock className="text-primary me-2" />
                          <span>Working Hours</span>
                        </label>
                        <div className="d-flex gap-2">
                          <input
                            type="time"
                            value={formData.workingHours.from}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                workingHours: { ...formData.workingHours, from: e.target.value }
                              })
                            }
                            className="form-control"
                            style={{
                              borderRadius: "10px",
                              padding: "10px",
                              border: "1px solid rgba(0,0,0,0.1)"
                            }}
                          />
                          <span className="align-self-center">to</span>
                          <input
                            type="time"
                            value={formData.workingHours.to}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                workingHours: { ...formData.workingHours, to: e.target.value }
                              })
                            }
                            className="form-control"
                            style={{
                              borderRadius: "10px",
                              padding: "10px",
                              border: "1px solid rgba(0,0,0,0.1)"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="d-flex align-items-center mb-3">
                        <FaDollarSign className="text-primary me-2" />
                        <div className="text-start">
                          <small className="text-muted">Hourly Rate</small>
                          <p className="mb-0">{developer?.hourlyRate ? `${developer.hourlyRate} PKR/hr` : "Not Set"}</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <FaClock className="text-primary me-2" />
                        <div className="text-start">
                          <small className="text-muted">Working Hours</small>
                          <p className="mb-0">
                            {developer?.workingHours?.from && developer?.workingHours?.to
                              ? `${convertTo12Hour(developer.workingHours.from)} - ${convertTo12Hour(developer.workingHours.to)}`
                              : "Not Set"}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Social Links */}
                <div className="social-links mt-4 d-flex justify-content-center gap-3">
                  {developer?.linkedIn && (
                    <a href={developer.linkedIn} target="_blank" rel="noopener noreferrer" 
                       className="btn btn-light rounded-circle p-2">
                      <FaLinkedin size={20} color="#0077b5" />
                    </a>
                  )}
                  {developer?.github && (
                    <a href={developer.github} target="_blank" rel="noopener noreferrer"
                       className="btn btn-light rounded-circle p-2">
                      <FaGithub size={20} color="#333" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Delete Account Button */}
            {isOwner && (
              <div className="mt-3">
                <button 
                  className="btn btn-danger w-100"
                  style={{
                    borderRadius: "25px",
                    background: "linear-gradient(135deg, #dc3545, #c82333)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(220,53,69,0.2)"
                  }}
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Main Content */}
          <div className="col-lg-8">
            {/* About Section */}
            <div className="card shadow-sm mb-4" style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: "15px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "2rem"
            }}>
              <h3 className="card-title mb-4" style={{ 
                borderBottom: "3px solid #007bff",
                paddingBottom: "10px",
                display: "inline-block"
              }}>
                About Me
              </h3>
              {editMode ? (
                <ReactQuill 
                  theme="snow" 
                  value={formData.about} 
                  onChange={(value) => setFormData({ ...formData, about: value })} 
                />
              ) : (
                <div className="about-content" dangerouslySetInnerHTML={{ __html: developer?.about }} />
              )}
            </div>

            {/* Expertise Section */}
            <div className="card shadow-sm mb-4" style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: "15px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "2rem"
            }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="card-title" style={{ 
                  borderBottom: "3px solid #007bff",
                  paddingBottom: "10px",
                  display: "inline-block"
                }}>
                  <FaCode className="me-2" />Expertise
                </h3>
                {editMode && (
                  <button
                    className="btn btn-primary btn-sm rounded-pill"
                    onClick={() => setShowExpertisePopup(true)}
                  >
                    <FaPlus className="me-1" /> Add
                  </button>
                )}
              </div>
              
              <div className="row g-3">
                {expertise.map((exp, index) => (
                  <div key={index} className="col-md-6">
                    <div className="expertise-card p-3" style={{
                      background: "rgba(255, 255, 255, 0.5)",
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      transition: "transform 0.2s",
                      cursor: "default"
                    }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="mb-1">{exp.domain}</h5>
                          <p className="text-muted mb-0">
                            {exp.experienceYears} years • {exp.projects} projects
                          </p>
                        </div>
                        {editMode && (
                          <div className="btn-group">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleEditExpertise(exp)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteExpertise(exp._id)}
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Feedback Section */}
            <div className="card shadow-sm mb-4" style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: "15px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "2rem"
            }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="card-title" style={{ 
                  borderBottom: "3px solid #007bff",
                  paddingBottom: "10px",
                  display: "inline-block"
                }}>
                  User Feedback
                </h3>
              </div>

              {reviews.length > 0 ? (
                <>
                  {/* Rating Summary */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-3">
                        <span style={{ fontSize: "48px", fontWeight: "700", color: "#111", lineHeight: 1, marginRight: "18px" }}>
                          {averageRating.toFixed(1)}
                        </span>
                        <div>
                          <div style={{ fontSize: "32px", color: "#FFD600", marginBottom: "8px" }}>
                            {'★'.repeat(Math.floor(averageRating))}
                            {averageRating % 1 >= 0.5 ? '★' : ''}
                            <span style={{ color: "#E5E7EB" }}>{'★'.repeat(5 - Math.ceil(averageRating))}</span>
                          </div>
                          <div style={{ color: "#6B7280", fontWeight: "500", fontSize: "18px" }}>
                            {totalRatings} ratings
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      {/* Star bars */}
                      {[5, 4, 3, 2, 1].map((star, idx) => {
                        const count = reviews.filter(review => review.rating === star).length;
                        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                        return (
                          <div key={star} className="d-flex align-items-center mb-2" style={{ gap: "10px" }}>
                            <span style={{ width: "60px", fontWeight: "500", color: "#222", fontSize: "16px" }}>
                              {star} Star{star > 1 ? 's' : ''}:
                            </span>
                            <div style={{ flex: 1, background: "#F3F4F6", borderRadius: "8px", height: "10px", position: "relative" }}>
                              <div style={{ width: `${percentage}%`, background: "#111", height: "10px", borderRadius: "8px" }}></div>
                            </div>
                            <span style={{ width: "40px", textAlign: "right", color: "#6B7280", fontSize: "14px" }}>
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "8px" }}>
                    {reviews.map((review, index) => (
                      <div key={index} className="d-flex align-items-start mb-4" style={{ gap: "18px" }}>
                        <div style={{ 
                          width: "48px", 
                          height: "48px", 
                          borderRadius: "50%", 
                          background: "#F3F4F6", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          fontWeight: "700", 
                          fontSize: "20", 
                          color: "#222", 
                          flexShrink: 0 
                        }}>
                          {review.reviewerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "700", fontSize: "18px", color: "#111", marginBottom: "2px" }}>
                            {review.reviewerName}
                          </div>
                          <div style={{ color: "#6B7280", fontSize: "14px", marginBottom: "2px" }}>
                            {review.reviewerRole}
                          </div>
                          <div style={{ color: "#FFD600", fontSize: "18px", marginBottom: "2px" }}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                          <div style={{ color: "#222", fontSize: "16px", lineHeight: "1.5" }}>
                            {review.description}
                          </div>
                          <div style={{ color: "#6B7280", fontSize: "14px", marginTop: "8px" }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "48px", color: "#E5E7EB", marginBottom: "16" }}>💬</div>
                  <div style={{ fontSize: "20px", fontWeight: "600", color: "#111", marginBottom: "8" }}>
                    No Feedback Yet
                  </div>
                  <div style={{ color: "#6B7280", fontSize: "16" }}>
                    Complete projects and sessions to receive reviews from clients
                  </div>
                </div>
              )}
            </div>

            {/* Job Experience Section */}
            <div className="card shadow-sm mb-4" style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: "15px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "2rem"
            }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="card-title" style={{ 
                  borderBottom: "3px solid #007bff",
                  paddingBottom: "10px",
                  display: "inline-block"
                }}>
                  <FaBriefcase className="me-2" />Job Experience
                </h3>
                {editMode && (
                  <button
                    className="btn btn-primary btn-sm rounded-pill"
                    onClick={() => setShowJobPopup(true)}
                  >
                    <FaPlus className="me-1" /> Add
                  </button>
                )}
              </div>

              <div className="timeline">
                {jobExperience.map((job, index) => (
                  <div key={index} className="job-card mb-3 p-3" style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    position: "relative"
                  }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-1">{job.position}</h5>
                        <h6 className="text-primary mb-2">{job.companyName}</h6>
                        <p className="text-muted mb-0">
                          {formatDate(job.startDate)} - {formatDate(job.endDate)}
                        </p>
                      </div>
                      {editMode && (
                        <div className="btn-group">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEditJobExperience(job)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteJobExperience(job._id)}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Section */}
            <div className="card shadow-sm mb-4" style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: "15px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "2rem"
            }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="card-title" style={{ 
                  borderBottom: "3px solid #007bff",
                  paddingBottom: "10px",
                  display: "inline-block"
                }}>
                  Social Media Links
                </h3>
              </div>

              {editMode ? (
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="d-flex align-items-center mb-2">
                        <FaLinkedin className="text-primary me-2" size={20} />
                        <span>LinkedIn Profile</span>
                      </label>
                      <input
                        type="text"
                        placeholder="LinkedIn Profile URL"
                        value={formData.linkedIn}
                        onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                        className="form-control"
                        style={{
                          borderRadius: "10px",
                          padding: "10px",
                          border: "1px solid rgba(0,0,0,0.1)"
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="d-flex align-items-center mb-2">
                        <FaGithub className="me-2" size={20} />
                        <span>GitHub Profile</span>
                      </label>
                      <input
                        type="text"
                        placeholder="GitHub Profile URL"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        className="form-control"
                        style={{
                          borderRadius: "10px",
                          padding: "10px",
                          border: "1px solid rgba(0,0,0,0.1)"
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="social-link-card p-3" style={{
                      background: "rgba(255, 255, 255, 0.5)",
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}>
                      <div className="d-flex align-items-center">
                        <FaLinkedin size={24} color="#0077b5" className="me-3" />
                        <div>
                          <h6 className="mb-1">LinkedIn</h6>
                          {developer?.linkedIn ? (
                            <a 
                              href={developer.linkedIn} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                              style={{ color: "#0077b5" }}
                            >
                              View Profile
                            </a>
                          ) : (
                            <span className="text-muted">Not Set</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="social-link-card p-3" style={{
                      background: "rgba(255, 255, 255, 0.5)",
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}>
                      <div className="d-flex align-items-center">
                        <FaGithub size={24} color="#333" className="me-3" />
                        <div>
                          <h6 className="mb-1">GitHub</h6>
                          {developer?.github ? (
                            <a 
                              href={developer.github} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                              style={{ color: "#333" }}
                            >
                              View Profile
                            </a>
                          ) : (
                            <span className="text-muted">Not Set</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {editMode && (
              <div className="text-end mt-4">
                <button 
                  className="btn btn-primary px-4"
                  onClick={handleProfileUpdate}
                  style={{
                    borderRadius: "25px",
                    background: "linear-gradient(135deg, #007bff, #0056b3)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(0,123,255,0.2)"
                  }}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showExpertisePopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "400px",
            position: "relative"
          }}>
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer"
              }}
              onClick={() => setShowExpertisePopup(false)}
            >
              ×
            </button>
            <h4>Add Expertise</h4>
            <select
              onChange={(e) => setNewExpertise({ ...newExpertise, domain: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            >
              <option value="">Select Domain</option>
              {expertiseOptions.map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Years of Experience"
              onChange={(e) => setNewExpertise({ ...newExpertise, experienceYears: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              type="number"
              placeholder="Number of Projects"
              onChange={(e) => setNewExpertise({ ...newExpertise, projects: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <button
              style={{
                background: "blue",
                color: "white",
                padding: "10px",
                width: "100%",
                border: "none",
                borderRadius: "5px"
              }}
              onClick={addExpertise}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {showEditExpertisePopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "400px",
            position: "relative"
          }}>
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer"
              }}
              onClick={() => setShowEditExpertisePopup(false)}
            >
              ×
            </button>
            <h4>Edit Expertise</h4>
            <input
              type="text"
              placeholder="Domain"
              value={editExpertise.domain}
              onChange={(e) => setEditExpertise({ ...editExpertise, domain: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              type="number"
              placeholder="Years of Experience"
              value={editExpertise.experienceYears}
              onChange={(e) => setEditExpertise({ ...editExpertise, experienceYears: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              type="number"
              placeholder="Number of Projects"
              value={editExpertise.projects}
              onChange={(e) => setEditExpertise({ ...editExpertise, projects: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <button
              style={{
                background: "blue",
                color: "white",
                padding: "10px",
                width: "100%",
                border: "none",
                borderRadius: "5px"
              }}
              onClick={handleUpdateExpertise}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {showJobPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "400px",
            position: "relative"
          }}>
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer"
              }}
              onClick={() => setShowJobPopup(false)}
            >
              ×
            </button>
            <h4>Add Job Experience</h4>
            <input
              type="text"
              placeholder="Company Name"
              value={newJob.companyName}
              onChange={(e) => setNewJob({ ...newJob, companyName: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              type="text"
              placeholder="Position"
              value={newJob.position}
              onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              type="date"
              value={newJob.startDate}
              onChange={(e) => setNewJob({ ...newJob, startDate: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              type="date"
              value={newJob.endDate}
              onChange={(e) => setNewJob({ ...newJob, endDate: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <button
              style={{
                background: "blue",
                color: "white",
                padding: "10px",
                width: "100%",
                border: "none",
                borderRadius: "5px"
              }}
              onClick={addJobExperience}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {showEditJobPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "400px",
            position: "relative"
          }}>
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer"
              }}
              onClick={() => setShowEditJobPopup(false)}
            >
              ×
            </button>
            <h4>Edit Job Experience</h4>
            <input
              type="text"
              placeholder="Company Name"
              value={editJob.companyName}
              onChange={(e) => setEditJob({ ...editJob, companyName: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              type="text"
              placeholder="Position"
              value={editJob.position}
              onChange={(e) => setEditJob({ ...editJob, position: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              type="date"
              value={editJob.startDate}
              onChange={(e) => setEditJob({ ...editJob, startDate: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <input
              type="date"
              value={editJob.endDate}
              onChange={(e) => setEditJob({ ...editJob, endDate: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <button
              style={{
                background: "blue",
                color: "white",
                padding: "10px",
                width: "100%",
                border: "none",
                borderRadius: "5px"
              }}
              onClick={handleUpdateJobExperience}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
