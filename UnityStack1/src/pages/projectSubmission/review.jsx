import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Header from '../../components/header';
import Footer from '../../components/footer';

const Review = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to continue');
          navigate('/login');
          return;
        }

        // Fetch user data from the API
        const response = await axios.get('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.role) {
          setUserData(response.data);
        } else {
          setError('Invalid user data received');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please login again.');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) {
        setError('Project ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to continue');
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && typeof response.data === 'object') {
          // Verify user has permission to review this project
          const project = response.data;
          const isAuthorized =
            (userData?.role === 'organization' && project.companyId === userData._id) ||
            (userData?.role === 'student' && project.userId === userData._id) ||
            (userData?.role === 'developer' && project.developerId === userData._id);

          if (!isAuthorized) {
            setError('You are not authorized to review this project');
            return;
          }

          setProject(project);
        } else {
          setError('Invalid project data received');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(error.response?.data?.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchProjectDetails();
    }
  }, [projectId, userData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userData || !userData.role) {
      toast.error('User data not found. Please login again.');
      navigate('/login');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!description.trim()) {
      toast.error('Please provide a review description');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      const reviewData = {
        rating,
        description,
        reviewerRole: userData.role
      };

      await axios.post(
        `http://localhost:5000/api/reviews/${projectId}`,
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Review submitted successfully');
      setTimeout(() => {
        navigate('/findwork', { replace: true });
      }, 1000);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const containerStyles = {
    fontFamily: "Poppins, sans-serif",
    padding: "40px 20px",
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  };

  const formStyles = {
    background: "#f9f9f9",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginTop: "20px",
  };

  const inputStyles = {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "border-color 0.3s ease",
  };

  const labelStyles = {
    fontWeight: "600",
    textAlign: "left",
    display: "block",
    marginBottom: "8px",
    color: "#333",
  };

  const buttonStyles = {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "12px 24px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background-color 0.3s ease",
  };

  const starContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  };

  const starStyle = {
    cursor: "pointer",
    fontSize: "2rem",
    color: "#ddd",
    transition: "color 0.2s ease",
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
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Find Work
          </button>
        </div>
      </div>
    );
  }

  if (!project || !project.title || !project.description) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Not Found</h2>
          <p className="text-gray-600">The project you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate('/findwork')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Find Work
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div style={containerStyles}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ fontFamily: "Poppins, sans-serif", color: "#333", marginBottom: "20px" }}>
            Review Project
          </h1>
          
          <div style={formStyles}>
            <div style={{ marginBottom: "30px", textAlign: "left" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#333", marginBottom: "10px" }}>
                {project.title}
              </h2>
              <p style={{ color: "#666", fontSize: "1rem" }}>{project.description}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "30px" }}>
                <label style={labelStyles}>Rate Your Experience</label>
                <div style={starContainerStyle}>
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <FaStar
                        key={index}
                        style={{
                          ...starStyle,
                          color: ratingValue <= (hover || rating) ? "#FFD700" : "#ddd"
                        }}
                        onClick={() => setRating(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                      />
                    );
                  })}
                </div>
                {rating > 0 && (
                  <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "5px" }}>
                    {rating} {rating === 1 ? 'star' : 'stars'} selected
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "30px" }}>
                <label style={labelStyles} htmlFor="description">
                  Review Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share your experience working on this project..."
                  style={{
                    ...inputStyles,
                    minHeight: "120px",
                    resize: "vertical"
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px" }}>
                <button
                  type="button"
                  onClick={() => navigate('/findwork')}
                  style={{
                    ...buttonStyles,
                    backgroundColor: "#6c757d",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    ...buttonStyles,
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Review;
