import React, { useState, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import mentorshipImage from "../assets/mentorship@2x.jpg";
import Projectimage from "../assets/freelance-job.png";
import { Link } from "react-router-dom";
import { Code, Rocket, MessageCircle } from "lucide-react";

const Home = () => {
  const [displayedSubText, setDisplayedSubText] = useState(""); // Typing animation for subheading
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0); // Current phrase index
  const [charIndex, setCharIndex] = useState(0); // Character index
  const phrases = [
    "Real-time collaboration.",
    "Q/A Sessions.",
    "Projects & resources.",
  ]; // Subheading phrases to cycle through

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
        }, 1500); // Pause before removing text
      }
    };

    const subInterval = setTimeout(typeSubText, 100);
    return () => clearTimeout(subInterval);
  }, [charIndex, currentPhraseIndex, phrases]);

  // Styles for the design
  const heroStyle = {
    position: "relative",
    textAlign: "center",
    padding: "30px 20px", // Adjusted padding to move elements up
    backgroundColor: "#f9fafb",
    color: "#1e3a8a",
    fontFamily: "Poppins, sans-serif",
    height: "500px", // Adjusted height
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", // Center align vertically
    alignItems: "center",
  };

  const headingStyle = {
    fontSize: "48px",
    fontWeight: "bold",
    margin: "10px 0", // Reduced margin for spacing
    color: "black",
  };

  const subtitleStyle = {
    fontSize: "20px", // Adjusted font size
    color: "#6b7280",
    textAlign: "center",
    marginBottom: "20px",
    lineHeight: "1.6",
  };

  const cursorStyle = {
    fontWeight: "bold",
    color: "#2563EB",
    animation: "blink 1s step-end infinite", // Blinking cursor effect
  };

  const searchContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "30px",
  };

  const inputStyle = {
    padding: "10px 15px",
    fontSize: "16px",
    border: "1px solid #d1d5db",
    borderRadius: "5px",
    width: "300px",
  };

  const searchButtonStyle = {
    backgroundColor: "#2563EB",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const sectionStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "60px 20px",
    backgroundColor: "#f9fafb",
    fontFamily: "Poppins, sans-serif",
  };

  const textContainerStyle = {
    flex: "1",
    padding: "20px",
  };

  const mentorshipHeadingStyle = {
    fontSize: "36px",
    fontWeight: "bold",
    color: "Black", // Updated to blue color
    marginBottom: "20px",
  };

  const subheadingStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "Black", // Updated to blue color
    marginBottom: "20px",
  };

  const listStyle = {
    listStyle: "none",
    padding: "0",
    margin: "0",
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#6b7280", // Gray color for the text
  };

  const listItemStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  };

  const iconStyle = {
    marginRight: "10px",
    color: "#1e293b", // Icon color
    fontSize: "20px",
  };

  const buttonStyle = {
    marginTop: "20px",
    backgroundColor: "#2563EB", // Blue color for the button
    color: "#ffffff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#1E40AF", // Darker blue on hover
  };

  const imageContainerStyle = {
    flex: "1",
    textAlign: "center",
  };

  const imageStyle = {
    width: "90%",
    height: "auto",
  };

  const categoriesStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "4rem 2rem",
  };

  const categoriesGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem",
  };

  const categoryCardStyle = {
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
  };

  const iconContainerStyle = (color) => ({
    width: "3rem",
    height: "3rem",
    borderRadius: "50%",
    backgroundColor: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const categoryNameStyle = {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1E293B",
  };

  const postingsStyle = {
    color: "#64748B",
    fontSize: "0.875rem",
  };

  const jobsCardStyle = {
    ...categoryCardStyle,
    backgroundColor: "#2563EB",
    color: "white",
  };

  const viewAllStyle = {
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
    ":hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  };

  const whatWeProvideSectionStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "4rem 2rem",
    textAlign: "center",
  };

  const whatWeProvideHeadingStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "3rem",
    textAlign: 'center',
  };

  const cardGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    marginTop: "2rem",
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s",
    ":hover": {
      transform: "translateY(-2px)",
    },
  };

  const illustrationStyle = {
    width: "200px",
    height: "160px",
    objectFit: "contain",
  };

  const cardTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1E293B",
  };

  const cardDescriptionStyle = {
    color: "#64748B",
    lineHeight: "1.6",
  };

  return (
    <div>
      <Header />

      {/* Main Hero Section */}
      <main style={heroStyle}>
        <h1 style={headingStyle}>
          Connect with{" "}
          <span style={{ color: "#2563EB" }}>1,000+ developers</span> ready to
          help
        </h1>

        <p style={subtitleStyle}>
          Join a supportive community where experienced developers <br />
          help juniors grow through{" "}
          <span style={{ fontWeight: "bold" }}>{displayedSubText}</span>
          <span style={cursorStyle}>|</span>
        </p>

        <div style={searchContainerStyle}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Describe your coding challenge or problem..."
          />
          <input
            style={inputStyle}
            type="text"
            placeholder="Technology (e.g., React, Python)"
          />
          <button style={searchButtonStyle}>Find Help</button>
        </div>

        <a
          href="/advancesearch"
          style={{
            display: "block",
            marginTop: "1rem",
            color: "#2563EB",
            textDecoration: "none",
          }}
        >
          Advanced search
        </a>
      </main>

      {/* What We Provide Section */}
      <section style={whatWeProvideSectionStyle}>
        <h2 style={whatWeProvideHeadingStyle}>
          What you'll find on UnityStack
        </h2>
        <div style={cardGridStyle}>
          <div style={cardStyle}>
            <img
              src="/public/section3A"
              alt="Technologies illustration"
              style={illustrationStyle}
            />
            <h3 style={cardTitleStyle}>Get Answers</h3>
            <p style={cardDescriptionStyle}>
              Get Answer in multiple stacks. find the nearest/best solution for
              your projects.
            </p>
          </div>

          <div style={cardStyle}>
            <img
              src="F:/Final Year Project/UnityStack2.0/UnityStack1/src/assets/section 3 - B.png"
              alt="Code review illustration"
              style={illustrationStyle}
            />
            <h3 style={cardTitleStyle}>Real-time collaboration</h3>
            <p style={cardDescriptionStyle}>
              Get immediate help through live coding sessions, code reviews, and
              pair programming with experienced developers.
            </p>
          </div>

          <div style={cardStyle}>
            <img
              src="F:/Final Year Project/UnityStack2.0/UnityStack1/src/assets/section 3 - C.png"
              alt="Setup illustration"
              style={illustrationStyle}
            />
            <h3 style={cardTitleStyle}>Find Projects</h3>
            <p style={cardDescriptionStyle}>
              Get Project tasks done form others and get project form
              organizations.
            </p>
          </div>
        </div>
      </section>

      {/* Expert Help Section */}
      <section style={sectionStyle}>
        {/* Text Content */}
        <div style={textContainerStyle}>
          <h2 style={mentorshipHeadingStyle}>
            Expert Help from Vetted Developers
          </h2>
          <h3 style={subheadingStyle}>One-on-one live mentorship</h3>
          <ul style={listStyle}>
            <li style={listItemStyle}>
              <span style={iconStyle}>💻</span> Debug with the help of an expert
            </li>
            <li style={listItemStyle}>
              <span style={iconStyle}>📚</span> Personalize your learning
              experience
            </li>
            <li style={listItemStyle}>
              <span style={iconStyle}>🧠</span> Get answers to complex problems
            </li>
          </ul>
          <button
            style={buttonStyle}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor =
                buttonHoverStyle.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = buttonStyle.backgroundColor)
            }
          >
            FIND AN EXPERT
          </button>
        </div>

        {/* Image */}
        <div style={imageContainerStyle}>
          <img src={mentorshipImage} alt="Mentorship" style={imageStyle} />
        </div>
      </section>

      {/* Popular Categories Section */}
      <section style={categoriesStyle}>
        <h2
          style={{ ...headingStyle, textAlign: "center", fontSize: "2.5rem" }}
        >
          Questions Asked in Popular Categories
        </h2>
        <div style={categoriesGridStyle}>
          <div style={categoryCardStyle}>
            <div style={iconContainerStyle("#EFF6FF")}>
              <span>💻</span>
            </div>
            <div>
              <h3 style={categoryNameStyle}>Frontend Development</h3>
              <p style={postingsStyle}>2,840 postings</p>
            </div>
          </div>

          <div style={categoryCardStyle}>
            <div style={iconContainerStyle("#F5F3FF")}>
              <span>🖥️</span>
            </div>
            <div>
              <h3 style={categoryNameStyle}>Backend Development</h3>
              <p style={postingsStyle}>2,420 postings</p>
            </div>
          </div>

          <div style={categoryCardStyle}>
            <div style={iconContainerStyle("#ECFDF5")}>
              <span>📊</span>
            </div>
            <div>
              <h3 style={categoryNameStyle}>Database Design</h3>
              <p style={postingsStyle}>1,950 postings</p>
            </div>
          </div>

          <div style={categoryCardStyle}>
            <div style={iconContainerStyle("#FEF2F2")}>
              <span>🔧</span>
            </div>
            <div>
              <h3 style={categoryNameStyle}>DevOps</h3>
              <p style={postingsStyle}>1,720 postings</p>
            </div>
          </div>

          <div style={categoryCardStyle}>
            <div style={iconContainerStyle("#FFF7ED")}>
              <span>🌐</span>
            </div>
            <div>
              <h3 style={categoryNameStyle}>Web Development</h3>
              <p style={postingsStyle}>3,150 postings</p>
            </div>
          </div>

          <div style={categoryCardStyle}>
            <div style={iconContainerStyle("#F0FDF4")}>
              <span>💻</span>
            </div>
            <div>
              <h3 style={categoryNameStyle}>System Architecture</h3>
              <p style={postingsStyle}>1,540 postings</p>
            </div>
          </div>

          <div style={categoryCardStyle}>
            <div style={iconContainerStyle("#F0F9FF")}>
              <span>📈</span>
            </div>
            <div>
              <h3 style={categoryNameStyle}>Performance</h3>
              <p style={postingsStyle}>1,280 postings</p>
            </div>
          </div>

          <div style={jobsCardStyle}>
            <h3 style={{ fontSize: "2rem", fontWeight: "bold" }}>
              +10K Answers
            </h3>
            <p style={{ opacity: 0.9 }}>Available now!</p>
            <a href="/jobs" style={viewAllStyle}>
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
         {/* Image */}
         <div style={imageContainerStyle}>
          <img src={Projectimage} alt="Projects" style={imageStyle} />
        </div>
        {/* Right Section (Text Content) */}
        <div
          style={{
            flex: "1",
            padding: "20px",
            textAlign: "left",
            marginLeft: "20px", // Add space on the left
            marginRight: "10px", // Add space on the right
            marginTop: "25px", // Optional: Add top margin
            marginBottom: "25px", // Optional: Add bottom margin
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
                <span role="img" aria-label="Code Review Icon">
                  📄
                </span>
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
                <span role="img" aria-label="Teamwork Icon">
                  👥
                </span>
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
                <span role="img" aria-label="Rocket Icon">
                  🚀
                </span>
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
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#1E40AF";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#2563EB";
            }}
          >
            GET STARTED
          </button>
        </div>
      </section>

      <section
        style={{
          background: "linear-gradient(to bottom, #2563EB, #F9FAFB)", // Blue to white gradient
          padding: "60px 20px",
          textAlign: "center",
          fontFamily: "Poppins, sans-serif",
          color: "white",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "80px", // Width of the square
            height: "80px", // Height of the square
            margin: "0 auto 20px", // Centering and spacing
            backgroundColor: "white", // Background color
            borderRadius: "16px", // Rounds the corners
            display: "flex", // Centers content
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Adds shadow
            transform: "rotate(15deg)", // Tilts the square
          }}
        >
          <span
            style={{
              fontSize: "38px",
              fontWeight: "bold",
              color: "#2563EB", // Blue color for the text
              transform: "rotate(-15deg)", // Rotates content back to align correctly
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
          style={{
            fontSize: "18px",
            color: "#E2E8F0",
            marginBottom: "30px",
          }}
        >
          Join our community of developers, share knowledge, and build amazing
          projects together
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
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
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.color = "#2563EB";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#2563EB";
              e.target.style.color = "white";
            }}
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
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.color = "#2563EB";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "white";
            }}
          >
            💬 Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
