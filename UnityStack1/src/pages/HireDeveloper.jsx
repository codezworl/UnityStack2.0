import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
const skills = {
  Frontend: [
    "React",
    "Angular",
    "Vue",
    "Next.js",
    "Svelte",
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
  ],
  Backend: ["Node.js", "Python", "Java", "PHP", "Ruby", "Go", "C#", "C++"],
  Mobile: ["React Native", "Flutter", "Ionic", "Swift", "Kotlin"],
  Databases: ["MongoDB", "MySQL", "PostgreSQL", "Redis"],
};

const HireDeveloper = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const handleSkillClick = (skill) => {
    navigate(`/Getexperthelp?skill=${skill}`);
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div
      style={{
        backgroundColor: "#F8F9FA",
        color: "#000",
        fontFamily: "Poppins, sans-serif",
        width: "100%",
      }}
    >
      <Header />

      {/* Header Section */}
      <div
        style={{
          width: "100%",
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "#F8F9FA",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "auto" }}>
          <h1
            style={{ fontSize: "32px", fontWeight: "bold", color: "#007BFF" }}
          >
            Hire Top Freelance Software Developers
          </h1>
          <p style={{ fontSize: "18px", marginTop: "10px" }}>
            Find top developers quickly and easily. Work with our vetted
            developers who have proven skills and experience.
          </p>
          <button
          onClick={() => navigate(`/login`)}
            style={{
              backgroundColor: "#007BFF",
              color: "#fff",
              padding: "12px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              marginTop: "20px",
            }}
          >
            Hire a Developer
          </button>
        </div>
      </div>

      {/* Skills Section */}

      <section
        style={{ width: "100%", padding: "40px 0", backgroundColor: "#fff" }}
      >
        <div style={{ maxWidth: "1200px", margin: "auto", padding: "0 20px" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            What freelance project do you need help with?
          </h2>
          {Object.entries(skills).map(([category, skillList]) => (
            <div key={category} style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  color: "black",
                }}
              >
                {category}
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "15px",
                }}
              >
                {skillList.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillClick(skill)}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    style={{
                      backgroundColor:
                        hoveredSkill === skill ? "#0056b3" : "#007BFF",
                      color: "#fff",
                      padding: "15px",
                      borderRadius: "8px",
                      border:
                        hoveredSkill === skill
                          ? "2px solid #007BFF"
                          : "2px solid transparent",
                      cursor: "pointer",
                      fontSize: "16px",
                      transition: "0.3s ease-in-out",
                      boxShadow:
                        hoveredSkill === skill
                          ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                          : "none",
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* How It Works & Why Hire a Developer */}
      <div
        style={{ width: "100%", padding: "40px 0", backgroundColor: "#fff" }}
      >
        <div style={{ maxWidth: "1200px", margin: "auto", padding: "0 20px" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            How it works
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                icon: "📝",
                title: "Post a request",
                description:
                  "We'll share your request with developers with relevant skills and expertise.",
              },
              {
                icon: "🌍",
                title: "Review & chat with developers",
                description:
                  "Use our messaging feature to instantly chat with developers worldwide.",
              },
              {
                icon: "⭐",
                title: "Hire the best developer",
                description: "Choose the best developer that meets your needs.",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#F8F9FA",
                  padding: "20px",
                  borderRadius: "10px",
                  textAlign: "left",
                  flex: "1",
                  minWidth: "250px",
                  maxWidth: "300px",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
              >
                <span style={{ fontSize: "30px" }}>{item.icon}</span>
                <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#555" }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div
        style={{ width: "100%", padding: "40px 0", backgroundColor: "#fff" }}
      >
        <div style={{ maxWidth: "1200px", margin: "auto", padding: "0 20px" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Frequently Asked Questions
          </h2>
          {[
            "How long do projects normally take?",
            "How much does it cost to hire a freelance developer?",
            "What makes UnityStack developers different?",
            "What happens if I'm not happy with the developer's work?",
          ].map((question, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#F8F9FA",
                borderRadius: "8px",
                marginBottom: "10px",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                style={{
                  width: "100%",
                  backgroundColor: "#F8F9FA",
                  color: "#000",
                  padding: "15px",
                  border: "none",
                  textAlign: "left",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {question} <span>{openFAQ === index ? "▲" : "▼"}</span>
              </button>
              {openFAQ === index && (
                <div
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#EEE",
                    color: "#555",
                    fontSize: "14px",
                  }}
                >
                  Answer placeholder
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div
        style={{
          width: "100%",
          padding: "50px 0",
          backgroundColor: "#007BFF",
          color: "#fff",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "auto", textAlign: "center" }}
        >
          <h2>Find talent you're looking for in minutes</h2>
          <p>
            Join thousands of businesses and developers who trust UnityStack.
          </p>
          <button
          onClick={() => navigate(`/login`)}
            style={{
              backgroundColor: "#fff",
              color: "#007BFF",
              padding: "12px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              border: "2px solid #007BFF",
            }}
          >
            Hire a Developer
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HireDeveloper;
