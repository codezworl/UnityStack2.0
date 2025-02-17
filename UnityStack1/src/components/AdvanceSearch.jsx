import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { motion } from "framer-motion";

const AdvanceSearch = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [problemDescription, setProblemDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [projectType, setProjectType] = useState("");
  const [timeSensitivity, setTimeSensitivity] = useState("");
  const [developerLevel, setDeveloperLevel] = useState("");
  const [helpTypes, setHelpTypes] = useState([]);
  const [budgetRange, setBudgetRange] = useState("");
  const [collaborationType, setCollaborationType] = useState("");
  const [projectDuration, setProjectDuration] = useState("");

  useEffect(() => {
    // Check if the user is logged in (you can use localStorage or API call)
    const userLoggedIn = localStorage.getItem("user");
    if (userLoggedIn) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSearchClick = () => {
    if (!isAuthenticated) {
      // Redirect to login first, then back to this page after login
      localStorage.setItem("redirectAfterLogin", "/advance-search");
      navigate("/login");
    } else {
      // Perform search action here (fetch suggested questions & experts)
    }
  };

const suggestionsData = {
  solutions: [
    { title: "How to center a div", votes: 42, answers: 5 },
    { title: "Understanding async/await in JavaScript", votes: 38, answers: 3 },
    { title: "Best practices for React hooks", votes: 55, answers: 7 }
  ],
  experts: [
    { name: "Jane Doe", skills: "React, JavaScript", sessions: 120, image: "/images/jane.jpg" },
    { name: "John Smith", skills: "Python, Machine Learning", sessions: 85, image: "/images/john.jpg" },
    { name: "Alice Johnson", skills: "Java, Spring Boot", sessions: 150, image: "/images/alice.jpg" }
  ]
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

      {/* Advanced Search Form */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "30px", borderRadius: "10px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>Advanced Developer Search</h1>
        <form style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px" }}>
          {/* Problem Description */}
          <div>
            <label htmlFor="problemDescription" style={{ fontWeight: "600" }}>Problem Description</label>
            <textarea id="problemDescription" placeholder="Describe your coding challenge..." 
              style={{ padding: "12px", fontSize: "16px", border: "1px solid #d1d5db", borderRadius: "5px", width: "100%", height: "100px" }}
              value={problemDescription} onChange={(e) => setProblemDescription(e.target.value)}
            />
          </div>

          {/* Technologies Involved */}
          <div>
            <label htmlFor="technologies" style={{ fontWeight: "600" }}>Technologies Involved</label>
            <input id="technologies" type="text" placeholder="React, Node.js, DevOps, etc." 
              style={{ padding: "12px", fontSize: "16px", border: "1px solid #d1d5db", borderRadius: "5px", width: "100%" }}
              value={technologies} onChange={(e) => setTechnologies(e.target.value)}
            />
          </div>

          {/* Project Type & Time Sensitivity */}
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
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

            <div style={{ flex: 1 }}>
              <label htmlFor="timeSensitivity" style={{ fontWeight: "600" }}>Time Sensitivity</label>
              <select id="timeSensitivity" 
                style={{ padding: "12px", fontSize: "16px", border: "1px solid #d1d5db", borderRadius: "5px", width: "100%", cursor: "pointer" }}
                value={timeSensitivity} onChange={(e) => setTimeSensitivity(e.target.value)}
              >
                <option value="">Select</option>
                <option value="24hrs">Within 24 hours</option>
                <option value="week">Within a week</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          {/* Additional Fields */}
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="budgetRange" style={{ fontWeight: "600" }}>Budget Range</label>
              <select id="budgetRange" 
                style={{ padding: "12px", fontSize: "16px", border: "1px solid #d1d5db", borderRadius: "5px", width: "100%", cursor: "pointer" }}
                value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)}
              >
                <option value="">Select</option>
                <option value="low">Less than 2000 Pkr</option>
                <option value="medium">500 pkr - 5000 pkr</option>
                <option value="high">More than 5000 pkr</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label htmlFor="collaborationType" style={{ fontWeight: "600" }}>Preferred Collaboration Type</label>
              <select id="collaborationType"
                style={{ padding: "12px", fontSize: "16px", border: "1px solid #d1d5db", borderRadius: "5px", width: "100%", cursor: "pointer" }}
                value={collaborationType} onChange={(e) => setCollaborationType(e.target.value)}
              >
                <option value="">Select</option>
                <option value="freelance">Question Query</option>
                <option value="full-time">1-to-1 Live Session</option>
                <option value="part-time">Project Assesment</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button style={{
            backgroundColor: "#2563EB", color: "white", padding: "12px", border: "none",
            borderRadius: "5px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", width: "100%"
          }}
            onClick={handleSearchClick}
          >
            🔍 Find Developers
          </button>
        </form>

            {/* Related Solutions */}
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>Related Solutions</h2>
        
        {/* Solution Filters */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
          {["Most Votes", "Recent", "JavaScript", "React", "Python", "Java"].map((tag, index) => (
            <span key={index} style={{
              backgroundColor: "#F3F4F6", padding: "6px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: "500", cursor: "pointer"
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Solution List */}
        {suggestionsData.solutions.map((solution, index) => (
          <div key={index} style={{ padding: "10px 0", borderBottom: index !== suggestionsData.solutions.length - 1 ? "1px solid #E5E7EB" : "none" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "5px", cursor: "pointer" }}>
              {solution.title}
            </h3>
            <p style={{ fontSize: "14px", color: "#6B7280" }}>
              👍 {solution.votes} votes • 💬 {solution.answers} answers
            </p>
          </div>
        ))}

        {/* View More Solutions */}
        <a href="/question" style={{ color: "#2563EB", fontWeight: "bold", display: "block", marginTop: "10px" }}>
          View all solutions →
        </a>
      </div>

      {/* Suggested Experts */}
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>Suggested Experts</h2>

        {/* Expert List */}
        {suggestionsData.experts.map((expert, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: index !== suggestionsData.experts.length - 1 ? "1px solid #E5E7EB" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={expert.image} alt={expert.name} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
              <div>
                <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "2px" }}>{expert.name}</p>
                <p style={{ fontSize: "14px", color: "#6B7280" }}>{expert.skills}</p>
                <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{expert.sessions} expert sessions</p>
              </div>
            </div>
            
            {/* Chat Now Button */}
            <button style={{
              backgroundColor: "#22c55e", color: "white", padding: "8px 15px", borderRadius: "5px",
              border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "bold"
            }}>
              💬 Chat Now
            </button>
          </div>
        ))}

        {/* View More Experts */}
        <a href="/Getexperthelp" style={{ color: "#2563EB", fontWeight: "bold", display: "block", marginTop: "10px" }}>
          View all experts →
        </a>
      </div>
      </div>

      <Footer />
    </div>
  </motion.div>
  );
};

export default AdvanceSearch;
