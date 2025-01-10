import React from "react";
import Header from "./header";
import Footer from "./footer";

const AdvanceSearch = () => {
  // Styles
  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
    color: "#1e293b",
  };

  const headingStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const formStyle = {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    marginBottom: "30px",
  };

  const inputStyle = {
    padding: "10px 15px",
    fontSize: "16px",
    border: "1px solid #d1d5db",
    borderRadius: "5px",
    width: "100%",
  };

  const buttonStyle = {
    backgroundColor: "#2563EB",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width: "fit-content",
    alignSelf: "center",
  };

  const buttonHoverStyle = {
    backgroundColor: "#1E40AF", // Darker blue on hover
  };

  return (
    <div>
      <Header />
      <div style={containerStyle}>
        <h1 style={headingStyle}>Advanced Search</h1>
        <form style={formStyle}>
          <input
            type="text"
            placeholder="Search by title or keywords"
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Location (e.g., city, state, or remote)"
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Category (e.g., Frontend, Backend)"
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Experience level (e.g., Junior, Mid, Senior)"
            style={inputStyle}
          />
        </form>
        <button
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = buttonStyle.backgroundColor)
          }
        >
          Search
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default AdvanceSearch;
