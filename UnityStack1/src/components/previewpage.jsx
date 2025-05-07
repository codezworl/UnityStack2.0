import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./footer";
import Header from "./header";

const PreviewQuestion = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure incoming props from location.state and provide fallback values
  const { 
    title: initialTitle, 
    details: initialDetails, 
    tried: initialTried, 
    tags: initialTags, 
    userName: initialUserName,   // Add userName
    userRole: initialUserRole    // Add userRole
  } = location.state || { title: "", details: "", tried: "", tags: [], userName: "", userRole: "" };  // Fallback to empty string if not available

  // Define states for form fields
  const [userName, setUserName] = useState(initialUserName); 
  const [userRole, setUserRole] = useState(initialUserRole); 
  const [currentUserId, setCurrentUserId] = useState(null);
  const [title, setTitle] = useState(initialTitle); 
  const [details, setDetails] = useState(initialDetails);
  const [tried, setTried] = useState(initialTried);
  const [tags, setTags] = useState(initialTags);

  // Validation: Ensure all required data exists
  if (!title || !details || !tried || !tags.length || !userRole || !userName) {
    return <div>Error: Missing data!</div>;  // Handle missing data case
  }

  const [error, setError] = useState("");
  
  // Handle form state (edit mode or new question)
  const editData = JSON.parse(sessionStorage.getItem("editQuestion"));
  const isEditMode = !!editData;  // true if editData exists, otherwise false
  
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
  
  // Check if all checklist items are checked
  const allChecked = Object.values(checklist).every(Boolean);
  
  const handleCheckboxChange = (name) => {
    setChecklist((prev) => ({ ...prev, [name]: !prev[name] }));
  };
   useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/user", {
            credentials: "include"
          });
          if (!res.ok) throw new Error("User fetch failed");
  
          const data = await res.json();
          setCurrentUserId(data.id);
          setUserName(data.name);
          setUserRole(data.role);
          console.log("✅ Logged in as:", data.name, data.role);
        } catch (err) {
          console.warn("❌ User not logged in:", err.message);
        }
      };
      fetchUser();
    }, []);
  

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      // Ensure all required fields are included
      if (!title || !details || !tried || tags.length === 0 || !userName || !userRole || !currentUserId) {
        setError("Please fill in all fields before submitting.");
        return;
      }
    
      setError("");  // Clear any previous errors
    
      // Prepare the data to send to the backend
      const newQuestion = {
        title,
        details,
        tried,
        tags,
        userRole,  // Pass userRole
        userName,  // Pass userName
        userId: currentUserId,  // Add currentUserId
      };
    
      try {
        const response = await fetch("http://localhost:5000/api/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newQuestion),
        });
    
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Error creating question");
        }
    
        alert("Question posted successfully!");
        navigate("/questions");  // Redirect to the questions page
      } catch (err) {
        console.error("Error creating question:", err);
        setError(err.message || "An error occurred while posting your question");
      }
    };
    
  
  

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
          {details.length > 150 && (
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
          {tried.length > 150 && (
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
            {tags?.length > 0 ? (
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
              onClick={() => navigate(-1)}
              style={{
                padding: "12px 20px",
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
