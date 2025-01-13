import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";

import Header from "../components/Header";
import Footer from "../components/Footer";

const Companies = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  const styles = {
    container: {
      width: "90%",
      margin: "20px auto",
      display: "flex",
      gap: "20px",
    },
    sidebar: {
      width: "200px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      backgroundColor: "#fff",
    },
    sidebarHeading: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "10px",
    },
    tagCheckbox: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },
    filterButton: {
      width: "100%",
      marginTop: "20px",
      padding: "10px",
      border: "none",
      borderRadius: "5px",
      color: "#fff",
      cursor: "pointer",
      backgroundColor: selectedTags.length ? "#007bff" : "#ddd",
    },
    mainContent: {
      flex: 1,
    },
    searchBar: {
      display: "flex",
      alignItems: "center",
      marginBottom: "30px",
    },
    searchInput: {
      width: "100%",
      maxWidth: "400px",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "8px 0 0 8px", // Rounded only on left
    },
    searchButton: {
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "0 8px 8px 0", // Rounded only on right
      cursor: "pointer",
    },
    companyCard: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    companyInfo: {
      flex: 1,
      marginRight: "10px",
    },
    companyHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
    },
    companyLogo: {
      width: "50px",
      height: "50px",
      marginRight: "15px",
      borderRadius: "5px",
      backgroundColor: "#ddd",
    },
    companyTitle: {
      fontSize: "18px",
      fontWeight: "600",
    },
    companySubTitle: {
      fontSize: "14px",
      color: "#555",
    },
    companyDescription: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "10px",
    },
    tagsContainer: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    },
    tag: {
      backgroundColor: "#f1f1f1",
      padding: "5px 10px",
      borderRadius: "5px",
      fontSize: "12px",
    },
    viewProfileButton: {
      backgroundColor: "#fff",
      border: "1px solid #007bff",
      color: "#007bff",
      padding: "5px 10px",
      borderRadius: "5px",
      cursor: "pointer",
      textDecoration: "none",
    },
  };

  const companies = [
    {
      name: "Systems Limited",
      location: "Lahore, Karachi, Islamabad",
      industry: "IT Services, Software Development",
      description:
        "Pioneering IT services and consulting in Pakistan, Systems Limited specializes in creating solutions for global clients with advanced technology.",
      tags: ["java", "react", "cloud"],
    },
    {
      name: "NETSOL Technologies",
      location: "Lahore",
      industry: "Financial Technology, IT Services",
      description:
        "NETSOL is a leading provider of IT solutions for global asset finance and leasing, with expertise in financial technology solutions.",
      tags: ["java", "angular", ".net"],
    },
    {
      name: "10Pearls",
      location: "Karachi, Lahore, Islamabad",
      industry: "Custom Software Development, Digital Transformation",
      description:
        "10Pearls collaborates with enterprises to innovate and create scalable digital solutions, enhancing customer experiences worldwide.",
      tags: ["flutter", "AI", "blockchain"],
    },
  ];

  const tagsList = [
    "java",
    "react",
    "node.js",
    "angular",
    ".net",
    "python",
    "mongodb",
    "typescript",
    "next.js",
    "express",
    "flutter",
    "blockchain",
    "AI",
    "cloud",
    "graphql",
    "php",
    "ruby",
  ];

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const applyFilter = () => {
    setIsFiltered(true);
  };

  const resetFilter = () => {
    setSelectedTags([]);
    setIsFiltered(false);
  };

  const filteredCompanies = selectedTags.length
    ? companies.filter((company) =>
        company.tags.some((tag) => selectedTags.includes(tag))
      )
    : companies;

  return (
    <>
      <Header />

      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <h4 style={styles.sidebarHeading}>Filter by Language</h4>
          {tagsList.map((tag, index) => (
            <div key={index} style={styles.tagCheckbox}>
              <label>
                <input
                  type="checkbox"
                  value={tag}
                  onChange={() => handleTagChange(tag)}
                />{" "}
                {tag}
              </label>
            </div>
          ))}
          <button
            style={styles.filterButton}
            disabled={!selectedTags.length}
            onClick={applyFilter}
          >
            Filter
          </button>
          <button
            style={{
              ...styles.filterButton,
              marginTop: "10px",
              backgroundColor: "#ff6b6b",
            }}
            onClick={resetFilter}
          >
            Reset
          </button>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Search Bar */}
          <div style={styles.searchBar}>
            <input
              type="text"
              placeholder="Search all companies"
              style={styles.searchInput}
            />
            <button style={styles.searchButton}>Search</button>
          </div>

          {/* Company Cards */}
          {filteredCompanies.map((company, index) => (
            <div key={index} style={styles.companyCard}>
              <div style={styles.companyInfo}>
                <div style={styles.companyHeader}>
                  <div style={styles.companyLogo}></div>
                  <div>
                    <h5 style={styles.companyTitle}>{company.name}</h5>
                    <p style={styles.companySubTitle}>
                      <FaMapMarkerAlt /> {company.location} &nbsp;|&nbsp;
                      <FaBuilding /> {company.industry}
                    </p>
                  </div>
                </div>
                <p style={styles.companyDescription}>{company.description}</p>
                <div style={styles.tagsContainer}>
                  {company.tags.map((tag, i) => (
                    <span key={i} style={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link to="/companiesprofile" style={styles.viewProfileButton}>
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Companies;
