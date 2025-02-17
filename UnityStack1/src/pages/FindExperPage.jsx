import React from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../components/header";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import effortless from "../assets/effortless.png";
import reliable from "../assets/reliable.jpg";


const ExpertButton = ({ text }) => (
  <motion.button
    whileHover={{ 
      scale: 1.02,
      backgroundColor: "#f5f5f5" 
    }}
    whileTap={{ scale: 0.98 }}
    style={{
      background: "none",
      border: "none",
      color: "#666",
      padding: "8px 12px",
      textAlign: "left",
      width: "100%",
      cursor: "pointer",
      borderRadius: "4px",
      marginBottom: "8px",
      transition: "color 0.2s ease",
    }}
    onClick={() => console.log(`Selected: ${text}`)}
  >
    {text}
  </motion.button>
);

const CategorySection = ({ title, color, experts }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    style={{ padding: "10px 0" }}
  >
    <h3 style={{
      display: "flex",
      alignItems: "center",
      color: "#333",
      marginBottom: "15px",
      fontWeight: "600"
    }}>
      <motion.span
        whileHover={{ scale: 1.1 }}
        style={{
          width: "24px",
          height: "24px",
          backgroundColor: color,
          borderRadius: "50%",
          marginRight: "10px"
        }}
      ></motion.span>
      {title}
    </h3>
    <div>
      {experts.map((expert, index) => (
        <ExpertButton key={index} text={expert} />
      ))}
    </div>
  </motion.div>
);

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    style={{
      background: "#FFFFFF",
      borderRadius: "8px",
      padding: "30px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      textAlign: "center",
    }}
  >
    <div style={{ marginBottom: "20px" }}>
      <img 
        src={icon} 
        alt={title} 
        style={{ 
          height: "120px",
          objectFit: "contain",
          width: "auto"
        }} 
      />
    </div>
    <h3 style={{ 
      fontSize: "22px", 
      color: "#333", 
      marginBottom: "15px",
      fontWeight: "600" 
    }}>
      {title}
    </h3>
    <p style={{ 
      color: "#666",
      fontSize: "16px",
      lineHeight: "1.6"
    }}>
      {description}
    </p>
  </motion.div>
);

const FindExpert = () => {
  const navigate = useNavigate();
  const categories = [
    {
      title: "Web Programming",
      color: "#4A90E2",
      experts: [
        "HTML/CSS developers",
        "JavaScript developers",
        "Python developers",
        "PHP developers",
        "Ruby developers",
        "Vue developers",
        "Angular developers",
        "Django developers",
        "Node.js developers",
        "WordPress developers",
        "Laravel developers",
        "ASP.NET developers",
        "TypeScript developers",
        "React developers"
      ]
    },
    {
      title: "Database/Operation",
      color: "#50E3C2",
      experts: [
        "MySQL developers",
        "MongoDB developers",
        "DevOps developers",
        "SQL developers",
        "PostgreSQL developers",
        "Microsoft Access developers",
        "Linux developers",
        "Amazon Web Services developers",
        "Google Cloud Platform developers",
        "Microsoft Azure developers"
      ]
    },
    {
      title: "Design/UX",
      color: "#F5A623",
      experts: [
        "HTML/CSS developers",
        "Bootstrap developers",
        "Figma developers",
        "Material UI developers"
      ]
    },
    {
      title: "Data Science & Analysis",
      color: "#7ED321",
      experts: [
        "Python developers",
        "R developers",
        "Excel/VBA developers",
        "Tableau developers",
        "Data Science developers",
        "Deep learning developers"
      ]
    },
    {
      title: "Mobile/App",
      color: "#BD10E0",
      experts: [
        "Java developers",
        "Android developers",
        "iOS developers",
        "Swift developers",
        "Flutter developers",
        "React Native developers"
      ]
    },
    {
      title: "DevOps",
      color: "#E74C3C",
      experts: [
        "Jenkins developers",
        "Docker developers",
        "Machine learning developers",
        "Selenium developers",
        "Kubernetes developers"
      ]
    },
    {
      title: "Others",
      color: "#9B59B6",
      experts: [
        "Algorithm developers",
        "Blockchain developers",
        "Computer science developers",
        "Software development mentors",
        "Front-end developers"
      ]
    }
  ];

  const handleGetHelp = () => {
    navigate('/Getexperthelp');
  };

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#fff",
        }}
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ 
            textAlign: "center", 
            marginBottom: "60px",
            backgroundColor: "#0A2540",
            padding: "60px 20px",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ 
                fontSize: "32px", 
                color: "#fff",
                marginBottom: "20px" 
              }}
            >
              Connect with Expert Developers for Your Projects
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ 
                color: "#fff",
                fontSize: "16px",
                marginBottom: "30px",
                maxWidth: "800px",
                margin: "0 auto 25px",
                opacity: "0.9"
              }}
            >
              Get personalized help from experienced developers for your academic projects, 
              assignments, and coding challenges. Our experts are ready to assist you with 
              one-on-one guidance in any programming language or technology stack.
            </motion.p>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "#f8f9fa",
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{
                backgroundColor: "#ffffff",
                color: "#0A2540",
                border: "none",
                padding: "14px 28px",
                borderRadius: "6px",
                fontSize: "18px",
                cursor: "pointer",
                fontWeight: "500",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
              onClick={handleGetHelp}
            >
              GET HELP NOW
            </motion.button>
          </div>
        </motion.div>

        {/* Expert Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ 
            padding: "0 20px 60px",
            maxWidth: "1200px",
            margin: "0 auto"
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{ 
              fontSize: "26px", 
              marginBottom: "15px",
              color: "#333",
              textAlign: "center",
              fontWeight: "bold"
            }}
          >
            What kind of programming expert do you need?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ 
              marginBottom: "40px",
              color: "#666",
              textAlign: "center",
              fontSize: "16px",
              maxWidth: "750px",
              margin: "0 auto 40px"
            }}
          >
            Codementor has programming experts in every tech stack. Check out the list below to find experts that fit your needs.
          </motion.p>

          <motion.div
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "40px",
              padding: "20px"
            }}
          >
            {categories.map((category, index) => (
              <CategorySection
                key={index}
                title={category.title}
                color={category.color}
                experts={category.experts}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            padding: "80px 20px",
            backgroundColor: "#f8f9fa"
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                fontSize: "32px",
                color: "#0A2540",
                textAlign: "center",
                marginBottom: "60px",
                fontWeight: "bold"
              }}
            >
              What you'll find on Our Platform
            </motion.h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
              marginBottom: "50px"
            }}>
              <FeatureCard
                // icon={varietyTech}
                title="A variety of technologies"
                description="From JavaScript and React to Swift and Go, our mentors cover it all."
              />
              <FeatureCard
                icon={reliable}
                title="Reliable mentors"
                description="Our mentors go through a strict application and vetting process, leaving only the best."
              />
              <FeatureCard
                icon={effortless}
                title="Effortless setup"
                description="Take advantage of our easy set up and billing process to connect with mentors right away."
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "#ff3333"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetHelp}
                style={{
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  padding: "16px 32px",
                  borderRadius: "6px",
                  fontSize: "18px",
                  cursor: "pointer",
                  fontWeight: "500",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                GET HELP NOW
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <Footer />
    </>
  );
};

export default FindExpert;
