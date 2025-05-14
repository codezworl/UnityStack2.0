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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Login Required</h2>
        <p style={{ marginBottom: '1.5rem' }}>Please login to start messaging this company.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onLogin}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              background: '#1d4ed8',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Login Now
          </button>
        </div>
      </div>
    </div>
  );
};

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("blogs");
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch company data
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/organizations/${id}`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch company');
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error('Error fetching company:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true
        });
        if (response.data) {
          setLoggedInUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoggedInUser(null);
      }
    };

    fetchCompany();
    fetchUser();
  }, [id]);

  // Updated handleMessageClick function with return-to-page functionality
  const handleMessageClick = async () => {
    try {
      // Check if user is logged in
      const response = await axios.get("http://localhost:5000/api/user", {
        withCredentials: true
      });

      if (response.data) {
        // Store the selected company ID in localStorage
        localStorage.setItem('selectedChatDeveloper', company._id);
        // Navigate to chat page
        navigate('/chat');
      } else {
        // Store the selected company ID in localStorage before showing login modal
        localStorage.setItem('selectedChatDeveloper', company._id);
        // User is not logged in, show login modal
        setShowLoginModal(true);
      }
    } catch (error) {
      // Store the selected company ID in localStorage before showing login modal
      localStorage.setItem('selectedChatDeveloper', company._id);
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
    localStorage.setItem('returnTo', `/companiesprofile/${id}`);
    localStorage.setItem('returnAction', 'chat');
    setShowLoginModal(false);
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;
  if (!company) return <div>Company not found</div>;

  const styles = {
    container: {
      display: "flex",
      gap: "20px",
      maxWidth: "1200px",
      margin: "20px auto",
    },
    sidebar: {
      width: "300px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      backgroundColor: "#fff",
      textAlign: "center",
    },
    profileImage: {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: "10px",
    },
    companyName: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "10px",
    },
    address: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "10px",
    },
    socialAccounts: {
      marginTop: "20px",
      textAlign: "center",
    },
    socialHeading: {
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "10px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
    },
    socialIcons: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      marginTop: "10px",
    },
    socialIcon: {
      fontSize: "24px",
      color: "#000",
      backgroundColor: "#f1f1f1",
      borderRadius: "50%",
      padding: "10px",
      cursor: "pointer",
      transition: "all 0.3s",
    },
    mainContent: {
      flex: 1,
      backgroundColor: "#fff",
      borderRadius: "8px",
      padding: "20px",
      border: "1px solid #ddd",
    },
    tabHeader: {
      display: "flex",
      gap: "20px",
      marginBottom: "20px",
      borderBottom: "1px solid #ddd",
      paddingBottom: "10px",
    },
    tabButton: {
      cursor: "pointer",
      padding: "10px",
      borderRadius: "8px",
      border: "none",
      background: "none",
      fontWeight: "600",
      color: "#007bff",
      outline: "none",
    },
    activeTab: {
      borderBottom: "3px solid #007bff",
      fontWeight: "700",
    },
    blogsSection: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    blogCard: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "#fff",
      marginBottom: "20px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    blogHeader: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "10px 15px",
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #eee",
    },
    blogDate: {
      fontSize: "14px",
      color: "#666",
      fontWeight: "500",
    },
    blogImage: {
      width: "100%",
      height: "300px",
      objectFit: "cover",
    },
    blogContent: {
      padding: "20px",
    },
    blogTitle: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "10px",
      color: "#333",
    },
    blogDescription: {
      fontSize: "16px",
      lineHeight: "1.6",
      color: "#666",
      marginBottom: "15px",
    },
    servicesSection: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      justifyContent: "center",
    },
    serviceCard: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      textAlign: "center",
      width: "calc(25% - 20px)", // Ensures 4 cards per row
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    serviceLogo: {
      fontSize: "30px",
      marginBottom: "10px",
    },
    serviceName: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#333",
    },
    aboutUsSection: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      padding: "20px",
    },
    ceoImage: {
      width: "200px",
      height: "200px",
      borderRadius: "8px",
      objectFit: "cover",
      border: "1px solid #ddd",
    },
    aboutUsText: {
      flex: 1,
      fontSize: "16px",
      color: "#555",
      lineHeight: "1.6",
    },
    ceoName: {
      fontSize: "18px",
      fontWeight: "600",
      marginTop: "10px",
      color: "#007bff",
      textAlign: "center",
    },
    ceoTitle: {
      fontSize: "14px",
      color: "#555",
      textAlign: "center",
    },
  };

  return (
    <>
      <Header />
      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <img
            src={company.profileImage || "/default-company.png"}
            alt="Company Logo"
            style={styles.profileImage}
          />
          <h3 style={styles.companyName}>{company.companyName}</h3>
          <p style={styles.address}>
            <FaMapMarkerAlt /> {company.location}
          </p>
          <p style={styles.address}>
            Operating Cities: {company.operatingCities?.join(', ')}
          </p>
          <p style={styles.address}>
            <FaGlobe />{" "}
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>
          </p>

          {/* Updated Message Button */}
          <button
            onClick={handleMessageClick}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            💬 Message Company
          </button>

          {/* Social Accounts */}
          <div style={styles.socialAccounts}>
            <h4 style={styles.socialHeading}>Social Accounts</h4>
            <div style={styles.socialIcons}>
              {company.socialLinks?.youtube && (
                <a href={company.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                  <FaYoutube style={styles.socialIcon} />
                </a>
              )}
              {company.socialLinks?.twitter && (
                <a href={company.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <FaTwitter style={styles.socialIcon} />
                </a>
              )}
              {company.socialLinks?.facebook && (
                <a href={company.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <FaFacebookF style={styles.socialIcon} />
                </a>
              )}
              {company.socialLinks?.linkedin && (
                <a href={company.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin style={styles.socialIcon} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          <div style={styles.tabHeader}>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === "blogs" && styles.activeTab),
              }}
              onClick={() => setActiveTab("blogs")}
            >
              Blogs
            </button>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === "services" && styles.activeTab),
              }}
              onClick={() => setActiveTab("services")}
            >
              Services
            </button>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === "about" && styles.activeTab),
              }}
              onClick={() => setActiveTab("about")}
            >
              About Us
            </button>
          </div>

          {activeTab === "blogs" && (
            <div style={styles.blogsSection}>
              {company.blogs?.map((blog, index) => (
                <div key={index} style={styles.blogCard}>
                  <div style={styles.blogHeader}>
                    <span style={styles.blogDate}>{blog.date}</span>
                  </div>
                  <img 
                    src={blog.image} 
                    alt={blog.caption} 
                    style={styles.blogImage} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-blog.png';
                    }}
                  />
                  <div style={styles.blogContent}>
                    <h3 style={styles.blogTitle}>{blog.caption}</h3>
                    <div
                      style={styles.blogDescription}
                      dangerouslySetInnerHTML={{ __html: blog.description }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "services" && (
            <div style={styles.servicesSection}>
              {company.services?.map((service, index) => (
                <div key={index} style={styles.serviceCard}>
                  <div style={styles.serviceLogo}>{service.logo}</div>
                  <div style={styles.serviceName}>{service.name}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "about" && (
            <div style={styles.aboutUsSection}>
              <div style={styles.aboutUsText}>{company.about}</div>
            </div>
          )}
        </div>

        {/* Updated Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleLoginModalClose}
          onLogin={handleLoginModalLogin}
        />
      </div>

      <Footer />
    </>
  );
};

export default CompanyProfile;
