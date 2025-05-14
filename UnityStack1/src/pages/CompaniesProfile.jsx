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

import Header from "../components/header";
import Footer from "../components/footer";

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
        const response = await fetch("http://localhost:5000/api/user", {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch user');
        const userData = await response.json();
        setLoggedInUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchCompany();
    fetchUser();
  }, [id]);

  const handleMessageClick = () => {
    if (!loggedInUser) {
      setShowLoginModal(true);
    } else {
      localStorage.setItem('selectedChatDeveloper', company._id);
      navigate('/chat');
    }
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

          {/* Message Button */}
          <button
            className="btn btn-primary mt-3"
            onClick={handleMessageClick}
            style={{ width: '100%' }}
          >
            Message
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
      </div>
      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Required</h5>
                <button type="button" className="btn-close" onClick={() => setShowLoginModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Please login to message this company.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLoginModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => navigate('/login')}>Login Now</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showLoginModal && <div className="modal-backdrop fade show"></div>}

      <Footer />
    </>
  );
};

export default CompanyProfile;
