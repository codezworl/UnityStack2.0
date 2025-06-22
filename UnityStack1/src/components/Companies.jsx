import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { FaMapMarkerAlt, FaBuilding, FaSearch, FaTimes, FaCode, FaMobileAlt, FaPaintBrush, FaRobot, FaServer, FaCloud, FaDatabase, FaShoppingCart, FaBullhorn, FaCube, FaNetworkWired, FaCheckCircle, FaShieldAlt, FaQuestionCircle, FaStar, FaRegStar, FaHeart } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 5;
  // Add organization ratings state
  const [organizationRatings, setOrganizationRatings] = useState({});
  const [ratingsLoading, setRatingsLoading] = useState(false);

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
    "CyberSecurity",
  ];

  // Add icons for each service
  const serviceIcons = [
    <FaCode />, // Web Development
    <FaMobileAlt />, // Mobile Development
    <FaPaintBrush />, // UI/UX Design
    <FaRobot />, // AI/ML
    <FaServer />, // DevOps
    <FaCloud />, // Cloud Solutions
    <FaDatabase />, // Database Design
    <FaShoppingCart />, // E-commerce
    <FaBullhorn />, // Digital Marketing
    <FaCube />, // Blockchain
    <FaNetworkWired />, // IoT Solutions
    <FaCheckCircle />, // Quality Assurance
    <FaShieldAlt />, // CyberSecurity
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

        // Fetch ratings for all organizations
        const organizationIds = safeData.map(org => org._id);
        await fetchOrganizationRatings(organizationIds);
      } catch (err) {
        console.error("❌ Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, []);

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredCompanies.length, isSearchActive, selectedService, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * companiesPerPage,
    currentPage * companiesPerPage
  );
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
      const results = companies.filter((company) => {
        // Check company name
        if (
          company.companyName &&
          company.companyName.toLowerCase().includes(searchTerm)
        ) {
          return true;
        }

        // Check location/address/city
        if (
          (company.location &&
            company.location.toLowerCase().includes(searchTerm)) ||
          (company.address &&
            company.address.toLowerCase().includes(searchTerm)) ||
          (company.operatingCities &&
            Array.isArray(company.operatingCities) &&
            company.operatingCities.some((city) =>
              city.toLowerCase().includes(searchTerm)
            ))
        ) {
          return true;
        }

        // Check services
        if (
          company.selectedServices &&
          Array.isArray(company.selectedServices) &&
          company.selectedServices.some((service) =>
            service.toLowerCase().includes(searchTerm)
          )
        ) {
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

      const filtered = companies.filter((company) => {
        if (
          !company.selectedServices ||
          !Array.isArray(company.selectedServices)
        ) {
          return false;
        }

        // Check for partial matches in service names
        return company.selectedServices.some(
          (service) =>
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
    return (words[0][0] + (words[1] ? words[1][0] : "")).toUpperCase();
  };

  // Fetch ratings for all organizations
  const fetchOrganizationRatings = async (organizationIds) => {
    try {
      setRatingsLoading(true);
      console.log('Fetching ratings for organizations:', organizationIds.length, 'organizations');
      const ratings = {};
      
      // Process organizations in smaller batches to avoid overwhelming the server
      const batchSize = 5;
      for (let i = 0; i < organizationIds.length; i += batchSize) {
        const batch = organizationIds.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i/batchSize) + 1}:`, batch);
        
        await Promise.all(
          batch.map(async (organizationId) => {
            try {
              console.log(`Fetching ratings for organization ${organizationId}...`);
              const response = await fetch(`http://localhost:5000/api/reviews/organization/${organizationId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                timeout: 10000 // 10 second timeout
              });
              
              console.log(`Response status for ${organizationId}:`, response.status);
              
              if (response.ok) {
                const data = await response.json();
                console.log(`✅ Ratings for organization ${organizationId}:`, data);
                ratings[organizationId] = {
                  averageRating: data.stats?.averageRating || 0,
                  totalReviews: data.stats?.totalReviews || 0
                };
              } else {
                const errorText = await response.text();
                console.error(`❌ Failed to fetch ratings for organization ${organizationId}:`, response.status, response.statusText, errorText);
                ratings[organizationId] = {
                  averageRating: 0,
                  totalReviews: 0
                };
              }
            } catch (error) {
              console.error(`❌ Error fetching ratings for organization ${organizationId}:`, error);
              ratings[organizationId] = {
                averageRating: 0,
                totalReviews: 0
              };
            }
          })
        );
        
        // Small delay between batches to avoid overwhelming the server
        if (i + batchSize < organizationIds.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      console.log('✅ All organization ratings fetched successfully:', Object.keys(ratings).length, 'organizations');
      console.log('Final ratings object:', ratings);
      setOrganizationRatings(ratings);
    } catch (error) {
      console.error('❌ Error in fetchOrganizationRatings:', error);
    } finally {
      setRatingsLoading(false);
    }
  };

  // Get organization rating helper function
  const getOrganizationRating = (organizationId) => {
    if (ratingsLoading) {
      return {
        averageRating: "Loading...",
        totalReviews: 0
      };
    }
    
    const rating = organizationRatings[organizationId];
    if (rating) {
      return {
        averageRating: rating.averageRating.toFixed(1),
        totalReviews: rating.totalReviews
      };
    } else {
      // Return default values if ratings haven't loaded yet
      return {
        averageRating: "0.0",
        totalReviews: 0
      };
    }
  };

  // Utility: Generate a random pastel color based on a string (company name)
  const getPastelColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 70%, 85%)`;
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
      border: "none",
      borderRadius: "16px",
      padding: "24px 20px 20px 20px",
      backgroundColor: "#fff",
      position: "relative",
      boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07)",
      opacity: isSearchActive ? 0.7 : 1,
      display: "flex",
      flexDirection: "column",
      minHeight: "600px",
      justifyContent: "space-between",
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
      borderRadius: "8px",
    },
    sidebarHeading: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "20px",
      opacity: isSearchActive ? 0.5 : 1,
    },
    serviceItem: {
      display: "flex",
      alignItems: "center",
      marginBottom: "12px",
      padding: "10px 12px",
      borderRadius: "8px",
      cursor: isSearchActive ? "not-allowed" : "pointer",
      opacity: isSearchActive ? 0.5 : 1,
      fontWeight: 500,
      fontSize: "15px",
      background: "none",
      border: "none",
      transition: "background 0.2s",
    },
    serviceCheckbox: {
      marginRight: "8px",
    },
    serviceIcon: {
      marginRight: "10px",
      fontSize: "18px",
      color: "#2563EB",
      minWidth: "18px",
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
      margin: "0 auto 30px auto",
      boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07)",
      borderRadius: "12px",
      background: "#fff",
      padding: "0",
    },
    searchInput: {
      width: "100%",
      padding: "16px 20px 16px 44px",
      border: "none",
      borderRadius: "12px",
      fontSize: "17px",
      background: "none",
      outline: "none",
      boxShadow: "none",
    },
    searchIcon: {
      position: "absolute",
      left: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#64748B",
      fontSize: "20px",
    },
    clearSearchBtn: {
      position: "absolute",
      right: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "#EFF6FF",
      border: "none",
      borderRadius: "50%",
      width: "28px",
      height: "28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "#2563EB",
      fontSize: "16px",
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
      border: "none",
      borderRadius: "16px",
      padding: "0",
      marginBottom: "28px",
      display: "flex",
      alignItems: "stretch",
      boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07)",
      background: "#fff",
      minHeight: "140px",
      position: "relative",
      overflow: "hidden",
    },
    cardLeft: {
      display: "flex",
      flex: 1,
      alignItems: "flex-start",
      padding: "32px 0 32px 32px",
      gap: "24px",
      minWidth: 0,
    },
    cardRight: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      justifyContent: "center",
      padding: "0 32px",
      minWidth: "160px",
      gap: "16px",
      background: "#fff",
    },
    companyInfo: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    companyHeader: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "2px",
    },
    companyLogo: {
      width: "60px",
      height: "60px",
      marginRight: 0,
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #fff",
      boxShadow: "0 2px 8px 0 rgba(37,99,235,0.07)",
      background: "#EFF6FF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: "22px",
      color: "#2563EB",
    },
    initialsCircle: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: "22px",
      color: "#2563EB",
      boxShadow: "0 2px 8px 0 rgba(37,99,235,0.07)",
      marginRight: 0,
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
      },
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
    needHelpCard: {
      background: "#F1F5F9",
      borderRadius: "12px",
      padding: "18px 16px",
      marginTop: "30px",
      textAlign: "center",
      boxShadow: "0 2px 8px 0 rgba(37,99,235,0.07)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
    },
    needHelpBtn: {
      background: "#2563EB",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "8px 16px",
      fontWeight: 600,
      fontSize: "14px",
      marginTop: "8px",
      cursor: "pointer",
      boxShadow: "0 2px 8px 0 rgba(37,99,235,0.07)",
    },
    ratingRow: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginBottom: "8px",
      marginTop: "2px",
    },
    reviewCount: {
      color: "#64748B",
      fontSize: "13px",
      marginLeft: "4px",
    },
    heartIcon: {
      color: "#E11D48",
      fontSize: "22px",
      marginLeft: "10px",
      cursor: "pointer",
      background: "#fff",
      borderRadius: "50%",
      boxShadow: "0 2px 8px 0 rgba(37,99,235,0.07)",
      padding: "6px",
      border: "1px solid #F1F5F9",
      transition: "background 0.2s",
    },
    paginationBar: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
      margin: "36px 0 24px 0",
    },
    paginationBtn: {
      background: "#fff",
      border: "1px solid #E5E7EB",
      color: "#2563EB",
      borderRadius: "6px",
      padding: "6px 14px",
      fontWeight: 600,
      fontSize: "15px",
      cursor: "pointer",
      transition: "background 0.2s, color 0.2s",
    },
    paginationBtnActive: {
      background: "#2563EB",
      color: "#fff",
      border: "1px solid #2563EB",
    },
    paginationBtnDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  };

  return (
    <>
      <Header />
      <div
        style={{
          width: "100%",
          textAlign: "center",
          marginBottom: 30,
          marginTop: 30,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#1E293B",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
          Find Your Perfect Tech Partner
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#64748B",
            fontWeight: 500,
            maxWidth: 550,
            margin: "0 auto",
          }}
        >
          Connect with top service providers and experts in technology,
          development, and design.
        </p>
      </div>

      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div>
            {isSearchActive && (
              <div style={styles.sidebarOverlay}>
                <p
                  style={{
                    textAlign: "center",
                    color: "#2563EB",
                    fontWeight: "500",
                    marginBottom: "10px",
                  }}
                >
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
                    fontSize: "0.9rem",
                  }}
                >
                  Clear Search to Use Filters
                </button>
              </div>
            )}

            <h4 style={styles.sidebarHeading}>Filter by Services</h4>

            {selectedService !== null && !isSearchActive && (
              <button style={styles.clearFilterBtn} onClick={clearFilters}>
                <FaTimes size={14} style={{ marginRight: "8px" }} />
                Clear Filter
              </button>
            )}

            {serviceOptions.map((service, index) => (
              <label
                key={index}
                style={{
                  ...styles.serviceItem,
                  backgroundColor:
                    selectedService === index ? "#EFF6FF" : "transparent",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedService === index}
                  onChange={() => filterByService(index)}
                  style={styles.serviceCheckbox}
                  disabled={isSearchActive}
                />
                <span style={styles.serviceIcon}>{serviceIcons[index]}</span>
                {service}
              </label>
            ))}
          </div>
          {/* Need Help Card */}
          <div style={styles.needHelpCard}>
            <FaQuestionCircle size={28} color="#2563EB" />
            <div style={{ fontWeight: 600, color: "#1E293B", fontSize: "16px" }}>Need Help?</div>
            <div style={{ color: "#64748B", fontSize: "14px" }}>
              Can't find what you're looking for? Our experts are here to help.
            </div>
            <button style={styles.needHelpBtn}>Get Expert Help</button>
          </div>
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
              <button style={styles.clearSearchBtn} onClick={clearSearch}>
                <FaTimes size={14} />
              </button>
            )}
          </div>

          {/* Results information */}
          <div style={styles.resultsInfo}>
            {isSearchActive ? (
              <span>
                Found {filteredCompanies.length} compan
                {filteredCompanies.length !== 1 ? "ies" : "y"}
                for "{searchQuery}"
                <button style={styles.clearSearchText} onClick={clearSearch}>
                  Clear search
                </button>
              </span>
            ) : selectedService !== null ? (
              <span>
                Showing {filteredCompanies.length} compan
                {filteredCompanies.length !== 1 ? "ies" : "y"}
                for {serviceOptions[selectedService]}
              </span>
            ) : (
              <span>Showing all {filteredCompanies.length} companies</span>
            )}
          </div>

          {/* Company Cards */}
          {paginatedCompanies.length > 0 ? (
            paginatedCompanies.map((company, index) => (
              <div
                key={index}
                style={{
                  border: "none",
                  borderRadius: "16px",
                  marginBottom: "28px",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 4px 24px 0 rgba(37,99,235,0.08)",
                  background: "linear-gradient(90deg, #f8fafc 60%, #f1f5f9 100%)",
                  minHeight: "140px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.18s, box-shadow 0.18s",
                  padding: "0 0 0 0",
                  cursor: "pointer",
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.015)";
                  e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(37,99,235,0.13)";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "0 4px 24px 0 rgba(37,99,235,0.08)";
                }}
              >
                {/* Logo/Initials */}
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "16px",
                    background: company.logo
                      ? "#fff"
                      : getPastelColor(company.companyName || "CO"),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: 28,
                    color: "#2563EB",
                    margin: "0 28px 0 32px",
                    boxShadow: "0 2px 8px 0 rgba(37,99,235,0.07)",
                    border: company.logo ? "2px solid #EFF6FF" : "none",
                    objectFit: "cover",
                    overflow: "hidden",
                  }}
                >
                  {company.logo ? (
                    <img
                      src={`http://localhost:5000/uploads/${company.logo}`}
                      alt={company.companyName}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "16px",
                        objectFit: "cover",
                      }}
                      onError={e => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    getInitials(company.companyName)
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>
                      {company.companyName}
                    </h3>
                    {company.operatingCities && company.operatingCities.length > 0 && (
                      <span style={{
                        background: "#e0e7ff",
                        color: "#2563eb",
                        fontWeight: 600,
                        fontSize: 12,
                        borderRadius: 6,
                        padding: "2px 10px",
                        marginLeft: 8,
                      }}>
                        {company.operatingCities[0]}
                      </span>
                    )}
                  </div>
                  <div style={{ color: "#64748b", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                    <FaMapMarkerAlt size={13} style={{ marginRight: 2 }} />
                    {company.location || company.address || "Location not specified"}
                  </div>
                  <div style={{ color: "#64748b", fontSize: 13, margin: "2px 0 0 0" }}>
                    {company.aboutUs
                      ? company.aboutUs.length > 80
                        ? `${company.aboutUs.substring(0, 80)}...`
                        : company.aboutUs
                      : "No description available."}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0 0 0" }}>
                    {[1, 2, 3, 4, 5].map(star => {
                      const rating = getOrganizationRating(company._id);
                      const avgRating = parseFloat(rating.averageRating);
                      return (avgRating >= star || (rating.averageRating === "Loading..." && 4 >= star)) ? (
                        <FaStar key={star} color="#FACC15" />
                      ) : (
                        <FaRegStar key={star} color="#FACC15" />
                      );
                    })}
                    <span style={{ 
                      color: "#64748B", 
                      fontSize: 13, 
                      marginLeft: 2,
                      fontStyle: getOrganizationRating(company._id).averageRating === "Loading..." ? "italic" : "normal"
                    }}>
                      {getOrganizationRating(company._id).totalReviews} reviews
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: 8 }}>
                    {company.selectedServices &&
                      company.selectedServices.map((service, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: "#EFF6FF",
                            color: "#2563EB",
                            fontWeight: 500,
                            fontSize: 13,
                            borderRadius: 6,
                            padding: "4px 12px",
                            marginBottom: 2,
                          }}
                        >
                          {service}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Right: View Profile and Heart */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    padding: "0 32px",
                    minWidth: "160px",
                    gap: "16px",
                    background: "transparent",
                    height: "100%",
                  }}
                >
                  <Link
                    to={`/companiesprofile/${company._id}`}
                    style={{
                      backgroundColor: "#fff",
                      border: "1.5px solid #2563EB",
                      color: "#2563EB",
                      padding: "10px 22px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      textDecoration: "none",
                      fontSize: "15px",
                      fontWeight: "bold",
                      boxShadow: "0 2px 8px 0 rgba(37,99,235,0.07)",
                      transition: "background 0.2s, color 0.2s",
                      marginBottom: 8,
                    }}
                  >
                    View Profile
                  </Link>
                  <FaHeart style={{
                    color: "#E11D48",
                    fontSize: "22px",
                    marginLeft: "10px",
                    cursor: "pointer",
                    background: "#fff",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px 0 rgba(37,99,235,0.07)",
                    padding: "6px",
                    border: "1px solid #F1F5F9",
                    transition: "background 0.2s",
                  }} />
                </div>
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
                    marginTop: "10px",
                  }}
                >
                  {isSearchActive ? "Clear Search" : "Clear Filter"}
                </button>
              )}
            </div>
          )}

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div style={styles.paginationBar}>
              <button
                style={{
                  ...styles.paginationBtn,
                  ...(currentPage === 1 ? styles.paginationBtnDisabled : {}),
                }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  style={{
                    ...styles.paginationBtn,
                    ...(currentPage === idx + 1 ? styles.paginationBtnActive : {}),
                  }}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                style={{
                  ...styles.paginationBtn,
                  ...(currentPage === totalPages ? styles.paginationBtnDisabled : {}),
                }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Companies;
