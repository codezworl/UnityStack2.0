import { motion } from "framer-motion";
import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import img1 from "../assets/Team1.jpeg"

const AboutUsPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        lineHeight: "1.6",
      }}
    >
        <Header />
      {/* Header Section */}
      <section
      style={{
        textAlign: "center",
        padding: "60px 20px",
        backgroundColor: "#F9FBFD",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Section Heading */}
      <motion.h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#007BFF",
          marginBottom: "20px",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Empowering Future Developers
      </motion.h1>

      <p
        style={{
          fontSize: "1.2rem",
          color: "#555",
          marginBottom: "40px",
        }}
      >
        UnityStack is an ambitious final year project aiming to create a
        community of passionate developers dedicated to helping each other
        succeed through real-time collaboration and mentorship.
      </p>

      {/* Boxes */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {[
          { text: "5,000+", subtext: "Developers to Connect" },
          { text: "150,000+", subtext: "Problems to Solve", isBlue: true },
          { text: "98%", subtext: "Target Satisfaction Rate" },
        ].map((box, index) => (
            <div
            key={index}
            style={{
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
              backgroundColor: box.isBlue ? "#007BFF" : "#FFFFFF",
              color: box.isBlue ? "#FFFFFF" : "#000000",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              width: "200px",
              cursor: "pointer",
              transition: "background-color 0.3s, transform 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>{box.text}</h3>
            <p style={{ fontSize: "1rem", color: box.isBlue ? "#FFFFFF" : "#555" }}>
              {box.subtext}
            </p>
          </div>
        ))}
      </div>
    </section>
       {/* Our Vision Section */}
       <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {/* Vision Content */}
        <div style={{ flex: 1, marginRight: "20px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>
            Our Vision
          </h2>
          <p style={{ fontSize: "1rem", color: "#555", marginBottom: "20px" }}>
            As a final year project, UnityStack envisions a future where every
            developer has access to quality mentorship and support. We're laying
            the groundwork for a platform that aims to break down barriers in
            technical learning by connecting developers with experienced mentors
            in real-time, making professional growth accessible to everyone.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              { label: "Clear Goals", color: "#007BFF" },
              { label: "High Standards", color: "#28A745" },
              { label: "Global Reach", color: "#6F42C1" },
              { label: "Passion", color: "#DC3545" },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: item.color,
                  color: "#FFFFFF",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Vision Image */}
        <div
          style={{
            flex: 1,
            height: "300px",
            backgroundColor: "#F0F0F0",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#E0E0E0",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span role="img" aria-label="placeholder" style={{ fontSize: "1.5rem" }}>
              📷
            </span>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              padding: "10px 15px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "1.2rem",
                color: "#007BFF",
              }}
            >
              🚀
            </span>
            <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>Project</span>
            <span style={{ fontSize: "0.6rem", fontWeight: "normal" }}>In Development</span>
          </div>
        </div>
      </section>

       {/* Our Core Values Section */}
       <section
        style={{
          backgroundColor: "#F9FBFD",
          padding: "60px 20px",
          textAlign: "center",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "40px",
          }}
        >
          Our Core Values
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {[
            {
              icon: "👥",
              title: "Community-Centric",
              description:
                "Aiming to build a supportive environment where developers can help each other grow.",
            },
            {
              icon: "💻",
              title: "Technical Excellence",
              description:
                "Striving for high standards in code quality and problem-solving approaches.",
            },
            {
              icon: "📚",
              title: "Continuous Learning",
              description:
                "Designing an environment that fosters constant growth and knowledge sharing.",
            },
          ].map((value, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#FFFFFF",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "2rem",
                    color: "#007BFF",
                  }}
                >
                  {value.icon}
                </span>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#333",
                    margin: 0,
                  }}
                >
                  {value.title}
                </h3>
              </div>
              <p style={{ fontSize: "1rem", color: "#555" }}>{value.description}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Our Team Section */}
      <section
        style={{
          padding: "60px 20px",
          backgroundColor: "#F9FBFD",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          Meet Our Team
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {[
             {
                name: "Alyan shahid",
                role: "Project member",
                image: "https://via.placeholder.com/300",
                linkedin: "https://linkedin.com/in/aishapatel",
              },
            {
              name: "M WAQAS ZAFAR",
              role: "Project Lead",
              image: img1,
              linkedin: "https://linkedin.com/in/sarahchen",
            },
            {
              name: "Alyan shahid",
              role: "Project member",
              image: "https://via.placeholder.com/300",
              linkedin: "https://linkedin.com/in/aishapatel",
            },
          ].map((member, index) => (
            <a
              key={index}
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "inherit",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                display: "block",
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: "300px",
                  backgroundImage: `url(${member.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: "0",
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "#FFFFFF",
                    padding: "10px 15px",
                    textAlign: "left",
                  }}
                >
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                    {member.name}
                  </h3>
                  <p style={{ fontSize: "1rem" }}>{member.role}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
       {/* Project Status Section */}
       <section
        style={{
          background: "linear-gradient(90deg, #007BFF, #00C9FF)",
          color: "#FFFFFF",
          padding: "60px 20px",
          textAlign: "center",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>
          Project Status: In Development
        </h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "40px" }}>
          UnityStack is currently in its initial stages as part of our final year
          project. We're working hard to bring our vision to life and create a
          platform that will revolutionize developer collaboration and mentorship.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <button
            style={{
              backgroundColor: "#FFFFFF",
              color: "#007BFF",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, background-color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#007BFF";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.color = "#007BFF";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Contact Us
          </button>
          <button
            style={{
              backgroundColor: "transparent",
              color: "#FFFFFF",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "2px solid #FFFFFF",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "transform 0.3s, background-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.color = "#007BFF";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Join US
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section
      style={{
        padding: "60px 20px",
        backgroundColor: "#F9FBFD",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            backgroundColor: "#CFF4D2",
            display: "inline-block",
            padding: "5px 15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          Frequently Asked Questions
        </h2>
        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "40px" }}>
          If you have any further questions please contact us.
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {[
          {
            question: "Will I get lifetime updates?",
            answer: "Yes, all users will receive lifetime updates to the platform.",
          },
          {
            question: "Does UnityStack provide code examples?",
            answer:
              "UnityStack provides extensive code examples and resources across multiple programming languages and frameworks. Our platform includes sample projects, code snippets, and interactive coding environments to help you learn and solve problems effectively.",
          },
          {
            question: "Do you have a free trial of UnityStack?",
            answer: "Yes, UnityStack offers a free trial to explore our features and decide if it's right for you.",
          },
          {
            question: "Who can use UnityStack?",
            answer:
              "UnityStack is designed for developers of all skill levels - from beginners looking to learn and grow, to experienced developers wanting to mentor others or collaborate on projects.",
          },
        ].map((faq, index) => (
          <div
            key={index}
            style={{
              marginBottom: "20px",
              borderBottom: "1px solid #E0E0E0",
              paddingBottom: "10px",
            }}
          >
            <button
              onClick={() => toggleFAQ(index)}
              style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                fontSize: "1rem",
                fontWeight: "bold",
                padding: "10px 0",
                cursor: "pointer",
                color: "#333",
              }}
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <p style={{ fontSize: "1rem", color: "#555", marginTop: "10px" }}>
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
      {/* Footer Section */}
     <Footer />
    </div>
  );
};

export default AboutUsPage;
