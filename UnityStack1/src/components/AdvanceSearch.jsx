import React, { useState } from "react";
import Header from "./header";
import Footer from "./footer";

const AdvanceSearch = () => {
  const [problemDescription, setProblemDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [projectType, setProjectType] = useState("");
  const [timeSensitivity, setTimeSensitivity] = useState("");
  const [developerLevel, setDeveloperLevel] = useState("");
  const [helpTypes, setHelpTypes] = useState([]);

  return (
    <div>
      <Header />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Poppins, sans-serif", color: "#1e293b" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}>Advanced Search</h1>
        <form style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px" }}>
          <div>
            <label htmlFor="problemDescription" style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Problem Description</label>
            <textarea
              id="problemDescription"
              placeholder="Describe your coding challenge, bug, or development problem in detail..."
              style={{ padding: "10px 15px", fontSize: "16px", border: "1px solid #d1d5db", borderRadius: "5px", width: "100%", height: "100px" }}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="technologies" style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Technologies Involved</label>
            <input
              id="technologies"
              type="text"
              placeholder="Technologies involved (e.g., React, Node.js, MongoDB, TypeScript)"
              style={{ padding: "10px 15px", fontSize: "16px", border: "1px solid #d1d5db", borderRadius: "5px", width: "100%" }}
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="projectType" style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Project Type</label>
            <select
              id="projectType"
              style={{ padding: "10px 15px", fontSize: "16px", border: "1px solid #d1d5db", borderRadius: "5px", width: "100%", appearance: "none", cursor: "pointer" }}
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            >
              <option value="">Select project type</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">Full Stack</option>
            </select>
          </div>

          <div>
            <label htmlFor="timeSensitivity" style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Time Sensitivity</label>
            <select
              id="timeSensitivity"
              style={{ padding: "10px 15px", fontSize: "16px", border: "1px solid #d1d5db", borderRadius: "5px", width: "100%", appearance: "none", cursor: "pointer" }}
              value={timeSensitivity}
              onChange={(e) => setTimeSensitivity(e.target.value)}
            >
              <option value="">Select time sensitivity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>Developer Experience Level Needed</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["Beginner-Friendly", "Intermediate", "Expert"].map((level) => (
                <button
                  key={level}
                  type="button"
                  style={{
                    padding: "10px 15px",
                    borderRadius: "20px",
                    backgroundColor: developerLevel === level ? "#2563EB" : "#E5E7EB",
                    color: developerLevel === level ? "white" : "#374151",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    border: "none"
                  }}
                  onClick={() => setDeveloperLevel(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>Type of Help Needed</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[
                "Code Review",
                "Live Debugging",
                "Architecture Review",
                "Pair Programming",
                "Technical Guidance",
                "Project Setup",
                "Performance Optimization"
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  style={{
                    padding: "10px 15px",
                    borderRadius: "20px",
                    backgroundColor: helpTypes.includes(type) ? "#2563EB" : "#E5E7EB",
                    color: helpTypes.includes(type) ? "white" : "#374151",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    border: "none"
                  }}
                  onClick={() => toggleHelpType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </form>
        <button
          style={{
            backgroundColor: "#2563EB",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            width: "fit-content",
            alignSelf: "center"
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1E40AF")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2563EB")}
        >
          Search
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default AdvanceSearch;
