import React, { useEffect, useState } from "react";
import { Card, Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { FiGrid, FiFileText, FiBriefcase, FiClipboard, FiDollarSign, FiClock, FiUser, FiDownload, FiCalendar, FiMessageSquare } from "react-icons/fi";
import "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const FindWork = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
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
  const [userName, setUserName] = useState("");
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [bidderType, setBidderType] = useState("");
  const [projectStats, setProjectStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    totalEarnings: 0,
  });
  const [projectHistory, setProjectHistory] = useState([]);
  const [invoiceProjects, setInvoiceProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  const projectsPerPage = 5;

  const availableTags = [
    "#webdev", "#wordpress", "#seo", "#shopify", "#graphicdesign",
    "#ai", "#data", "#node", "#mern", "#figma", "#logo"
  ];

  // Fetch all projects for the current developer
  const fetchAllProjects = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/projects/assigned',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        // Update project history with all assigned projects
        setProjectHistory(response.data.projects);
        
        // Update stats from backend
        if (response.data.stats) {
          setProjectStats(response.data.stats);
        }

        // For Active Projects Tab: Show projects with in-progress status
        const activeProjects = response.data.projects.filter(project => 
          project.status === 'in-progress' &&
          project.paymentStatus === 'paid'
        );
        setActiveProjects(activeProjects);

        // For Invoices Tab: Show completed projects with paid status
        const completedProjects = response.data.projects.filter(project => 
          project.status === 'completed' &&
          project.paymentStatus === 'paid'
        );
        setInvoiceProjects(completedProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          setUser(response.data);
          // Fetch projects after user data is loaded
          await fetchAllProjects(response.data._id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

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
      console.log('Fetching active projects...');
      fetchActiveProjects();
    } else if (activeTab === "invoices") {
      fetchInvoiceProjects();
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

      const response = await fetch("http://localhost:5000/api/projects/active", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw API response:', data);

      // Ensure data is an array
      const projectsArray = Array.isArray(data) ? data : [];
      console.log('Projects array:', projectsArray);

      // Filter projects with more detailed logging
      const filteredProjects = projectsArray.filter(project => {
        console.log('Checking project:', {
          id: project._id,
          title: project.title,
          status: project.status
        });

        const isValidStatus = ['in-progress', 'submitted', 'rejected'].includes(project.status);
        
        console.log('Project status check:', {
          isValidStatus,
          willShow: isValidStatus
        });

        return isValidStatus;
      });

      console.log('Final filtered projects:', filteredProjects);
      setActiveProjects(filteredProjects);
    } catch (err) {
      console.error("Error fetching active projects:", err);
      setActiveError(err.message || "Failed to load active projects");
      setActiveProjects([]);
    } finally {
      setLoadingActive(false);
    }
  };

  const fetchInvoiceProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get('http://localhost:5000/api/projects/find-work-invoices', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && Array.isArray(response.data)) {
        // No need for additional filtering as backend handles it
        setInvoiceProjects(response.data);
      } else {
        setInvoiceProjects([]);
      }
    } catch (err) {
      console.error('Error fetching invoice projects:', err);
      setError(err.message || 'Failed to load invoice projects');
    } finally {
      setLoading(false);
    }
  };

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
    setSelectedTags((prev) => {
      // Ensure prev is an array
      const currentTags = Array.isArray(prev) ? prev : [];
      return currentTags.includes(tag) 
        ? currentTags.filter((t) => t !== tag) 
        : [...currentTags, tag];
    });
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

  const fetchProjectHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get('http://localhost:5000/api/projects/assigned', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.projects) {
        // Update project history with all assigned projects
        setProjectHistory(response.data.projects);
        
        // Update stats from backend
        if (response.data.stats) {
          setProjectStats(response.data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching project history:', error);
      toast.error('Failed to load project history');
    }
  };

  useEffect(() => {
    if (activeTab === "overview") {
      fetchProjectHistory();
    }
  }, [activeTab]);

  const renderProjectHistory = () => {
    if (!projectHistory || !Array.isArray(projectHistory)) {
      return (
        <div className="text-center py-5">
          <p>No project history available</p>
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Project Title</th>
              <th>Assigned By</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {projectHistory.map((project) => (
              <tr key={project._id}>
                <td>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>
                    {project.title}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "14px", color: "#111827" }}>
                    {project.companyId?.companyName || 
                     (project.userId?.firstName ? `${project.userId.firstName} ${project.userId.lastName}` : 'N/A')}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "14px", color: "#111827" }}>
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "14px", color: "#111827" }}>
                    {project.acceptedBidAmount ? `PKR ${Number(project.acceptedBidAmount).toLocaleString()}` : 'N/A'}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "14px" }}>
                    <span className={`badge ${
                      project.status === 'completed' ? 'bg-success' :
                      project.status === 'in-progress' ? 'bg-primary' :
                      project.status === 'rejected' ? 'bg-danger' :
                      project.status === 'submitted' ? 'bg-info' :
                      project.status === 'assigned' ? 'bg-warning' :
                      'bg-secondary'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "14px" }}>
                    <span className={`badge ${
                      project.paymentStatus === 'released' ? 'bg-success' :
                      project.paymentStatus === 'paid' ? 'bg-primary' :
                      'bg-secondary'
                    }`}>
                      {project.paymentStatus ? project.paymentStatus.charAt(0).toUpperCase() + project.paymentStatus.slice(1) : 'Pending'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleChat = (project) => {
    // Get the client ID based on who created the project
    let clientId;
    switch (project.createdBy) {
      case 'Student':
        clientId = project.userId;
        break;
      case 'Developer':
        clientId = project.developerId;
        break;
      case 'Organization':
        clientId = project.companyId;
        break;
      default:
        toast.error('Could not determine client information');
        return;
    }

    if (!clientId) {
      toast.error('Client information not available');
      return;
    }

    navigate(`/chat?id=${clientId}`);
  };

  const handleSubmitWork = (project) => {
    if (!project._id) {
      toast.error('Project ID not found');
      return;
    }
    navigate(`/submission/${project._id}`);
  };

  const handleDownloadInvoice = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to download invoice');
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/projects/${projectId}/invoice`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Create a blob from the PDF Stream
      const file = new Blob([response.data], { type: 'application/pdf' });
      // Create a URL for the blob
      const fileURL = window.URL.createObjectURL(file);
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `invoice-${projectId}.pdf`;
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      // Clean up and remove the link
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(fileURL);
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice. Please try again.');
    }
  };

  const handleWithdraw = async (projectId) => {
    try {
      setIsWithdrawing(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/withdraw`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        toast.success('Withdrawal request submitted successfully');
        // Refresh the project list
        fetchAllProjects(user._id);
      }
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      toast.error(error.response?.data?.message || 'Failed to request withdrawal');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const renderActiveProjects = () => {
    if (!activeProjects || !Array.isArray(activeProjects)) {
      return (
        <div className="text-center py-5">
          <p>No active projects available</p>
        </div>
      );
    }

    if (activeProjects.length === 0) {
      return (
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
      );
    }

    const getAssignedByName = (project) => {
      switch (project.createdBy) {
        case 'Student':
          return project.userName || 'Student';
        case 'Developer':
          return project.developerName || 'Developer';
        case 'Organization':
          return project.companyName || 'Organization';
        default:
          return 'N/A';
      }
    };

    const getStatusBadge = (status) => {
      switch (status) {
        case 'in-progress':
          return <span className="badge bg-primary">In Progress</span>;
        case 'submitted':
          return <span className="badge bg-info">Submitted</span>;
        case 'rejected':
          return <span className="badge bg-danger">Rejected</span>;
        default:
          return <span className="badge bg-secondary">{status}</span>;
      }
    };

    return (
      <div className="row g-4">
        {activeProjects.map((project) => (
          <div key={project._id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">{project.title}</h5>
                
                <div className="mb-3">
                  <small className="text-muted d-block">Assigned By</small>
                  <div className="d-flex align-items-center">
                    <div className="avatar-sm me-2">
                      <div className="avatar-title rounded-circle bg-primary-subtle text-primary">
                        {getAssignedByName(project)[0] || '?'}
                      </div>
                    </div>
                    <div>
                      <div className="fw-medium">
                        {getAssignedByName(project)}
                      </div>
                      <small className="text-muted">
                        {project.createdBy}
                      </small>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-block">Project Details</small>
                  <div className="d-flex justify-content-between">
                    <div>
                      <small className="text-muted">Budget</small>
                      <div className="fw-medium">
                        PKR {Number(project.acceptedBidAmount).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <small className="text-muted">Due Date</small>
                      <div className="fw-medium">
                        {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-block">Status</small>
                  <div className="d-flex gap-2">
                    {getStatusBadge(project.status)}
                    <span className="badge bg-success">Paid</span>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-primary flex-grow-1"
                    onClick={() => handleViewDetails(project)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleChat(project)}
                  >
                    <FiMessageSquare />
                  </button>
                </div>

                {project.status === 'rejected' ? (
                  <button
                    className="btn btn-danger w-100 mt-2"
                    onClick={() => navigate(`/edit-submission/${project._id}`)}
                  >
                    Edit Submission
                  </button>
                ) : project.status === 'in-progress' ? (
                  <button
                    className="btn btn-success w-100 mt-2"
                    onClick={() => navigate(`/submission/${project._id}`)}
                  >
                    Submit Work
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const renderProjectDetailsModal = () => {
    if (!selectedProject) return null;

    return (
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProjectDetailsModal project={selectedProject} onClose={() => setShowDetailsModal(false)} />
        </Modal.Body>
      </Modal>
    );
  };

  const ProjectDetailsModal = ({ project, onClose }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [submission, setSubmission] = useState(null);
    const [loadingSubmission, setLoadingSubmission] = useState(false);
    const [submissionError, setSubmissionError] = useState("");

    useEffect(() => {
      const fetchSubmission = async () => {
        if (project?.status === 'rejected') {
          setLoadingSubmission(true);
          setSubmissionError("");
          try {
            const res = await fetch(`http://localhost:5000/api/projects/${project._id}/submission`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            if (!res.ok) throw new Error('Failed to fetch submission');
            const data = await res.json();
            setSubmission(data);
          } catch (err) {
            setSubmissionError('Could not load rejection details.');
          } finally {
            setLoadingSubmission(false);
          }
        }
      };
      fetchSubmission();
    }, [project]);

    const handleChatClick = () => {
      // Get the client ID based on who created the project
      let clientId;
      switch (project?.createdBy) {
        case 'Student':
          clientId = project?.userId;
          break;
        case 'Developer':
          clientId = project?.developerId;
          break;
        case 'Organization':
          clientId = project?.companyId;
          break;
        default:
          toast.error('Could not determine client information');
          return;
      }

      if (!clientId) {
        toast.error('Client information not available');
        return;
      }

      navigate(`/chat?id=${clientId}`);
    };

    const handleSubmitWork = () => {
      if (!project?._id) {
        toast.error('Project ID not found');
        return;
      }
      navigate(`/submission/${project._id}`);
    };

    const handleEditSubmission = () => {
      navigate(`/edit-submission/${project._id}`);
    };

    // Get the client name for all project types
    const getClientName = () => {
      if (project?.companyName) return project.companyName;
      if (project?.userName) return project.userName;
      if (project?.developerName) return project.developerName;
      return "Client";
    };

    // Get the assignment line
    const getAssignedByName = () => {
      const clientName = getClientName();
      const devName = project?.assignedDeveloper?.firstName || "Developer";
      return `${clientName} assigned ${devName}`;
    };

    if (!project) return null;

    return (
      <div style={{
        position: 'relative',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>{project.title}</h2>
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
          <p style={{ margin: '0', color: '#6B7280' }}>{project.description}</p>
        </div>

        {/* Show rejection reason if rejected */}
        {project.status === 'rejected' && (
          <div style={{ 
            margin: '24px', 
            padding: '16px', 
            background: '#fff3f3', 
            borderRadius: '8px', 
            border: '1px solid #ffcdd2' 
          }}>
            <h4 style={{ color: '#d32f2f', marginBottom: '10px' }}>Rejection Details</h4>
            {loadingSubmission ? (
              <div>Loading rejection details...</div>
            ) : submissionError ? (
              <div style={{ color: '#d32f2f' }}>{submissionError}</div>
            ) : submission && submission.rejectionDetails ? (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Issues Found:</strong>
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    {submission.rejectionDetails.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Message:</strong>
                  <p style={{ margin: '5px 0' }}>{submission.rejectionDetails.message}</p>
                </div>
                <button
                  onClick={handleEditSubmission}
                  style={{
                    marginTop: '16px',
                    padding: '10px 20px',
                    backgroundColor: '#B91C1C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Edit Submission
                </button>
              </>
            ) : (
              <div>No rejection details available.</div>
            )}
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Project Details Section */}
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
                <span style={{ color: '#2563EB' }}>📋</span> Project Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}>Project Type</p>
                  <p style={{ margin: 0, fontWeight: '500' }}>{project.type}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}>Budget</p>
                  <p style={{ margin: 0, fontWeight: '500' }}>PKR {project.acceptedBidAmount ? project.acceptedBidAmount.toLocaleString() : (project.budget ? project.budget.toLocaleString() : 'N/A')}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}>Skills Required</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {project.skills?.map((skill, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: '#E5E7EB',
                          color: '#374151',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '14px'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

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
                  <p style={{ margin: 0, fontWeight: '500' }}>
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not started'}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}>Deadline</p>
                  <p style={{ margin: 0, fontWeight: '500' }}>
                    {new Date(project.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#6B7280' }}>Status</p>
                  <span style={{
                    backgroundColor: project.status === 'in-progress' ? '#DBEAFE' : 
                                   project.status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                    color: project.status === 'in-progress' ? '#1E40AF' : 
                          project.status === 'rejected' ? '#B91C1C' : '#92400E',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {project.status === 'in-progress' ? 'In Progress' : 
                     project.status === 'rejected' ? 'Rejected' : 'Assigned'}
                  </span>
                </div>
              </div>
            </div>

            {/* Client Information */}
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
                <span style={{ color: '#2563EB' }}>👤</span> Project Assignment
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ 
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6B7280',
                    fontSize: '20px'
                  }}>
                    {getClientName()[0]}
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>
                      {getAssignedByName()}
                    </p>
                    <p style={{ margin: 0, color: '#6B7280' }}>
                      {getClientName()}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleChatClick}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      backgroundColor: '#2563EB',
                      color: 'white',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>💬</span> Chat Now
                  </button>
                  {project.status === 'in-progress' ? (
                    <button
                      onClick={handleSubmitWork}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        backgroundColor: '#059669',
                        color: 'white',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      Submit Work
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        <div className="tab-pane fade show active">
          <div style={{ padding: "20px" }}>
            {/* Stats Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card border-primary h-100">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">Total Projects</h6>
                    <h2 className="card-title mb-0 text-primary">
                      {projectStats.total || 0}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-success h-100">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">Completed</h6>
                    <h2 className="card-title mb-0 text-success">
                      {projectStats.completed || 0}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-info h-100">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">Total Earnings</h6>
                    <h2 className="card-title mb-0 text-info">
                      PKR {projectHistory && Array.isArray(projectHistory)
                        ? projectHistory.filter(p => p.status === 'completed' && p.paymentStatus === 'released')
                            .reduce((sum, p) => sum + ((p.acceptedBidAmount || p.budget) * 0.9), 0).toLocaleString()
                        : 0}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Project History Table */}
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">Project History</h5>
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : projectHistory.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-history fa-3x text-muted mb-3"></i>
                    <h5>No Project History</h5>
                    <p className="text-muted">
                      Your assigned and completed projects will appear here
                    </p>
                  </div>
                ) : (
                  renderProjectHistory()
                )}
              </div>
            </div>
          </div>
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
                          <span style={{ fontSize: "14px" }}>PKR {project.budget}</span>
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
              <p style={{ color: "#6B7280" }}>Projects assigned to you with completed payments</p>
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
            renderActiveProjects()
          )}
        </div>
      )}

      {activeTab === "invoices" && (
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
              }}>Invoices & Payments</h2>
              <p style={{ color: "#6B7280" }}>View and manage your project payments and withdrawals</p>
            </div>
          </div>

          {/* Withdrawal Card Section */}
          {invoiceProjects.filter(project => 
            project.status === 'completed' && 
            project.paymentStatus === 'paid' && 
            !project.paymentDetails?.withdrawalStatus
          ).length > 0 && (
            <div style={{
              backgroundColor: "#F0FDF4",
              border: "1px solid #86EFAC",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "32px"
            }}>
              <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "16px", color: "#166534" }}>
                Available for Withdrawal
              </h3>
              <p style={{ color: "#15803D", marginBottom: "16px" }}>
                You have completed projects that are ready for withdrawal.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {invoiceProjects
                  .filter(project => 
                    project.status === 'completed' && 
                    project.paymentStatus === 'paid' && 
                    !project.paymentDetails?.withdrawalStatus
                  )
                  .map(project => (
                    <div key={project._id} style={{
                      backgroundColor: "#FFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      padding: "16px",
                      marginBottom: "16px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                            {project.title}
                          </h3>
                          <p style={{ color: "#6B7280", marginBottom: "4px" }}>
                            Amount: PKR {(project.acceptedBidAmount || project.budget)?.toLocaleString()}
                          </p>
                          <p style={{ color: "#6B7280" }}>
                            Completed on: {new Date(project.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {project.paymentStatus === 'released' ? (
                          <button
                            onClick={() => handleDownloadInvoice(project._id)}
                            style={{
                              backgroundColor: "#2563EB",
                              color: "white",
                              padding: "8px 16px",
                              borderRadius: "6px",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              transition: "background-color 0.2s"
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#1D4ED8"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#2563EB"}
                          >
                            <FiDownload /> Download Invoice
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate(`/invoiceget/${project._id}`)}
                            style={{
                              backgroundColor: "#22C55E",
                              color: "white",
                              padding: "8px 16px",
                              borderRadius: "6px",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              transition: "background-color 0.2s"
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#16A34A"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#22C55E"}
                          >
                            <FiDollarSign /> Withdraw Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Invoice History Section */}
          <div style={{ marginTop: "32px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "24px" }}>
              Invoice History
            </h3>

            {/* Withdrawn Invoices Table */}
            <div style={{
              backgroundColor: "#FFF",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              overflow: "hidden"
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F9FAFB" }}>
                    <th style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #E5E7EB",
                      color: "#6B7280",
                      fontWeight: 500,
                      fontSize: "14px"
                    }}>
                      Project
                    </th>
                    <th style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #E5E7EB",
                      color: "#6B7280",
                      fontWeight: 500,
                      fontSize: "14px"
                    }}>
                      Client
                    </th>
                    <th style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #E5E7EB",
                      color: "#6B7280",
                      fontWeight: 500,
                      fontSize: "14px"
                    }}>
                      Amount
                    </th>
                    <th style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #E5E7EB",
                      color: "#6B7280",
                      fontWeight: 500,
                      fontSize: "14px"
                    }}>
                      Withdrawal Date
                    </th>
                    <th style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      borderBottom: "1px solid #E5E7EB",
                      color: "#6B7280",
                      fontWeight: 500,
                      fontSize: "14px"
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceProjects.map(project => (
                    <tr key={project._id}>
                      <td style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #E5E7EB",
                      }}>
                        <div>
                          <p style={{ margin: "0", fontWeight: "500" }}>{project.title}</p>
                          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#6B7280" }}>
                            Completed: {new Date(project.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #E5E7EB",
                      }}>
                        {project.createdBy === 'Student' ? 
                          `${project.userId?.firstName} ${project.userId?.lastName}` :
                          project.createdBy === 'Developer' ?
                          `${project.developerId?.firstName} ${project.developerId?.lastName}` :
                          project.createdBy === 'Organization' ?
                          project.companyId?.companyName : 'N/A'}
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #E5E7EB",
                      }}>
                        PKR {((project.acceptedBidAmount || project.budget) * 0.9).toLocaleString()}
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #E5E7EB",
                      }}>
                        {project.paymentDetails?.withdrawalDate ? 
                          new Date(project.paymentDetails.withdrawalDate).toLocaleDateString() : 
                          'N/A'}
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #E5E7EB",
                      }}>
                        <button
                          onClick={() => handleDownloadInvoice(project._id)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#2563EB",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <FiDownload size={16} /> Download Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {invoiceProjects.length === 0 && (
                <div style={{
                  textAlign: "center",
                  padding: "48px 0",
                  color: "#6B7280"
                }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
                  <h3 style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}>
                    No Released Invoices
                  </h3>
                  <p style={{
                    fontSize: "14px",
                    maxWidth: "400px",
                    margin: "0 auto",
                  }}>
                    Released invoices will appear here once you complete the withdrawal process.
                  </p>
                </div>
              )}
            </div>
          </div>
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

      {renderProjectDetailsModal()}
    </div>
  );
};

export default FindWork;
