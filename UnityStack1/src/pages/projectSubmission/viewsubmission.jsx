import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { FiDownload, FiCheck, FiX } from 'react-icons/fi';

const ViewSubmission = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/submissions/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setSubmission(response.data);
      } catch (error) {
        console.error('Error fetching submission:', error);
        setError(error.response?.data?.message || 'Failed to fetch submission');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [projectId]);

  const handleDownload = async (file) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/submissions/download/${file.filename}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.originalname);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handleRejectClick = () => {
    setShowRejectForm(true);
  };

  const handleIssueToggle = (issue) => {
    setSelectedIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const handleStatusUpdate = async (status) => {
    if (status === 'rejected' && selectedIssues.length === 0) {
      toast.error('Please select at least one issue');
      return;
    }

    if (status === 'rejected' && !rejectionMessage.trim()) {
      toast.error('Please provide a rejection message');
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5000/api/submissions/${projectId}/status`,
        {
          status,
          feedback: rejectionMessage,
          issues: selectedIssues
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.submission.status === 'approved') {
        toast.success('Project approved successfully');
        // Navigate to review page for completed projects
        navigate(`/review/${projectId}`);
      } else if (response.data.submission.status === 'rejected') {
        toast.success('Project rejected successfully');
        // Navigate back to find work page for rejected projects
        navigate('/findwork');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/findwork')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Find Work
          </button>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Submission Found</h2>
          <p className="text-gray-600">The submission you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate('/findwork')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Find Work
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
      >
        <Header />
        <div
          style={{
            background: "#f8f9fa",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              width: "100%",
              padding: "30px",
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
          >
            <h2
              style={{
                fontSize: "26px",
                marginBottom: "20px",
                fontWeight: "bold",
                color: "#222",
                textAlign: "center",
              }}
            >
              Project Submission Details
            </h2>

            <button
              onClick={() => navigate('/findwork')}
              style={{
                position: "absolute",
                top: "20px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "1rem",
                cursor: "pointer",
                color: "Black",
              }}
              aria-label="Close"
            >
              ✖
            </button>

            {submission && (
              <div>
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
                    Submitted by: {submission.submitterName}
                  </h3>
                  <p style={{ color: "#666", marginBottom: "8px" }}>
                    Role: {submission.submitterRole}
                  </p>
                  <p style={{ color: "#666", marginBottom: "8px" }}>
                    Submitted on: {new Date(submission.submittedAt).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
                    Project Details
                  </h3>
                  <p style={{ marginBottom: "8px" }}>
                    <strong>Title:</strong> {submission.title}
                  </p>
                  <p style={{ marginBottom: "8px" }}>
                    <strong>Description:</strong> {submission.description}
                  </p>
                </div>

                {submission.files && submission.files.length > 0 && (
                  <div style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
                      Submitted Files
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {submission.files.map((file, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px",
                            background: "#f8f9fa",
                            borderRadius: "6px",
                          }}
                        >
                          <span>{file.originalname}</span>
                          <button
                            onClick={() => handleDownload(file)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 16px",
                              background: "#007BFF",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            <FiDownload /> Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {submission.links && submission.links.length > 0 && (
                  <div style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
                      Project Links
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {submission.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#007BFF",
                            textDecoration: "none",
                          }}
                        >
                          {link.url}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {!showRejectForm ? (
                  <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                    <button
                      onClick={handleRejectClick}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 24px",
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: updating ? "not-allowed" : "pointer",
                        opacity: updating ? 0.7 : 1,
                      }}
                    >
                      <FiX /> {updating ? "Rejecting..." : "Reject"}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('approved')}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 24px",
                        background: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: updating ? "not-allowed" : "pointer",
                        opacity: updating ? 0.7 : 1,
                      }}
                    >
                      <FiCheck /> {updating ? "Approving..." : "Approve"}
                    </button>
                  </div>
                ) : (
                  <div style={{ marginTop: "20px", padding: "15px", background: "#fff3f3", borderRadius: "8px", border: "1px solid #ffcdd2" }}>
                    <h4 style={{ color: "#d32f2f", marginBottom: "10px" }}>Rejection Details</h4>
                    <div style={{ marginBottom: "10px" }}>
                      <strong>Issues Found:</strong>
                      <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                        {selectedIssues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Message:</strong>
                      <p style={{ margin: "5px 0" }}>{rejectionMessage}</p>
                    </div>
                  </div>
                )}

                {submission.status !== 'pending' && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      background: submission.status === 'approved' ? "#d4edda" : "#f8d7da",
                      color: submission.status === 'approved' ? "#155724" : "#721c24",
                      borderRadius: "6px",
                      marginTop: "16px",
                    }}
                  >
                    Status: {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </motion.div>

      {/* Rejection Modal */}
      {showRejectForm && (
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
            <h3 style={{ marginBottom: "16px" }}>Reject Submission</h3>
            <div style={{ marginBottom: "20px" }}>
              <p style={{ marginBottom: "10px", fontWeight: "bold" }}>Select Issues:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {['zipFile', 'docFile', 'link', 'description'].map((issue) => (
                  <label key={issue} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      checked={selectedIssues.includes(issue)}
                      onChange={() => handleIssueToggle(issue)}
                    />
                    {issue === 'zipFile' ? 'ZIP File Issues' :
                     issue === 'docFile' ? 'Document File Issues' :
                     issue === 'link' ? 'Link Issues' :
                     'Description Issues'}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                Rejection Message
              </label>
              <textarea
                value={rejectionMessage}
                onChange={(e) => setRejectionMessage(e.target.value)}
                rows="4"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "6px",
                  resize: "vertical"
                }}
                placeholder="Please provide details about the issues..."
              />
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowRejectForm(false)}
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
                onClick={() => handleStatusUpdate('rejected')}
                disabled={updating}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: updating ? "not-allowed" : "pointer",
                  opacity: updating ? 0.7 : 1
                }}
              >
                {updating ? "Rejecting..." : "Reject Submission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSubmission;
