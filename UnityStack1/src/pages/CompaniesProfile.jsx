import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaMapMarkerAlt,
  FaGlobe,
  FaYoutube,
  FaTwitter,
  FaFacebookF,
  FaLinkedin,
} from "react-icons/fa";

import Header from "../components/Header";
import Footer from "../components/Footer";

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState("blogs");

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
    },
    blogHeader: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "10px",
      fontSize: "12px",
      color: "#666",
    },
    blogImage: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
    },
    blogCaption: {
      padding: "10px",
      fontSize: "16px",
      fontWeight: "600",
      textAlign: "center",
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

  const companyDetails = {
    name: "Systems Limited",
    address: "Lahore, Pakistan",
    operatingCities: "Lahore, Karachi, Islamabad",
    website: "https://www.systemsltd.com",
    socialLinks: {
      youtube: "https://www.youtube.com",
      twitter: "https://www.twitter.com",
      facebook: "https://www.facebook.com",
      linkedin: "https://www.linkedin.com",
    },
  };

  const blogPosts = [
    { img: "/path/to/image1.jpg", caption: "Product Launch Event", date: "Jan 10, 2025" },
    { img: "/path/to/image2.jpg", caption: "Annual General Meeting", date: "Dec 20, 2024" },
    { img: "/path/to/image3.jpg", caption: "Community Meetup", date: "Nov 15, 2024" },
    { img: "/path/to/image4.jpg", caption: "Tech Innovation Day", date: "Oct 10, 2024" },
    { img: "/path/to/image5.jpg", caption: "Employee Appreciation Day", date: "Sep 5, 2024" },
    { img: "/path/to/image6.jpg", caption: "Hackathon 2024", date: "Aug 20, 2024" },
  ];

  const services = [
    { name: "Web Development", logo: "🌐" },
    { name: "App Development", logo: "📱" },
    { name: "Cloud Solutions", logo: "☁️" },
    { name: "AI Integration", logo: "🤖" },
    { name: "Data Analytics", logo: "📊" },
    { name: "Cybersecurity", logo: "🔒" },
    { name: "Blockchain", logo: "⛓️" },
    { name: "E-commerce", logo: "🛒" },
    { name: "IoT Solutions", logo: "🌐" },
    { name: "DevOps", logo: "⚙️" },
    { name: "AR/VR", logo: "🕶️" },
    { name: "UI/UX Design", logo: "🎨" },
  ];

  return (
    <>
      <Header />
      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <img
            src="/path/to/company-logo.jpg" // Replace with actual company logo path
            alt="Company Logo"
            style={styles.profileImage}
          />
          <h3 style={styles.companyName}>{companyDetails.name}</h3>
          <p style={styles.address}>
            <FaMapMarkerAlt /> {companyDetails.address}
          </p>
          <p style={styles.address}>
            Operating Cities: {companyDetails.operatingCities}
          </p>
          <p style={styles.address}>
            <FaGlobe />{" "}
            <a
              href={companyDetails.website}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              Visit Website
            </a>
          </p>
          <div style={styles.socialAccounts}>
            <h5 style={styles.socialHeading}>Social Accounts</h5>
            <div style={styles.socialIcons}>
              <a href={companyDetails.socialLinks.youtube} target="_blank" rel="noreferrer" style={styles.socialIcon}>
                <FaYoutube />
              </a>
              <a href={companyDetails.socialLinks.twitter} target="_blank" rel="noreferrer" style={styles.socialIcon}>
                <FaTwitter />
              </a>
              <a href={companyDetails.socialLinks.facebook} target="_blank" rel="noreferrer" style={styles.socialIcon}>
                <FaFacebookF />
              </a>
              <a href={companyDetails.socialLinks.linkedin} target="_blank" rel="noreferrer" style={styles.socialIcon}>
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          <div style={styles.tabHeader}>
            <button
              style={{ ...styles.tabButton, ...(activeTab === "blogs" ? styles.activeTab : {}) }}
              onClick={() => setActiveTab("blogs")}
            >
              Blogs & Events
            </button>
            <button
              style={{ ...styles.tabButton, ...(activeTab === "services" ? styles.activeTab : {}) }}
              onClick={() => setActiveTab("services")}
            >
              Services
            </button>
            <button
              style={{ ...styles.tabButton, ...(activeTab === "about" ? styles.activeTab : {}) }}
              onClick={() => setActiveTab("about")}
            >
              About Us
            </button>
          </div>

          {activeTab === "blogs" && (
            <div style={styles.blogsSection}>
              {blogPosts.map((post, index) => (
                <div key={index} style={styles.blogCard}>
                  <div style={styles.blogHeader}>{post.date}</div>
                  <img src={post.img} alt="Blog Post" style={styles.blogImage} />
                  <div style={styles.blogCaption}>{post.caption}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "services" && (
            <div style={styles.servicesSection}>
              {services.map((service, index) => (
                <div key={index} style={styles.serviceCard}>
                  <div style={styles.serviceLogo}>{service.logo}</div>
                  <div style={styles.serviceName}>{service.name}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "about" && (
            <div style={styles.aboutUsSection}>
              <div style={styles.aboutUsText}>
                <p>
                  Systems Limited is a leading technology services company with decades of
                  experience in providing innovative solutions to a global clientele. Our mission is
                  to deliver cutting-edge services that help businesses grow and excel in the
                  digital age.
                </p>
                <p>
                  At Systems Limited, we believe in empowering our clients by offering tailored
                  solutions that meet their unique needs and objectives.
                </p>
              </div>
              <div>
                <img
                  src="/path/to/ceo-image.jpg" // Replace with the CEO's image path
                  alt="CEO"
                  style={styles.ceoImage}
                />
                <h5 style={styles.ceoName}>John Smith</h5>
                <p style={styles.ceoTitle}>CEO of Systems Limited</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompanyProfile;
