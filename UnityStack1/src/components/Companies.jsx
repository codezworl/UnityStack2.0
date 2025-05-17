import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { FaMapMarkerAlt, FaBuilding, FaSearch, FaTimes } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Define available service options for filtering
  const serviceOptions = [
    "Web Development", 
    "Mobile Development", 
    "UI/UX Design", 
    "AI/ML", 
    "DevOps", 
    "Cloud Solutions", 
    "Database Design", 
    "E-commerce", 
    "Digital Marketing", 
    "Blockchain", 
    "IoT Solutions", 
    "Quality Assurance", 
    "CyberSecurity"
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/organizations/all");
        const data = await res.json();
        console.log("🚀 Fetched companies:", data);
        const safeData = Array.isArray(data) ? data : [];
        setCompanies(safeData);
        setFilteredCompanies(safeData);
      } catch (err) {
        console.error("❌ Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setIsSearchActive(false);
      // If search is cleared, apply service filter if any
      if (selectedService !== null) {
        filterByService(selectedService);
      } else {
        setFilteredCompanies(companies);
      }
    } else {
      setIsSearchActive(true);
      // Filter by search query - improved to better match city and services
      const searchTerm = query.toLowerCase();
      const results = companies.filter(company => {
        // Check company name
        if (company.companyName && company.companyName.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Check location/address/city
        if ((company.location && company.location.toLowerCase().includes(searchTerm)) ||
            (company.address && company.address.toLowerCase().includes(searchTerm)) ||
            (company.operatingCities && Array.isArray(company.operatingCities) && 
             company.operatingCities.some(city => city.toLowerCase().includes(searchTerm)))) {
          return true;
        }
        
        // Check services
        if (company.selectedServices && Array.isArray(company.selectedServices) && 
            company.selectedServices.some(service => service.toLowerCase().includes(searchTerm))) {
          return true;
        }
        
        return false;
      });
      setFilteredCompanies(results);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchActive(false);
    if (selectedService !== null) {
      filterByService(selectedService);
    } else {
      setFilteredCompanies(companies);
    }
  };

  // Filter by service - improved to better match service names
  const filterByService = (serviceIndex) => {
    if (isSearchActive) return; // Don't apply service filter if search is active
    
    if (serviceIndex === selectedService) {
      // If clicking on already selected service, clear the filter
      setSelectedService(null);
      setFilteredCompanies(companies);
    } else {
      setSelectedService(serviceIndex);
      const serviceToFind = serviceOptions[serviceIndex].toLowerCase();
      
      const filtered = companies.filter(company => {
        if (!company.selectedServices || !Array.isArray(company.selectedServices)) {
          return false;
        }
        
        // Check for partial matches in service names
        return company.selectedServices.some(service => 
          service.toLowerCase().includes(serviceToFind) || 
          serviceToFind.includes(service.toLowerCase())
        );
      });
      
      setFilteredCompanies(filtered);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedService(null);
    setFilteredCompanies(companies);
  };

  // Add function to generate initials from company name
  const getInitials = (name) => {
    if (!name) return "CO";
    
    // Split by spaces and get first letter of each word
    const words = name.trim().split(/\s+/);
    
    if (words.length === 1) {
      // If single word, take first two letters
      return name.substring(0, 2).toUpperCase();
    }
    
    // Otherwise take first letter of first two words
    return (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase();
  };

  const styles = {
    container: {
      width: "90%",
      margin: "20px auto",
      display: "flex",
      gap: "20px",
    },
    sidebar: {
      width: "280px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      backgroundColor: "#fff",
      position: "relative",
      opacity: isSearchActive ? 0.7 : 1,
    },
    sidebarOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      zIndex: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      borderRadius: "8px"
    },
    sidebarHeading: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "20px",
      opacity: isSearchActive ? 0.5 : 1,
    },
    serviceItem: {
      display: "block",
      marginBottom: "10px",
      padding: "8px 10px",
      borderRadius: "6px",
      cursor: isSearchActive ? "not-allowed" : "pointer",
      opacity: isSearchActive ? 0.5 : 1,
    },
    serviceCheckbox: {
      marginRight: "8px",
    },
    clearFilterBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#EFF6FF",
      color: "#2563EB",
      border: "none",
      borderRadius: "6px",
      padding: "8px 12px",
      marginBottom: "15px",
      cursor: "pointer",
      fontSize: "0.9rem",
      width: "100%",
    },
    mainContent: {
      flex: 1,
    },
    searchBarContainer: {
      position: "relative",
      maxWidth: "600px",
      marginBottom: "30px",
    },
    searchInput: {
      width: "100%",
      padding: "12px 20px 12px 40px",
      border: isSearchActive ? "1px solid #2563EB" : "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "16px",
      boxShadow: isSearchActive ? "0 0 0 3px rgba(37, 99, 235, 0.1)" : "none",
    },
    searchIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#64748B",
    },
    clearSearchBtn: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "#EFF6FF",
      border: "none",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "#2563EB",
    },
    resultsInfo: {
      marginBottom: "20px",
      color: "#64748B",
      fontSize: "14px",
    },
    clearSearchText: {
      background: "none",
      border: "none",
      color: "#2563EB",
      marginLeft: "10px",
      cursor: "pointer",
      textDecoration: "underline",
      fontSize: "14px",
      padding: "0",
    },
    companyCard: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }
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
      width: "60px",
      height: "60px",
      marginRight: "15px",
      borderRadius: "8px",
      objectFit: "cover",
      border: "1px solid #eee",
    },
    companyTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#333",
    },
    companyLocation: {
      fontSize: "14px",
      color: "#555",
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
    companyDescription: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "15px",
    },
    tagsContainer: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      marginBottom: "10px",
    },
    tag: {
      backgroundColor: "#f1f1f1",
      padding: "5px 10px",
      borderRadius: "5px",
      fontSize: "12px",
      color: "#333",
    },
    viewProfileButton: {
      backgroundColor: "#fff",
      border: "1px solid #2563EB",
      color: "#2563EB",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "bold",
      transition: "background-color 0.2s",
      "&:hover": {
        backgroundColor: "#EFF6FF",
      }
    },
    noResults: {
      textAlign: "center",
      padding: "30px",
      color: "#64748B",
      border: "1px dashed #ccc",
      borderRadius: "8px",
      marginTop: "20px",
    },
    cityTags: {
      display: "flex",
      gap: "6px",
      flexWrap: "wrap",
      marginTop: "5px",
    },
    cityTag: {
      backgroundColor: "#E5E7EB",
      padding: "3px 8px",
      borderRadius: "4px",
      fontSize: "11px",
      color: "#4B5563",
    },
  };

  // Update company logo style and initials placeholder style
  const companyLogoStyle = {
    width: "60px",
    height: "60px",
    marginRight: "15px",
    borderRadius: "8px",
    objectFit: "cover",
    border: "1px solid #eee",
  };

  const initialsStyle = {
    ...companyLogoStyle,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF", // Light blue background
    color: "#2563EB", // Blue text
    fontWeight: "bold",
    fontSize: "18px",
  };

  return (
    <>
      <Header />

      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {isSearchActive && (
            <div style={styles.sidebarOverlay}>
              <p style={{ 
                textAlign: "center", 
                color: "#2563EB", 
                fontWeight: "500",
                marginBottom: "10px"
              }}>
                Filters are disabled during search
              </p>
              <button
                onClick={clearSearch}
                style={{
                  backgroundColor: "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                Clear Search to Use Filters
              </button>
            </div>
          )}
          
          <h4 style={styles.sidebarHeading}>Filter by Services</h4>
          
          {selectedService !== null && !isSearchActive && (
            <button 
              style={styles.clearFilterBtn}
              onClick={clearFilters}
            >
              <FaTimes size={14} style={{ marginRight: "8px" }} />
              Clear Filter
            </button>
          )}

          {serviceOptions.map((service, index) => (
            <label 
              key={index} 
              style={{
                ...styles.serviceItem,
                backgroundColor: selectedService === index ? "#EFF6FF" : "transparent",
              }}
            >
              <input
                type="checkbox"
                checked={selectedService === index}
                onChange={() => filterByService(index)}
                style={styles.serviceCheckbox}
                disabled={isSearchActive}
              />
              {service}
            </label>
          ))}
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Search Bar */}
          <div style={styles.searchBarContainer}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search for companies by name, location, or services..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={styles.searchInput}
            />
            {isSearchActive && (
              <button 
                style={styles.clearSearchBtn}
                onClick={clearSearch}
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>

          {/* Results information */}
          <div style={styles.resultsInfo}>
            {isSearchActive ? (
              <span>
                Found {filteredCompanies.length} compan{filteredCompanies.length !== 1 ? 'ies' : 'y'} 
                for "{searchQuery}"
                <button style={styles.clearSearchText} onClick={clearSearch}>
                  Clear search
                </button>
              </span>
            ) : selectedService !== null ? (
              <span>
                Showing {filteredCompanies.length} compan{filteredCompanies.length !== 1 ? 'ies' : 'y'} 
                for {serviceOptions[selectedService]}
              </span>
            ) : (
              <span>Showing all {filteredCompanies.length} companies</span>
            )}
          </div>

          {/* Company Cards */}
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company, index) => (
              <div key={index} style={styles.companyCard}>
                <div style={styles.companyInfo}>
                  <div style={styles.companyHeader}>
                    {company.logo ? (
                      <>
                        <img
                          src={`http://localhost:5000/uploads/${company.logo}`}
                          alt={company.companyName}
                          style={companyLogoStyle}
                          onError={e => {
                            // Replace with initials if image fails to load
                            e.target.parentNode.innerHTML = `<div style="${Object.entries(initialsStyle).map(([k, v]) => `${k}:${v}`).join(';')}">${getInitials(company.companyName)}</div>`;
                          }}
                        />
                      </>
                    ) : (
                      <div style={initialsStyle}>
                        {getInitials(company.companyName)}
                      </div>
                    )}
                    <div>
                      <h3 style={styles.companyTitle}>{company.companyName}</h3>
                      <p style={styles.companyLocation}>
                        <FaMapMarkerAlt size={14} /> 
                        {company.location || company.address || "Location not specified"}
                      </p>
                      {company.operatingCities && company.operatingCities.length > 0 && (
                        <div style={styles.cityTags}>
                          {company.operatingCities.map((city, idx) => (
                            <span key={idx} style={styles.cityTag}>
                              {city}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p style={styles.companyDescription}>
                    {company.aboutUs 
                      ? (company.aboutUs.length > 150 ? `${company.aboutUs.substring(0, 150)}...` : company.aboutUs)
                      : "No description available."}
                  </p>
                  
                  <div style={styles.tagsContainer}>
                    {company.selectedServices && company.selectedServices.map((service, idx) => (
                      <span key={idx} style={styles.tag}>
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  to={`/companiesprofile/${company._id}`}
                  style={styles.viewProfileButton}
                >
                  View Profile
                </Link>
              </div>
            ))
          ) : (
            <div style={styles.noResults}>
              <h4>No companies found</h4>
              <p>Try adjusting your search or filter criteria</p>
              {(isSearchActive || selectedService !== null) && (
                <button 
                  onClick={isSearchActive ? clearSearch : clearFilters}
                  style={{
                    backgroundColor: "#2563EB",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px", 
                    cursor: "pointer",
                    fontSize: "14px",
                    marginTop: "10px"
                  }}
                >
                  {isSearchActive ? "Clear Search" : "Clear Filter"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Companies;
