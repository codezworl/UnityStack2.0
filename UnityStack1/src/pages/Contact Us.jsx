import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com"; // Import EmailJS
import Header from "../components/header";
import Footer from "../components/footer";
import img3 from "../assets/linkedin.png";
import img2 from "../assets/facebook.png";
import img1 from "../assets/logos.png";
import img4 from "../assets/instagram.png";

const ContactPage = () => {
  const form = useRef(); // Ref for the form
  const [submitted, setSubmitted] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      await emailjs.sendForm(
        "service_26xgh75", // Replace with your EmailJS service ID
        "template_beulgz4", // Replace with your EmailJS template ID
        form.current,
        "GAc_xsQJLuiZY_ZpD" // Replace with your EmailJS user ID
      );
      setSubmitted(true); // Show success message
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      alert("Message failed to send. Please try again later.");
    }

    e.target.reset(); // Reset the form after submission
  };

  const containerStyles = {
    fontFamily: "Arial, sans-serif",
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const headingStyles = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
    marginBottom: "10px",
  };

  const subheadingStyles = {
    textAlign: "center",
    fontSize: "1rem",
    color: "#555",
    marginBottom: "30px",
  };

  const formContainer = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    alignItems: "start",
  };

  const formStyles = {
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const inputStyles = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1rem",
  };

  const buttonStyles = {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "10px 20px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const successStyles = {
    backgroundColor: "#d4f8d4",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    color: "#28a745",
    fontWeight: "bold",
    marginTop: "20px",
  };

  const infoStyles = {
    textAlign: "left",
  };

  const socialMediaStyles = {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
  };

  const iconStyles = {
    width: "30px",
    height: "30px",
    cursor: "pointer",
    transition: "transform 0.3s",
  };

  return (
    <>
      <Header />
      <div style={containerStyles}>
        {submitted ? (
          <div style={successStyles}>
            <h2>Thank You!</h2>
            <p>Your feedback has been submitted successfully.</p>
          </div>
        ) : (
          <>
            <h1 style={headingStyles}>Get in Touch</h1>
            <p style={subheadingStyles}>
              We’re excited to hear from you! Fill out the form or reach us
              directly below.
            </p>
            <div style={formContainer}>
              <motion.form
                ref={form} // Attach ref to the form
                style={formStyles}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={sendEmail} // Attach the sendEmail function
              >
                <input
                  type="text"
                  name="user_name"
                  placeholder="Name"
                  style={inputStyles}
                  required
                />
                <input
                  type="email"
                  name="user_email"
                  placeholder="Email"
                  style={inputStyles}
                  required
                />
                <select name="inquiry_type" style={inputStyles} required>
                  <option value="">Select Inquiry Type</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Support</option>
                  <option value="feedback">Feedback</option>
                </select>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  style={inputStyles}
                />
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="4"
                  style={{ ...inputStyles, resize: "none" }}
                  required
                ></textarea>
                <button style={buttonStyles} type="submit">
                  Send Message
                </button>
              </motion.form>

              <motion.div
                style={infoStyles}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3>Contact Information</h3>
                <p>
                  <strong>Email:</strong> contact@unitystack.com
                </p>
                <p>
                  <strong>Phone:</strong> +92 (370) 4072105
                </p>
                <p>
                  <strong>Address:</strong> Lahore, Punjab, Pakistan
                </p>

                <h4>Follow Us</h4>
                <div style={socialMediaStyles}>
                  <img
                    src={img1}
                    alt="Twitter"
                    style={iconStyles}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                  <img
                    src={img2}
                    alt="Facebook"
                    style={iconStyles}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                  <img
                    src={img3}
                    alt="LinkedIn"
                    style={iconStyles}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                  <img
                    src={img4}
                    alt="Instagram"
                    style={iconStyles}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
