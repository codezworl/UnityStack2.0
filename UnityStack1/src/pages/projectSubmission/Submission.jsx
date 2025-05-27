import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Header from '../../components/header';
import Footer from '../../components/footer';

const Submission = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: ''
  });
  const [zipFile, setZipFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
        setProject(response.data);
        setFormData(prev => ({
          ...prev,
          title: response.data.title
        }));
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
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

    try {
      // Validate project ID
      if (!projectId) {
        throw new Error('Project ID is missing');
      }

      console.log('Starting submission process:', {
        projectId,
        title: formData.title,
        description: formData.description,
        hasZipFile: !!zipFile,
        hasDocFile: !!docFile
      });

      const submissionData = new FormData();
      submissionData.append('projectId', projectId);
      submissionData.append('title', formData.title);
      submissionData.append('description', formData.description);
      if (formData.link) {
        submissionData.append('link', formData.link);
      }
      if (zipFile) {
        submissionData.append('zipFile', zipFile);
      }
      if (docFile) {
        submissionData.append('docFile', docFile);
      }

      console.log('Making API call to:', `http://localhost:5000/api/submissions`);
      console.log('Form data contents:', {
        projectId: submissionData.get('projectId'),
        title: submissionData.get('title'),
        description: submissionData.get('description'),
        hasZipFile: !!submissionData.get('zipFile'),
        hasDocFile: !!submissionData.get('docFile')
      });

      const response = await axios.post(
        `http://localhost:5000/api/submissions`,
        submissionData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Submission response:', response.data);
      toast.success('Project submitted successfully!');
      navigate('/findwork');
    } catch (err) {
      console.error('Submission error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        projectId
      });
      setError(err.response?.data?.message || 'Error submitting project');
      toast.error(err.response?.data?.message || 'Error submitting project');
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
              Submit Project Work
            </h2>

            {/* Close Button */}
            <button
              onClick={() => navigate('/developerdashboard')}
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
              {/* Title */}
              <label
                style={{
                  fontWeight: "bold",
                  color: "#444",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
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

              {/* Description */}
              <label
                style={{
                  fontWeight: "bold",
                  color: "#444",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
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

              {/* ZIP File Upload */}
              <label
                style={{
                  fontWeight: "bold",
                  color: "#444",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                ZIP File Upload <span style={{ color: "red" }}>*</span>
              </label>
              <div
                style={{
                  border: "2px dashed #ccc",
                  borderRadius: "5px",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "15px",
                  background: "#f8f9fa",
                }}
              >
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleZipFileChange}
                  style={{ display: "none" }}
                  id="zipFile"
                  required
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
                {zipFile && (
                  <p style={{ marginTop: "10px", color: "#666" }}>
                    Selected: {zipFile.name}
                  </p>
                )}
              </div>

              {/* Document Upload */}
              <label
                style={{
                  fontWeight: "bold",
                  color: "#444",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Document Upload (Optional)
              </label>
              <div
                style={{
                  border: "2px dashed #ccc",
                  borderRadius: "5px",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "15px",
                  background: "#f8f9fa",
                }}
              >
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
                {docFile && (
                  <p style={{ marginTop: "10px", color: "#666" }}>
                    Selected: {docFile.name}
                  </p>
                )}
              </div>

              {/* Link */}
              <label
                style={{
                  fontWeight: "bold",
                  color: "#444",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "50%",
                  marginLeft: "200px",
                  padding: "14px",
                  borderRadius: "5px",
                  border: "none",
                  background: submitting ? "#ccc" : "#28a745",
                  color: "#fff",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontSize: "16px",
                }}
              >
                {submitting ? "Submitting..." : "Submit Project"}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </motion.div>
    </div>
  );
};

export default Submission;
