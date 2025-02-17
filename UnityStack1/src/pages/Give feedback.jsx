import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/header";
import Footer from "../components/footer";

const FeedbackPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    overall_experience: "",
    ease_of_use: "",
    feature_completeness: "",
    design_appeal: "",
    recommendation: "",
    comments: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create feedback object matching the structure in UsersPage
    const newFeedback = {
      id: Date.now(), // Temporary ID
      name: formData.name,
      role: formData.role,
      overall_experience: parseInt(formData.overall_experience),
      ease_of_use: parseInt(formData.ease_of_use),
      feature_completeness: parseInt(formData.feature_completeness),
      design_appeal: parseInt(formData.design_appeal),
      recommendation: parseInt(formData.recommendation),
      comments: formData.comments,
      date: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
    };

    // Here you would typically send this to your backend
    console.log('New Feedback:', newFeedback);

    // Reset form and show success message
    setSubmitted(true);
    setFormData({
      name: "",
      email: "",
      role: "",
      overall_experience: "",
      ease_of_use: "",
      feature_completeness: "",
      design_appeal: "",
      recommendation: "",
      comments: ""
    });
    
    setTimeout(() => setSubmitted(false), 3000);
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
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginTop: "20px",
  };

  const inputStyles = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1rem",
  };

  const labelStyles = {
    fontWeight: "bold",
    textAlign: "left",
    display: "block",
    marginBottom: "5px",
  };

  const buttonStyles = {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "10px 20px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
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
        <h1 style={{ fontFamily: "Poppins, sans-serif" }}>We Value Your Feedback</h1>
        <p style={{ fontFamily: "Poppins, sans-serif" }}>
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
              <option value="Software Developer">Software Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Mobile Developer">Mobile Developer</option>
            </select>

            <label style={labelStyles}>Overall Experience</label>
            <input
              type="number"
              name="overall_experience"
              value={formData.overall_experience}
              onChange={handleChange}
              style={inputStyles}
              min="1"
              max="10"
              placeholder="Rate 1-10"
              required
            />

            <label style={labelStyles}>Ease of Use</label>
            <input
              type="number"
              name="ease_of_use"
              value={formData.ease_of_use}
              onChange={handleChange}
              style={inputStyles}
              min="1"
              max="10"
              placeholder="Rate 1-10"
              required
            />

            <label style={labelStyles}>Feature Completeness</label>
            <input
              type="number"
              name="feature_completeness"
              value={formData.feature_completeness}
              onChange={handleChange}
              style={inputStyles}
              min="1"
              max="10"
              placeholder="Rate 1-10"
              required
            />

            <label style={labelStyles}>Design Appeal</label>
            <input
              type="number"
              name="design_appeal"
              value={formData.design_appeal}
              onChange={handleChange}
              style={inputStyles}
              min="1"
              max="10"
              placeholder="Rate 1-10"
              required
            />

            <label style={labelStyles}>How likely are you to recommend UnityStack?</label>
            <input
              type="number"
              name="recommendation"
              value={formData.recommendation}
              onChange={handleChange}
              style={inputStyles}
              min="1"
              max="10"
              placeholder="Rate 1-10"
              required
            />

            <label style={labelStyles} htmlFor="comments">Any additional comments or suggestions?</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows="4"
              style={{ ...inputStyles, resize: "none" }}
              placeholder="Your comments here..."
            />

            <button type="submit" style={buttonStyles}>Submit Feedback</button>
          </motion.form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FeedbackPage;
