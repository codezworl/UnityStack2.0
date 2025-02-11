import React, { useState, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import mentorshipImage from "../assets/mentorship@2x.jpg";
import Projectimage from "../assets/freelance-job.png";
import { Link } from "react-router-dom";
import { Code, Rocket, MessageCircle } from "lucide-react";
import img1 from "../assets/section3A.png";
import img2 from "../assets/section3B.jpg";
import img3 from "../assets/section3C.jpg";
import { motion } from "framer-motion";
import { FaCommentAlt, FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import homebg1 from "../assets/bg1.jpg";

const Home = () => {
  const [displayedSubText, setDisplayedSubText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const phrases = [
    "Real-time collaboration.",
    "Q/A Sessions.",
    "Projects & resources.",
  ];

  useEffect(() => {
    const typeSubText = () => {
      const currentPhrase = phrases[currentPhraseIndex];
      if (charIndex < currentPhrase.length) {
        setDisplayedSubText((prev) => prev + currentPhrase[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setDisplayedSubText("");
          setCharIndex(0);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 1500);
      }
    };

    const subInterval = setTimeout(typeSubText, 100);
    return () => clearTimeout(subInterval);
  }, [charIndex, currentPhraseIndex, phrases]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0 }}
    >
      <div>
        <Header />

        {/* Main Hero Section */}
        <main
          style={{
            position: "relative",
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "#f9fafb",
            color: "#1e3a8a",
            fontFamily: "Poppins, sans-serif",
            height: "550px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: `url(${homebg1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              margin: "10px 0",
              color: "black",
              marginTop: "30px",
            }}
          >
            Connect with{" "}
            <span style={{ color: "#2563EB" }}>1,000+ developers</span> ready to
            help
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#6b7280",
              textAlign: "center",
              marginBottom: "20px",
              lineHeight: "1.6",
            }}
          >
            Join a supportive community where experienced developers <br />
            help juniors grow through{" "}
            <span style={{ fontWeight: "bold" }}>{displayedSubText}</span>
            <span
              style={{
                fontWeight: "bold",
                color: "#2563EB",
                animation: "blink 1s step-end infinite",
              }}
            >
              |
            </span>
          </p>
          {/* Call-to-Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            <button
              href="/get-started"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: "bold",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                textDecoration: "none",
                backgroundColor: "white",
                color: "#2563EB",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease, color 0.3s ease",
              }}
              onMouseOver={(e) => (
                (e.target.style.backgroundColor = "white"),
                (e.target.style.color = "#2563EB")
              )}
              onMouseOut={(e) => (
                (e.target.style.backgroundColor = "#2563EB"),
                (e.target.style.color = "white")
              )}
            >
              🚀 Get Started Now
            </button>

            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: "bold",
                border: "2px solid black",
                borderRadius: "5px",
                cursor: "pointer",
                textDecoration: "none",
                backgroundColor: "transparent",
                color: "black",
                transition: "background-color 0.3s ease, color 0.3s ease",
              }}
              onMouseOver={(e) => (
                (e.target.style.backgroundColor = "black"),
                (e.target.style.color = "#2563EB")
              )}
              onMouseOut={(e) => (
                (e.target.style.backgroundColor = "transparent"),
                (e.target.style.color = "black")
              )}
            >
              Browse Experts
            </button>
          </div>
          {/* search bar*/}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "80px",
            }}
          >
            <input
              style={{
                padding: "10px 15px",
                fontSize: "16px",
                border: "1px solid #d1d5db",
                borderRadius: "5px",
                width: "300px",
              }}
              type="text"
              placeholder="Describe your coding challenge or problem..."
            />
            <input
              style={{
                padding: "10px 15px",
                fontSize: "16px",
                border: "1px solid #d1d5db",
                borderRadius: "5px",
                width: "300px",
              }}
              type="text"
              placeholder="Technology (e.g., React, Python)"
            />
            <button
              style={{
                backgroundColor: "#2563EB",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
            >
              Find Help
            </button>
          </div>

          <a
            href="/advancesearch"
            style={{
              display: "block",
              marginTop: "1rem",
              color: "#2563EB",
              textDecoration: "none",
              letterSpacing: "0.1rem",
              fontWeight: "normal",
              fontSize: "1.2rem",
              transition: "color 0.3s ease",
              marginLeft: "300px",
            }}
            onMouseOver={(e) => (e.target.style.color = "black")}
            onMouseOut={(e) => (
              (e.target.style.backgroundColor = "transparent"),
              (e.target.style.color = "#2563EB")
            )}
          >
            Advanced search
          </a>
        </main>

        {/* What We Provide Section */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "4rem 2rem",
            textAlign: "center",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            What you'll find on UnityStack
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginTop: "1.5rem",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                ":hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <img
                src={img1}
                alt="Projects"
                style={{ width: "80%", height: "auto" }}
              />
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1E293B",
                  marginTop: "0.5rem",
                }}
              >
                Get Answers
              </h3>
              <p
                style={{
                  color: "#64748B",
                  lineHeight: "1.6",
                  fontSize: "0.9rem",
                }}
              >
                Get answers across multiple tech stacks. Find the nearest or
                best solution for your projects.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                ":hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <img
                src={img2}
                alt="Projects"
                style={{ width: "80%", height: "auto" }}
              />
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1E293B",
                  marginTop: "0.5rem",
                }}
              >
                Real-time collaboration
              </h3>
              <p
                style={{
                  color: "#64748B",
                  lineHeight: "1.6",
                  fontSize: "0.9rem",
                }}
              >
                Get immediate help through live coding sessions, code reviews,
                and pair programming with experienced developers.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                ":hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <img
                src={img3}
                alt="Projects"
                style={{ width: "80%", height: "auto" }}
              />
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1E293B",
                  marginTop: "0.5rem",
                }}
              >
                Find Projects
              </h3>
              <p
                style={{
                  color: "#64748B",
                  lineHeight: "1.6",
                  fontSize: "0.9rem",
                }}
              >
                Get project tasks done by others. Choose projects based on your
                skills and interests.
              </p>
            </div>
          </div>
        </section>

        {/* Expert Help Section */}
        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "60px 20px",
            backgroundColor: "#f9fafb",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {/* Text Content */}
          <div style={{ flex: "1", padding: "20px" }}>
            <h2
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "Black",
                marginBottom: "20px",
              }}
            >
              Expert Help from Vetted Developers
            </h2>
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "Black",
                marginBottom: "20px",
              }}
            >
              One-on-One live Session
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: "0",
                margin: "0",
                fontSize: "16px",
                lineHeight: "1.8",
                color: "#6b7280",
              }}
            >
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    marginRight: "10px",
                    color: "#1e293b",
                    fontSize: "20px",
                  }}
                >
                  💻
                </span>{" "}
                Debug with the help of an expert
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    marginRight: "10px",
                    color: "#1e293b",
                    fontSize: "20px",
                  }}
                >
                  📚
                </span>{" "}
                Personalize your learning experience
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    marginRight: "10px",
                    color: "#1e293b",
                    fontSize: "20px",
                  }}
                >
                  🧠
                </span>{" "}
                Get answers to complex problems
              </li>
            </ul>
            <button
              style={{
                marginTop: "20px",
                backgroundColor: "#2563EB",
                color: "#ffffff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1E40AF")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2563EB")}
            >
              <a
                href="/Getexperthelp"
                style={{ textDecoration: "none", color: "white" }}
              >
                Find an expert
              </a>
            </button>
          </div>

          {/* Image */}
          <div style={{ flex: "1", textAlign: "center" }}>
            <img
              src={mentorshipImage}
              alt="Mentorship"
              style={{ width: "90%", height: "auto" }}
            />
          </div>
        </section>

        {/* Popular Categories Section */}
        <section
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem" }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#1e3a8a",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Questions Asked in Popular Categories
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginTop: "2rem",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "1rem",
                backgroundColor: "white",
                border: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                ":hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  backgroundColor: "#EFF6FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                💻
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1E293B",
                }}
              >
                Frontend Development
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
                2,840 postings
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                borderRadius: "1rem",
                backgroundColor: "white",
                border: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                ":hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  backgroundColor: "#F5F3FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🖥️
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1E293B",
                }}
              >
                Backend Development
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
                2,420 postings
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                borderRadius: "1rem",
                backgroundColor: "white",
                border: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                ":hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  backgroundColor: "#ECFDF5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                📊
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1E293B",
                }}
              >
                Database Design
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
                1,950 postings
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                borderRadius: "1rem",
                backgroundColor: "white",
                border: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                ":hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  backgroundColor: "#FEF2F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🔧
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1E293B",
                }}
              >
                DevOps
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
                1,720 postings
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                borderRadius: "1rem",
                backgroundColor: "white",
                border: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                ":hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  backgroundColor: "#FFF7ED",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🌐
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1E293B",
                }}
              >
                Web Development
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
                3,150 postings
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                borderRadius: "1rem",
                backgroundColor: "white",
                border: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                ":hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  backgroundColor: "#F0FDF4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                💻
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1E293B",
                }}
              >
                System Architecture
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
                1,540 postings
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                borderRadius: "1rem",
                backgroundColor: "white",
                border: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                ":hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  backgroundColor: "#F0F9FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                📈
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1E293B",
                }}
              >
                Performance
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
                1,280 postings
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                borderRadius: "1rem",
                backgroundColor: "#2563EB",
                color: "white",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                ":hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <h3 style={{ fontSize: "2rem", fontWeight: "bold" }}>
                +10K Answers
              </h3>
              <p style={{ opacity: 0.9 }}>Available now!</p>
              <a
                href="/question"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "white",
                  textDecoration: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  marginTop: "1rem",
                  transition: "background-color 0.2s",
                  ":hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                View all
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Project Assessment Section */}
        <section
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "60px 20px",
            backgroundColor: "#F9FAFB",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {/* Left Section (Image Container) */}
          <div style={{ flex: "1", textAlign: "center" }}>
            <img
              src={Projectimage}
              alt="Projects"
              style={{ width: "90%", height: "auto" }}
            />
          </div>
          {/* Right Section (Text Content) */}
          <div
            style={{
              flex: "1",
              padding: "20px",
              textAlign: "left",
              marginLeft: "20px",
              marginRight: "10px",
              marginTop: "25px",
              marginBottom: "25px",
            }}
          >
            <h2
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "#1E293B",
                marginBottom: "20px",
              }}
            >
              Project assessment work
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: "0",
                margin: "0",
                fontSize: "16px",
                lineHeight: "1.8",
                color: "#64748B",
              }}
            >
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#EFF6FF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "10px",
                  }}
                >
                  📄
                </div>
                Find experts for on-demand code review
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#EFF6FF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "10px",
                  }}
                >
                  👥
                </div>
                Build features for your existing product
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#EFF6FF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "10px",
                  }}
                >
                  🚀
                </div>
                Turn your idea into an MVP
              </li>
            </ul>
            <button
              style={{
                marginTop: "20px",
                backgroundColor: "#2563EB",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1E40AF")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2563EB")}
            >
              GET STARTED
            </button>
          </div>
        </section>

        {/* Feedback Section */}
        <section>
          <motion.div
            style={{
              backgroundColor: "#EAF4FF",
              borderRadius: "12px",
              padding: "30px 20px",
              maxWidth: "1200px",
              margin: "40px auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ fontFamily: "Arial, sans-serif", color: "#004AAD" }}>
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Ready to Share Your UnityStack Experience?
              </h2>
            </div>
            <a
              href="/feedback"
              style={{
                backgroundColor: "#004AAD",
                color: "white",
                padding: "12px 24px",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                textDecoration: "none",
                transition: "transform 0.3s, background-color 0.3s",
              }}
              whileHover={{
                transform: "scale(1.05)",
                backgroundColor: "#003380",
              }}
            >
              <FaCommentAlt /> Give Feedback
            </a>
          </motion.div>
        </section>

        {/* Connect Section */}
        <section
          style={{
            background: "linear-gradient(to bottom, #2563EB, #F9FAFB)",
            padding: "60px 20px",
            textAlign: "center",
            fontFamily: "Poppins, sans-serif",
            color: "white",
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 20px",
              backgroundColor: "white",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transform: "rotate(15deg)",
            }}
          >
            <span
              style={{
                fontSize: "38px",
                fontWeight: "bold",
                color: "#2563EB",
                transform: "rotate(-15deg)",
              }}
            >
              {"< >"}
            </span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              marginBottom: "20px",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            Connect with expert developers and grow together
          </h2>

          {/* Subheading */}
          <p
            style={{ fontSize: "18px", color: "#E2E8F0", marginBottom: "30px" }}
          >
            Join our community of developers, share knowledge, and build amazing
            projects together
          </p>

          {/* Buttons */}
          <div
            style={{ display: "flex", justifyContent: "center", gap: "20px" }}
          >
            <a
              href="/get-started"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: "bold",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                textDecoration: "none",
                backgroundColor: "white",
                color: "#2563EB",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease, color 0.3s ease",
              }}
              onMouseOver={(e) => (
                (e.target.style.backgroundColor = "white"),
                (e.target.style.color = "#2563EB")
              )}
              onMouseOut={(e) => (
                (e.target.style.backgroundColor = "#2563EB"),
                (e.target.style.color = "white")
              )}
            >
              🚀 Get Started Now
            </a>

            <a
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: "bold",
                border: "2px solid white",
                borderRadius: "5px",
                cursor: "pointer",
                textDecoration: "none",
                backgroundColor: "transparent",
                color: "white",
                transition: "background-color 0.3s ease, color 0.3s ease",
              }}
              onMouseOver={(e) => (
                (e.target.style.backgroundColor = "white"),
                (e.target.style.color = "#2563EB")
              )}
              onMouseOut={(e) => (
                (e.target.style.backgroundColor = "transparent"),
                (e.target.style.color = "white")
              )}
            >
              💬 Contact Us
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </motion.div>
  );
};

export default Home;
