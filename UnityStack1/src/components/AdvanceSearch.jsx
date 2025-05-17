import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { motion } from "framer-motion";

const AdvanceSearch = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [problemDescription, setProblemDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [projectType, setProjectType] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchResults, setSearchResults] = useState({
    developers: [],
    questions: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // Load saved request if exists
      const savedRequest = localStorage.getItem("savedRequest");
      if (savedRequest) {
        const { problemDescription: savedDesc, technologies: savedTech, projectType: savedType } = JSON.parse(savedRequest);
        setProblemDescription(savedDesc);
        setTechnologies(savedTech);
        setProjectType(savedType);
      }
    }
  }, []);

  const handleSearchClick = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/advance-search");
      setShowLoginModal(true);
      return;
    }

    if (isSearching) return;
    setIsSearching(true);

    try {
      // Save request to localStorage
      const requestData = {
        problemDescription,
        technologies,
        projectType
      };
      localStorage.setItem("savedRequest", JSON.stringify(requestData));

      // Fetch developers based on technologies
      const developersRes = await fetch(`http://localhost:5000/api/developers?skills=${technologies}`, {
        credentials: "include"
      });
      const developersData = await developersRes.json();

      // Fetch questions based on technologies
      const questionsRes = await fetch(`http://localhost:5000/api/questions?search=${technologies}`, {
        credentials: "include"
      });
      const questionsData = await questionsRes.json();

      setSearchResults({
        developers: developersData.slice(0, 3), // Get first 3 developers
        questions: questionsData.questions.slice(0, 3) // Get first 3 questions
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleLoginModalLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const handleChatClick = async (developerId) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      // Create a new chat session
      const response = await fetch('http://localhost:5000/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          developerId: developerId,
          initialMessage: `I'm interested in your expertise regarding: ${technologies}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create chat session');
      }

      const data = await response.json();
      navigate(`/chat/${data.chatId}`);
    } catch (error) {
      console.error('Error creating chat session:', error);
    }
  };

  const handleEditRequest = () => {
    setIsEditing(true);
  };

  const handleClearRequest = () => {
    localStorage.removeItem("savedRequest");
    setProblemDescription("");
    setTechnologies("");
    setProjectType("");
    setSearchResults({ developers: [], questions: [] });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0 }}
    >
      <div style={{ backgroundColor: "#F8F9FA", color: "#1e293b", fontFamily: "Poppins, sans-serif", width: "100%" }}>
        <Header />

        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "30px", borderRadius: "10px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>Advanced Developer Search</h1>

          {/* Request Card */}
          {!isEditing && (searchResults.developers.length > 0 || searchResults.questions?.length > 0) && (
            <div style={{ 
              backgroundColor: "#fff", 
              padding: "20px", 
              borderRadius: "10px", 
              marginBottom: "20px", 
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)" 
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Your Request</h2>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleEditRequest}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#2563EB",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "bold"
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={handleClearRequest}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#EF4444",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "bold"
                    }}
                  >
                    🗑️ Clear
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>Problem Description:</strong>
                <p style={{ marginTop: "5px", color: "#4B5563" }}>{problemDescription}</p>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>Technologies:</strong>
                <p style={{ marginTop: "5px", color: "#4B5563" }}>{technologies}</p>
              </div>
              <div>
                <strong>Project Type:</strong>
                <p style={{ marginTop: "5px", color: "#4B5563" }}>{projectType}</p>
              </div>
            </div>
          )}

          {/* Search Form */}
          {(isEditing || (!searchResults.developers.length && !searchResults.questions?.length)) && (
            <form onSubmit={handleSearchClick} style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px" }}>
              <div>
                <label htmlFor="problemDescription" style={{ fontWeight: "600" }}>Problem Description</label>
                <textarea id="problemDescription" placeholder="Describe your coding challenge..." 
                  style={{ padding: "12px", fontSize: "16px", border: "1px solid #d1d5db", borderRadius: "5px", width: "100%", height: "100px" }}
                  value={problemDescription} onChange={(e) => setProblemDescription(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="technologies" style={{ fontWeight: "600" }}>Technologies Involved</label>
                <input id="technologies" type="text" placeholder="React, Node.js, DevOps, etc." 
                  style={{ padding: "12px", fontSize: "16px", border: "1px solid #d1d5db", borderRadius: "5px", width: "100%" }}
                  value={technologies} onChange={(e) => setTechnologies(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="projectType" style={{ fontWeight: "600" }}>Project Type</label>
                <select id="projectType" 
                  style={{ padding: "12px", fontSize: "16px", border: "1px solid #d1d5db", borderRadius: "5px", width: "100%", cursor: "pointer" }}
                  value={projectType} onChange={(e) => setProjectType(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="frontend">Frontend Development</option>
                  <option value="backend">Backend Development</option>
                  <option value="fullstack">Full Stack Development</option>
                  <option value="Other Fields">Any Other Field</option>
                </select>
              </div>

              <button 
                type="submit"
                disabled={isSearching}
                style={{
                  backgroundColor: isSearching ? "#93C5FD" : "#2563EB",
                  color: "white",
                  padding: "12px",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: isSearching ? "not-allowed" : "pointer",
                  width: "100%"
                }}
              >
                {isSearching ? "Searching..." : "🔍 Find Developers"}
              </button>
            </form>
          )}

          {/* Search Results */}
          {(searchResults.developers.length > 0 || searchResults.questions?.length > 0) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Suggested Experts */}
              {searchResults.developers.length > 0 && (
                <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>Suggested Experts</h2>

                  {/* Expert List */}
                  {searchResults.developers.map((developer, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: index !== searchResults.developers.length - 1 ? "1px solid #E5E7EB" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={developer.profileImage || "/images/default-avatar.png"} alt={developer.firstName} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                        <div>
                          <Link 
                            to={`/profile/${developer._id}`}
                            style={{ 
                              fontSize: "16px", 
                              fontWeight: "bold", 
                              marginBottom: "2px",
                              color: "#2563EB",
                              textDecoration: "none"
                            }}
                          >
                            {developer.firstName} {developer.lastName}
                          </Link>
                          <p style={{ fontSize: "14px", color: "#6B7280" }}>{developer.expertise?.map(exp => exp.domain).join(", ")}</p>
                        </div>
                      </div>
                      
                      {/* Chat Now Button */}
                      <button 
                        onClick={() => handleChatClick(developer._id)}
                        style={{
                          backgroundColor: "#22c55e", 
                          color: "white", 
                          padding: "8px 15px", 
                          borderRadius: "5px",
                          border: "none", 
                          cursor: "pointer", 
                          fontSize: "14px", 
                          fontWeight: "bold"
                        }}
                      >
                        💬 Chat Now
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Related Questions */}
              {searchResults.questions?.length > 0 && (
                <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>Related Questions</h2>

                  {/* Question List */}
                  {searchResults.questions.map((question, index) => (
                    <div key={index} style={{ padding: "10px 0", borderBottom: index !== searchResults.questions.length - 1 ? "1px solid #E5E7EB" : "none" }}>
                      <Link 
                        to={`/questionthread/${question._id}`}
                        style={{ 
                          fontSize: "16px", 
                          fontWeight: "bold", 
                          color: "#2563EB",
                          textDecoration: "none",
                          display: "block",
                          marginBottom: "5px"
                        }}
                      >
                        {question.title}
                      </Link>
                      <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "5px" }}>
                        {question.details.substring(0, 150)}...
                      </p>
                      <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "#6B7280" }}>
                        <span>{question.answers?.length || 0} answers</span>
                        <span>{question.views} views</span>
                        <span>Asked by {question.userName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "10px",
              maxWidth: "400px",
              width: "100%",
              textAlign: "center"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Login Required</h2>
              <p style={{ marginBottom: "1.5rem" }}>Please login to continue with the search.</p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button
                  onClick={handleLoginModalClose}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#E5E7EB",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLoginModalLogin}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#2563EB",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </motion.div>
  );
};

export default AdvanceSearch;
