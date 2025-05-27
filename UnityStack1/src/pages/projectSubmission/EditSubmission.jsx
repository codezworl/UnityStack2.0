import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Header from '../../components/header';
import Footer from '../../components/footer';

const EditSubmission = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: ''
  });
  const [zipFile, setZipFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [error, setError] = useState('');

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
        setFormData({
          title: response.data.title,
          description: response.data.description
        });
      } catch (error) {
        console.error('Error fetching submission:', error);
        setError(error.response?.data?.message || 'Failed to fetch submission');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleZipFileChange = (e) => {
    setZipFile(e.target.files[0]);
  };

  const handleDocFileChange = (e) => {
    setDocFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!zipFile && !submission.files.some(f => f.originalname.endsWith('.zip'))) {
      setError('ZIP file is required');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (zipFile) {
        formDataToSend.append('zipFile', zipFile);
      }
      if (docFile) {
        formDataToSend.append('docFile', docFile);
      }

      const response = await axios.put(
        `http://localhost:5000/api/submissions/${projectId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data) {
        toast.success('Submission updated successfully!');
        navigate('/findwork');
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      setError(error.response?.data?.message || 'Failed to update submission');
      toast.error(error.response?.data?.message || 'Failed to update submission');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
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
        <div style={{ background: "#f8f9fa", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ maxWidth: "800px", width: "100%", padding: "30px", background: "#fff", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", position: "relative" }}>
            <h2 style={{ fontSize: "26px", marginBottom: "20px", fontWeight: "bold", color: "#222", textAlign: "center" }}>
              Edit Submission
            </h2>

            {submission?.rejectionDetails && (
              <div style={{ marginBottom: "20px", padding: "15px", background: "#fff3f3", borderRadius: "8px", border: "1px solid #ffcdd2" }}>
                <h4 style={{ color: "#d32f2f", marginBottom: "10px" }}>Rejection Details</h4>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Issues Found:</strong>
                  <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                    {submission.rejectionDetails.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Message:</strong>
                  <p style={{ margin: "5px 0" }}>{submission.rejectionDetails.message}</p>
                </div>
              </div>
            )}

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

            {error && (
              <p style={{ color: "red", fontSize: "14px", textAlign: "center" }}>
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <label style={{ fontWeight: "bold", color: "#444", display: "block", marginBottom: "5px" }}>
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  background: "#f8f9fa",
                }}
                required
              />

              <label style={{ fontWeight: "bold", color: "#444", display: "block", marginBottom: "5px" }}>
                Project Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  background: "#f8f9fa",
                  resize: "vertical",
                }}
                required
              />

              <label style={{ fontWeight: "bold", color: "#444", display: "block", marginBottom: "5px" }}>
                ZIP File Upload <span style={{ color: "red" }}>*</span>
              </label>
              <div style={{
                border: "2px dashed #ccc",
                borderRadius: "5px",
                padding: "20px",
                textAlign: "center",
                marginBottom: "15px",
                background: "#f8f9fa",
              }}>
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleZipFileChange}
                  style={{ display: "none" }}
                  id="zipFile"
                />
                <label
                  htmlFor="zipFile"
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    background: "#007BFF",
                    color: "#fff",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Choose ZIP File
                </label>
                {zipFile ? (
                  <p style={{ marginTop: "10px", color: "#666" }}>
                    Selected: {zipFile.name}
                  </p>
                ) : submission.files.some(f => f.originalname.endsWith('.zip')) && (
                  <p style={{ marginTop: "10px", color: "#666" }}>
                    Current: {submission.files.find(f => f.originalname.endsWith('.zip')).originalname}
                  </p>
                )}
              </div>

              <label style={{ fontWeight: "bold", color: "#444", display: "block", marginBottom: "5px" }}>
                Document Upload (Optional)
              </label>
              <div style={{
                border: "2px dashed #ccc",
                borderRadius: "5px",
                padding: "20px",
                textAlign: "center",
                marginBottom: "15px",
                background: "#f8f9fa",
              }}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleDocFileChange}
                  style={{ display: "none" }}
                  id="docFile"
                />
                <label
                  htmlFor="docFile"
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    background: "#007BFF",
                    color: "#fff",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Choose Document
                </label>
                {docFile ? (
                  <p style={{ marginTop: "10px", color: "#666" }}>
                    Selected: {docFile.name}
                  </p>
                ) : submission.files.some(f => !f.originalname.endsWith('.zip')) && (
                  <p style={{ marginTop: "10px", color: "#666" }}>
                    Current: {submission.files.find(f => !f.originalname.endsWith('.zip')).originalname}
                  </p>
                )}
              </div>

              <label style={{ fontWeight: "bold", color: "#444", display: "block", marginBottom: "5px" }}>
                Link (Optional)
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://example.com"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  background: "#f8f9fa",
                }}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "50%",
                  marginLeft: "200px",
                  padding: "14px",
                  borderRadius: "5px",
                  border: "none",
                  background: loading ? "#ccc" : "#28a745",
                  color: "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                }}
              >
                {loading ? "Updating..." : "Update Submission"}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </motion.div>
    </div>
  );
};

export default EditSubmission; 