import React from "react";
import { Link } from "react-router-dom";
import footerLogo from "../assets/Vector.png"; // Replace with your logo path
import { FaTwitter, FaGithub, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

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

        {/* Services Section */}
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
            Services
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
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>
              <Link to="/Getexperthelp" style={{ textDecoration: 'none', color: 'inherit' }}>
                Get Expert Help
              </Link>
            </li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>
              <Link to="/develporsighn1" style={{ textDecoration: 'none', color: 'inherit' }}>
                Become an Expert
              </Link>
            </li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>
              <Link to="/livesessionform" style={{ textDecoration: 'none', color: 'inherit' }}>
                Live Sessions
              </Link>
            </li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>
              <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                Code Review
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Section */}
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
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>
              <Link to="/aboutus" style={{ textDecoration: 'none', color: 'inherit' }}>
                About UnityStack
              </Link>
            </li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>
              <Link to="/careers" style={{ textDecoration: 'none', color: 'inherit' }}>
                Careers
              </Link>
            </li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>
              <Link to="/blog" style={{ textDecoration: 'none', color: 'inherit' }}>
                Blog
              </Link>
            </li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>
              <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Section */}
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
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>
              <Link to="/help-center" style={{ textDecoration: 'none', color: 'inherit' }}>
                Help Center
              </Link>
            </li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>
              <Link to="/community" style={{ textDecoration: 'none', color: 'inherit' }}>
                Community
              </Link>
            </li>
           
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>
              <a href="https://discord.gg/unitystack" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                Join Discord
              </a>
            </li>
            <li style={{ cursor: "pointer", transition: "color 0.3s" }}>
              <Link to="/feedback" style={{ textDecoration: 'none', color: 'inherit' }}>
                Give Feedback
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        style={{
          borderTop: "1px solid #E5E7EB",
          paddingTop: "20px",
          textAlign: "center",
          fontSize: "14px",
          color: "#94A3B8",
        }}
      >
        <p style={{ marginBottom: "10px" }}>© 2024 UnityStack. All rights reserved.</p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Link to="/privacy" style={{ textDecoration: 'none', color: 'inherit' }}>
            Privacy Policy
          </Link>
          <Link to="/terms" style={{ textDecoration: 'none', color: 'inherit' }}>
            Terms of Service
          </Link>
          <Link to="/code-of-conduct" style={{ textDecoration: 'none', color: 'inherit' }}>
            Code of Conduct
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
