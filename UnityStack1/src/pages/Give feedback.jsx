import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/header";
import Footer from "../components/footer";

const FeedbackPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000); // Reset form view after 3 seconds
  };

  const containerStyles = {
    fontFamily: "Arial, sans-serif",
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
        <h1>We Value Your Feedback</h1>
        <p>Your input helps us improve UnityStack and better serve our community.</p>

        {submitted ? (
          <div style={successStyles}>
            <h2>Thank You!</h2>
            <p>Your feedback has been submitted successfully.</p>
          </div>
        ) : (
          <motion.form
            style={formStyles}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
          >
            <label style={labelStyles} htmlFor="name">Name</label>
            <input id="name" type="text" name="name" placeholder="Your Name" style={inputStyles} required />

            <label style={labelStyles} htmlFor="email">Email</label>
            <input id="email" type="email" name="email" placeholder="Your Email" style={inputStyles} required />

            <label style={labelStyles} htmlFor="role">Your Role</label>
            <select id="role" name="role" style={inputStyles} required>
              <option value="">Select your role</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
              <option value="other">Other</option>
            </select>

            <label style={labelStyles}>Overall Experience</label>
            <input type="number" name="overall_experience" style={inputStyles} min="1" max="10" placeholder="Rate 1-10" required />

            <label style={labelStyles}>Ease of Use</label>
            <input type="number" name="ease_of_use" style={inputStyles} min="1" max="10" placeholder="Rate 1-10" required />

            <label style={labelStyles}>Feature Completeness</label>
            <input type="number" name="feature_completeness" style={inputStyles} min="1" max="10" placeholder="Rate 1-10" required />

            <label style={labelStyles}>Design Appeal</label>
            <input type="number" name="design_appeal" style={inputStyles} min="1" max="10" placeholder="Rate 1-10" required />

            <label style={labelStyles}>How likely are you to recommend UnityStack?</label>
            <input type="number" name="recommendation" style={inputStyles} min="1" max="10" placeholder="Rate 1-10" required />

            <label style={labelStyles} htmlFor="comments">Any additional comments or suggestions?</label>
            <textarea id="comments" name="comments" rows="4" style={{ ...inputStyles, resize: "none" }} placeholder="Your comments here..."></textarea>

            <button type="submit" style={buttonStyles}>Submit Feedback</button>
          </motion.form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FeedbackPage;
