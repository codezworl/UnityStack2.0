import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./footer";
import Header from "./header";

const PreviewQuestion = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Use state to handle the data from location
  const [questionData, setQuestionData] = useState({
    title: "",
    details: "",
    tried: "",
    tags: [],
    userName: "",
    userRole: "",
    currentUserId: null
  });
  
  // State for user status
  const [isUserFetched, setIsUserFetched] = useState(false);
  // State for checklist (validation before submission)
  const [checklist, setChecklist] = useState({
    title: false,
    details: false,
    formattedCode: false,
    solutions: false,
    tags: false,
  });
  
  // Expand details and attempted solutions
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [expandedTried, setExpandedTried] = useState(false);
  const [error, setError] = useState("");

  // Extract data from location state - only run this once
  useEffect(() => {
    // Check if location state exists
    if (location.state) {
      // Destructure the data with fallback values
      const { 
        title = "", 
        details = "", 
        tried = "", 
        tags = [], 
        userName = "",
        userRole = ""
      } = location.state;

      // Set the data to state
      setQuestionData({
        title,
        details,
        tried,
        tags,
        userName,
        userRole,
        currentUserId: null
      });
    } else {
      // If no location state, try to get data from sessionStorage
      try {
        const storedTags = JSON.parse(sessionStorage.getItem("tags") || "[]");
        
        setQuestionData({
          title: sessionStorage.getItem("title") || "",
          details: sessionStorage.getItem("details") || "",
          tried: sessionStorage.getItem("tried") || "",
          tags: Array.isArray(storedTags) ? storedTags : [],
          userName: "",
          userRole: "",
          currentUserId: null
        });
      } catch (e) {
        console.error("Error parsing data from sessionStorage:", e);
      }
    }
  }, [location.state]); // Only re-run if location.state changes

  // Fetch user data in a separate effect to avoid loops
  useEffect(() => {
    // Only fetch user data once and if we need it
    if (!isUserFetched && (!questionData.userName || !questionData.userRole)) {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.warn("No token found in localStorage");
            setIsUserFetched(true); // Mark as fetched even if failed
            return;
          }

          const res = await fetch("http://localhost:5000/api/user", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          
          if (!res.ok) throw new Error("User fetch failed");

          const data = await res.json();
          
          setQuestionData(prev => ({
            ...prev,
            currentUserId: data.id || data._id,
            userName: prev.userName || data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            userRole: prev.userRole || data.role
          }));
          
          console.log("✅ Logged in as:", data.name || data.firstName, data.role);
        } catch (err) {
          console.warn("❌ User not logged in:", err.message);
        } finally {
          setIsUserFetched(true);
        }
      };
      
      fetchUser();
    }
  }, [isUserFetched, questionData.userName, questionData.userRole]);

  // Pull out the data from state
  const { title, details, tried, tags, userName, userRole } = questionData;
  
  // Check if all checklist items are checked
  const allChecked = Object.values(checklist).every(Boolean);
  
  const handleCheckboxChange = (name) => {
    setChecklist((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure all required fields are included
    if (!title || !details || !tried || !tags.length) {
      setError("Please fill in all fields before submitting.");
      return;
    }
    
    setError("");  // Clear any previous errors
  
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to post a question.");
      return;
    }
    
    // Prepare the data to send to the backend
    const newQuestion = {
      title,
      details,
      tried,
      tags
    };
    
    try {
      const response = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newQuestion),
      });
    
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Error creating question");
      }

      // Clear the session storage
      sessionStorage.removeItem("title");
      sessionStorage.removeItem("details");
      sessionStorage.removeItem("tried");
      sessionStorage.removeItem("tags");
    
      alert("Question posted successfully!");
      navigate("/question");  // Redirect to the questions page
    } catch (err) {
      console.error("Error creating question:", err);
      setError(err.message || "An error occurred while posting your question");
    }
  };

  // Render a fallback UI if required data is missing
  if (!title || !details || !tried) {
    return (
      <div className="container mt-5 text-center">
        <Header />
        <div className="alert alert-warning mt-5">
          <h4>Missing required data!</h4>
          <p>We couldn't find all the necessary information to preview your question.</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate("/askquestion")}
          >
            Go back to Ask Question
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      {/* Header inside the main container */}
      <Header />
  
      {/* Main content wrapper */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          padding: "20px",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0 }}
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "800px",
            width: "100%",
          }}
        >
          <h2 style={{ textAlign: "center", color: "#222", fontWeight: "bold" }}>
            Preview Your Question
          </h2>
  
          {/* Problem Details */}
          <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>
            Problem Details:
          </p>
          <div
            style={{
              background: "#f1f1f1",
              padding: "15px",
              borderRadius: "5px",
              position: "relative",
              maxHeight: expandedDetails ? "none" : "150px",
              overflow: "hidden",
            }}
            dangerouslySetInnerHTML={{
              __html: details || "<p>No details provided</p>",
            }}
          />
          {details && details.length > 150 && (
            <button
              onClick={() => setExpandedDetails(!expandedDetails)}
              style={{
                display: "block",
                marginTop: "10px",
                background: "none",
                border: "none",
                color: "#007BFF",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {expandedDetails ? "Read Less ▲" : "Read More ▼"}
            </button>
          )}
  
          {/* Attempted Solutions */}
          <p
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginTop: "20px",
              marginBottom: "5px",
            }}
          >
            Attempted Solutions:
          </p>
          <div
            style={{
              background: "#f1f1f1",
              padding: "15px",
              borderRadius: "5px",
              position: "relative",
              maxHeight: expandedTried ? "none" : "150px",
              overflow: "hidden",
            }}
            dangerouslySetInnerHTML={{
              __html: tried || "<p>No attempted solution provided</p>",
            }}
          />
          {tried && tried.length > 150 && (
            <button
              onClick={() => setExpandedTried(!expandedTried)}
              style={{
                display: "block",
                marginTop: "10px",
                background: "none",
                border: "none",
                color: "#007BFF",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {expandedTried ? "Read Less ▲" : "Read More ▼"}
            </button>
          )}
  
          {/* Tags */}
          <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "20px", marginBottom: "5px" }}>
            Tags:
          </p>
          <div>
            {tags && tags.length > 0 ? (
              tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    display: "inline-block",
                    background: "#007BFF",
                    color: "#fff",
                    padding: "8px 12px",
                    borderRadius: "20px",
                    marginRight: "5px",
                    fontSize: "14px",
                  }}
                >
                  #{tag}
                </span>
              ))
            ) : (
              <p>No tags added</p>
            )}
          </div>
  
          {/* User Info (UserName and Role) */}
          {userName && userRole && (
          <div
            style={{
              fontSize: "16px",
              marginTop: "20px",
              fontWeight: "bold",
              color: "#222",
            }}
          >
            <span style={{ color: "#2563EB" }}>{userName}</span> ({userRole})
          </div>
          )}
  
          {/* Checklist */}
          <h3 style={{ marginTop: "25px", fontSize: "20px", color: "#222" }}>
            Before submitting, please check:
          </h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {Object.keys(checklist).map((key) => (
              <li key={key} style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={checklist[key]}
                  onChange={() => handleCheckboxChange(key)}
                  style={{ marginRight: "10px", transform: "scale(1.2)" }}
                />
                <span style={{ fontSize: "16px" }}>{key.replace(/([A-Z])/g, " $1").trim()}</span>
              </li>
            ))}
          </ul>
          {error && <p style={{ color: "red" }}>{error}</p>}
  
          {/* Submit & Edit Buttons */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={handleSubmit}
              disabled={!allChecked}
              style={{
                padding: "12px 20px",
                margin: "0 10px",
                borderRadius: "5px",
                border: "none",
                background: allChecked ? "#28a745" : "#ccc",
                color: "#fff",
                cursor: allChecked ? "pointer" : "not-allowed",
                fontSize: "16px",
              }}
            >
              Post Your Question
            </button>
  
            <button
              onClick={() => navigate("/askquestion")}
              style={{
                padding: "12px 20px",
                margin: "0 10px",
                borderRadius: "5px",
                border: "none",
                background: "#007BFF",
                color: "#fff",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Edit Question
            </button>
          </div>
        </motion.div>
      </div>
  
      {/* Footer inside the main container */}
      <Footer />
    </div>
  );
};  

export default PreviewQuestion;
