import React from "react";
import footerLogo from "../assets/Vector.png"; // Replace with your logo path
import { FaTwitter, FaGithub, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
import FeedbackPage from "../pages/Give feedback";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#F9FAFB",
        padding: "40px 20px",
        fontFamily: "Poppins, sans-serif",
        color: "#1E293B",
       
      }}
    >
      {/* Top Section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Logo and Description */}
        <div
          style={{
            flex: "1 1 200px",
            marginBottom: "20px",
          }}
        >
          <img
            src={footerLogo}
            alt="UnityStack Logo"
            style={{
              width: "120px",
              marginBottom: "15px",
            }}
          />
          <p
            style={{
              color: "#6B7280",
              fontSize: "14px",
              lineHeight: "1.8",
            }}
          >
            A supportive community where developers connect, collaborate, and grow together through expert help with a live session.
          </p>
          {/* Social Media Icons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <FaTwitter
              style={{
                fontSize: "18px",
                color: "#6B7280",
                cursor: "pointer",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#2563EB")}
              onMouseOut={(e) => (e.target.style.color = "#6B7280")}
            />
            <FaGithub
              style={{
                fontSize: "18px",
                color: "#6B7280",
                cursor: "pointer",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#2563EB")}
              onMouseOut={(e) => (e.target.style.color = "#6B7280")}
            />
            <FaLinkedin
              style={{
                fontSize: "18px",
                color: "#6B7280",
                cursor: "pointer",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#2563EB")}
              onMouseOut={(e) => (e.target.style.color = "#6B7280")}
            />
            <FaInstagram
              style={{
                fontSize: "18px",
                color: "#6B7280",
                cursor: "pointer",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#2563EB")}
              onMouseOut={(e) => (e.target.style.color = "#6B7280")}
            />
            <FaYoutube
              style={{
                fontSize: "18px",
                color: "#6B7280",
                cursor: "pointer",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#2563EB")}
              onMouseOut={(e) => (e.target.style.color = "#6B7280")}
            />
          </div>
        </div>

        {/* Links Section */}
        <div
          style={{
            flex: "1 1 150px",
            marginBottom: "20px",
          }}
        >
          <h4
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#1E293B",
              marginBottom: "15px",
              marginLeft: "80px",
            }}
          >
            Product
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              marginLeft: "80px",
              color: "#64748B",
              fontSize: "14px",
              lineHeight: "1.8",
            }}
          >
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>Documentation</li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>Features</li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>API Reference</li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>Resources</li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>Pricing</li>
          </ul>
        </div>

        <div
          style={{
            flex: "1 1 150px",
            marginBottom: "20px",
          }}
        >
          <h4
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#1E293B",
              marginBottom: "15px",
            }}
          >
            Company
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              color: "#64748B",
              fontSize: "14px",
              lineHeight: "1.8",
            }}
          >
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>About UnityStack</li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>Careers</li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>Blog</li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>Contact Us</li>
          </ul>
        </div>

        <div
          style={{
            flex: "1 1 150px",
            marginBottom: "20px",
          }}
        >
          <h4
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#1E293B",
              marginBottom: "15px",
            }}
          >
            Support
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              color: "#64748B",
              fontSize: "14px",
              lineHeight: "1.8",
            }}
          >
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>Help Center</li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>Community</li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>System Status</li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>Join Discord</li>
            <li src={FeedbackPage} style={{ cursor: "pointer", transition: "color 0.3s" }}>Give Feedback</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        style={{
          
          paddingTop: "20px",
          textAlign: "center",
          fontSize: "14px",
          color: "#94A3B8",
        }}
      >
        <p style={{ marginBottom: "10px" }}>© 2025 UnityStack. All rights reserved.</p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Code of Conduct</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
