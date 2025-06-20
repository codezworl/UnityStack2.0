import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import {
  Search,
  LayoutGrid,
  List,
  Star,
  Clock,
  MessageSquare,
  Code,
  Bookmark,
  X,
  Calendar,
  User,
} from "lucide-react";
import axios from "axios";

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
          Please login to start chatting with developers.
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

// Add these helper functions before the GetHelp component
const getInitials = (firstName, lastName) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${firstInitial}${lastInitial}`;
};

const getRandomColor = (name) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
    '#1ABC9C', '#F1C40F', '#E67E22', '#D35400'
  ];
  
  // Use the name to generate a consistent color
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const AvatarFallback = ({ firstName, lastName, size = 50 }) => {
  const initials = getInitials(firstName, lastName);
  const backgroundColor = getRandomColor(`${firstName}${lastName}`);
  
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: `${size * 0.4}px`,
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}
    >
      {initials}
    </div>
  );
};

const GetHelp = () => {
  const [developers, setDevelopers] = useState([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState([]);
  const [visibleDevelopers, setVisibleDevelopers] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const navigate = useNavigate();

  // Popup messages
  const [popup, setPopup] = useState(null);

  // Search bar state
  const [searchQuery, setSearchQuery] = useState("");

  // NEW: Sorting & View Mode
  const [sortOption, setSortOption] = useState("Relevancy");
  const [viewMode, setViewMode] = useState("grid"); // or "list"

  // Filter states
  const [priceFilter, setPriceFilter] = useState(null);
  const [domainFilter, setDomainFilter] = useState(null);

  // NEW: Sidebar state for animations
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    skills: true,
  });
  const [hoveredFilter, setHoveredFilter] = useState(null);

  // Define domain options to match the expertise options from the profile page
  const domainOptions = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "Django",
    "Java",
    "SQL",
    "C++",
    "Swift",
    "Go",
    "MERN",
    "Django",
    "Flutter",
    "Ruby",
    "Ruby on Rails",
    "PHP",
    "Laravel",
    "C#",
    "ASP.NET",
    "SQL Server",
    "MySQL",
    "MongoDB",
    "PostgreSQL",
    "Oracle",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "Linux",
    "Windows",
    "MacOS",
    "iOS",
    "Android",
    "Web Development",
    "Mobile Development",
    "AI/ML",
    "React",
    "Node.js",
    "UI/UX",
    "Database",
    "DevOps",
  ];

  // Define price range options
  const priceRanges = [
    { label: "Under 2,000 PKR/hr", min: 0, max: 2000, icon: "💰" },
    { label: "2,000 - 4,000 PKR/hr", min: 2000, max: 4000, icon: "💎" },
    { label: "4,000 - 6,000 PKR/hr", min: 4000, max: 6000, icon: "🏆" },
    { label: "Above 6,000 PKR/hr", min: 6000, max: Infinity, icon: "👑" },
  ];

  // NEW: Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Function to clear all filters
  const clearFilters = () => {
    setPriceFilter(null);
    setDomainFilter(null);
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Function to check if any filter is applied
  const isFilterApplied = priceFilter !== null || domainFilter !== null;

  // Check if search is active
  const isSearchActive = searchQuery.trim() !== "";

  // Auto-dismiss popup after 3 seconds
  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => {
        setPopup(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  // Apply filters to developers
  useEffect(() => {
    let result = [...developers];

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((dev) => {
        const searchFields = {
          tags: dev.domainTags?.join(" ").toLowerCase() || "",
          name: `${dev.firstName} ${dev.lastName}`.toLowerCase(),
          bio: dev.bio?.toLowerCase() || "",
          expertise: dev.expertiseLevel?.toLowerCase() || "",
        };

        return (
          searchFields.tags.includes(query) ||
          searchFields.name.includes(query) ||
          searchFields.bio.includes(query) ||
          searchFields.expertise.includes(query)
        );
      });
    } else {
      // Apply price filter only if search is not active
      if (priceFilter !== null) {
        const { min, max } = priceRanges[priceFilter];
        result = result.filter((dev) => {
          const rate = parseInt(dev.hourlyRate || "0", 10);
          return rate >= min && rate < max;
        });
      }

      // Apply domain filter to check for expertise only if search is not active
      if (domainFilter !== null) {
        const selectedDomain = domainOptions[domainFilter].toLowerCase();
        result = result.filter((dev) => {
          // Check in domainTags
          if (dev.domainTags && Array.isArray(dev.domainTags)) {
            for (const tag of dev.domainTags) {
              if (tag.toLowerCase() === selectedDomain) {
                return true;
              }
            }
          }

          // Check in expertise array
          if (dev.expertise && Array.isArray(dev.expertise)) {
            for (const exp of dev.expertise) {
              if (exp.domain && exp.domain.toLowerCase() === selectedDomain) {
                return true;
              }
            }
          }

          return false;
        });
      }
    }

    setFilteredDevelopers(result);
  }, [developers, searchQuery, priceFilter, domainFilter]);

  // Fetch developers on mount
  useEffect(() => {
    const fetchDevelopers = async () => {
      const startTime = Date.now();
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/developers");

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format. Expected an array.");
        }

        // Process developer data to include expertise domains in domainTags
        const processedData = data.map((dev) => {
          // If developer already has expertiseLevel, use that
          let expertiseLevel = dev.expertiseLevel;

          // Create a copy of domainTags or initialize an empty array
          let domainTags = [...(dev.domainTags || [])];

          // Process expertise array if available
          if (
            dev.expertise &&
            Array.isArray(dev.expertise) &&
            dev.expertise.length > 0
          ) {
            // Find the maximum years of experience across domains
            const maxYears = Math.max(
              ...dev.expertise.map((exp) => exp.experienceYears || 0)
            );

            // Add expertise domains to domainTags if not already included
            dev.expertise.forEach((exp) => {
              if (exp.domain && !domainTags.includes(exp.domain)) {
                domainTags.push(exp.domain);
              }
            });

            // Map years to expertise level if not already set
            if (!expertiseLevel) {
              if (maxYears >= 10) {
                expertiseLevel = "Expert";
              } else if (maxYears >= 6) {
                expertiseLevel = "Senior";
              } else if (maxYears >= 3) {
                expertiseLevel = "Mid-Level";
              } else {
                expertiseLevel = "Junior";
              }
            }
          }

          // Default to Junior if no expertise info
          if (!expertiseLevel) {
            expertiseLevel = "Junior";
          }

          return { ...dev, expertiseLevel, domainTags };
        });

        setDevelopers(processedData);
        setFilteredDevelopers(processedData); // Initialize filtered list with all developers

        // Optional: success popup
        setPopup({
          message: "Developers fetched successfully",
          type: "success",
        });
      } catch (err) {
        console.error("Error fetching developers:", err);
        setError(err.message);
        setPopup({
          message: "Failed to fetch developers: " + err.message,
          type: "error",
        });
      } finally {
        // Ensure the loading message shows for at least 5 seconds
        const elapsed = Date.now() - startTime;
        const delay = Math.max(5000 - elapsed, 0);
        setTimeout(() => {
          setLoading(false);
          setIsLoading(false);
        }, delay);
      }
    };

    fetchDevelopers();
  }, []);

  /**
   * Enhanced dynamic search:
   * - Matches domainTags, firstName, lastName, and bio
   * - Debounced search to improve performance
   * - Case-insensitive matching
   */
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setFilteredDevelopers(developers);
      return;
    }

    // Enhanced search function with more fields and weighted results
    const searchResults = developers.filter((dev) => {
      const searchFields = {
        tags: dev.domainTags?.join(" ").toLowerCase() || "",
        name: `${dev.firstName} ${dev.lastName}`.toLowerCase(),
        bio: dev.bio?.toLowerCase() || "",
        expertise: dev.expertiseLevel?.toLowerCase() || "",
      };

      // Check if any field contains the search query
      return (
        searchFields.tags.includes(query) ||
        searchFields.name.includes(query) ||
        searchFields.bio.includes(query) ||
        searchFields.expertise.includes(query)
      );
    });

    // Sort results by relevance
    const sortedResults = searchResults.sort((a, b) => {
      const aRelevance = calculateRelevance(a, query);
      const bRelevance = calculateRelevance(b, query);
      return bRelevance - aRelevance;
    });

    setFilteredDevelopers(sortedResults);
  }, [searchQuery, developers]);

  // Helper function to calculate search result relevance
  const calculateRelevance = (developer, query) => {
    let score = 0;

    // Exact matches in tags get highest priority
    if (developer.domainTags?.some((tag) => tag.toLowerCase() === query)) {
      score += 10;
    }

    // Partial matches in tags
    if (
      developer.domainTags?.some((tag) => tag.toLowerCase().includes(query))
    ) {
      score += 5;
    }

    // Name matches
    const fullName =
      `${developer.firstName} ${developer.lastName}`.toLowerCase();
    if (fullName.includes(query)) {
      score += 3;
    }

    // Bio matches
    if (developer.bio?.toLowerCase().includes(query)) {
      score += 2;
    }

    // Expertise level matches
    if (developer.expertiseLevel?.toLowerCase().includes(query)) {
      score += 2;
    }

    return score;
  };

  // Update the search input UI for better user experience
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  /**
   * Sort the filtered developers based on sortOption.
   * Use useMemo to avoid re-sorting on every render unless dependencies change.
   */
  const sortedDevelopers = useMemo(() => {
    let devs = [...filteredDevelopers];
    switch (sortOption) {
      case "Available Now":
        // Put available devs first
        devs.sort((a, b) => {
          if (a.isAvailable && !b.isAvailable) return -1;
          if (!a.isAvailable && b.isAvailable) return 1;
          return 0;
        });
        break;

      case "Highest Rated":
        // Sort descending by rating
        devs.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;

      case "Most Experienced":
        // Sort by maximum experience years from expertise array
        devs.sort((a, b) => {
          // Get max experience years from a's expertise array
          const aMaxExp =
            a.expertise && Array.isArray(a.expertise)
              ? Math.max(
                  ...a.expertise.map((exp) =>
                    parseInt(exp.experienceYears || 0, 10)
                  ),
                  0
                )
              : 0;

          // Get max experience years from b's expertise array
          const bMaxExp =
            b.expertise && Array.isArray(b.expertise)
              ? Math.max(
                  ...b.expertise.map((exp) =>
                    parseInt(exp.experienceYears || 0, 10)
                  ),
                  0
                )
              : 0;

          return bMaxExp - aMaxExp;
        });
        break;

      // "Relevancy" or default -> no sorting
      default:
        break;
    }
    return devs;
  }, [filteredDevelopers, sortOption]);

  // Handle "Show More" pagination
  const handleShowMore = () => {
    setVisibleDevelopers((prev) => prev + 12);
  };

  // Handle changes in the sort dropdown
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setVisibleDevelopers(12); // reset pagination if needed
  };

  // Toggle between grid or list view
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  // Add new function to handle chat button click
  const handleChatClick = async (developer) => {
    try {
      // Check if user is logged in
      const response = await axios.get("http://localhost:5000/api/user", {
        withCredentials: true,
      });

      if (response.data) {
        // Store the selected developer ID in localStorage
        localStorage.setItem("selectedChatDeveloper", developer._id);
        // Navigate to chat page
        navigate("/chat");
      } else {
        // Store the selected developer ID in localStorage before showing login modal
        localStorage.setItem("selectedChatDeveloper", developer._id);
        // User is not logged in, show login modal
        setSelectedDeveloper(developer);
        setShowLoginModal(true);
      }
    } catch (error) {
      // Store the selected developer ID in localStorage before showing login modal
      localStorage.setItem("selectedChatDeveloper", developer._id);
      // If error, user is not logged in
      setSelectedDeveloper(developer);
      setShowLoginModal(true);
    }
  };

  // Add function to handle login modal actions
  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    setSelectedDeveloper(null);
  };

  const handleLoginModalLogin = () => {
    // Store the current page and selected developer info for redirect after login
    localStorage.setItem("returnTo", "/Getexperthelp");
    localStorage.setItem("returnAction", "chat");
    setShowLoginModal(false);
    navigate("/login");
  };

  // Update the developer cards to display expertise from both domainTags and expertise arrays
  const getExpertiseTags = (developer) => {
    const tags = [];

    // Add domain tags if available
    if (developer.domainTags && Array.isArray(developer.domainTags)) {
      tags.push(...developer.domainTags);
    }

    // Add expertise domains if available and not already included
    if (developer.expertise && Array.isArray(developer.expertise)) {
      developer.expertise.forEach((exp) => {
        if (exp.domain && !tags.includes(exp.domain)) {
          tags.push(exp.domain);
        }
      });
    }

    return tags;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div
        style={{
          backgroundColor: "#F8FAFC",
          minHeight: "100vh",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {/* Popup Notification */}
        {popup && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: 10000,
              padding: "1rem 1.5rem",
              backgroundColor: popup.type === "error" ? "#f8d7da" : "#d1e7dd",
              color: popup.type === "error" ? "#842029" : "#0f5132",
              borderRadius: "8px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {popup.message}
          </div>
        )}

        <Header />

        {/* Enhanced Search Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "1rem",
            marginLeft: "280px",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              width: "100%",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative", flex: 1 }}>
              <Search
                size={20}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748B",
                }}
              />
              <input
                type="text"
                placeholder="Search by skills, expertise, or developer name..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  fontSize: "16px",
                  borderRadius: "8px",
                  border: isSearchActive
                    ? "1px solid #2563EB"
                    : "1px solid #E2E8F0",
                  fontFamily: "Poppins, sans-serif",
                  transition: "all 0.2s ease",
                  backgroundColor: "white",
                  boxShadow: isSearchActive
                    ? "0 0 0 3px rgba(37, 99, 235, 0.1)"
                    : "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563EB";
                  e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  if (!isSearchActive) {
                    e.target.style.borderColor = "#E2E8F0";
                    e.target.style.boxShadow = "none";
                  }
                }}
              />
              {isSearchActive && (
                <button
                  onClick={clearSearch}
                  style={{
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
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Show search results count with filter information */}
        <div
          style={{
            textAlign: "center",
            color: "#64748B",
            marginTop: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          {isSearchActive && (
            <div>
              <span>
                Found {filteredDevelopers.length} developer
                {filteredDevelopers.length !== 1 ? "s" : ""}
                for "{searchQuery}"
              </span>
              <button
                onClick={clearSearch}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563EB",
                  marginLeft: "10px",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "0.875rem",
                  padding: "0",
                }}
              >
                Clear search
              </button>
            </div>
          )}

          {!isSearchActive && isFilterApplied && (
            <span>
              Found {filteredDevelopers.length} developer
              {filteredDevelopers.length !== 1 ? "s" : ""}
              with current filters
            </span>
          )}
        </div>

        {/* SORT & VIEW OPTIONS */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              maxWidth: "1200px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "0 1rem",
            }}
          >
            {/* Showing X experts */}
            <p
              style={{
                marginLeft: "270px",
                fontWeight: "normal",
                color: "#64748B",
                fontSize: "0.875rem",
              }}
            >
              Showing {filteredDevelopers.length} expert
              {filteredDevelopers.length !== 1 ? "s" : ""}
              {isSearchActive
                ? " (search results)"
                : isFilterApplied
                ? " (filtered)"
                : ""}
            </p>

            {/* Dropdown & View Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <select
                value={sortOption}
                onChange={handleSortChange}
                style={{
                  padding: "0.4rem",
                  borderRadius: "6px",
                  border: "1px solid #E2E8F0",
                  fontWeight: "bold",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                <option value="Relevancy">Sort by Relevancy</option>
                <option value="Available Now">Available Now</option>
                <option value="Highest Rated">Highest Rated</option>
                <option value="Most Experienced">Most Experienced</option>
              </select>

              {/* Grid/List Toggle */}
              <div>
                <button
                  onClick={() => toggleViewMode("grid")}
                  style={{
                    backgroundColor: viewMode === "grid" ? "#2563EB" : "white",
                    color: viewMode === "grid" ? "#fff" : "#2563EB",
                    padding: "0.5rem 1rem",
                    border: "1px solid #2563EB",
                    borderRadius: "6px",
                    marginRight: "4px",
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Grid
                </button>
                <button
                  onClick={() => toggleViewMode("list")}
                  style={{
                    backgroundColor: viewMode === "list" ? "#2563EB" : "white",
                    color: viewMode === "list" ? "#fff" : "#2563EB",
                    padding: "0.5rem 1rem",
                    border: "1px solid #2563EB",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
        >
          {/* Enhanced Sidebar with Glassmorphism */}
          <motion.aside
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              width: "320px",
              height: "fit-content",
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "20px",
              padding: "1.5rem",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              marginRight: "2rem",
              marginTop: "-70px",
              opacity: isSearchActive ? 0.7 : 1,
              position: "relative",
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
              overflow: "hidden",
            }}
          >
            {/* Glassmorphism overlay effect */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                borderRadius: "20px",
                pointerEvents: "none",
              }}
            />

            {isSearchActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.5rem",
                  borderRadius: "20px",
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  <Search size={24} color="white" />
                </div>
                <p
                  style={{
                    textAlign: "center",
                    color: "#4F46E5",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    fontSize: "1rem",
                  }}
                >
                  🔍 Search Active
                </p>
                <p
                  style={{
                    textAlign: "center",
                    color: "#6B7280",
                    fontSize: "0.875rem",
                    marginBottom: "1.5rem",
                    lineHeight: "1.5",
                  }}
                >
                  Filters are temporarily disabled during search
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearSearch}
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                >
                  Clear Search to Use Filters
                </motion.button>
              </motion.div>
            )}

            {/* Sidebar Header */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "12px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  <LayoutGrid size={20} color="white" />
                </div>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    margin: 0,
                  }}
                >
                  Smart Filters
                </h2>
              </motion.div>

              {/* Clear Filters Button */}
              {isFilterApplied && !isSearchActive && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
                    color: "#DC2626",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    marginBottom: "1.5rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    width: "100%",
                    boxShadow: "0 4px 15px rgba(220, 38, 38, 0.15)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <X size={16} style={{ marginRight: "8px" }} />
                  Clear All Filters
                </motion.button>
              )}

              {/* Price Range Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ marginBottom: "1.5rem" }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSection("price")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    marginBottom: "1rem",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    transition: "all 0.3s ease",
                    background: "rgba(255, 255, 255, 0.1)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                        borderRadius: "8px",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>💰</span>
                    </div>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#1F2937",
                        margin: 0,
                      }}
                    >
                      Price Range
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSections.price ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span style={{ fontSize: "18px", color: "#6B7280" }}>
                      ▼
                    </span>
                  </motion.div>
                </motion.button>

                <motion.div
                  initial={false}
                  animate={{
                    height: expandedSections.price ? "auto" : 0,
                    opacity: expandedSections.price ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ paddingLeft: "16px" }}>
                    {priceRanges.map((range, index) => (
                      <motion.label
                        key={range.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "0.8rem",
                          padding: "12px 16px",
                          borderRadius: "12px",
                          background:
                            priceFilter === index
                              ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
                              : "rgba(255, 255, 255, 0.05)",
                          border:
                            priceFilter === index
                              ? "1px solid rgba(102, 126, 234, 0.3)"
                              : "1px solid rgba(255, 255, 255, 0.1)",
                          cursor: isSearchActive ? "not-allowed" : "pointer",
                          opacity: isSearchActive ? 0.5 : 1,
                          transition: "all 0.3s ease",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={() => setHoveredFilter(`price-${index}`)}
                        onMouseLeave={() => setHoveredFilter(null)}
                      >
                        {/* Hover effect overlay */}
                        {hoveredFilter === `price-${index}` &&
                          !isSearchActive && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background:
                                  "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                                borderRadius: "12px",
                              }}
                            />
                          )}

                        <input
                          type="checkbox"
                          checked={priceFilter === index}
                          onChange={() => {
                            if (!isSearchActive) {
                              if (priceFilter === index) {
                                setPriceFilter(null);
                              } else {
                                setPriceFilter(index);
                                setDomainFilter(null);
                              }
                            }
                          }}
                          style={{
                            marginRight: "12px",
                            transform: "scale(1.2)",
                            accentColor: "#667eea",
                          }}
                          disabled={isSearchActive}
                        />
                        <span style={{ fontSize: "18px", marginRight: "8px" }}>
                          {range.icon}
                        </span>
                        <span
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "500",
                            color: "#374151",
                          }}
                        >
                          {range.label}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Skills/Expertise Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSection("skills")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    marginBottom: "1rem",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    transition: "all 0.3s ease",
                    background: "rgba(255, 255, 255, 0.1)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                        borderRadius: "8px",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px",
                      }}
                    >
                      <Code size={16} color="white" />
                    </div>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#1F2937",
                        margin: 0,
                      }}
                    >
                      Skills & Expertise
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSections.skills ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span style={{ fontSize: "18px", color: "#6B7280" }}>
                      ▼
                    </span>
                  </motion.div>
                </motion.button>

                <motion.div
                  initial={false}
                  animate={{
                    height: expandedSections.skills ? "auto" : 0,
                    opacity: expandedSections.skills ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      paddingLeft: "16px",
                      maxHeight: "300px",
                      overflowY: "auto",
                      scrollbarWidth: "thin",
                      scrollbarColor: "rgba(102, 126, 234, 0.3) transparent",
                    }}
                  >
                    {domainOptions.map((domain, index) => (
                      <motion.label
                        key={domain}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "0.6rem",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          background:
                            domainFilter === index
                              ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
                              : "rgba(255, 255, 255, 0.05)",
                          border:
                            domainFilter === index
                              ? "1px solid rgba(102, 126, 234, 0.3)"
                              : "1px solid rgba(255, 255, 255, 0.1)",
                          cursor: isSearchActive ? "not-allowed" : "pointer",
                          opacity: isSearchActive ? 0.5 : 1,
                          transition: "all 0.3s ease",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={() => setHoveredFilter(`domain-${index}`)}
                        onMouseLeave={() => setHoveredFilter(null)}
                      >
                        {/* Hover effect overlay */}
                        {hoveredFilter === `domain-${index}` &&
                          !isSearchActive && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background:
                                  "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                                borderRadius: "10px",
                              }}
                            />
                          )}

                        <input
                          type="checkbox"
                          checked={domainFilter === index}
                          onChange={() => {
                            if (!isSearchActive) {
                              if (domainFilter === index) {
                                setDomainFilter(null);
                              } else {
                                setDomainFilter(index);
                                setPriceFilter(null);
                              }
                            }
                          }}
                          style={{
                            marginRight: "10px",
                            transform: "scale(1.1)",
                            accentColor: "#667eea",
                          }}
                          disabled={isSearchActive}
                        />
                        <span
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: "500",
                            color: "#374151",
                          }}
                        >
                          {domain}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{
                  marginTop: "1.5rem",
                  padding: "16px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                      borderRadius: "8px",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "10px",
                    }}
                  >
                    <Star size={14} color="white" />
                  </div>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: "#1F2937",
                    }}
                  >
                    Quick Stats
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8rem",
                    color: "#6B7280",
                  }}
                >
                  <span>Total: {developers.length}</span>
                  <span>Filtered: {filteredDevelopers.length}</span>
                </div>
              </motion.div>
            </div>
          </motion.aside>

          {/* Main Developer Cards Section */}
          <div style={{ maxWidth: "1200px", width: "100%" }}>
            {isLoading ? (
              <p style={{ textAlign: "center", padding: "2rem" }}>
                Loading developers...
              </p>
            ) : error ? (
              <p style={{ color: "red" }}>Error: {error}</p>
            ) : sortedDevelopers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <p
                  style={{
                    color: "#64748B",
                    fontSize: "16px",
                    marginBottom: "1rem",
                  }}
                >
                  {isSearchActive
                    ? `No developers found for "${searchQuery}".`
                    : isFilterApplied
                    ? "No developers match your current filters."
                    : "No developers available."}
                </p>

                {isSearchActive ? (
                  <button
                    onClick={clearSearch}
                    style={{
                      backgroundColor: "#2563EB",
                      color: "white",
                      padding: "10px 16px",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Clear Search
                  </button>
                ) : (
                  isFilterApplied && (
                    <button
                      onClick={clearFilters}
                      style={{
                        backgroundColor: "#2563EB",
                        color: "white",
                        padding: "10px 16px",
                        borderRadius: "6px",
                        border: "none",
                        fontSize: "14px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Clear Filters
                    </button>
                  )
                )}
              </div>
            ) : (
              <div
                style={{
                  display: viewMode === "grid" ? "grid" : "block",
                  gridTemplateColumns:
                    viewMode === "grid"
                      ? "repeat(auto-fit, minmax(300px, 1fr))"
                      : "none",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                {sortedDevelopers
                  .slice(0, visibleDevelopers)
                  .map((dev, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        border: "1px solid #E2E8F0",
                        padding: "1.5rem",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        marginBottom: viewMode === "list" ? "1.5rem" : "0",
                      }}
                    >
                      {/* Profile Picture and Name */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        {dev.profileImage ? (
                          <img
                            src={dev.profileImage}
                            alt={`${dev.firstName} ${dev.lastName}`}
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <AvatarFallback
                            firstName={dev.firstName}
                            lastName={dev.lastName}
                            size={50}
                          />
                        )}
                        <div>
                          <h3
                            style={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              color: "#111827",
                            }}
                          >
                            {dev.firstName} {dev.lastName}
                          </h3>

                          {/* Rating Below Name */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              color: "#F59E0B",
                              fontSize: "14px",
                            }}
                          >
                            <Star size={16} />
                            <span>{dev.rating || "0.0"}</span>
                            <span
                              style={{ color: "#D97706", fontWeight: "bold" }}
                            >
                              ({dev.reviews || 0} reviews)
                            </span>
                          </div>
                        </div>

                        {/* Save Icon (Bookmark) */}
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            marginLeft: "auto",
                          }}
                        >
                          <Bookmark size={16} />
                        </button>
                      </div>

                      {/* Display Skill Tags */}
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          marginTop: "0.5rem",
                        }}
                      >
                        {getExpertiseTags(dev).map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              backgroundColor: "#F3F4F6",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              fontSize: "14px",
                              color: "#374151",
                              fontWeight: "500",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Availability and Hourly Rate */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginTop: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: dev.isAvailable
                              ? "#D1FAE5"
                              : "#DBEAFE",
                            color: dev.isAvailable ? "#065F46" : "#1E40AF",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          {dev.isAvailable
                            ? "✅ Available Now"
                            : "📅 Available in " + (dev.availability || "N/A")}
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#111827",
                          }}
                        >
                          {dev.hourlyRate
                            ? `${dev.hourlyRate} PKR/hr`
                            : "Price not set"}
                        </span>
                      </div>

                      {/* Short Description */}
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#374151",
                          lineHeight: "1.5",
                          marginTop: "0.5rem",
                        }}
                      >
                        {dev.bio ||
                          "Senior full-stack developer with experience in modern web technologies."}
                      </p>

                      {/* Action Buttons */}
                      {/* Action Buttons */}
                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          position: "relative",
                          zIndex: 1,
                          justifyContent: "center",
                          marginTop: "auto",
                          paddingTop: "1rem",
                        }}
                      >
                        <motion.button
                          whileHover={{
                            scale: 1.02,
                            boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onChatClick(dev)}
                          style={{
                            width: "140px",
                            height: "42px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            backgroundColor: "#4F46E5",
                            color: "white",
                            padding: "0 1.25rem",
                            borderRadius: "12px",
                            border: "none",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: "0 2px 4px rgba(79, 70, 229, 0.1)",
                          }}
                        >
                          <MessageSquare size={16} />
                          Chat Now
                        </motion.button>

                        <motion.button
                          whileHover={{
                            scale: 1.02,
                            backgroundColor: "rgba(79, 70, 229, 0.05)",
                            boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.1)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            (window.location.href = `/profile/${dev._id}`)
                          }
                          style={{
                            width: "140px",
                            height: "42px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            backgroundColor: "white",
                            color: "#4F46E5",
                            padding: "0 1.25rem",
                            borderRadius: "12px",
                            border: "1px solid #4F46E5",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            textDecoration: "none",
                          }}
                        >
                          <User size={16} />
                          View Profile
                        </motion.button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Show More Button */}
            {visibleDevelopers < sortedDevelopers.length && (
              <button
                onClick={handleShowMore}
                style={{
                  display: "block",
                  margin: "auto",
                  backgroundColor: "#2563EB",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
              >
                Show More
              </button>
            )}
          </div>
        </div>

        {/* Add Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleLoginModalClose}
          onLogin={handleLoginModalLogin}
        />

        <Footer />
      </div>
    </motion.div>
  );
};

export default GetHelp;
