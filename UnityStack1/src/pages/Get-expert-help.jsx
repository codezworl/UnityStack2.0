"use client";

import React, { useState } from "react";
import { Search, MessageSquare, Bookmark, Star } from "lucide-react";
import Header from "F:/Final Year Project/UnityStack2.0/UnityStack1/src/components/header.jsx";
import Footer from "F:/Final Year Project/UnityStack2.0/UnityStack1/src/components/footer";

const developers = [
  {
    name: "Sarah Khan",
    price: "2,500 PKR/hr",
    rating: 4.8,
    reviews: 120,
    skills: ["React", "Node.js", "TypeScript"],
    availability: "Available Now",
    img: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Ahmed Hassan",
    price: "4,500 PKR/hr",
    rating: 4.8,
    reviews: 120,
    skills: ["React", "Node.js", "TypeScript"],
    availability: "Available in 2 hours",
    img: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Fatima Ali",
    price: "3,000 PKR/hr",
    rating: 4.8,
    reviews: 120,
    skills: ["React", "Node.js", "TypeScript"],
    availability: "Available Now",
    img: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Usman Malik",
    price: "6,000 PKR/hr",
    rating: 4.7,
    reviews: 100,
    skills: ["Python", "Django", "PostgreSQL"],
    availability: "Available tomorrow",
    img: "https://i.pravatar.cc/150?img=4",
  },
  {
    name: "Ayesha Noor",
    price: "5,000 PKR/hr",
    rating: 4.9,
    reviews: 150,
    skills: ["Angular", "Node.js", "MongoDB"],
    availability: "Available Now",
    img: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Zain Shah",
    price: "4,000 PKR/hr",
    rating: 4.6,
    reviews: 110,
    skills: ["Vue.js", "Laravel", "MySQL"],
    availability: "Available in 2 hours",
    img: "https://i.pravatar.cc/150?img=6",
  },
  {
    name: "Amna Raza",
    price: "3,500 PKR/hr",
    rating: 4.8,
    reviews: 140,
    skills: ["React Native", "Expo", "Firebase"],
    availability: "Available next week",
    img: "https://i.pravatar.cc/150?img=7",
  },
  {
    name: "Ali Zafar",
    price: "3,800 PKR/hr",
    rating: 4.7,
    reviews: 130,
    skills: ["Flutter", "Dart", "Firebase"],
    availability: "Available Now",
    img: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "Maria Khan",
    price: "4,200 PKR/hr",
    rating: 4.9,
    reviews: 200,
    skills: ["Java", "Spring", "SQL"],
    availability: "Available in 2 hours",
    img: "https://i.pravatar.cc/150?img=9",
  },
  {
    name: "Omar Khalid",
    price: "5,500 PKR/hr",
    rating: 4.5,
    reviews: 90,
    skills: ["Ruby", "Rails", "PostgreSQL"],
    availability: "Available tomorrow",
    img: "https://i.pravatar.cc/150?img=10",
  },
  {
    name: "Hira Bashir",
    price: "6,000 PKR/hr",
    rating: 4.9,
    reviews: 180,
    skills: ["Kotlin", "Android", "Firebase"],
    availability: "Available Now",
    img: "https://i.pravatar.cc/150?img=11",
  },
  {
    name: "Sameer Khan",
    price: "5,000 PKR/hr",
    rating: 4.6,
    reviews: 160,
    skills: ["Swift", "iOS", "Core Data"],
    availability: "Available next week",
    img: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Omar Khalid",
    price: "5,500 PKR/hr",
    rating: 4.5,
    reviews: 90,
    skills: ["Ruby", "Rails", "PostgreSQL"],
    availability: "Available tomorrow",
    img: "https://i.pravatar.cc/150?img=10",
  },
  {
    name: "Hira Bashir",
    price: "6,000 PKR/hr",
    rating: 4.9,
    reviews: 180,
    skills: ["Kotlin", "Android", "Firebase"],
    availability: "Available Now",
    img: "https://i.pravatar.cc/150?img=11",
  },
  {
    name: "Sameer Khan",
    price: "5,000 PKR/hr",
    rating: 4.6,
    reviews: 160,
    skills: ["Swift", "iOS", "Core Data"],
    availability: "Available next week",
    img: "https://i.pravatar.cc/150?img=12",
  },
];

export default function GetHelp() {
  const [visibleDevelopers, setVisibleDevelopers] = useState(12);

  // Show more developers
  const handleShowMore = () => {
    setVisibleDevelopers((prev) => prev + 12);
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Header />

      {/* Filter Sidebar */}
      <div
        style={{ display: "flex", justifyContent: "center", padding: "1rem" }}
      >
        <aside
          style={{
            width: "280px",
            height: "700px",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "1rem",
            border: "1px solid #E2E8F0",
            marginRight: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Filters
          </h2>
          {/* Price Range */}
          <div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Price Range
            </h3>
            {[
              "Under 2,000 PKR/hr",
              "2,000 - 4,000 PKR/hr",
              "4,000 - 6,000 PKR/hr",
              "Above 6,000 PKR/hr",
            ].map((range) => (
              <label
                key={range}
                style={{ display: "block", marginBottom: "0.8rem" }}
              >
                <input type="checkbox" />
                <span style={{ marginLeft: "0.5rem" }}>{range}</span>
              </label>
            ))}
          </div>

          {/* Immediate Assistance */}
          <div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Immediate Assistance
            </h3>
            <label>
              <input type="checkbox" />
              <span style={{ marginLeft: "0.5rem", marginBottom: "0.8rem" }}>
                Available Now
              </span>
            </label>
          </div>

          {/* Expertise Level */}
          <div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "1rem",
                marginTop: "1rem",
              }}
            >
              Expertise Level
            </h3>
            {["Junior", "Mid-Level", "Senior", "Expert"].map((level) => (
              <label
                key={level}
                style={{ display: "block", marginBottom: "0.5rem" }}
              >
                <input type="checkbox" />
                <span style={{ marginLeft: "0.5rem" }}>{level}</span>
              </label>
            ))}
          </div>

          {/* Problem Complexity */}
          <div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              Problem Complexity
            </h3>
            {["Beginner", "Intermediate", "Advanced"].map((complexity) => (
              <label
                key={complexity}
                style={{ display: "block", marginBottom: "0.5rem" }}
              >
                <input type="checkbox" />
                <span style={{ marginLeft: "0.5rem" }}>{complexity}</span>
              </label>
            ))}
          </div>
        </aside>

        <div style={{ maxWidth: "1200px", width: "100%" }}>
          <div
            style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}
          >
            {/* Search Bar */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1rem",
                backgroundColor: "white",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
              }}
            >
              <input
                type="text"
                placeholder="Describe your problem (e.g., React bug, database optimization)"
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "4px",
                  border: "1px solid #E2E8F0",
                  fontSize: "0.875rem",
                }}
              />
              <select
                style={{
                  padding: "0.75rem",
                  borderRadius: "4px",
                  border: "1px solid #E2E8F0",
                  fontSize: "0.875rem",
                }}
              >
                <option>Select Technology</option>
                <option>React</option>
                <option>Python</option>
                <option>Node.js</option>
              </select>
              <select
                style={{
                  padding: "0.75rem",
                  borderRadius: "4px",
                  border: "1px solid #E2E8F0",
                  fontSize: "0.875rem",
                }}
              >
                <option>Select Domain</option>
                <option>Web Development</option>
                <option>Data Science</option>
              </select>
              <button
                style={{
                  backgroundColor: "#2563EB",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "4px",
                  border: "none",
                  fontWeight: "500",
                }}
              >
                <Search size={16} />
                Search
              </button>
            </div>

            {/* Showing Experts and Sorting Options */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              {/* Left: Showing X experts */}
              <div>
                <span style={{ color: "#64748B", fontSize: "0.875rem" }}>
                  Showing {developers.length} experts
                </span>
              </div>

              {/* Right: Sort by and View Toggle */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                {/* Sort By Dropdown */}
                <select
                  style={{
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #E2E8F0",
                    fontSize: "0.875rem",
                    backgroundColor: "white",
                  }}
                >
                  <option>Sort by Relevancy</option>
                  <option>Available Now</option>
                  <option>Highest Rated</option>
                  <option>Most Experienced</option>
                </select>

                {/* View Toggle Icons */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    backgroundColor: "#F1F5F9",
                    padding: "0.25rem",
                    borderRadius: "0.375rem",
                  }}
                >
                  <button
                    style={{
                      padding: "0.5rem",
                      borderRadius: "0.25rem",
                      backgroundColor: "white", // Highlight the grid view
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {/* Grid View Icon */}
                    {/* SVG Icon 1 */}
                  </button>
                  <button
                    style={{
                      padding: "0.5rem",
                      borderRadius: "0.25rem",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {/* List View Icon */}
                    {/* SVG Icon 2 */}
                  </button>
                </div>
              </div>
            </div>
            {/* Featured Experts */}
            <section
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "1.5rem",
                border: "1px solid #E2E8F0",
                marginBottom: "2rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Featured Experts
              </h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around", // Keeps items evenly spaced
                  alignItems: "center",
                }}
              >
                {["Top Expert 1", "Top Expert 2", "Top Expert 3"].map(
                  (expert, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#F8FAFC",
                        padding: "1rem",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center", // Aligns items in a row
                        justifyContent: "start", // Aligns items to start of the container
                        gap: "10px", // Space between image and text content
                        width: "100%", // Each card takes full available width
                        maxWidth: "300px", // Optional: can set a max width for each card
                      }}
                    >
                      <img
                        src={`https://i.pravatar.cc/150?img=${index + 1}`}
                        alt="Expert"
                        style={{
                          width: "50px", // Smaller size for inline display
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                      <div>
                        <h3
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            margin: "0",
                          }}
                        >
                          {expert}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "#F59E0B",
                          }}
                        >
                          <svg // Star icon using SVG
                            xmlns="http://www.w3.org/2000/svg"
                            fill="yellow" // Fill the star with yellow color
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            style={{
                              width: "16px",
                              height: "16px",
                              marginRight: "4px",
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.18 0l-2.8 2.034c-.784.57-1.838-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                          <span style={{ fontSize: "0.875rem" }}>4.9</span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Developer Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)", // Sets three columns
                gap: "1.5rem",
                marginBottom: "2rem", // Adds space at the bottom
              }}
            >
              {developers.slice(0, 6).map(
                (
                  dev,
                  index // Shows only the first 6 developers
                ) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      padding: "1rem", // Reduced padding for smaller cards
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem", // Reduced gap for smaller cards
                        }}
                      >
                        <img
                          src={dev.img}
                          alt={dev.name}
                          style={{
                            width: "40px", // Smaller image
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <h3
                            style={{
                              fontSize: "0.875rem", // Smaller text
                              fontWeight: "600",
                              margin: "0",
                            }}
                          >
                            {dev.name}
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.25rem",
                              alignItems: "center",
                              color: "#EAB308",
                            }}
                          >
                            <Star size={16} />
                            <span>{dev.rating}</span>
                            <span
                              style={{ color: "#64748B", fontSize: "0.75rem" }} // Smaller text
                            >
                              ({dev.reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      <Bookmark size={20} />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "0.25rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {dev.skills.map((skill) => (
                        <span
                          key={skill}
                          style={{
                            backgroundColor: "#F1F5F9",
                            padding: "0.25rem 0.5rem",
                            fontSize: "0.75rem",
                            borderRadius: "4px",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#ECFDF5",
                          color: "#059669",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                        }}
                      >
                        {dev.availability}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          color: "#64748B",
                        }}
                      >
                        {dev.price}
                      </span>
                    </div>

                    <p style={{ color: "#64748B", fontSize: "0.75rem" }}>
                      Senior full-stack developer with expertise in{" "}
                      {dev.skills.join(", ")}.
                    </p>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        style={{
                          flex: 1,
                          backgroundColor: "#2563EB",
                          color: "white",
                          borderRadius: "4px",
                          border: "none",
                          padding: "0.75rem",
                          fontWeight: "500",
                        }}
                      >
                        <MessageSquare size={16} />
                        Chat Now
                      </button>
                      <button
                        style={{
                          flex: 1,
                          borderRadius: "4px",
                          border: "1px solid #2563EB",
                          padding: "0.75rem",
                          color: "#2563EB",
                          fontWeight: "500",
                        }}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Show More Button */}
            {visibleDevelopers < developers.length && (
              <button
                onClick={handleShowMore}
                style={{
                  marginTop: "2rem",
                  display: "block",
                  backgroundColor: "#2563EB",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "4px",
                  border: "none",
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontWeight: "500",
                }}
              >
                Show More
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
