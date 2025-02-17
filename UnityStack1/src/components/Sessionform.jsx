import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LiveSessionForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState("live-help");
  const [sessionLength, setSessionLength] = useState("");
  const [budget, setBudget] = useState(20);
  const [featuredRequest, setFeaturedRequest] = useState(false);
  const [helpType, setHelpType] = useState("");
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [technologies, setTechnologies] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [notSure, setNotSure] = useState(false);
  const [hoursPerWeek, setHoursPerWeek] = useState(""); 
  const [weeks, setWeeks] = useState(""); 

  const recommendedTags = [
    "React",
    "Next.js",
    "Web Development",
    "CSS",
    "Front-end",
    "UX design",
    "Redux",
    "Responsive Design",
  ];

  const handleAddTag = () => {
    if (newTag && !technologies.includes(newTag)) {
      setTechnologies([...technologies, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTechnologies(technologies.filter((t) => t !== tag));
  };

  return (
    <div
      style={{
        maxWidth: "750px",
        margin: "50px auto",
        padding: "20px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Top Back Button (Dashboard) */}
      <button
        onClick={() => navigate("/studentdashboard")}
        style={{
          background: "none",
          border: "none",
          fontSize: "16px",
          color: "#2563EB",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      {/* Step Indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "20px 0",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: step === 1 ? "#2563EB" : "#E5E7EB",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          1
        </div>
        <hr style={{ flex: 1, borderTop: "2px solid #E5E7EB" }} />
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: step === 2 ? "#2563EB" : "#E5E7EB",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          2
        </div>
      </div>

      {step === 1 ? (
        /* STEP 1: Problem Description */
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>
            Tell us about what you need help with
          </h2>

          {/* Help Type Selection */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            {["Troubleshooting", "Debugging", "Tutoring"].map((type) => (
              <button
                key={type}
                onClick={() => setHelpType(type)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: `2px solid ${
                    helpType === type ? "#2563EB" : "#E5E7EB"
                  }`,
                  background: helpType === type ? "#E0ECFF" : "transparent",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Summary Input */}
          <div style={{ marginTop: "20px" }}>
            <label style={{ fontWeight: "bold" }}>One sentence summary</label>
            <input
              type="text"
              placeholder="e.g., Need help fixing the style on a React website"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                marginTop: "5px",
              }}
            />
          </div>

          {/* Detailed Description */}
          <div style={{ marginTop: "20px" }}>
            <label style={{ fontWeight: "bold" }}>
              Details of what you need help with
            </label>
            <textarea
              placeholder="What's your current progress? What do you need help with?"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                marginTop: "5px",
                height: "100px",
              }}
            />
          </div>

          {/* Add Tags Manually */}
          <div style={{ marginTop: "20px" }}>
            <label style={{ fontWeight: "bold" }}>Technologies (add 2-6)</label>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                }}
              />
              <button
                onClick={handleAddTag}
                style={{
                  padding: "10px 15px",
                  background: "#2563EB",
                  color: "white",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                + Add
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "10px",
              }}
            >
              {technologies.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    background: "#E5E7EB",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} ✖
                </span>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={() => setStep(2)}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "16px",
              width: "100%",
              marginTop: "20px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Next
          </button>
        </div>
      ) : (
        /* STEP 2: Session Preferences */
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>
            How would you like to get help?
          </h2>

          {/* Session Type Selection */}

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            {[
              {
                type: "live-help",
                label: "1:1 live help",
                description: "Start a live mentorship session",
              },
              {
                type: "long-term",
                label: "Long-term mentorship",
                description: "Work regularly with a dedicated mentor",
              },
            ].map(({ type, label, description }) => (
              <button
                key={type}
                onClick={() => setSessionType(type)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: `2px solid ${
                    sessionType === type ? "#2563EB" : "#E5E7EB"
                  }`,
                  background: sessionType === type ? "#E0ECFF" : "transparent",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {label} <br />
                <span style={{ fontSize: "12px", color: "#64748B" }}>
                  {description}
                </span>
              </button>
            ))}
          </div>

          {/* Show Estimated Hours only for "Long-term mentorship" */}
          {sessionType === "long-term" && (
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>
                Estimated hours
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <span>I'm available</span>
                <input
                  type="number"
                  min="1"
                  disabled={notSure}
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  style={{
                    width: "50px",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #E5E7EB",
                    background: notSure ? "#F3F4F6" : "white",
                  }}
                />
                <span>hours a week for</span>
                <input
                  type="number"
                  min="1"
                  disabled={notSure}
                  value={weeks}
                  onChange={(e) => setWeeks(e.target.value)}
                  style={{
                    width: "50px",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #E5E7EB",
                    background: notSure ? "#F3F4F6" : "white",
                  }}
                />
                <span>weeks.</span>
                <input
                  type="checkbox"
                  checked={notSure}
                  onChange={() => {
                    setNotSure(!notSure);
                    setHoursPerWeek("");
                    setWeeks("");
                  }}
                />
                <span>I'm not sure yet.</span>
              </div>
            </div>
          )}
          {/* Session Length Selection */}
          <p style={{ fontWeight: "bold", marginTop: "20px" }}>
            Estimated session length
          </p>
          {["Less than 1 hr", "More than 1 hr", "Not sure yet"].map(
            (option) => (
              <label
                key={option}
                style={{ display: "block", marginBottom: "10px" }}
              >
                <input
                  type="radio"
                  name="sessionLength"
                  value={option}
                  onChange={() => setSessionLength(option)}
                />{" "}
                {option}
              </label>
            )
          )}
          {/* Budget Selection */}
          <p style={{ fontWeight: "bold", marginTop: "20px" }}>
            Estimated budget for every 15 mins
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            {[1500, 2000, 3000, 4000, 5000].map((amount) => (
              <button
                key={amount}
                onClick={() => setBudget(amount)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: `2px solid ${budget === amount ? "#000" : "#E5E7EB"}`,
                  background: budget === amount ? "#000" : "transparent",
                  color: budget === amount ? "#fff" : "#000",
                  cursor: "pointer",
                }}
              >
                {amount} pkr
              </button>
            ))}
          </div>
          {/* Back & Submit Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={() => setStep(1)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                cursor: "pointer",
              }}
            >
              Back
            </button>
            <button
              onClick={() => alert("Request Submitted!")}
              style={{
                flex: 1,
                backgroundColor: "#000",
                color: "#fff",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Submit Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSessionForm;
