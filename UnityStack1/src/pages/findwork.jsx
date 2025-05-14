import React, { useEffect, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { FiGrid, FiFileText, FiBriefcase, FiClipboard, FiDollarSign, FiClock, FiUser } from "react-icons/fi";
import "chart.js/auto";

const FindWork = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidProposal, setBidProposal] = useState("");
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeProjects, setActiveProjects] = useState([]);
  const [loadingActive, setLoadingActive] = useState(false);
  const [activeError, setActiveError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(null); 
  const [userName, setUserName] = useState("");// Initialize userId state
  const [isSubmittingBid, setIsSubmittingBid] = useState(false); 
  const [bidderType, setBidderType] = useState("");



  const projectsPerPage = 5;

  const availableTags = [
    "#webdev", "#wordpress", "#seo", "#shopify", "#graphicdesign",
    "#ai", "#data", "#node", "#mern", "#figma", "#logo"
  ];
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user", { credentials: "include" });
        if (!res.ok) throw new Error("User fetch failed");
  
        const data = await res.json();
        setUserName(data.name);  // Set userName
        setUserRole(data.role);  // Set userRole
        setUserId(data.id);      // Set currentUserId
        console.log("✅ Logged in as:", data.name, data.role, data.id);
      } catch (err) {
        console.warn("❌ User not logged in:", err.message);
      }
    };
  
    fetchUser();
  }, []);
  
   // Initialize state

   useEffect(() => {
    if (userRole === "student") {
      setBidderType("Student");
    } else if (userRole === "organization") {
      setBidderType("Organization"); // Capitalized
    } else if (userRole === "developer") {
      setBidderType("Developer"); // Capitalized
    }
  }, [userRole]);
  
  

  

  

  useEffect(() => {
   
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/projects");
        setProjects(res.data.projects);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };

    
    fetchProjects();
  }, []);

  useEffect(() => {
    if (activeTab === "available") {
      fetchAvailableProjects();
    } else if (activeTab === "active") {
      fetchActiveProjects();
    }
  }, [activeTab]);

  const fetchAvailableProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("http://localhost:5000/api/projects/available", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message || "Failed to load projects. Please try again later.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveProjects = async () => {
    setLoadingActive(true);
    setActiveError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("http://localhost:5000/api/projects/assigned", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setActiveProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching active projects:", err);
      setActiveError(err.message || "Failed to load active projects");
      setActiveProjects([]);
    } finally {
      setLoadingActive(false);
    }
  };

 // Ensure that you collect and send these parameters from the form submission
 const handleBidSubmit = async (e) => {
  e.preventDefault();
  setIsSubmittingBid(true);

  try {
    // Get the current user info from the server
    const userResponse = await fetch("http://localhost:5000/api/user", { 
      credentials: "include" 
    });
    
    if (!userResponse.ok) {
      throw new Error("Failed to get user information");
    }

    const userData = await userResponse.json();
    
    // Create the bid data using the fresh user data
    const bidData = {
      amount: bidAmount,
      proposal: bidProposal
    };

    const response = await fetch(`http://localhost:5000/api/projects/${selectedProject._id}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(bidData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit bid");
    }

    // Success handling
    alert("Bid submitted successfully!");
    setShowBidModal(false);
    setBidAmount("");
    setBidProposal("");
    setSelectedProject(null);

  } catch (error) {
    console.error("Error submitting bid:", error);
    alert(error.message || "Failed to submit bid");
  } finally {
    setIsSubmittingBid(false);
  }
};













  
  
  

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const safeProjects = Array.isArray(projects) ? projects : [];
  const filteredProjects = safeProjects;
  const paginatedProjects = {
    last: Math.max(currentPage * projectsPerPage, 0),
    first: Math.max((currentPage * projectsPerPage) - projectsPerPage, 0),
    current: [],
    total: Math.max(Math.ceil(filteredProjects.length / projectsPerPage), 1)
  };

  paginatedProjects.current = filteredProjects.slice(paginatedProjects.first, paginatedProjects.last);

  return (
    <div style={{ padding: "24px" }}>
      {/* Tab Navigation */}
      <div style={{ 
        display: "flex", 
        gap: "32px",
        borderBottom: "1px solid #E5E7EB",
        marginBottom: "32px"
      }}>
        <button
          onClick={() => setActiveTab("overview")}
          style={{
            background: "none",
            border: "none",
            padding: "12px 0",
            color: activeTab === "overview" ? "#111827" : "#6B7280",
            fontWeight: "500",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderBottom: activeTab === "overview" ? "2px solid #2563EB" : "none",
            marginBottom: "-1px"
          }}
        >
          <FiGrid /> Overview
        </button>
        <button
          onClick={() => setActiveTab("available")}
          style={{
            background: "none",
            border: "none",
            padding: "12px 0",
            color: activeTab === "available" ? "#111827" : "#6B7280",
            fontWeight: "500",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderBottom: activeTab === "available" ? "2px solid #2563EB" : "none",
            marginBottom: "-1px"
          }}
        >
          <FiBriefcase /> Available Projects
        </button>
        <button
          onClick={() => setActiveTab("active")}
          style={{
            background: "none",
            border: "none",
            padding: "12px 0",
            color: activeTab === "active" ? "#111827" : "#6B7280",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderBottom: activeTab === "active" ? "2px solid #2563EB" : "none",
            marginBottom: "-1px"
          }}
        >
          <FiClipboard /> Active Projects
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          style={{
            background: "none",
            border: "none",
            padding: "12px 0",
            color: activeTab === "invoices" ? "#111827" : "#6B7280",
            fontWeight: "500",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderBottom: activeTab === "invoices" ? "2px solid #2563EB" : "none",
            marginBottom: "-1px"
          }}
        >
          <FiFileText /> Invoices
        </button>
      </div>

      {activeTab === "overview" && (
          <div>
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "600",
            marginBottom: "8px",
            color: "#111827"
          }}>
            Hi {userName}!
          </h1>
          <p style={{ 
            fontSize: "16px", 
            color: "#6B7280",
            marginBottom: "32px"
          }}>
            Welcome to Your Dashboard. Track your progress and manage your work efficiently!
          </p>

          {/* Stats Cards */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: "24px",
            marginBottom: "32px"
          }}>
            <Card style={{ 
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <Card.Body>
                <h3 style={{ 
                  fontSize: "20px",
                  fontWeight: "500",
                  color: "#111827",
                  marginBottom: "16px"
                }}>
                  Completed Jobs
                </h3>
                <p style={{ 
                  fontSize: "36px",
                  fontWeight: "600",
                  color: "#2563EB",
                  margin: "0"
                }}>
                  0
                </p>
              </Card.Body>
            </Card>

            <Card style={{ 
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <Card.Body>
                <h3 style={{ 
                  fontSize: "20px",
                  fontWeight: "500",
                  color: "#111827",
                  marginBottom: "16px"
                }}>
                  Active Projects
                </h3>
                <p style={{ 
                  fontSize: "36px",
                  fontWeight: "600",
                  color: "#2563EB",
                  margin: "0"
                }}>
                  0
                </p>
                <a href="#" style={{ 
                  color: "#2563EB",
                  textDecoration: "none",
                  fontSize: "14px",
                  display: "block",
                  marginTop: "8px"
                }}>
                  View Detail
                </a>
              </Card.Body>
            </Card>

            <Card style={{ 
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <Card.Body>
                <h3 style={{ 
                  fontSize: "20px",
                  fontWeight: "500",
                  color: "#111827",
                  marginBottom: "16px"
                }}>
                  Your Applied Jobs
                </h3>
                <p style={{ 
                  fontSize: "36px",
                  fontWeight: "600",
                  color: "#2563EB",
                  margin: "0"
                }}>
                  0
                </p>
                <a href="#" style={{ 
                  color: "#2563EB",
                  textDecoration: "none",
                  fontSize: "14px",
                  display: "block",
                  marginTop: "8px"
                }}>
                            View Detail
                          </a>
                      </Card.Body>
                    </Card>
                  </div>

          {/* Finances Section */}
          <Card style={{ 
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px"
          }}>
            <Card.Body>
              <div style={{ 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "24px"
              }}>
                <div>
                  <h3 style={{ 
                    fontSize: "20px",
                    fontWeight: "500",
                    color: "#111827",
                    marginBottom: "8px"
                  }}>
                    Your Earnings
                  </h3>
                  <p style={{ 
                    fontSize: "14px",
                    color: "#6B7280",
                    margin: "0"
                  }}>
                    Your Total Income since you joined
                  </p>
                </div>
                <a href="#" style={{ 
                  color: "#2563EB",
                  textDecoration: "none",
                  fontSize: "14px"
                }}>
                  View Invoices
                </a>
              </div>

              <h2 style={{ 
                fontSize: "36px",
                fontWeight: "600",
                color: "#2563EB",
                marginBottom: "24px"
              }}>
                Rs 0
              </h2>

              <div style={{ 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px"
              }}>
                <span style={{ color: "#6B7280" }}>Pending</span>
                <span style={{ color: "#2563EB", fontWeight: "500" }}>Rs 0</span>
            </div>

              <div style={{ 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ color: "#6B7280" }}>Cash Account Balance</span>
                <Button
                  style={{
                    backgroundColor: "#2563EB",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Withdraw
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Chart Section */}
          <Card style={{ 
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
                  <Card.Body>
              <h3 style={{ 
                fontSize: "20px",
                fontWeight: "500",
                color: "#111827",
                marginBottom: "24px"
              }}>
                Your Finances
              </h3>
              <div style={{ height: "300px" }}>
                      <Bar
                        data={{
                          labels: ["Jan", "Feb", "Mar", "Apr"],
                          datasets: [
                            {
                              label: "Earnings (PKR)",
                              data: [0, 0, 0, 0],
                        backgroundColor: "#2563EB",
                        borderRadius: 8,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                        grid: {
                          color: "#E5E7EB"
                        }
                            },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                          },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
      )}

      {activeTab === "available" && (
        <div style={{ padding: "24px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "24px"
          }}>
            <div>
              <h2 style={{ 
                fontSize: "24px", 
                fontWeight: "600",
                marginBottom: "8px"
              }}>Available Projects</h2>
              <p style={{ color: "#6B7280" }}>Find and bid on projects that match your skills</p>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "6px",
                  width: "300px"
                }}
              />
            </div>
          </div>

          <div style={{ 
            display: "flex", 
            gap: "12px", 
            flexWrap: "wrap",
            marginBottom: "24px"
          }}>
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "none",
                  backgroundColor: selectedTags.includes(tag) ? "#2563EB" : "#F3F4F6",
                  color: selectedTags.includes(tag) ? "white" : "#4B5563",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p>Loading projects...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#DC2626" }}>
              <p>{error}</p>
              <button
                onClick={fetchAvailableProjects}
                style={{
                  marginTop: "16px",
                  padding: "8px 16px",
                  backgroundColor: "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Try Again
              </button>
            </div>
          ) : paginatedProjects.current.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "48px 0",
              backgroundColor: "#F9FAFB",
              borderRadius: "12px",
              border: "1px solid #E5E7EB"
            }}>
              <div style={{ 
                width: "64px",
                height: "64px",
                margin: "0 auto 16px",
                backgroundColor: "#E5E7EB",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <FiBriefcase size={24} color="#9CA3AF" />
              </div>
              <h3 style={{ 
                fontSize: "18px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px"
              }}>No Projects Available</h3>
              <p style={{ 
                color: "#6B7280",
                maxWidth: "400px",
                margin: "0 auto"
              }}>
                There are currently no available projects matching your criteria. Please check back later or adjust your search filters.
              </p>
            </div>
          ) : (
            <>
              <div style={{ 
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "24px"
              }}>
                {paginatedProjects.current.map((project) => (
                  <div
                    key={project._id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      overflow: "hidden",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    onClick={() => {
                      setSelectedProject(project);
                      setShowBidModal(true);
                    }}
                  >
                    <div style={{ padding: "20px" }}>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "16px"
                      }}>
                        <div>
                          <h3 style={{ 
                            fontSize: "18px",
                            fontWeight: "600",
                            marginBottom: "4px"
                          }}>{project.title}</h3>
                          <p style={{ 
                            color: "#6B7280",
                            fontSize: "14px",
                            margin: "0"
                          }}>{project.companyName}</p>
                        </div>
                        <span style={{
                          backgroundColor: "#E5E7EB",
                          color: "#374151",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500"
                        }}>
                          {project.bids?.length || 0} bids
                        </span>
                      </div>

                      <p style={{ 
                        color: "#4B5563",
                        fontSize: "14px",
                        marginBottom: "16px",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}>{project.description}</p>

                      <div style={{ 
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "16px"
                      }}>
                        {project.skills.map((skill, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: "#F3F4F6",
                              color: "#4B5563",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px"
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div style={{ 
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        padding: "16px 0",
                        borderTop: "1px solid #E5E7EB"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FiDollarSign />
                          <span style={{ fontSize: "14px" }}>Rs. {project.budget}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FiClock />
                          <span style={{ fontSize: "14px" }}>
                            {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {paginatedProjects.current.length > 0 && (
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  gap: "16px",
                  marginTop: "32px"
                }}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB",
                      backgroundColor: "white",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      opacity: currentPage === 1 ? 0.5 : 1
                    }}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {paginatedProjects.total}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(paginatedProjects.total, p + 1))}
                    disabled={currentPage === paginatedProjects.total}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB",
                      backgroundColor: "white",
                      cursor: currentPage === paginatedProjects.total ? "not-allowed" : "pointer",
                      opacity: currentPage === paginatedProjects.total ? 0.5 : 1
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "active" && (
        <div style={{ padding: "24px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "24px"
          }}>
            <div>
              <h2 style={{ 
                fontSize: "24px", 
                fontWeight: "600",
                marginBottom: "8px"
              }}>Active Projects</h2>
              <p style={{ color: "#6B7280" }}>Projects assigned to you</p>
            </div>
          </div>

          {loadingActive ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p>Loading active projects...</p>
            </div>
          ) : activeError ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#DC2626" }}>
              <p>{activeError}</p>
              <button
                onClick={fetchActiveProjects}
                style={{
                  marginTop: "16px",
                  padding: "8px 16px",
                  backgroundColor: "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Try Again
              </button>
            </div>
          ) : activeProjects.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "48px 0",
              backgroundColor: "#F9FAFB",
              borderRadius: "12px",
              border: "1px solid #E5E7EB"
            }}>
              <div style={{ 
                width: "64px",
                height: "64px",
                margin: "0 auto 16px",
                backgroundColor: "#E5E7EB",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <FiClipboard size={24} color="#9CA3AF" />
              </div>
              <h3 style={{ 
                fontSize: "18px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px"
              }}>No Active Projects</h3>
              <p style={{ 
                color: "#6B7280",
                maxWidth: "400px",
                margin: "0 auto"
              }}>
                You don't have any active projects at the moment.
              </p>
            </div>
          ) : (
            <div style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px"
            }}>
              {activeProjects.map((project) => (
                <div
                  key={project._id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    overflow: "hidden"
                  }}
                >
                  <div style={{ padding: "20px" }}>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "16px"
                    }}>
                      <div>
                        <h3 style={{ 
                          fontSize: "18px",
                          fontWeight: "600",
                          marginBottom: "4px"
                        }}>{project.title}</h3>
                        <p style={{ 
                          color: "#6B7280",
                          fontSize: "14px",
                          margin: "0"
                        }}>{project.companyName}</p>
                      </div>
                      <span style={{
                        backgroundColor: "#DBEAFE",
                        color: "#2563EB",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "500"
                      }}>
                        Active
                      </span>
                    </div>

                    <p style={{ 
                      color: "#4B5563",
                      fontSize: "14px",
                      marginBottom: "16px"
                    }}>{project.description}</p>

                    <div style={{ 
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      padding: "16px 0",
                      borderTop: "1px solid #E5E7EB"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FiDollarSign />
                        <span style={{ fontSize: "14px" }}>Rs. {project.budget}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FiClock />
                        <span style={{ fontSize: "14px" }}>
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setShowProjectDetails(true);
                      }}
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "16px",
                        backgroundColor: "#2563EB",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "invoices" && (
          <div>
            <h4>Invoices</h4>
            <p>You have not generated any invoices yet.</p>
        </div>
      )}

{showBidModal && selectedProject && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  }}>
    <div style={{
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "24px",
      width: "90%",
      maxWidth: "500px",
    }}>
      <h3 style={{ marginBottom: "16px" }}>Submit Bid for {selectedProject.title}</h3>
      <form onSubmit={handleBidSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Bid Amount (Rs.)
          </label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
            min="0"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #E5E7EB",
              borderRadius: "6px"
            }}
          />
        </div>
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Proposal
          </label>
          <textarea
            value={bidProposal}
            onChange={(e) => setBidProposal(e.target.value)}
            required
            rows="4"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #E5E7EB",
              borderRadius: "6px",
              resize: "vertical"
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => setShowBidModal(false)}
            style={{
              padding: "8px 16px",
              border: "1px solid #E5E7EB",
              borderRadius: "6px",
              backgroundColor: "white"
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#2563EB",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
            disabled={isSubmittingBid}
          >
            {isSubmittingBid ? "Submitting..." : "Submit Bid"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

const ProjectDetailsModal = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>{project.title}</h2>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #DC2626',
                  color: '#DC2626',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Report Issue
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #2563EB',
                  color: '#2563EB',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Open
              </button>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6B7280',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
          </div>
          <p style={{ margin: 0, color: '#6B7280' }}>{project.description}</p>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '32px', 
          padding: '0 24px',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 0',
              color: activeTab === "overview" ? '#111827' : '#6B7280',
              borderBottom: activeTab === "overview" ? '2px solid #2563EB' : 'none',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("files")}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 0',
              color: activeTab === "files" ? '#111827' : '#6B7280',
              borderBottom: activeTab === "files" ? '2px solid #2563EB' : 'none',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Files
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 0',
              color: activeTab === "messages" ? '#111827' : '#6B7280',
              borderBottom: activeTab === "messages" ? '2px solid #2563EB' : 'none',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Messages
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {activeTab === "overview" && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Timeline Section */}
              <div style={{ 
                backgroundColor: '#F9FAFB', 
                borderRadius: '8px',
                padding: '24px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ color: '#2563EB' }}>📅</span> Timeline
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}>Start Date</p>
                    <p style={{ margin: 0, fontWeight: '500' }}>2/1/2024</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}>Deadline</p>
                    <p style={{ margin: 0, fontWeight: '500' }}>4/1/2024</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}>Duration</p>
                    <p style={{ margin: 0, fontWeight: '500' }}>60 days</p>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div style={{ 
                backgroundColor: '#F9FAFB', 
                borderRadius: '8px',
                padding: '24px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ color: '#2563EB' }}>📈</span> Progress
                </h3>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#6B7280' }}>Project Completion</span>
                    <span style={{ fontWeight: '600' }}>65%</span>
                  </div>
                  <div style={{ 
                    height: '8px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: '65%',
                      height: '100%',
                      backgroundColor: '#2563EB',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}>Start Date</p>
                    <p style={{ margin: 0, fontWeight: '500' }}>2/1/2024</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}>Deadline</p>
                    <p style={{ margin: 0, fontWeight: '500' }}>4/1/2024</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}>Status</p>
                    <span style={{
                      backgroundColor: '#FEF3C7',
                      color: '#92400E',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      In progress
                    </span>
                  </div>
                </div>
              </div>

              {/* Developer Assignment */}
              <div style={{ 
                gridColumn: '1 / -1',
                backgroundColor: '#F9FAFB', 
                borderRadius: '8px',
                padding: '24px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ color: '#2563EB' }}>👤</span> Developer Assignment
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#E5E7EB'
                    }} />
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>John Smith</p>
                      <p style={{ margin: 0, color: '#6B7280' }}>john@example.com</p>
                    </div>
                  </div>
                  <button
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      backgroundColor: '#2563EB',
                      color: 'white',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "files" && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ 
                width: '48px',
                height: '48px',
                margin: '0 auto 16px',
                color: '#9CA3AF'
              }}>
                📄
              </div>
              <p style={{ 
                margin: '0 0 24px 0',
                color: '#6B7280',
                fontSize: '16px'
              }}>
                No files uploaded yet
              </p>
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: '#2563EB',
                  color: 'white',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Upload Files
              </button>
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              {/* Messages content */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindWork;
