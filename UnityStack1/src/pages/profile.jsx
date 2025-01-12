import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar, FaGlobe, FaLinkedin, FaGithub, FaTwitter, FaJava, FaDatabase, FaJsSquare } from "react-icons/fa";
import { BsClock, BsCalendar3 } from "react-icons/bs";

import Header from "../components/header";
import profileImage from "../assets/logo.jpg"; // Import profile image

const Profile = () => {
  const styles = {
    container: {
      maxWidth: "1100px",
      margin: "20px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      backgroundColor: "#fff",
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      display: "flex",
      gap: "20px",
    },
    sidebar: {
      width: "300px",
      borderRight: "1px solid #ddd",
      paddingRight: "20px",
    },
    profileImage: {
      borderRadius: "50%",
      width: "150px",
      height: "150px",
      objectFit: "cover",
      border: "3px solid #00bfa6",
      marginBottom: "20px",
    },
    profileName: {
      fontSize: "24px",
      fontWeight: "600",
      textAlign: "center",
      marginBottom: "5px",
    },
    availability: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "14px",
      color: "#00bfa6",
      marginBottom: "10px",
    },
    greenDot: {
      width: "8px",
      height: "8px",
      backgroundColor: "#00bfa6",
      borderRadius: "50%",
      marginRight: "5px",
    },
    badge: {
      display: "block",
      fontSize: "14px",
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "5px 10px",
      borderRadius: "5px",
      fontWeight: "500",
      textAlign: "center",
      marginBottom: "10px",
    },
    rating: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "16px",
      fontWeight: "500",
      color: "#555",
      marginBottom: "20px",
    },
    btn: {
      backgroundColor: "#007bff",
      color: "#fff",
      fontWeight: "600",
      padding: "10px 20px",
      borderRadius: "5px",
      border: "none",
      display: "block",
      margin: "0 auto",
      width: "80%",
    },
    content: {
      flex: 1,
    },
    sectionHeading: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#333",
      marginBottom: "10px",
      position: "relative",
    },
    headingUnderline: {
      content: "''",
      position: "absolute",
      bottom: "-5px",
      left: "0",
      width: "80px",
      height: "3px",
      backgroundColor: "#007bff",
    },
    aboutText: {
      fontSize: "14px",
      lineHeight: "1.6",
      color: "#555",
    },
    expertiseSection: {
      marginTop: "30px",
    },
    expertiseItem: {
      marginBottom: "20px",
    },
    expertiseIcon: {
      fontSize: "30px",
      marginRight: "10px",
    },
    reviewsSection: {
      marginTop: "30px",
    },
    footerItem: {
      marginBottom: "10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    reviewHeader: {
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "10px",
    },
    reviewBody: {
      fontSize: "14px",
      color: "#555",
      marginBottom: "20px",
    },
    clientName: {
      fontWeight: "600",
      marginRight: "10px",
    },
    clientDate: {
      fontSize: "12px",
      color: "#888",
    },
    expertiseSection: {
        marginTop: "30px",
      },
      expertiseItem: {
        marginBottom: "20px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      },
      expertiseIcon: {
        fontSize: "30px",
        marginRight: "10px",
        color: "#007bff",
      },
      socialSection: {
        marginTop: "30px",
      },
      socialCard: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        margin: "10px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
      },
      socialIcon: {
        fontSize: "20px",
        marginRight: "10px",
        color: "#007bff",
      },
      socialDetails: {
        fontSize: "14px",
        color: "#555",
      },
      experienceSection: {
        marginTop: "30px",
      },
      experienceItem: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9",
      },
      experienceTitle: {
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "5px",
        color: "#333",
      },
      experienceSubTitle: {
        fontSize: "14px",
        color: "#555",
        marginBottom: "10px",
      },
      experienceDetails: {
        fontSize: "14px",
        color: "#555",
        marginBottom: "10px",
      },
      tagsContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
      },
      tag: {
        backgroundColor: "#007bff",
        color: "#fff",
        padding: "5px 10px",
        borderRadius: "5px",
        fontSize: "12px",
      },
    
  };

  return (
    <>
      {/* Header */}
      <Header />

      <div className="container" style={styles.container}>
        {/* Sidebar Section */}
        <div style={styles.sidebar}>
          <img
            src={profileImage} // Profile image
            alt="Profile"
            style={styles.profileImage}
          />
          <h2 style={styles.profileName}>Asif Nouman</h2>
          <div style={styles.availability}>
            <div style={styles.greenDot}></div>
            <span>Available Now</span>
          </div>
          <span style={styles.badge}> Developer</span>
          <p style={styles.rating}>
            5.0 <FaStar style={{ color: "#ffc107", marginLeft: "5px" }} /> (22 reviews)
          </p>
          <button className="btn" style={styles.btn}>
            MESSAGE
          </button>
        </div>

        {/* Main Content Section */}
        <div style={styles.content}>
          {/* About Me Section */}
          <h3 style={styles.sectionHeading}>
            About Me
            <div style={styles.headingUnderline}></div>
          </h3>
          <p style={styles.aboutText}>
            Full-stack software craftsman and technical leader with over 15 years of experience.
            Equally adept at system design, programming, technical leadership,  Develporship, and
            business collaboration. Passionate about simplicity and efficiency.
          </p>
          <p style={styles.aboutText}>
            I have worked at over a dozen companies large and small, in a handful of different
            domains. Also participated in hundreds of interviews, about half-and-half as the
            interviewer and the interviewee. I have given dozens of talks and training sessions
            on a variety of topics, mostly focusing on distributed systems, caching, and testing.
          </p>
          <div style={styles.footerItem}>
            <div>
              <strong style={{ color: "#007bff" }}>US$25.00</strong>
              <p>For every 15 mins</p>
            </div>
            <div>
              <strong>78</strong>
              <p>Sessions/Jobs</p>
            </div>
            <div>
              <BsClock /> Eastern Time (US & Canada) (-05:00)
              <br />
              <BsCalendar3 /> Joined February 2017
            </div>
          </div>

          {/* Expertise Section */}
          <div style={styles.expertiseSection}>
            <h3 style={styles.sectionHeading}>
              Expertise
              <div style={styles.headingUnderline}></div>
            </h3>
            <div style={styles.expertiseItem}>
              <FaJava style={styles.expertiseIcon} />
              <strong>Java:</strong> 15 years of experience | 7 endorsements
              <p style={styles.aboutText}>
                I have been hands-on with Java from version 1.5 up to Java 22, helping with basics,
                advanced concurrency, and everything in between.
              </p>
            </div>
            <div style={styles.expertiseItem}>
              <FaDatabase style={styles.expertiseIcon} />
              <strong>SQL:</strong> 15 years of experience
              <p style={styles.aboutText}>
                Most projects in my career have leveraged a relational SQL database. I have
                considerable expertise in SQL query performance optimization.
              </p>
            </div>
            <div style={styles.expertiseItem}>
              <FaJsSquare style={styles.expertiseIcon} />
              <strong>JavaScript:</strong> 15 years of experience
              <p style={styles.aboutText}>
                I have spent several focused years on JavaScript, Typescript, and web frameworks.
                I can help you navigate around the rough edges.
              </p>
            </div>
          </div>

          {/* Reviews Section */}
          <div style={styles.reviewsSection}>
            <h3 style={styles.sectionHeading}>
              Reviews from Clients
              <div style={styles.headingUnderline}></div>
            </h3>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#007bff" }}>5.0</h2>
              <p style={{ fontSize: "14px", color: "#555" }}>
                <FaStar style={{ color: "#ffc107" }} />
                <FaStar style={{ color: "#ffc107" }} />
                <FaStar style={{ color: "#ffc107" }} />
                <FaStar style={{ color: "#ffc107" }} />
                <FaStar style={{ color: "#ffc107" }} /> (22 reviews)
              </p>
            </div>
            <div>
              <div style={styles.reviewHeader}>
                <span style={styles.clientName}>James Mitchell</span>
                <span style={styles.clientDate}>January 2025</span>
              </div>
              <p style={styles.reviewBody}>
                Asif was ready with everything I needed to know, explained it in a way that was
                crystal-clear and easy to understand. Highly recommend him to anyone needing help.
              </p>
            </div>
            <div>
              <div style={styles.reviewHeader}>
                <span style={styles.clientName}>Julian Madrigal</span>
                <span style={styles.clientDate}>November 2024</span>
              </div>
              <p style={styles.reviewBody}>Excellent Developer! He is very patient and understanding.</p>
            </div>
          </div>

          {/* Social Presence Section */}
          <div style={styles.socialSection}>
            <h3 style={styles.sectionHeading}>
              Social Presence
              <div style={styles.headingUnderline}></div>
            </h3>
            <h5>
              <FaGithub style={styles.socialIcon} />
              GitHub
            </h5>
            <div style={styles.socialCard}>
              <div>
                <strong>devbox</strong>
                <p style={styles.socialDetails}>Shell</p>
              </div>
              <div>
                <FaStar style={{ color: "#ffc107" }} /> 1 <FaGithub /> 1
              </div>
            </div>
            <div style={styles.socialCard}>
              <div>
                <strong>simple-jdbc</strong>
                <p style={styles.socialDetails}>Java</p>
              </div>
              <div>
                <FaStar style={{ color: "#ffc107" }} /> 1 <FaGithub /> 0
              </div>
            </div>
            <h5>
              <FaLinkedin style={styles.socialIcon} />
              LinkedIn
            </h5>
            <p style={styles.socialDetails}>
              <a href="https://www.linkedin.com/in/asif-nouman" target="_blank" rel="noreferrer">
                View LinkedIn Profile
              </a>
            </p>
            {/* Experience Section */}
<div style={styles.experienceSection}>
  <h3 style={styles.sectionHeading}>
    Employments
    <div style={styles.headingUnderline}></div>
  </h3>

  {/* Experience Item 1 */}
  <div style={styles.experienceItem}>
    <h5 style={styles.experienceTitle}>
      Sr. Staff Software Engineer
    </h5>
    <p style={styles.experienceSubTitle}>
      Fanatics Betting & Gaming | 2023-05-01 - Present
    </p>
    <ul style={styles.experienceDetails}>
      <li>
        Designed new mission-critical system serving majority of application traffic - This system has one of the lowest incident rates of any ...
      </li>
    </ul>
    <div style={styles.tagsContainer}>
      <span style={styles.tag}>Java</span>
      <span style={styles.tag}>MongoDB</span>
      <span style={styles.tag}>Spring</span>
      <span style={styles.tag}>View more</span>
    </div>
  </div>

  {/* Experience Item 2 */}
  <div style={styles.experienceItem}>
    <h5 style={styles.experienceTitle}>
      Staff Software Engineer
    </h5>
    <p style={styles.experienceSubTitle}>
      Crossbeam | 2022-04-01 - 2023-03-01
    </p>
    <ul style={styles.experienceDetails}>
      <li>Avoided costly replatforming via 100x optimization in PostgreSQL usage in key areas.</li>
      <li>Developed a new reporting architecture...</li>
    </ul>
    <div style={styles.tagsContainer}>
      <span style={styles.tag}>PostgreSQL</span>
      <span style={styles.tag}>Elasticsearch</span>
      <span style={styles.tag}>GitLab</span>
      <span style={styles.tag}>View more</span>
    </div>
  </div>
</div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
