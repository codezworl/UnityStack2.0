import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiDollarSign, FiFileText, FiUser, FiClock } from "react-icons/fi";
//import { toast } from "react-toastify";
import { loadStripe } from '@stripe/stripe-js';
import noProjects from "../assets/freelance-job.png";  // Changed to use an existing image



const BidModal = ({ isOpen, onClose, project, bids, onAssignProject }) => {
  if (!isOpen) return null;

  console.log("BidModal - Project:", project);
  console.log("BidModal - Bids:", bids);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '15px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#1f2937' }}>
            Bids for {project?.title}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        {bids && bids.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {bids.map((bid) => (
              <div 
                key={bid._id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#f9fafb'
                }}
              >
                {/* Developer Info Section */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: '500'
                    }}>
                      {(bid.userName || 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', color: '#1f2937' }}>
                        {bid.userName || 'Anonymous Developer'}
                      </h3>
                      <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                        {bid.userRole || 'Developer'}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h4 style={{ margin: 0, color: '#2563eb', fontSize: '24px', fontWeight: '600' }}>
                      PKR {bid.amount}
                    </h4>
                    <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                      Submitted: {new Date(bid.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Proposal Section */}
                <div style={{ 
                  marginBottom: '20px',
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#1f2937' }}>
                    Proposal
                  </h4>
                  <p style={{ margin: 0, fontSize: '15px', color: '#4b5563', lineHeight: '1.5' }}>
                    {bid.proposal}
                  </p>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '20px'
                }}>
                  <button
                    onClick={() => handleChatWithDeveloper(bid.userId)}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      color: '#1f2937',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    Chat with Developer
                  </button>
                  <button
                    onClick={() => onAssignProject(bid)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    Assign Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '48px 0',
            color: '#6b7280',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px dashed #e5e7eb'
          }}>
            <p style={{ fontSize: '16px', margin: 0 }}>No bids received yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FindDeveloper = () => {
  const [bidsList, setBidsList] = useState([]);
  const [activeTab, setActiveTab] = useState("post"); // Active tab state
  const [showForm, setShowForm] = useState(false); // Toggle for create request form
  const [currentRequests, setCurrentRequests] = useState([]); // Current requests
  const [selectedBid, setSelectedBid] = useState(null); // Selected bid for viewing details
  const [showBidModal, setShowBidModal] = useState(false); // Toggle for bid details modal
  const [selectedProject, setSelectedProject] = useState(null); // Selected project for viewing bids
  const [projects, setProjects] = useState([]); // Initialize as empty array
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [],
    skillInput: "",
    budget: "",
    deadline: "",
    file: null,
    type: "Full Stack Project",
  });

  const [uploading, setUploading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const availableTags = [
    "ReactJS",
    "JavaScript",
    "Python",
    "Node.js",
    "HTML",
    "CSS",
    "Java",
    "C++",
    "PHP",
    "Android",
  ];

  const [customTag, setCustomTag] = useState("");
  const [matchedDevelopers, setMatchedDevelopers] = useState([]);

  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);

  const [showChat, setShowChat] = useState(false);
  const [currentChatRoom, setCurrentChatRoom] = useState(null);

  const [activeProjects, setActiveProjects] = useState([]);

  const [invoiceProjects, setInvoiceProjects] = useState([]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);

  // Add this state at the top with other state declarations
  const [showBidDetails, setShowBidDetails] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTag = (tag) => {
    if (tag && !formData.skills.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, tag],
        skillInput: "",
      }));
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((t) => t !== tag),
    }));
  };

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
    ];

    if (file.size > maxSize) {
      alert("File is too large. Maximum size is 10MB");
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Invalid file type. Please upload PDF, DOC, DOCX, or ZIP files only"
      );
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        setFormData({ ...formData, files: files });
        setFilePreview({
          name: files[0].name,
          size: (files[0].size / 1024 / 1024).toFixed(2),
        });
      } else {
        e.target.value = ""; // Reset file input
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to post a project");
      }

      // Validate budget
      const budget = parseFloat(formData.budget);

      if (isNaN(budget) || budget <= 0) {
        alert("Please enter a valid budget amount greater than 0");
        setUploading(false);
        return;
      }

      // Validate skills
      if (formData.skills.length < 2) {
        alert("Please select at least 2 skills");
        setUploading(false);
        return;
      }

      // Validate deadline
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) {
        alert("Deadline must be in the future");
        setUploading(false);
        return;
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        skills: formData.skills,
        budget: budget,
        deadline: formData.deadline,
      };

      console.log("Sending project data:", projectData);

      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      const newProject = await response.json();

      // Add the new project to the projects state
      setProjects((prevProjects) => [newProject, ...prevProjects]);

      // Reset form
      setFormData({
        title: "",
        description: "",
        skills: [],
        skillInput: "",
        budget: "",
        deadline: "",
        file: null,
        type: "Full Stack Project",
      });
      setShowForm(false);
      alert("Project created successfully!");
    } catch (error) {
      console.error("Error creating project:", error);
      if (error.message === "Please login to post a project") {
        alert("Please login to post a project");
      } else {
        alert(error.message || "Failed to create project. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  // Add function to fetch projects
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, user might need to login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Add useEffect to fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Add this function to handle custom payment input
  const handleBudgetChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        budget: value,
      }));
    }
  };

  // Add this function to handle skill input
  const handleSkillInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      skillInput: e.target.value,
    }));
  };

  const handleCreateRequest = () => {
    // Check if at least 2 tags are selected
    if (formData.title && formData.description && formData.skills.length >= 2) {
      setCurrentRequests([...currentRequests, formData]);
      setFormData({
        type: "Full Stack Project",
        title: "",
        description: "",
        skills: [],
        budget: "",
        deadline: "",
        files: null,
      }); // Reset form
      setShowForm(false); // Close form
    } else {
      alert("Please fill out all fields and add at least 2 tags!");
    }
  };

  const handleDeleteRequest = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to delete the project");
      }

      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete project");
      }

      // Update projects list by removing the deleted project
      setProjects((prevProjects) =>
        prevProjects.filter((p) => p._id !== projectId)
      );
      alert("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert(error.message || "Failed to delete project");
    }
  };

  const handleViewDetails = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProjectDetails(project);
      setShowProjectDetails(true);
    }
  };

  // Update the handleViewBids function
  const handleViewBids = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to view bids");
        return;
      }

      console.log("Fetching bids for project:", projectId);

      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/bids`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bids");
      }

      const data = await response.json();
      console.log("Received bids data:", data);

      // Find the current project
      const currentProject = projects.find(p => p._id === projectId);
      if (!currentProject) {
        throw new Error("Project not found");
      }

      // Set the project and bids
      setSelectedProject({
        ...currentProject,
        title: currentProject.title,
        description: currentProject.description
      });
      
      // Format and set the bids list with proper bidder information
      setBidsList(data.bids.map(bid => ({
        _id: bid._id,
        userName: bid.userName || bid.bidderName || "Anonymous Developer",
        userRole: bid.userRole || "Developer",
        amount: bid.amount,
        proposal: bid.proposal,
        createdAt: bid.createdAt || bid.submittedAt,
        userId: bid.bidderId || bid.userId, // Use bidderId from the bid data
        bidderId: bid.bidderId || bid.userId // Ensure bidderId is set
      })));

      // Show the modal
      setShowBidModal(true);
    } catch (error) {
      console.error("Error fetching bids:", error);
      alert("Failed to fetch bids. Please try again.");
    }
  };

  
  
  const handleCloseModal = () => {
    setShowBidModal(false);
    setSelectedProject(null);
  };
  
  
  
  
  
  
  
  
  
  

  const handleChatWithDeveloper = async (developerId) => {
    try {
      // Get the chat room ID or create a new one
      const response = await fetch("http://localhost:5000/api/chat/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ developerId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to start chat");
      }

      const { roomId } = await response.json();

      // Open chat window
      setShowChat(true);
      setCurrentChatRoom(roomId);
    } catch (error) {
      console.error("Error starting chat:", error);
      alert(error.message || "Failed to start chat");
    }
  };

  const handleCloseProject = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to close the project");
      }

      const shouldDelete = window.confirm(
        "Do you want to permanently delete this project? Click OK to delete permanently, or Cancel to just close it."
      );

      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/close`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ permanent: shouldDelete }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to close project");
      }

      // Update projects list by removing the closed/deleted project
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectId)
      );
      alert(
        shouldDelete
          ? "Project deleted successfully"
          : "Project closed successfully"
      );
    } catch (error) {
      console.error("Error closing project:", error);
      alert(error.message || "Failed to close project");
    }
  };

  const handleSubmitBid = async (projectId, amount, proposal) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/bids`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ amount, proposal }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit bid");
      }

      const updatedProject = await response.json();

      // Update the project in the state
      setProjects(
        projects.map((p) => (p._id === projectId ? updatedProject : p))
      );

      // Close the bid modal
      setShowBidModal(false);
      setSelectedProject(null);

      alert("Bid submitted successfully!");
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert(error.message || "Failed to submit bid");
    }
  };

  // Add this function near the top with other functions
  const handleViewProfile = (developerId) => {
    window.location.href = `/developer-profile/${developerId}`;
  };

  // Update the BidDetailsModal component
  const BidDetailsModal = ({ project, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBid, setSelectedBid] = useState(null);

    // Add debug logging when project or bids change
    useEffect(() => {
      console.log("Project in modal:", project);
      console.log("Project bids:", project.bids);
    }, [project]);

    const handleAssignProject = async (bid) => {
      try {
        console.log("Attempting to assign bid:", bid);

        if (!bid) {
          console.error("Bid object is null or undefined");
          alert("Invalid bid information: Bid object is missing");
          return;
        }

        if (!bid.userId) {
          console.error("Developer information is missing from bid:", bid);
          alert("Invalid bid information: Developer information is missing");
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please login to assign project");
        }

        // Update project status to in-progress
        const response = await fetch(
          `http://localhost:5000/api/projects/${selectedProject._id}/assign`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              developerId: bid.userId,
              status: "in-progress",
              startDate: new Date().toISOString(),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to assign project");
        }

        const updatedProject = await response.json();
        
        // Update the projects list
        setProjects(prevProjects => 
          prevProjects.map(p => 
            p._id === selectedProject._id ? updatedProject : p
          )
        );

        // Close the bid modal
        setShowBidModal(false);
        setSelectedProject(null);
        setBidsList([]);

        alert("Project assigned successfully!");
        
        // Refresh active projects
        fetchActiveProjects();
      } catch (error) {
        console.error("Error in project assignment:", error);
        alert("Failed to process project assignment. Please try again.");
      }
    };

    // Add handlePaymentSubmit function
    const handlePaymentSubmit = async (paymentInfo) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please login to assign project");
        }

        if (
          !selectedBid ||
          !selectedBid.developerId ||
          !selectedBid.developerId._id
        ) {
          throw new Error("Invalid developer information");
        }

        const response = await fetch(
          `http://localhost:5000/api/projects/${project._id}/assign`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              developerId: selectedBid.developerId._id,
              paymentInfo,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to assign project");
        }

        alert("Project assigned successfully!");
        setShowPaymentModal(false);
        setSelectedBid(null);
        onClose(); // Close the bid details modal
      } catch (error) {
        console.error("Error assigning project:", error);
        alert(error.message || "Failed to assign project");
      }
    };

    const handleViewProfile = async (developerId) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/developers/${developerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch developer profile");
        }

        // Navigate to developer profile page
        window.location.href = `/developer-profile/${developerId}`;
      } catch (error) {
        console.error("Error viewing profile:", error);
        alert("Failed to view profile. Please try again.");
      }
    };

    const handleChatWithDeveloper = async (developerId) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/chat/room/${developerId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create chat room");
        }

        const data = await response.json();
        window.location.href = `/chat/${data.roomId}`;
      } catch (error) {
        console.error("Error creating chat room:", error);
        alert("Failed to start chat. Please try again.");
      }
    };

    return (
      <>
{showBidModal && selectedProject && (
  <div className="modal-backdrop">
    <div className="modal-content">
      <div className="modal-header">
        <h2>Project Bids - {selectedProject.title}</h2>
        <button onClick={handleCloseModal} className="close-button">&times;</button>
      </div>
      <div className="modal-body">
        {selectedProject.bids && selectedProject.bids.length > 0 ? (
          <div className="bids-container">
            {selectedProject.bids.map((bid) => {
              const developerName = bid.bidderName || bid.userName || "Anonymous Developer";
              return (
                <div key={bid._id} className="bid-card">
                  <div className="bid-header">
                    <div className="developer-info">
                      <div
                        className="avatar"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "#2563EB",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          fontWeight: "500",
                        }}
                      >
                        {developerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="developer-details">
                        <h3>{developerName}</h3>
                        <div className="developer-stats">
                          <span>{bid.userRole}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bid-amount">
                      <h4>PKR {bid.amount}</h4>
                      <span>{new Date(bid.submittedAt || bid.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="bid-proposal">
                    <h4>Proposal</h4>
                    <p>{bid.proposal}</p>
                  </div>

                  <div className="bid-actions">
                    <button
                      onClick={() => handleViewProfile(bid.userId)}
                      className="btn-secondary"
                      disabled={!bid.userId}
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleChatWithDeveloper(bid.userId)}
                      className="btn-secondary"
                      disabled={!bid.userId}
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => onAssignProject(bid)}
                      className="btn-primary"
                      disabled={loading || selectedProject.status === "assigned"}
                    >
                      {loading ? "Processing..." : "Assign Project"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-bids">
            <p>No bids received yet</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}





        {showPaymentModal && selectedBid && (
          <PaymentModal
            project={project}
            bid={selectedBid}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedBid(null);
            }}
            onPaymentSubmit={handlePaymentSubmit}
          />
        )}

        <style jsx>{`
          .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background-color: white;
            border-radius: 12px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow: auto;
          }

          .modal-header {
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .modal-body {
            padding: 20px;
          }

          .close-button {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
          }

          .bids-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .bid-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            background-color: #f9fafb;
          }

          .bid-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
          }

          .developer-info {
            display: flex;
            gap: 16px;
            align-items: center;
          }

          .avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: #2563eb;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 500;
          }

          .developer-details h3 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 600;
          }

          .developer-stats {
            display: flex;
            gap: 12px;
            color: #6b7280;
            font-size: 14px;
          }

          .bid-amount {
            text-align: right;
          }

          .bid-amount h4 {
            margin: 0 0 4px 0;
            color: #2563eb;
            font-size: 18px;
          }

          .bid-amount span {
            color: #6b7280;
            font-size: 14px;
          }

          .bid-proposal {
            margin-bottom: 16px;
          }

          .bid-proposal h4 {
            margin: 0 0 8px 0;
            font-size: 14px;
            color: #6b7280;
          }

          .bid-proposal p {
            margin: 0;
            font-size: 14px;
          }

          .bid-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            border-top: 1px solid #e5e7eb;
            padding-top: 16px;
          }

          .btn-primary,
          .btn-secondary {
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-primary {
            background-color: #2563eb;
            color: white;
            border: none;
          }

          .btn-primary:disabled {
            background-color: #e5e7eb;
            cursor: not-allowed;
          }

          .btn-secondary {
            border: 1px solid #e5e7eb;
            background-color: white;
          }

          .btn-secondary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .no-bids {
            text-align: center;
            padding: 48px 0;
            color: #6b7280;
          }
        `}</style>
      </>
    );
  };

  const fetchMatchedDevelopers = async (skills) => {
    try {
      const response = await axios.post("/api/match-developers", { skills });
      setMatchedDevelopers(response.data);
    } catch (error) {
      console.error("Error fetching matched developers:", error);
    }
  };

  const viewDeveloperProfile = (developerId) => {
    // Implement navigation to developer profile
    console.log(`Viewing developer profile: ${developerId}`);
  };

  // Project Details Modal Component
  const ProjectDetailsModal = ({ project, onClose }) => {
    const handleContactClick = () => {
      handleChatWithDeveloper(project.developerId);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div
            style={{
              padding: "24px",
              maxWidth: "600px",
              backgroundColor: "white",
              borderRadius: "8px",
              position: "relative",
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                right: "16px",
                top: "16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
              }}
            >
              ×
            </button>

            <h2 style={{ marginBottom: "16px" }}>{project.title}</h2>
            <p style={{ marginBottom: "24px", color: "#666" }}>
              {project.description}
            </p>

            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ marginBottom: "8px" }}>Project Details</h3>
              <p>
                <strong>Budget:</strong> ${project.budget}
              </p>
              <p>
                <strong>Deadline:</strong>{" "}
                {new Date(project.deadline).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {project.status}
              </p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ marginBottom: "8px" }}>Required Skills</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {project.skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      padding: "4px 12px",
                      backgroundColor: "#E5E7EB",
                      borderRadius: "16px",
                      fontSize: "14px",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
            <button
  onClick={() => handleViewBids(project._id)}
  style={{
    padding: "8px 16px",
    backgroundColor: "#2563EB",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  }}
>
  View Bids
</button>


            </div>
          </div>
        </div>
      </div>
    );
  };

  const ReportIssueModal = ({ project, onClose }) => {
    const [formData, setFormData] = useState({
      issueType: "",
      severity: "medium",
      title: "",
      description: "",
      contactMethod: "email",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission
      console.log("Form submitted:", formData);
      onClose();
    };

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          zIndex: 1100,
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "calc(100vh - 80px)",
            overflow: "auto",
            position: "relative",
          }}
        >
          <div style={{ padding: "24px" }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#DC2626", fontSize: "24px" }}>⚠️</span>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  margin: 0,
                  color: "#111827",
                }}
              >
                Report an Issue
              </h2>
            </div>
            <p
              style={{
                margin: "0 0 24px 0",
                color: "#6B7280",
              }}
            >
              Use this form to report any issues or concerns with the project "
              {project.title}".
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "24px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "16px",
                    color: "#111827",
                  }}
                >
                  Issue Details
                </h3>
                <p
                  style={{
                    margin: "0 0 24px 0",
                    color: "#6B7280",
                    fontSize: "14px",
                  }}
                >
                  Provide information about the issue you're experiencing
                </p>

                {/* Issue Type */}
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#111827",
                      fontWeight: "500",
                    }}
                  >
                    Issue Type
                  </label>
                  <select
                    value={formData.issueType}
                    onChange={(e) =>
                      setFormData({ ...formData, issueType: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "6px",
                      fontSize: "14px",
                      color: "#111827",
                    }}
                  >
                    <option value="">Select issue type</option>
                    <option value="bug">Bug</option>
                    <option value="feature">Feature Request</option>
                    <option value="support">Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Severity */}
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#111827",
                      fontWeight: "500",
                    }}
                  >
                    Severity
                  </label>
                  <div style={{ display: "flex", gap: "16px" }}>
                    {["low", "medium", "high", "critical"].map((severity) => (
                      <label
                        key={severity}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="severity"
                          value={severity}
                          checked={formData.severity === severity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              severity: e.target.value,
                            })
                          }
                          style={{ cursor: "pointer" }}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#111827",
                            textTransform: "capitalize",
                          }}
                        >
                          {severity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Issue Title */}
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#111827",
                      fontWeight: "500",
                    }}
                  >
                    Issue Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Brief title describing the issue"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                  />
                </div>

                {/* Detailed Description */}
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#111827",
                      fontWeight: "500",
                    }}
                  >
                    Detailed Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Please provide as much detail as possible about the issue"
                    rows={6}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "6px",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* Contact Method */}
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#111827",
                      fontWeight: "500",
                    }}
                  >
                    Preferred Contact Method
                  </label>
                  <div style={{ display: "flex", gap: "16px" }}>
                    {["email", "phone"].map((method) => (
                      <label
                        key={method}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="contactMethod"
                          value={method}
                          checked={formData.contactMethod === method}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contactMethod: e.target.value,
                            })
                          }
                          style={{ cursor: "pointer" }}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#111827",
                            textTransform: "capitalize",
                          }}
                        >
                          {method}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  borderTop: "1px solid #E5E7EB",
                  paddingTop: "16px",
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    backgroundColor: "white",
                    color: "#6B7280",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#2563EB",
                    color: "white",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Add ChatWindow component
  const ChatWindow = ({ roomId, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/chat/messages/${roomId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch messages");
          }

          const data = await response.json();
          setMessages(data.messages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    }, [roomId]);

    const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/chat/messages/${roomId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ message: newMessage }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const sentMessage = await response.json();
        setMessages((prev) => [...prev, sentMessage]);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message");
      }
    };

    return (
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "350px",
          height: "500px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          zIndex: 1100,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "16px" }}>Chat</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#6B7280",
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            flex: 1,
            padding: "16px",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              No messages yet
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "12px",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  backgroundColor:
                    message.sender === "me" ? "#E3F2FD" : "#F3F4F6",
                  maxWidth: "80%",
                  alignSelf:
                    message.sender === "me" ? "flex-end" : "flex-start",
                }}
              >
                <p style={{ margin: 0 }}>{message.text}</p>
                <small style={{ color: "#6B7280" }}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </small>
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          style={{
            padding: "16px",
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#2563EB",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Add this function to fetch active projects
  const fetchActiveProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, user might need to login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/projects/active",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch active projects");
      }

      const data = await response.json();
      setActiveProjects(data);
    } catch (error) {
      console.error("Error fetching active projects:", error);
    }
  };

  // Add useEffect to fetch active projects when tab changes
  useEffect(() => {
    if (activeTab === "active-projects") {
      fetchActiveProjects();
    }
  }, [activeTab]);

  // Add function to update project progress
  const handleUpdateProgress = async (projectId, progress) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to update progress");
      }

      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/progress`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ progress }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      // Refresh active projects
      fetchActiveProjects();
    } catch (error) {
      console.error("Error updating progress:", error);
      alert(error.message || "Failed to update progress");
    }
  };

  // Add function to handle payment submission
  const handlePaymentSubmission = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to submit payment");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/payment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentStatus: "paid" }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit payment");
      }

      // Refresh the invoice projects list
      fetchInvoiceProjects();
      alert(
        "Payment submitted successfully! Project moved to active projects."
      );
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert(error.message || "Failed to submit payment");
    }
  };

  // Add function to fetch projects pending payment
  const fetchInvoiceProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects/invoices", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch invoice projects");
      }

      const data = await response.json();
      setInvoiceProjects(data);
    } catch (error) {
      console.error("Error fetching invoice projects:", error);
    }
  };

  // Update useEffect to fetch invoice projects when tab changes
  useEffect(() => {
    if (activeTab === "invoice") {
      fetchInvoiceProjects();
    } else if (activeTab === "active-projects") {
      fetchActiveProjects();
    }
  }, [activeTab]);

  // Add this component before the ProjectDetailsModal
  const PaymentModal = ({ isOpen, onClose, project, bid, onPaymentSubmit }) => {
    const [stripe, setStripe] = useState(null);
    const [elements, setElements] = useState(null);
    const [cardElement, setCardElement] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isStripeReady, setIsStripeReady] = useState(false);

    useEffect(() => {
      let mounted = true;

      const setupStripe = async () => {
        try {
          const stripeInstance = await getStripe();
          if (!mounted) return;

          if (!stripeInstance) {
            throw new Error('Failed to load Stripe');
          }

          setStripe(stripeInstance);
          const elementsInstance = stripeInstance.elements();
          setElements(elementsInstance);

          // Create card element
          const card = elementsInstance.create('card', {
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          });

          // Wait for DOM to be ready
          setTimeout(() => {
            const cardElementContainer = document.getElementById('card-element');
            if (cardElementContainer && mounted) {
              card.mount('#card-element');
              setCardElement(card);
              setIsStripeReady(true);

              card.on('change', (event) => {
                if (event.error) {
                  setError(event.error.message);
                } else {
                  setError(null);
                }
              });
            }
          }, 100);

        } catch (err) {
          console.error('Error initializing Stripe:', err);
          if (mounted) {
            setError('Failed to initialize payment system. Please try again later.');
          }
        }
      };

      setupStripe();

      return () => {
        mounted = false;
        if (cardElement) {
          cardElement.destroy();
        }
      };
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!stripe || !elements || !cardElement) {
        setError('Payment system is not ready. Please try again.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Create payment intent on the server
        const response = await fetch('http://localhost:5000/api/payments/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            amount: bid.amount * 100, // Convert to cents
            projectId: project._id,
            developerId: bid.bidderId
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const { clientSecret } = await response.json();

        // Confirm the payment with Stripe
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: project.title,
              },
            },
          }
        );

        if (stripeError) {
          throw new Error(stripeError.message);
        }

        if (paymentIntent.status === 'succeeded') {
          // Update project status and payment information
          const updateResponse = await fetch(`http://localhost:5000/api/projects/${project._id}/payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
              amount: bid.amount,
              developerId: bid.bidderId
            })
          });

          if (!updateResponse.ok) {
            throw new Error('Failed to update project status');
          }

          onPaymentSubmit(paymentIntent.id);
          onClose();
        }
      } catch (err) {
        console.error('Payment error:', err);
        setError(err.message || 'Payment failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
            }}>
              Payment Details
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#6B7280',
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '0 0 8px 0', color: '#374151' }}>
              Project: {project.title}
            </p>
            <p style={{ margin: '0 0 8px 0', color: '#374151' }}>
              Developer: {bid.userName}
            </p>
            <p style={{ margin: '0', color: '#374151', fontWeight: '500' }}>
              Amount: ${bid.amount}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#374151',
                fontSize: '14px',
              }}>
                Card Details
              </label>
              <div
                id="card-element"
                style={{
                  padding: '12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  backgroundColor: '#F9FAFB',
                }}
              />
              {error && (
                <div style={{
                  color: '#DC2626',
                  fontSize: '14px',
                  marginTop: '8px',
                }}>
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isStripeReady}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading || !isStripeReady ? '#9CA3AF' : '#2563EB',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading || !isStripeReady ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Define handleAssignProject at the top level of the component
  const handleAssignProject = async (bid) => {
    try {
      console.log("Attempting to assign bid:", bid);

      if (!bid) {
        console.error("Bid object is null or undefined");
        alert("Invalid bid information: Bid object is missing");
        return;
      }

      // Get the bidder ID from the bid
      const bidderId = bid.userId || bid.bidderId;
      if (!bidderId) {
        console.error("Bidder ID is missing from bid:", bid);
        alert("Invalid bid information: Bidder ID is missing");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to assign project");
      }

      // Update project status to in-progress
      const response = await fetch(
        `http://localhost:5000/api/projects/${selectedProject._id}/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            developerId: bidderId,
            status: "in-progress",
            startDate: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to assign project");
      }

      const updatedProject = await response.json();
      
      // Update the projects list by removing the assigned project
      setProjects(prevProjects => 
        prevProjects.filter(p => p._id !== selectedProject._id)
      );

      // Close the bid modal
      setShowBidModal(false);
      setSelectedProject(null);
      setBidsList([]);

      alert("Project assigned successfully!");
      
      // Refresh active projects
      fetchActiveProjects();
    } catch (error) {
      console.error("Error in project assignment:", error);
      alert(error.message || "Failed to process project assignment. Please try again.");
    }
  };

  const handlePaymentSubmit = async (paymentInfo) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to make a payment");
      }

      // Update project status and payment info
      const response = await fetch(
        `http://localhost:5000/api/projects/${paymentInfo.projectId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentIntentId: paymentInfo.paymentIntentId,
            amount: paymentInfo.amount,
            developerId: paymentInfo.developerId,
            status: "in-progress",
            startDate: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process payment");
      }

      const updatedProject = await response.json();
      
      // Update the projects list
      setProjects(prevProjects => 
        prevProjects.map(p => 
          p._id === paymentInfo.projectId ? updatedProject : p
        )
      );

      // Close the payment modal
      setShowPaymentModal(false);
      setSelectedBid(null);

      alert("Payment successful! Project has been assigned.");
      
      // Refresh active projects
      fetchActiveProjects();
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(error.message || "Failed to process payment. Please try again.");
    }
  };

  return (
    <div>
      <h3>Find Developer</h3>
      <p style={{ color: "#6B7280", marginBottom: "24px" }}>
        Assign work to developers and manage your projects.
      </p>

      <div
        style={{
          display: "flex",
          gap: "32px",
          borderBottom: "1px solid #E5E7EB",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => setActiveTab("post")}
          style={{
            background: "none",
            border: "none",
            padding: "12px 0",
            color: activeTab === "post" ? "#111827" : "#6B7280",
            fontWeight: "500",
            fontSize: "16px",
            cursor: "pointer",
            position: "relative",
            transition: "color 0.2s ease",
            borderBottom: activeTab === "post" ? "2px solid #2563EB" : "none",
            marginBottom: "-1px",
          }}
        >
          Post Project
        </button>
        <button
          onClick={() => setActiveTab("bids")}
          style={{
            background: "none",
            border: "none",
            padding: "12px 0",
            color: activeTab === "bids" ? "#111827" : "#6B7280",
            fontWeight: "500",
            fontSize: "16px",
            cursor: "pointer",
            position: "relative",
            transition: "color 0.2s ease",
            borderBottom: activeTab === "bids" ? "2px solid #2563EB" : "none",
            marginBottom: "-1px",
          }}
        >
          Review Bids
        </button>
        <button
          onClick={() => setActiveTab("active-projects")}
          style={{
            background: "none",
            border: "none",
            padding: "12px 0",
            color: activeTab === "active-projects" ? "#111827" : "#6B7280",
            fontWeight: "500",
            fontSize: "16px",
            cursor: "pointer",
            position: "relative",
            transition: "color 0.2s ease",
            borderBottom:
              activeTab === "active-projects" ? "2px solid #2563EB" : "none",
            marginBottom: "-1px",
          }}
        >
          Active Projects
        </button>
        <button
          onClick={() => setActiveTab("past")}
          style={{
            background: "none",
            border: "none",
            padding: "12px 0",
            color: activeTab === "past" ? "#111827" : "#6B7280",
            fontWeight: "500",
            fontSize: "16px",
            cursor: "pointer",
            position: "relative",
            transition: "color 0.2s ease",
            borderBottom: activeTab === "past" ? "2px solid #2563EB" : "none",
            marginBottom: "-1px",
          }}
        >
          Past History
        </button>
        <button
          onClick={() => setActiveTab("invoice")}
          style={{
            background: "none",
            border: "none",
            padding: "16px 0",
            color: activeTab === "invoice" ? "#111827" : "#6B7280",
            borderBottom:
              activeTab === "invoice" ? "2px solid #2563EB" : "none",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Invoice
        </button>
      </div>

      <div className="tab-content">
        {/* Current Requests Tab */}
        {activeTab === "post" && (
          <div className="tab-pane fade show active">
            {/* Add description section */}
            <div className="card mb-4" style={{ backgroundColor: "#f8f9fa" }}>
              <div className="card-body">
                <h4 className="card-title mb-3">How It Works</h4>
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <span style={{ fontSize: "24px" }}>1️⃣</span>
                      </div>
                      <div>
                        <h5>Post Your Project</h5>
                        <p className="text-muted">
                          Describe your project requirements, budget, and
                          deadline. Add relevant files and technical
                          specifications.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <span style={{ fontSize: "24px" }}>2️⃣</span>
                      </div>
                      <div>
                        <h5>Review Developers</h5>
                        <p className="text-muted">
                          Our platform will match you with qualified developers.
                          Review their profiles and expertise.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <span style={{ fontSize: "24px" }}>3️⃣</span>
                      </div>
                      <div>
                        <h5>Assign & Track</h5>
                        <p className="text-muted">
                          Select your preferred developer, assign the project,
                          and track progress through our platform.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="mb-1">Project Requests</h5>
                <p className="text-muted mb-0">
                  Create and manage your project requests
                </p>
              </div>
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => setShowForm(true)}
              >
                <i className="fas fa-plus"></i>
                Post New Project
              </button>
            </div>

            {/* Request Form */}
            {showForm && (
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5>Create Project Request</h5>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      <i className="fas fa-times"></i> Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Project Type</label>
                      <select
                        className="form-select"
                        name="type"
                        value={formData.type}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="Full Stack Project">
                          Full Stack Project
                        </option>
                        <option value="Front End">Front End</option>
                        <option value="Back End">Back End</option>
                        <option value="API">API</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Project Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        placeholder="Enter a clear and concise project title"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Project Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        rows="4"
                        placeholder="Describe your project requirements in detail"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Required Skills</label>
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {formData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="badge bg-primary"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleRemoveTag(skill)}
                          >
                            {skill} <i className="fas fa-times ms-1"></i>
                          </span>
                        ))}
                      </div>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {availableTags.map((tag) => (
                          <span
                            key={tag}
                            className="badge bg-secondary"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleAddTag(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Add custom skill"
                          value={customTag}
                          onChange={(e) => setCustomTag(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (customTag.trim()) {
                                handleAddTag(customTag.trim());
                                setCustomTag("");
                              }
                            }
                          }}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => {
                            if (customTag.trim()) {
                              handleAddTag(customTag.trim());
                              setCustomTag("");
                            }
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Project Budget (PKR)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="budget"
                        value={formData.budget}
                        onChange={handleFormChange}
                        placeholder="Enter project budget"
                        required
                        min="1"
                        step="1"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Project Deadline</label>
                      <input
                        type="date"
                        className="form-control"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleFormChange}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Project Files (Optional)
                      </label>
                      <div
                        className="border rounded p-3 text-center"
                        style={{
                          borderStyle: "dashed",
                          backgroundColor: "#f8f9fa",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          document.getElementById("file-upload").click()
                        }
                      >
                        <input
                          id="file-upload"
                          type="file"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                          accept=".pdf,.doc,.docx,.zip"
                        />
                        <i className="fas fa-cloud-upload-alt fa-2x mb-2"></i>
                        <p className="mb-0">Click to upload or drag and drop</p>
                        <small className="text-muted">
                          Supported formats: PDF, DOC, DOCX, ZIP (Max 10MB)
                        </small>
                      </div>

                      {filePreview && (
                        <div className="mt-2 p-2 border rounded d-flex justify-content-between align-items-center">
                          <div>
                            <i className="fas fa-file me-2"></i>
                            <span>{filePreview.name}</span>
                            <small className="text-muted ms-2">
                              ({filePreview.size} MB)
                            </small>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setFormData({ ...formData, file: null });
                              setFilePreview(null);
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={uploading}
                      >
                        {uploading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Submit Project Request
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Current Requests */}
            <div className="row g-4">
              {currentRequests.length === 0 ? (
                <div className="col-12">
                  <div
                    className="text-center py-5"
                    style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
                  >
                    <img
                      src={noProjects}
                      alt="No projects"
                      style={{ width: "150px", marginBottom: "20px" }}
                    />
                    <h5>No Project Requests Yet</h5>
                    <p className="text-muted">
                      Create your first project request to find qualified
                      developers
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowForm(true)}
                    >
                      Post Your First Project
                    </button>
                  </div>
                </div>
              ) : (
                currentRequests.map((request, index) => (
                  <div className="col-md-6 col-lg-4" key={index}>
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-3">
                          <span className="badge bg-primary">
                            {request.type}
                          </span>
                          <span className="text-muted">
                            Posted {new Date().toLocaleDateString()}
                          </span>
                        </div>
                        <h5 className="card-title mb-3">{request.title}</h5>
                        <p className="card-text text-muted">
                          {request.description}
                        </p>
                        <div className="mb-3">
                          <strong>Required Skills:</strong>
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            {request.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="badge bg-light text-dark"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <strong>Budget:</strong>
                            <span className="ms-2 text-success">
                              {request.budget}
                            </span>
                          </div>
                          <div>
                            <strong>Deadline:</strong>
                            <span className="ms-2">{request.deadline}</span>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-primary flex-grow-1"
                            onClick={() =>
                              alert(
                                "View applications functionality coming soon!"
                              )
                            }
                          >
                            View Applications
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteRequest(request.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {formData.skills.length > 0 && (
              <div className="card mt-4">
                <div className="card-body">
                  <h5 className="card-title">Matched Developers</h5>
                  <div className="row g-3">
                    {matchedDevelopers.map((dev) => (
                      <div key={dev.id} className="col-md-4">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                              <img
                                src={
                                  dev.avatar ||
                                  `https://ui-avatars.com/api/?name=${dev.name}`
                                }
                                alt={dev.name}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  marginRight: "10px",
                                }}
                              />
                              <div>
                                <h6 className="mb-0">{dev.name}</h6>
                                <small className="text-muted">
                                  {dev.title}
                                </small>
                              </div>
                            </div>
                            <div className="mb-2">
                              <strong>Matching Skills:</strong>
                              <div className="d-flex flex-wrap gap-1 mt-1">
                                {dev.matchingSkills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="badge bg-success"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="text-muted">
                                <i className="fas fa-star text-warning"></i>
                                {dev.rating} ({dev.reviews} reviews)
                              </span>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => viewDeveloperProfile(dev.id)}
                              >
                                View Profile
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Projects Tab */}
        {activeTab === "active-projects" && (
          <div className="tab-pane fade show active">
            <div style={{ padding: "20px" }}>
              <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}>
                <h2 style={{
                  marginBottom: "24px",
                  color: "#111827",
                  fontSize: "24px",
                  fontWeight: "600",
                }}>
                  Active Projects
                </h2>

                <div style={{ overflowX: "auto" }}>
                  <table style={{
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: "0 8px",
                  }}>
                    <thead>
                      <tr>
                        <th style={{
                          padding: "12px 24px",
                          textAlign: "left",
                          fontSize: "14px",
                          color: "#111827",
                          fontWeight: "500",
                          backgroundColor: "#F9FAFB",
                          borderBottom: "1px solid #E5E7EB",
                        }}>
                          Project
                        </th>
                        <th style={{
                          padding: "12px 24px",
                          textAlign: "left",
                          fontSize: "14px",
                          color: "#111827",
                          fontWeight: "500",
                          backgroundColor: "#F9FAFB",
                          borderBottom: "1px solid #E5E7EB",
                        }}>
                          Developer
                        </th>
                        <th style={{
                          padding: "12px 24px",
                          textAlign: "left",
                          fontSize: "14px",
                          color: "#111827",
                          fontWeight: "500",
                          backgroundColor: "#F9FAFB",
                          borderBottom: "1px solid #E5E7EB",
                        }}>
                          Timeline
                        </th>
                        <th style={{
                          padding: "12px 24px",
                          textAlign: "left",
                          fontSize: "14px",
                          color: "#111827",
                          fontWeight: "500",
                          backgroundColor: "#F9FAFB",
                          borderBottom: "1px solid #E5E7EB",
                        }}>
                          Status
                        </th>
                        <th style={{
                          padding: "12px 24px",
                          textAlign: "right",
                          fontSize: "14px",
                          color: "#111827",
                          fontWeight: "500",
                          backgroundColor: "#F9FAFB",
                          borderBottom: "1px solid #E5E7EB",
                        }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeProjects.map((project) => {
                        const timeRemaining = new Date(project.deadline) - new Date();
                        const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
                        
                        return (
                          <tr key={project._id} style={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          }}>
                            <td style={{ padding: "16px 24px" }}>
                              <div>
                                <p style={{
                                  margin: 0,
                                  fontWeight: "500",
                                  color: "#111827",
                                  fontSize: "14px",
                                }}>
                                  {project.title}
                                </p>
                                <p style={{
                                  margin: "4px 0 0 0",
                                  fontSize: "14px",
                                  color: "#6B7280",
                                }}>
                                  {project.description}
                                </p>
                              </div>
                            </td>
                            <td style={{ padding: "16px 24px" }}>
                              <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                              }}>
                                <div style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  backgroundColor: "#E5E7EB",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "14px",
                                  color: "#4B5563",
                                  fontWeight: "500",
                                }}>
                                  {project.assignedDeveloper?.userName?.charAt(0) || 'D'}
                                </div>
                                <div>
                                  <p style={{
                                    margin: 0,
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    color: "#111827",
                                  }}>
                                    {project.assignedDeveloper?.userName || 'Developer'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "16px 24px" }}>
                              <div>
                                <p style={{
                                  margin: 0,
                                  fontSize: "14px",
                                  color: "#6B7280",
                                }}>
                                  {daysRemaining} days remaining
                                </p>
                                <p style={{
                                  margin: "4px 0 0 0",
                                  fontSize: "14px",
                                  color: "#6B7280",
                                }}>
                                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                                </p>
                              </div>
                            </td>
                            <td style={{ padding: "16px 24px" }}>
                              <span style={{
                                padding: "6px 12px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                backgroundColor: "#FFF3E0",
                                color: "#E65100",
                              }}>
                                {project.paymentStatus === 'pending' ? 'Payment Pending' : 'In Progress'}
                              </span>
                            </td>
                            <td style={{ padding: "16px 24px", textAlign: "right" }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                {project.paymentStatus === 'pending' ? (
                                  <button
                                    onClick={() => {
                                      setSelectedProject(project);
                                      setSelectedBid({
                                        amount: project.budget,
                                        bidderId: project.assignedDeveloper?._id,
                                        userName: project.assignedDeveloper?.userName
                                      });
                                      setShowPaymentModal(true);
                                    }}
                                    style={{
                                      padding: "8px 16px",
                                      backgroundColor: "#2563EB",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                      fontSize: "14px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    Pay Now
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleViewDetails(project._id)}
                                    style={{
                                      padding: "8px 16px",
                                      backgroundColor: "#2563EB",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                      fontSize: "14px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    View Details
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {activeProjects.length === 0 && (
                    <div style={{
                      textAlign: "center",
                      padding: "48px 0",
                      color: "#6B7280",
                    }}>
                      <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
                      <h3 style={{
                        fontSize: "18px",
                        fontWeight: "500",
                        marginBottom: "8px",
                      }}>
                        No Active Projects
                      </h3>
                      <p style={{
                        fontSize: "14px",
                        maxWidth: "400px",
                        margin: "0 auto",
                      }}>
                        Projects will appear here once they are assigned to developers.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Past History Tab */}
        {activeTab === "past" && (
          <div className="tab-pane fade show active">
            <ProjectHistory />
          </div>
        )}

        {/* Review Bids Tab */}
        {activeTab === "bids" && (
          <div className="tab-pane fade show active">
            <div style={{ padding: "20px" }}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h3 className="mb-4">Project Bids</h3>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Project</th>
                          <th>Bids Received</th>
                          <th>Budget</th>
                          <th>Deadline</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((project) => (
                          <tr key={project._id}>
                            <td>
                              <div>
                                <h6 className="mb-1">{project.title}</h6>
                                <p className="text-muted small mb-0">
                                  {project.description}
                                </p>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-primary">
                                {project.bids?.length || 0} bids
                              </span>
                            </td>
                            <td>PKR {project.budget?.toLocaleString()}</td>
                            <td>
                              {new Date(project.deadline).toLocaleDateString()}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  project.status === "open"
                                    ? "bg-success"
                                    : project.status === "in-progress"
                                    ? "bg-warning"
                                    : "bg-danger"
                                }`}
                              >
                                {project.status}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleViewBids(project._id)}
                                  disabled={project.status === "closed"}
                                >
                                  View Bids
                                </button>
                                {project.status === "open" && (
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                      handleCloseProject(project._id)
                                    }
                                  >
                                    Close
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

  



</div>
          
        )}

        {/* Invoice Tab */}
        {activeTab === "invoice" && (
          <div className="tab-pane fade show active">
            <div style={{ padding: "24px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}>
                <div>
                  <h2 style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}>
                    Invoices & Payments
                  </h2>
                  <p style={{ color: "#6B7280" }}>
                    Manage your project payments and view payment history
                  </p>
                </div>
              </div>

              {/* Pending Payments Section */}
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <FiDollarSign /> Pending Payments
                </h3>

                {invoiceProjects.length === 0 ? (
                  <div style={{
                    textAlign: "center",
                    padding: "32px",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                  }}>
                    <p style={{ color: "#6B7280" }}>No pending payments</p>
                  </div>
                ) : (
                  <div style={{
                    display: "grid",
                    gap: "16px",
                  }}>
                    {invoiceProjects.map(project => (
                      <div key={project._id} style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB",
                        padding: "20px",
                      }}>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "16px",
                        }}>
                          <div>
                            <h4 style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              marginBottom: "4px",
                            }}>
                              {project.title}
                            </h4>
                            <p style={{
                              color: "#6B7280",
                              fontSize: "14px",
                              margin: "0",
                            }}>
                              Invoice #: {project._id.slice(-6).toUpperCase()}
                            </p>
                            <p style={{
                              color: "#6B7280",
                              fontSize: "14px",
                              margin: "4px 0 0 0",
                            }}>
                              Developer: {project.assignedDeveloper?.userName || "Not assigned"}
                            </p>
                          </div>
                          <span style={{
                            backgroundColor: "#FEF3C7",
                            color: "#92400E",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}>
                            Payment Pending
                          </span>
                        </div>

                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 0",
                          borderTop: "1px solid #E5E7EB",
                        }}>
                          <div>
                            <p style={{
                              margin: "0",
                              fontSize: "14px",
                              color: "#6B7280",
                            }}>
                              Amount
                            </p>
                            <p style={{
                              margin: "0",
                              fontSize: "16px",
                              fontWeight: "600",
                            }}>
                              PKR {project.budget?.toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              setSelectedBid({
                                amount: project.budget,
                                bidderId: project.assignedDeveloper?._id,
                                userName: project.assignedDeveloper?.userName
                              });
                              setShowPaymentModal(true);
                            }}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#2563EB",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            Pay Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment History Section */}
              <div>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <FiFileText /> Payment History
                </h3>

                {invoiceProjects.filter(project => project.paymentStatus === "paid").length === 0 ? (
                  <div style={{
                    textAlign: "center",
                    padding: "32px",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                  }}>
                    <p style={{ color: "#6B7280" }}>No payment history available</p>
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    overflow: "hidden",
                  }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            borderBottom: "1px solid #E5E7EB",
                            backgroundColor: "#F9FAFB",
                          }}>
                            Project
                          </th>
                          <th style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            borderBottom: "1px solid #E5E7EB",
                            backgroundColor: "#F9FAFB",
                          }}>
                            Developer
                          </th>
                          <th style={{
                            padding: "12px 16px",
                            textAlign: "right",
                            borderBottom: "1px solid #E5E7EB",
                            backgroundColor: "#F9FAFB",
                          }}>
                            Amount
                          </th>
                          <th style={{
                            padding: "12px 16px",
                            textAlign: "right",
                            borderBottom: "1px solid #E5E7EB",
                            backgroundColor: "#F9FAFB",
                          }}>
                            Payment Date
                          </th>
                          <th style={{
                            padding: "12px 16px",
                            textAlign: "right",
                            borderBottom: "1px solid #E5E7EB",
                            backgroundColor: "#F9FAFB",
                          }}>
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceProjects
                          .filter(project => project.paymentStatus === "paid")
                          .map(project => (
                            <tr key={project._id}>
                              <td style={{
                                padding: "12px 16px",
                                borderBottom: "1px solid #E5E7EB",
                              }}>
                                <div>
                                  <p style={{ margin: "0", fontWeight: "500" }}>{project.title}</p>
                                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#6B7280" }}>
                                    Invoice #: {project._id.slice(-6).toUpperCase()}
                                  </p>
                                </div>
                              </td>
                              <td style={{
                                padding: "12px 16px",
                                borderBottom: "1px solid #E5E7EB",
                              }}>
                                {project.assignedDeveloper?.userName || "Not assigned"}
                              </td>
                              <td style={{
                                padding: "12px 16px",
                                textAlign: "right",
                                borderBottom: "1px solid #E5E7EB",
                              }}>
                                PKR {project.budget?.toLocaleString()}
                              </td>
                              <td style={{
                                padding: "12px 16px",
                                textAlign: "right",
                                borderBottom: "1px solid #E5E7EB",
                              }}>
                                {new Date(project.paymentDate).toLocaleDateString()}
                              </td>
                              <td style={{
                                padding: "12px 16px",
                                textAlign: "right",
                                borderBottom: "1px solid #E5E7EB",
                              }}>
                                <span style={{
                                  backgroundColor: "#DCFCE7",
                                  color: "#166534",
                                  padding: "4px 8px",
                                  borderRadius: "12px",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                }}>
                                  Paid
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {showChat && (
        <ChatWindow
          roomId={currentChatRoom}
          onClose={() => {
            setShowChat(false);
            setCurrentChatRoom(null);
          }}
        />
      )}
      {showPaymentModal && selectedProject && selectedBid && (
        <PaymentModal
          project={selectedProject}
          bid={selectedBid}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedBid(null);
          }}
          onPaymentSubmit={handlePaymentSubmit}
        />
      )}

      {/* Add the new BidModal */}
      <BidModal
        isOpen={showBidModal}
        onClose={() => {
          setShowBidModal(false);
          setSelectedProject(null);
          setBidsList([]);
        }}
        project={selectedProject}
        bids={bidsList}
        onAssignProject={handleAssignProject}
      />
    </div>
  );
};

const ProjectHistory = () => {
  const [projectStats, setProjectStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    totalEarnings: 0,
  });
  const [projectHistory, setProjectHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to view project history");
      }

      const response = await fetch(
        "http://localhost:5000/api/projects/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch project history");
      }

      const data = await response.json();
      setProjectHistory(data.projects);
      setProjectStats(data.stats);
    } catch (error) {
      setError(error.message || "Failed to load project history");
      console.error("Error fetching project history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectHistory();
  }, []);

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        <i className="fas fa-exclamation-circle me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-primary h-100">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Total Projects</h6>
              <h2 className="card-title mb-0 text-primary">
                {projectStats.total}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success h-100">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Completed</h6>
              <h2 className="card-title mb-0 text-success">
                {projectStats.completed}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-danger h-100">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Cancelled</h6>
              <h2 className="card-title mb-0 text-danger">
                {projectStats.cancelled}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info h-100">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Total Earnings</h6>
              <h2 className="card-title mb-0 text-info">
                PKR {projectStats.totalEarnings?.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Project History Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Project History</h5>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : projectHistory.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-history fa-3x text-muted mb-3"></i>
              <h5>No Project History</h5>
              <p className="text-muted">
                Your completed projects will appear here
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Project Details</th>
                    <th>Developer</th>
                    <th>Timeline</th>
                    <th>Status</th>
                    <th>Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {projectHistory.map((project) => (
                    <tr key={project._id}>
                      <td>
                        <div>
                          <h6 className="mb-1">{project.title}</h6>
                          <p className="text-muted small mb-0">
                            {project.description}
                          </p>
                          <div className="mt-1">
                            {project.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="badge bg-light text-dark me-1"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              project.developer.profilePicture ||
                              `https://ui-avatars.com/api/?name=${project.developer.name}`
                            }
                            alt={project.developer.name}
                            className="rounded-circle me-2"
                            width="40"
                            height="40"
                          />
                          <div>
                            <div>{project.developer.name}</div>
                            <small className="text-muted">
                              {project.developer.email}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="small text-muted">Started</div>
                          <div>
                            {new Date(project.startDate).toLocaleDateString()}
                          </div>
                          <div className="small text-muted mt-1">Completed</div>
                          <div>
                            {new Date(
                              project.completionDate
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            project.status === "completed"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold text-success">
                          PKR {project.budget.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindDeveloper;
