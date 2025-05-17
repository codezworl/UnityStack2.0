import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";
import { toast } from "react-toastify";

const FeedbackPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          rating
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit feedback');
      }

      toast.success('Feedback submitted successfully!');
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        role: "",
        description: ""
      });
      setRating(0);
      
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
    ":focus": {
      borderColor: "#007BFF",
      outline: "none",
    }
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
    ":hover": {
      backgroundColor: "#0056b3",
    },
    ":disabled": {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    }
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

  const successStyles = {
    backgroundColor: "#d4f8d4",
    padding: "20px",
    borderRadius: "8px",
    color: "#28a745",
    fontWeight: "bold",
    marginTop: "20px",
  };

  return (
    <>
      <Header />
      <div style={containerStyles}>
        <h1 style={{ fontFamily: "Poppins, sans-serif", color: "#333" }}>
          We Value Your Feedback
        </h1>
        <p style={{ fontFamily: "Poppins, sans-serif", color: "#666" }}>
          Your input helps us improve UnityStack and better serve our community.
        </p>

        {submitted ? (
          <motion.div
            style={successStyles}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 style={{ fontFamily: "Poppins, sans-serif" }}>Thank You!</h2>
            <p style={{ fontFamily: "Poppins, sans-serif" }}>
              Your feedback has been submitted successfully.
            </p>
          </motion.div>
        ) : (
          <motion.form
            style={formStyles}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
          >
            <label style={labelStyles} htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              style={inputStyles}
              required
            />

            <label style={labelStyles} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              style={inputStyles}
              required
            />

            <label style={labelStyles} htmlFor="role">Your Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={inputStyles}
              required
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="developer">Developer</option>
              <option value="organization">Organization</option>
            </select>

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

            <label style={labelStyles} htmlFor="description">Your Feedback</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              style={{ ...inputStyles, resize: "none" }}
              placeholder="Share your thoughts about UnityStack..."
              required
            />

            <button 
              type="submit" 
              style={buttonStyles}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </motion.form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FeedbackPage;
