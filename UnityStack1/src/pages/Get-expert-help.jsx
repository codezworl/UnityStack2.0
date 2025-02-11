import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

const GetHelp = () => {
  const [developers, setDevelopers] = useState([]); // ✅ Ensure state is an array
  const [visibleDevelopers, setVisibleDevelopers] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/developers");

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format. Expected an array.");
        }

        setDevelopers(data);
      } catch (err) {
        console.error("Error fetching developers:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  const handleShowMore = () => {
    setVisibleDevelopers((prev) => prev + 12);
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Header />

      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
        {/* ✅ Sidebar Before Developer Cards */}
        <aside
          style={{
            width: "280px",
            height: "auto",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "1rem",
            border: "1px solid #E2E8F0",
            marginRight: "2rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
            Filters
          </h2>

          {/* Price Range */}
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>
              Price Range
            </h3>
            {["Under 2,000 PKR/hr", "2,000 - 4,000 PKR/hr", "4,000 - 6,000 PKR/hr", "Above 6,000 PKR/hr"].map((range) => (
              <label key={range} style={{ display: "block", marginBottom: "0.8rem" }}>
                <input type="checkbox" />
                <span style={{ marginLeft: "0.5rem" }}>{range}</span>
              </label>
            ))}
          </div>

          {/* Expertise Level */}
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", marginTop: "1rem" }}>
              Expertise Level
            </h3>
            {["Junior", "Mid-Level", "Senior", "Expert"].map((level) => (
              <label key={level} style={{ display: "block", marginBottom: "0.5rem" }}>
                <input type="checkbox" />
                <span style={{ marginLeft: "0.5rem" }}>{level}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Main Developer Cards Section */}
        <div style={{ maxWidth: "1200px", width: "100%" }}>
          {loading ? (
            <p>Loading developers...</p>
          ) : error ? (
            <p style={{ color: "red" }}>Error: {error}</p>
          ) : developers.length === 0 ? (
            <p>No developers available at the moment.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              {developers.slice(0, visibleDevelopers).map((dev, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    padding: "1rem",
                  }}
                >
                  {/* ✅ Profile Picture and Name */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <img
                      src={dev.profileImage || "https://i.pravatar.cc/150?img=1"}
                      alt={dev.firstName}
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                    <div>
                      <h3>{dev.firstName} {dev.lastName}</h3>
                      
                      {/* ✅ Rating Below Name */}
                      <div style={{ display: "flex", alignItems: "center", color: "#F59E0B" }}>
                        <Star size={16} /> {dev.rating || "0.0"} ({dev.reviews || 0} reviews)
                      </div>

                      {/* ✅ Display Domain Tags Below Rating */}
                      <div style={{ marginTop: "8px" }}>
                        {dev.domainTags && dev.domainTags.length > 0 ? (
                          dev.domainTags.map((tag, idx) => (
                            <span
                              key={idx}
                              style={{
                                display: "inline-block",
                                backgroundColor: "#E2E8F0",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                marginRight: "5px",
                                color: "#1D4ED8",
                              }}
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: "#64748B", fontSize: "12px" }}>No domain tags</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p>{dev.availability}</p>
                  <p>{dev.hourlyRate ? `${dev.hourlyRate} PKR/hr` : "Price not set"}</p>

                  <Link to={`/profile/${dev._id}`}>
                    <button style={{ backgroundColor: "#2563EB", color: "white", padding: "8px 16px", borderRadius: "4px", border: "none" }}>
                      View Profile
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Show More Button */}
          {visibleDevelopers < developers.length && (
            <button onClick={handleShowMore} style={{ display: "block", margin: "auto", backgroundColor: "#2563EB", color: "white", padding: "10px 20px", borderRadius: "4px", border: "none" }}>
              Show More
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GetHelp;
