import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaGlobe,
  FaYoutube,
  FaTwitter,
  FaFacebookF,
  FaLinkedin,
} from "react-icons/fa";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";

// Login Modal Component
const LoginModal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "90%",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Login Required</h2>
        <p style={{ marginBottom: "1.5rem" }}>
          Please login to start messaging this company.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              background: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onLogin}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              background: "#1d4ed8",
              color: "white",
              cursor: "pointer",
            }}
          >
            Login Now
          </button>
        </div>
      </div>
    </div>
  );
};

const glass = {
  background: "rgba(255,255,255,0.7)",
  boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.18)",
  backdropFilter: "blur(8px)",
};

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("blogs");
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Animation state
  const [tabAnim, setTabAnim] = useState("fadein 0.7s");
  useEffect(() => {
    setTabAnim("fadein 0.7s");
  }, [activeTab]);

  // Fetch company data
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/organizations/${id}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch company");
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true,
        });
        if (response.data) {
          setLoggedInUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoggedInUser(null);
      }
    };

    fetchCompany();
    fetchUser();
  }, [id]);


  const handleMessageClick = async () => {
    try {
      // Check if user is logged in
      const response = await axios.get("http://localhost:5000/api/user", {
        withCredentials: true,
      });

      if (response.data) {
        // Store the selected company ID in localStorage
        localStorage.setItem("selectedChatDeveloper", company._id);
        // Navigate to chat page
        navigate("/chat");
      } else {
        // Store the selected company ID in localStorage before showing login modal
        localStorage.setItem("selectedChatDeveloper", company._id);
        // User is not logged in, show login modal
        setShowLoginModal(true);
      }
    } catch (error) {
      // Store the selected company ID in localStorage before showing login modal
      localStorage.setItem("selectedChatDeveloper", company._id);
      // If error, user is not logged in
      setShowLoginModal(true);
    }
  };

  // Handle login modal actions
  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleLoginModalLogin = () => {
    // Store the current page and selected company info for redirect after login
    localStorage.setItem("returnTo", `/companiesprofile/${id}`);
    localStorage.setItem("returnAction", "chat");
    setShowLoginModal(false);
    navigate("/login");
  };

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#e0e7ff 0%,#f0fdfa 100%)",
        }}
      >
        Loading...
      </div>
    );
  if (!company) return <div>Company not found</div>;

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#e0e7ff 0%,#f0fdfa 100%)",
          padding: "2vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            ...glass,
            width: "320px",
            padding: "2rem 1.5rem",
            marginRight: "2vw",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
            transition: "box-shadow 0.3s",
            position: "sticky",
            top: "2vw",
          }}
        >
          <img
            src={company.profileImage || "/default-company.png"}
            alt="Company Logo"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 4px 24px #a5b4fc55",
              border: "4px solid #fff",
              transition: "transform 0.4s",
              marginBottom: "0.5rem",
              animation: "popin 0.7s",
            }}
          />
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
              margin: 0,
            }}
          >
            {company.companyName}
          </h3>
          <div
            style={{
              color: "#64748b",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5em",
            }}
          >
            <FaMapMarkerAlt /> {company.location}
          </div>
          <div style={{ color: "#64748b", fontSize: "0.95rem" }}>
            Operating Cities: {company.operatingCities?.join(", ")}
          </div>
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#2563eb",
              fontWeight: 500,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            🌐 Visit Website
          </a>
          <button
            onClick={handleMessageClick}
            style={{
              width: "100%",
              padding: "0.9em",
              background: "linear-gradient(90deg,#6366f1 0%,#06b6d4 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "1rem",
              marginTop: "0.5em",
              boxShadow: "0 2px 8px #06b6d455",
              cursor: "pointer",
              transition: "transform 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5em",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.04)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            💬 Message Company
          </button>
          <div style={{ marginTop: "1.5em" }}>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "1em" }}
            >
              {company.socialLinks?.youtube && (
                <a
                  href={company.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube
                    style={{
                      fontSize: "1.7em",
                      color: "#f87171",
                      background: "#fff",
                      borderRadius: "50%",
                      padding: "0.3em",
                      boxShadow: "0 2px 8px #f8717155",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </a>
              )}
              {company.socialLinks?.twitter && (
                <a
                  href={company.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter
                    style={{
                      fontSize: "1.7em",
                      color: "#38bdf8",
                      background: "#fff",
                      borderRadius: "50%",
                      padding: "0.3em",
                      boxShadow: "0 2px 8px #38bdf855",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </a>
              )}
              {company.socialLinks?.facebook && (
                <a
                  href={company.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF
                    style={{
                      fontSize: "1.7em",
                      color: "#2563eb",
                      background: "#fff",
                      borderRadius: "50%",
                      padding: "0.3em",
                      boxShadow: "0 2px 8px #2563eb55",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </a>
              )}
              {company.socialLinks?.linkedin && (
                <a
                  href={company.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin
                    style={{
                      fontSize: "1.7em",
                      color: "#0ea5e9",
                      background: "#fff",
                      borderRadius: "50%",
                      padding: "0.3em",
                      boxShadow: "0 2px 8px #0ea5e955",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </a>
              )}
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div
          style={{
            ...glass,
            flex: 1,
            minWidth: 0,
            padding: "2rem",
            animation: tabAnim,
            transition: "box-shadow 0.3s",
            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "2em",
              marginBottom: "2em",
              borderBottom: "1px solid #e0e7ef",
            }}
          >
            {["blogs", "services", "about"].map((tab) => (
              <button
                key={tab}
                style={{
                  background: "none",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "1.1em",
                  color: activeTab === tab ? "#2563eb" : "#64748b",
                  padding: "0.7em 0",
                  borderBottom:
                    activeTab === tab
                      ? "3px solid #2563eb"
                      : "3px solid transparent",
                  cursor: "pointer",
                  transition: "color 0.2s,border-bottom 0.2s",
                }}
                onClick={() => {
                  setActiveTab(tab);
                  setTabAnim("fadein 0.7s");
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* Blogs */}
          {activeTab === "blogs" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.5em",
                justifyItems: "center",
                animation: tabAnim,
              }}
            >
              {company.blogs?.length ? (
                company.blogs.map((blog, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(`/blog/${blog._id || i}`)}
                    style={{
                      cursor: "pointer",
                      background: "#fff",
                      borderRadius: "16px",
                      boxShadow: "0 2px 12px #2563eb11",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.18s, box-shadow 0.18s",
                      border: "1px solid #f1f5f9",
                      maxWidth: 340,
                      minWidth: 0,
                      width: "100%",
                      minHeight: 260,
                      position: "relative",
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
                      e.currentTarget.style.boxShadow = "0 8px 24px #2563eb22";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "0 2px 12px #2563eb11";
                    }}
                  >
                    <img
                      src={blog.image}
                      alt={blog.caption}
                      style={{
                        width: "100%",
                        height: "140px",
                        objectFit: "cover",
                        background: "#f1f5f9",
                      }}
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = "/default-blog.png";
                      }}
                    />
                    <div style={{ padding: "1em 1.1em", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ color: "#0ea5e9", fontWeight: 600, fontSize: "0.98em", marginBottom: 6 }}>
                        {blog.category || "Tips & Tricks"}
                      </div>
                      <div style={{ fontSize: "1.08em", fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                        {blog.caption}
                      </div>
                      <div style={{ color: "#64748b", fontSize: "0.93em", marginTop: "auto" }}>
                        By {blog.author || "Unknown"} on {blog.date}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: "#64748b", textAlign: "center" }}>
                  No blogs yet.
                </div>
              )}
            </div>
          )}
          {/* Services */}
          {activeTab === "services" && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2em",
                justifyContent: "center",
                animation: tabAnim,
              }}
            >
              {company.services?.length ? (
                company.services.map((service, i) => (
                  <div
                    key={i}
                    style={{
                      ...glass,
                      width: "220px",
                      padding: "1.5em",
                      textAlign: "center",
                      boxShadow: "0 2px 12px #06b6d411",
                      transition: "transform 0.3s",
                      animation: "fadein 0.7s",
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '80px',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.1em",
                        color: "#2563eb",
                      }}
                    >
                      {service.name}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: "#64748b", textAlign: "center" }}>
                  No services listed.
                </div>
              )}
            </div>
          )}
          {/* About Us */}
          {activeTab === "about" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2em",
                animation: tabAnim,
              }}
            >
              <div
                style={{ fontSize: "1.1em", color: "#334155", lineHeight: 1.7 }}
              >
                {company.about}
              </div>
            </div>
          )}
        </div>
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleLoginModalClose}
          onLogin={handleLoginModalLogin}
        />
      </div>
      <Footer />
      {/* Animations */}
      <style>{`
        @keyframes fadein { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:translateY(0);} }
        @keyframes popin { from{opacity:0;transform:scale(0.7);} to{opacity:1;transform:scale(1);} }
      `}</style>
    </>
  );
};

export default CompanyProfile;
