import React, { useState } from "react";
import Header from "./header";
import Footer from "./footer";
import { Link } from "react-router-dom"; 
export default function AllQuestionsPage() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Newest");
  const [isHovered, setIsHovered] = useState(false);
  const handleTabClick = (tab) => setSelectedTab(tab);
  const handleMoreToggle = () => setIsMoreOpen((prev) => !prev);
  const handleFilterToggle = () => setIsFilterOpen((prev) => !prev);
  const tags = [
    { name: "react", count: 2543 },
    { name: "javascript", count: 1876 },
    { name: "node.js", count: 1234 },
    { name: "python", count: 987 },
    { name: "mongodb", count: 765 },
    { name: "next.js", count: 654 },
    { name: "typescript", count: 543 },
    { name: "express", count: 432 },
  ];

  const handleTagClick = (tag) => {
    console.log(`You clicked on tag: ${tag}`);
    // Redirect or filter questions based on the clicked tag
    // For example: window.location.href = `/questions?tag=${tag}`;
  };
  // Mock Data
  const questions = [
    {
      id: 1,
      title: "How to implement real-time chat in Next.js?",
      description:
        "I'm trying to implement a real-time chat feature using Next.js and WebSockets...",
      tags: ["next.js", "react", "websockets"],
      votes: 15,
      answers: 3,
      views: 234,
      askedBy: "Sarah Ahmed",
      time: "2 hours ago",
      status: "Solved",
    },
    {
      id: 2,
      title: "TypeError: Cannot read property 'map' of undefined in React",
      description:
        "I'm getting this error when trying to map over an array in React...",
      tags: ["react", "javascript", "typescript"],
      votes: 8,
      answers: 5,
      views: 156,
      askedBy: "Muhammad Ali",
      time: "4 hours ago",
      status: "Solved",
    },
    {
      id: 3,
      title: "How to optimize database queries in Node.js?",
      description:
        "Looking for best practices to optimize MongoDB queries in a Node.js application...",
      tags: ["node.js", "mongodb", "performance"],
      votes: 23,
      answers: 7,
      views: 567,
      askedBy: "Zainab Khan",
      time: "1 day ago",
      status: "Solved",
    },
  ];

  // Styles
  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
  };

  const questionCardStyle = {
    backgroundColor: "#FFFFFF",
    padding: "1.5rem",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    marginBottom: "1.5rem",
  };

  const sidebarStyle = {
    backgroundColor: "#FFFFFF",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    maxHeight: "fit-content",
  };

  const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    marginTop: "2rem",
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  // Error handling (if no questions)
  if (questions.length === 0) {
    return (
      <div style={containerStyle}>
        <h1>No Questions Found</h1>
        <p>There are currently no questions available. Try again later.</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Header />
      {/* Main Content */}
      <div style={containerStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 1fr",
            gap: "2rem",
          }}
        >
          {/* Main Questions Area */}
          <div>
            {/* Search Bar and Filters */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              {/* Left: Title */}
              <h1 style={{ fontSize: "1.5rem", fontWeight: "600", margin: 0 }}>
                All Questions
              </h1>

              {/* Right: Ask Question Button */}
              <button
                style={{
                  backgroundColor: "#2563EB",
                  color: "#FFFFFF",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Ask Question
              </button>
            </div>

            {/* Search Bar Section */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                backgroundColor: "white",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
              }}
            >
              <input
                type="text"
                placeholder="Search questions..."
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  fontSize: "0.875rem",
                }}
              />
              <button
                style={{
                  backgroundColor: "#2563EB",
                  color: "#FFFFFF",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "1rem",
                  }}
                >
                  🔍
                </span>{" "}
                Search
              </button>
            </div>

            <div style={{ padding: "1rem", backgroundColor: "#F8FAFC" }}>
              {/* Filter Tab */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #E2E8F0",
                  paddingBottom: "0.5rem",
                }}
              >
                {/* Tabs */}
                <div style={{ display: "flex", gap: "1rem" }}>
                  {["Newest", "Active", "Unanswered", "Most voted"].map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "4px",
                          border: "none",
                          backgroundColor:
                            selectedTab === tab ? "#2563EB" : "transparent",
                          color: selectedTab === tab ? "#FFFFFF" : "#1E293B",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        {tab}
                      </button>
                    )
                  )}

                  {/* More Dropdown */}
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={handleMoreToggle}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        border: "1px solid #E2E8F0",
                        backgroundColor: "transparent",
                        color: "#1E293B",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                    >
                      More
                    </button>
                    {isMoreOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "2.5rem",
                          left: 0,
                          backgroundColor: "#FFFFFF",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          borderRadius: "4px",
                          zIndex: 10,
                          width: "200px",
                        }}
                      >
                        {[
                          "Frequent",
                          "Score",
                          "Trending",
                          "Week",
                          "Month",
                          "Custom Filters",
                        ].map((option) => (
                          <div
                            key={option}
                            style={{
                              padding: "0.5rem 1rem",
                              fontSize: "0.875rem",
                              color: "#1E293B",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setSelectedTab(option);
                              setIsMoreOpen(false);
                            }}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Question Count and Filter Button */}
                <div
                  style={{ display: "flex", gap: "1rem", alignItems: "center" }}
                >
                  {/* Question Count */}
                  <div style={{ fontSize: "0.875rem", color: "#64748B" }}>
                    24,241,806 questions
                  </div>

                  {/* Filter Button */}
                  <button
                    onClick={handleFilterToggle}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                      border: "1px solid #E2E8F0",
                      backgroundColor: isHovered ? "#2563EB" : "transparent",
                      color: isHovered ? "#FFFFFF" : "#2563EB",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.3s, color 0.3s",
                    }}
                  >
                    Filter
                  </button>
                </div>
              </div>

              {/* Filter Section */}
              {isFilterOpen && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                    }}
                  >
                    Filter Options
                  </h3>
                  <div style={{ display: "flex", gap: "2rem" }}>
                    {/* Filter By */}
                    <div>
                      <h4
                        style={{
                          fontSize: "1rem",
                          fontWeight: "500",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Filter by
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <label>
                          <input type="checkbox" /> No answers
                        </label>
                        <label>
                          <input type="checkbox" /> No accepted answer
                        </label>
                        <label>
                          <input type="checkbox" /> Has bounty
                        </label>
                        <label>
                          <input
                            type="number"
                            placeholder="Days old"
                            style={{
                              padding: "0.5rem",
                              border: "1px solid #E2E8F0",
                              borderRadius: "4px",
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Sorted By */}
                    <div>
                      <h4
                        style={{
                          fontSize: "1rem",
                          fontWeight: "500",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Sorted by
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        {[
                          "Newest",
                          "Recent activity",
                          "Highest score",
                          "Most frequent",
                          "Bounty ending soon",
                          "Trending",
                          "Most activity",
                        ].map((option) => (
                          <label key={option}>
                            <input type="radio" name="sortedBy" /> {option}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Tagged With */}
                    <div>
                      <h4
                        style={{
                          fontSize: "1rem",
                          fontWeight: "500",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Tagged with
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <label>
                          <input type="radio" name="taggedWith" /> My watched
                          tags
                        </label>
                        <label>
                          <input type="radio" name="taggedWith" /> The following
                          tags:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. javascript or python"
                          style={{
                            padding: "0.5rem",
                            border: "1px solid #E2E8F0",
                            borderRadius: "4px",
                            width: "100%",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div
                    style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}
                  >
                    <button
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#2563EB",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Apply Filter
                    </button>
                    <button
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "transparent",
                        color: "#2563EB",
                        border: "1px solid #E2E8F0",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Question Cards */}
            <div>
              {questions.map((question) => (
                <div key={question.id} style={questionCardStyle}>
                  {/* Question Title with Dynamic Link */}
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Link
                      to={`/questionthread/${question.id}`} // Navigate dynamically to the questionthread route
                      style={{
                        textDecoration: "none",
                        color: "#2563EB",
                        transition: "color 0.3s",
                      }}
                      onMouseOver={(e) => (e.target.style.color = "#1D4ED8")} // Hover effect
                      onMouseOut={(e) => (e.target.style.color = "#2563EB")}
                    >
                      {question.title}
                    </Link>
                  </h3>
                  <p style={{ color: "#64748B", marginBottom: "0.5rem" }}>
                    {question.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          backgroundColor: "#E5E7EB",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                          color: "#1E293B",
                        }}
                      >
                        {tag}
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
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <span style={{ color: "#1E293B" }}>
                        <strong>{question.votes}</strong> votes
                      </span>
                      <span style={{ color: "#1E293B" }}>
                        <strong>{question.answers}</strong> answers
                      </span>
                      <span style={{ color: "#1E293B" }}>
                        <strong>{question.views}</strong> views
                      </span>
                    </div>
                    <div style={{ color: "#64748B", fontSize: "0.875rem" }}>
                      Asked by {question.askedBy} • {question.time} •{" "}
                      <span
                        style={{
                          color:
                            question.status === "Solved"
                              ? "#059669"
                              : "#DC2626",
                        }}
                      >
                        {question.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div style={paginationStyle}>
              {[1, 2, 3, 4, "...", 10].map((page, index) => (
                <button
                  key={index}
                  style={{
                    ...buttonStyle,
                    backgroundColor: page === 1 ? "#2563EB" : "#E5E7EB",
                    color: page === 1 ? "#FFFFFF" : "#1E293B",
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside style={sidebarStyle}>
            {/* Popular Tags */}
            <div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Popular Tags
              </h3>
              <div>
                {tags.map((tag) => (
                  <div
                    key={tag.name}
                    onClick={() => handleTagClick(tag.name)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#F1F5F9",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      color: "#2563EB",
                      marginBottom: "0.5rem",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                  >
                    <span>{tag.name}</span>
                    <span
                      style={{
                        backgroundColor: "#E5E7EB",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.375rem",
                        color: "#64748B",
                        fontWeight: "500",
                      }}
                    >
                      {tag.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Filter Questions */}
            <div style={{ marginBottom: "2rem", marginTop: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Filter Questions
              </h3>
              <select
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  marginBottom: "1rem",
                }}
              >
                <option>All Questions</option>
                <option>Answered</option>
                <option>Unanswered</option>
              </select>
              <select
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <option>All Time</option>
                <option>Past Week</option>
                <option>Past Month</option>
              </select>
              <button
                style={{ ...buttonStyle, width: "100%", marginTop: "1rem" }}
              >
                Apply Filters
              </button>
            </div>

            {/* Need Help */}
            <div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Need Help?
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
                Check out our guide on how to ask good questions and get better
                answers from the community.
              </p>
              <button
                style={{
                  ...buttonStyle,
                  width: "100%",
                  backgroundColor: "#059669",
                }}
              >
                View Guide
              </button>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
