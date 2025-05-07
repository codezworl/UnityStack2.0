import React, { useState, useEffect, useCallback, useMemo } from "react";
import Header from "./header";
import Footer from "./footer";
import { Link } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Question() {
  const [showNoResultsModal, setShowNoResultsModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Newest");
  const [isHovered, setIsHovered] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  const [showMyQuestions, setShowMyQuestions] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    title: "",
    details: "",
    tags: []
  });

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 2;
  const handleTabClick = (tab) => {
    setSelectedTab(tab); // Set the selected tab for filtering questions
    setCurrentPage(1); // reset to the first page when filter is changed
  };
  const handleMoreToggle = () => setIsMoreOpen((prev) => !prev);
  const handleFilterToggle = () => setIsFilterOpen((prev) => !prev);
  const [tags, setTags] = useState([]);  // State to store fetched tags
  const [selectedTag, setSelectedTag] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    mostAnswered: false,
    unanswered: false,
    daysOld: "",  // User will input the number of days
    sortedBy: "Newest",  // Default sort option
    taggedWith: "",  // Tag the user can input
  });
  const [filterApplied, setFilterApplied] = useState(false);  // New state to track if filter is applied
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Fetch question and answers


  const handleFilterChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (type === "checkbox") {
      setFilterOptions((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else if (type === "radio") {
      setFilterOptions((prevState) => ({
        ...prevState,
        [name]: value,  // Update sortedBy value
      }));
    } else if (type === "text" || type === "number") {
      setFilterOptions((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleFilterApply = async () => {
    try {
      let query = "";
      // Apply checkboxes for Most Answered and Unanswered
      if (filterOptions.mostAnswered) {
        query += "&sortBy=mostAnswered";
      }
      if (filterOptions.unanswered) {
        query += "&sortBy=unanswered";
      }
      if (filterOptions.daysOld) {
        query += `&daysOld=${filterOptions.daysOld}`;
      }
      if (filterOptions.sortedBy) {
        query += `&sortBy=${filterOptions.sortedBy}`;
      }
      if (filterOptions.taggedWith) {
        query += `&tag=${filterOptions.taggedWith}`;
      }
  
      // Construct the final URL with the selected filters
      const finalUrl = `http://localhost:5000/api/questions?${query}`;
  
      const res = await fetch(finalUrl, {
        credentials: "include",
      });
  
      if (!res.ok) throw new Error("Failed to fetch questions");
  
      const data = await res.json();
      setQuestions(data.questions);  // Update the questions with filtered data
  
      // Close the filter options and mark filter as applied
      setIsFilterOpen(false);
      setFilterApplied(true);  // Mark filter as applied
    } catch (err) {
      console.error("❌ Error applying filters:", err.message);
    }
  };
  


  useEffect(() => {
    const fetchQuestionsAndTags = async () => {
      try {
        const query = selectedTag ? `?tag=${selectedTag}` : ''; // If a tag is selected, include it
        let sortParam = '';
    
        // If a tab is selected, append the sorting query
        if (selectedTab === 'Newest') {
          sortParam = 'sortBy=newest';
        } else if (selectedTab === 'Oldest') {
          sortParam = 'sortBy=oldest';
        } else if (selectedTab === 'Most Answered') {
          sortParam = 'sortBy=mostAnswered';
        } else if (selectedTab === 'Unanswered') {
          sortParam = 'sortBy=unanswered';
        }
    
        // Construct the final URL without search parameters
        const finalUrl = `http://localhost:5000/api/questions${query ? query + '&' : '?'}${sortParam}`;
    
        const res = await fetch(finalUrl, {
          credentials: "include",
        });
    
        if (!res.ok) throw new Error("Failed to fetch questions");
    
        const data = await res.json();
        setQuestions(data.questions);  // Set the questions
        setTags(data.tags);            // Set the tags with counts
      } catch (err) {
        console.error("❌ Error loading questions and tags:", err.message);
      }
    };
    
    

    if (!isSearching) {
      fetchQuestionsAndTags();  // Fetch without search filter
    }
  }, [selectedTag, selectedTab, isSearching]);  // Fetch again when selectedTab changes
  // Fetch again when selectedTab changes




  // Empty dependency ensures it runs once on component mount
  // The empty dependency array ensures this effect runs only once when the component is mounted.


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user", {
          credentials: "include"
        });
        if (!res.ok) throw new Error("User fetch failed");

        const data = await res.json();
        setCurrentUserId(data.id);
        setUserName(data.name);
        setUserRole(data.role);
        console.log("✅ Logged in as:", data.name, data.role);
      } catch (err) {
        console.warn("❌ User not logged in:", err.message);
      }
    };
    fetchUser();
  }, []);



  const toggleMyQuestions = () => {
    setShowMyQuestions(prev => !prev);
    setCurrentPage(1); // reset paginator
  };
  const handleTagClick = async (tag) => {
    setSelectedTag(tag); // Set the selected tag for filtering questions

    try {
      const res = await fetch(`http://localhost:5000/api/questions/tag?tag=${tag}`); // Fetch filtered questions based on tag
      if (!res.ok) {
        throw new Error("Failed to fetch filtered questions");
      }

      const data = await res.json();  // Parse the response
      setQuestions(data);  // Update questions with filtered data
    } catch (err) {
      console.error("Error fetching filtered questions:", err.message);
    }
  };



  const guideContent = [
    {
      title: "How to Ask a Good Question",
      icon: "❓",
      steps: [
        "Be specific about your problem",
        "Include relevant code snippets",
        "Explain what you've tried",
        "Use proper formatting and tags",
        "Proofread before posting"
      ]
    },
    {
      title: "How to Answer Questions",
      icon: "✍",
      steps: [
        "Read the question carefully",
        "Provide clear explanations",
        "Include code examples when relevant",
        "Be respectful and constructive",
        "Follow up on clarifications"
      ]
    },
    {
      title: "Using Filters Effectively",
      icon: "🔍",
      steps: [
        "Use tags to narrow your search",
        "Filter by question status",
        "Sort by relevance or date",
        "Combine multiple filters",
        "Save common filter combinations"
      ]
    }
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



  const buttonStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const paginationData = useMemo(() => {
    let filteredQuestions = [...questions];

    // 👇 If "My Questions" is toggled
    if (showMyQuestions && currentUserId) {
      filteredQuestions = filteredQuestions.filter(q => q.user === currentUserId);
    }

    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

    return { currentQuestions, totalPages };
  }, [currentPage, questionsPerPage, questions, currentUserId, showMyQuestions]);


  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= paginationData.totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle modal close
  const handleCloseModal = () => {
    setShowNoResultsModal(false);
  };
  const handleDelete = async (questionId) => {
    console.log("Deleting question with ID:", questionId); // Log question ID to check
    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/questions/${questionId}`, {
        method: "DELETE",
        credentials: "include", // Sends cookie for authentication
      });

      if (res.ok) {
        setQuestions((prev) => prev.filter((q) => q._id !== questionId));
      } else {
        const error = await res.json();
        console.error("Error:", error);  // Log the error response
        alert("Failed to delete question");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };


  const handleEdit = (question) => {
    setEditData({
      _id: question._id,
      title: question.title,
      details: question.details,
      tags: question.tags.join(", ")
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/questions/${editData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          title: editData.title,
          details: editData.details,
          tags: editData.tags.split(",").map(tag => tag.trim())
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setQuestions((prev) =>
          prev.map((q) => (q._id === updated._id ? updated : q))
        );
        setEditModalOpen(false);
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error("❌ Edit error:", err);
    }
  };

  const handleRemoveFilter = () => {
    // Reset filter options
    setFilterOptions({
      mostAnswered: false,
      unanswered: false,
      daysOld: "",
      sortedBy: "Newest",  // Default sorting
      taggedWith: "",
    });
    
    // Reset other states related to the filter
    setSelectedTag(null);  // Reset tag filter
    setFilterApplied(false);  // Reset filter applied state
  
    // Close the filter options
    setIsFilterOpen(false);
  
    // Fetch all questions again (without filters)
    fetchQuestionsAndTags();  // Function that fetches all questions
  };
  
  

  const handleQuestionClick = async (questionId) => {
    if (!currentUserId) {
      return; // If the user is not logged in, don't update the view count
    }

    const question = questions.find(q => q._id === questionId);

    if (question.user === currentUserId) {
      return; // If the user is the owner of the question, don't increment views
    }

    try {
      const res = await fetch(`http://localhost:5000/api/questions/${questionId}/view`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (res.ok) {
        // Handle the success response (e.g., update the UI if necessary)
        const updatedQuestion = await res.json();
        setQuestions(prevQuestions => prevQuestions.map(q => q._id === questionId ? updatedQuestion : q));
      } else {
        console.error('Failed to increment view count');
      }
    } catch (err) {
      console.error('Error updating view count:', err.message);
    }
  };
  

// Handle Search Input Change
const handleSearchChange = (e) => {
  setSearchQuery(e.target.value);
  if (e.target.value.trim() !== "") {
    setIsSearching(true); // When there's text in the search, set search to active
  } else {
    setIsSearching(false); // When the search bar is cleared, set search to inactive
  }
};
const handleSearchKeyPress = (e) => {
  if (e.key === "Enter") {
    fetchSearchResults();
  }
};

const fetchSearchResults = async () => {
  try {
    const query = searchQuery ? `?search=${searchQuery}` : "";
    const res = await fetch(`http://localhost:5000/api/questions${query}`, { credentials: "include" });
    const data = await res.json();
    setQuestions(data.questions);
  } catch (err) {
    console.error("Error fetching search results:", err.message);
  }
};

// Trigger search when the user presses Enter


const clearSearch = () => {
  setSearchQuery("");  // Clear search input
  setIsSearching(false); // Reset the searching state
  setSelectedTag(null);  // Clear any tag selection
  setFilterOptions({
    mostAnswered: false,
    unanswered: false,
    daysOld: "",
    sortedBy: "Newest",
    taggedWith: "",
  }); // Reset filter options to defaults
  setFilterApplied(false); // Reset filter applied state
  
  // Fetch questions again without any search or filter
  fetchQuestionsAndTags(); // Fetch all questions without search/filter
};
const highlightText = (text, query) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi"); // Case-insensitive search
  return text.replace(regex, `<span style="background-color: yellow;">$1</span>`);
};
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
      >
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
                <h1
                  style={{ fontSize: "1.5rem", fontWeight: "600", margin: 0 }}
                >
                  All Questions
                </h1>

                {/* Right: Ask Question Button */}
                <button
                  onClick={() => navigate("/askquestion")}
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
              {currentUserId && (
                <button
                  onClick={toggleMyQuestions}
                  style={{
                    marginRight: "10px",
                    backgroundColor: showMyQuestions ? "#F59E0B" : "#2563EB",
                    color: "#FFFFFF",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                >
                  {showMyQuestions ? "All Questions" : "My Questions"}
                </button>
              )}

              {/* Search Bar */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  backgroundColor: "white",
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ position: "relative", flex: 1 }}>
                <input
      type="text"
      placeholder="Search questions..."
      value={searchQuery}
      onChange={handleSearchChange}
      onKeyPress={handleSearchKeyPress}
      style={{
        width: "100%",
        padding: "0.75rem 1rem 0.75rem 2.5rem",
        borderRadius: "8px",
        border: "1px solid #E2E8F0",
        fontSize: "0.875rem",
        fontFamily: "Poppins, sans-serif",
        transition: "all 0.3s ease",
        outline: "none",
      }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#2563EB";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(37, 99, 235, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#E2E8F0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94A3B8",
                      fontSize: "1.25rem",
                    }}
                  >
                    🔍
                  </span>
                </div>
                <button
    onClick={clearSearch}
    style={{
      padding: "0.5rem 1rem",
      backgroundColor: "#F59E0B",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    Clear Search
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
  {["Newest", "Oldest", "Most Answered", "Unanswered"].map((tab) => (
    <button
      key={tab}
      onClick={() => handleTabClick(tab)}
      disabled={isSearching} // Disable the tabs when searching
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        border: "none",
        backgroundColor: selectedTab === tab ? "#2563EB" : "transparent", // Active tab color
        color: selectedTab === tab ? "#FFFFFF" : "#1E293B", // No change in color when disabled
        fontWeight: "500",
        cursor: isSearching ? "not-allowed" : "pointer", // Change cursor when disabled
      }}
    >
      {tab}
    </button>
  ))}
</div>


                  
                  {filterApplied && (
  <button
    onClick={handleRemoveFilter}
    style={{
      backgroundColor: "#F59E0B",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      padding: "0.5rem 1rem",
      fontWeight: "600",
    }}
  >
    Remove Filter
  </button>
)}
                  {/* Right Side: Question Count and Filter Button */}
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    {/* Question Count */}
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#64748B",
                        fontFamily: "Poppins, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      <span style={{ fontWeight: "600", color: "#1E293B" }}>
                        {questions.length}
                      </span>
                      <span>questions</span>
                    </div>

                    {/* Filter Button */}
                    <button
  onClick={handleFilterToggle}
  disabled={isSearching} // Disable when searching
  style={{
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    border: "1px solid #E2E8F0",
    backgroundColor: isSearching ? "gray" : isHovered ? "#2563EB" : "transparent",
    color: isSearching ? "#A1A1A1" : isHovered ? "#FFFFFF" : "#2563EB", // Change text color when disabled
    fontWeight: "500",
    cursor: isSearching ? "not-allowed" : "pointer", // Disable pointer when searching
    transition: "background-color 0.3s, color 0.3s",
  }}
>
  Filter
</button>
                  </div>
                </div>

                {/* Filter Section */}
                {/* Filter Options Section */}
{isFilterOpen && (
  <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
    <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Filter Options</h3>
    <div style={{ display: "flex", gap: "2rem" }}>
      {/* Filter By */}
      <div>
        <h4 style={{ fontSize: "1rem", fontWeight: "500", marginBottom: "0.5rem" }}>Filter by</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label>
            <input
              type="checkbox"
              name="mostAnswered"
              checked={filterOptions.mostAnswered}
              onChange={handleFilterChange}
            /> Most Answered
          </label>
          <label>
            <input
              type="checkbox"
              name="unanswered"
              checked={filterOptions.unanswered}
              onChange={handleFilterChange}
            /> Unanswered
          </label>

          <label>
            <input
              type="number"
              name="daysOld"
              value={filterOptions.daysOld}
              onChange={handleFilterChange}
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
        <h4 style={{ fontSize: "1rem", fontWeight: "500", marginBottom: "0.5rem" }}>Sorted by</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {["Newest", "Oldest", "Highest views", "Lowest Views"].map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="sortedBy"
                value={option}
                checked={filterOptions.sortedBy === option}
                onChange={handleFilterChange}
              /> {option}
            </label>
          ))}
        </div>
      </div>

      {/* Tagged With */}
      <div>
        <h4 style={{ fontSize: "1rem", fontWeight: "500", marginBottom: "0.5rem" }}>Tagged with</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label>
            <input
              type="radio"
              name="taggedWith"
              value="followingTags"
              checked={filterOptions.taggedWith === "followingTags"}
              onChange={handleFilterChange}
            /> The following tags:
          </label>
          <input
            type="text"
            name="taggedWith"
            value={filterOptions.taggedWith}
            onChange={handleFilterChange}
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
    <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
      <button
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#2563EB",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={handleFilterApply}
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
        onClick={() => setIsFilterOpen(false)}  // Close the filter
      >
        Cancel Filter
      </button>
    </div>
  </div>
)}


              </div>
              {/* Question Cards */}
              <div>
                {paginationData.currentQuestions.map((question) => (
                  <motion.div key={question._id} style={questionCardStyle} onClick={() => handleQuestionClick(question._id)}>
                    {/* Question Title with Dynamic Link */}
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                      <Link
                        to={`/questionthread/${question._id}`}
                        style={{
                          textDecoration: "none",
                          color: "#2563EB",
                          transition: "color 0.3s",
                        }}
                        onMouseOver={(e) => (e.target.style.color = "#1D4ED8")}
                        onMouseOut={(e) => (e.target.style.color = "#2563EB")}
                      >
                        {question.title}
                      </Link>
                    </h3>

                    {/* Question Description */}
                    <div
                       style={{ color: "#64748B", marginBottom: "0.5rem" }}
                       dangerouslySetInnerHTML={{
                         __html: highlightText(question.details, searchQuery),
                       }}
                    />
                    <p style={{ color: "#64748B", marginBottom: "0.5rem" }}>
                      {question.description}
                    </p>

                    {/* Tags */}
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

                    {/* Display User Info (Name and Role) */}
                    <div style={{ fontSize: "0.875rem", color: "#64748B", marginBottom: "1rem" }}>
                      <span style={{ fontWeight: "600", color: "#1E293B" }}>
                        {question.userName} ({question.userRole})
                      </span>
                    </div>

                    {/* Question Metadata */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", gap: "1rem" }}>

                        <span style={{ color: "#1E293B" }}>
                          <strong>{Array.isArray(question.answers) ? question.answers.length : 0}</strong> answers
                        </span>
                        <span style={{ color: "#1E293B" }}>
                          <strong>{question.views}</strong> views
                        </span>
                      </div>
                      <div style={{ color: "#64748B", fontSize: "0.875rem" }}>
                        {question.user === currentUserId && (
                          <div
                            style={{
                              marginTop: "0.5rem",
                              display: "flex",
                              gap: "10px",
                              justifyContent: "flex-end",
                            }}
                          >
                            <button
                              onClick={() => handleEdit(question)}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#facc15",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontWeight: "bold",
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(question._id)}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#ef4444",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontWeight: "bold",
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>



              {/* Pagination Controls */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "20px",
                  padding: "20px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "1px solid #E2E8F0",
                    backgroundColor: currentPage === 1 ? "#F1F5F9" : "#FFFFFF",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    color: currentPage === 1 ? "#94A3B8" : "#1E293B",
                    transition: "all 0.3s ease",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Previous
                </button>

                {Array.from({ length: paginationData.totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "4px",
                      border: "1px solid #E2E8F0",
                      backgroundColor:
                        currentPage === number ? "#2563EB" : "#FFFFFF",
                      color: currentPage === number ? "#FFFFFF" : "#1E293B",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: currentPage === number ? "600" : "normal",
                    }}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === paginationData.totalPages}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "1px solid #E2E8F0",
                    backgroundColor:
                      currentPage === paginationData.totalPages ? "#F1F5F9" : "#FFFFFF",
                    cursor:
                      currentPage === paginationData.totalPages ? "not-allowed" : "pointer",
                    color: currentPage === paginationData.totalPages ? "#94A3B8" : "#1E293B",
                    transition: "all 0.3s ease",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Next
                </button>
              </div>

              {/* Optional: Page info */}
              <div
                style={{
                  textAlign: "center",
                  color: "#64748B",
                  fontSize: "14px",
                  marginTop: "10px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Page {currentPage} of {paginationData.totalPages}
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
                {selectedTag && (
                  <button
                    onClick={handleRemoveFilter}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#EF4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      marginBottom: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    Remove Filter
                  </button>
                )}

                <div>
                  {tags.map((tag) => (
                    <div
                      key={tag._id}
                      onClick={() => setSelectedTag(tag._id)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: selectedTag === tag._id ? "#2563EB" : "#F1F5F9", // Blue background for active tag
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        marginBottom: "0.5rem",
                        cursor: "pointer",  // Make it clickable
                        transition: "background-color 0.3s, color 0.3s",
                        color: selectedTag === tag._id ? "white" : "#2563EB",  // Text color white for active tag
                      }}
                      onMouseEnter={(e) => {
                        if (selectedTag !== tag._id) {
                          e.target.style.backgroundColor = "#2563EB"; // Hover effect only if not selected
                          e.target.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedTag !== tag._id) {
                          e.target.style.backgroundColor = "#F1F5F9"; // Reset background color on hover leave if not selected
                          e.target.style.color = "#2563EB"; // Reset text color
                        }
                      }}
                    >
                      <span>{tag._id}</span> {/* Tag name */}
                      <span>{tag.count} Questions</span> {/* Tag count */}
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
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Need Help?
                </h3>
                <p style={{
                  color: "#64748B",
                  fontSize: "0.875rem",
                  fontFamily: "Poppins, sans-serif",
                  marginBottom: "1rem"
                }}>
                  Check out our guide on how to ask good questions and get
                  better answers from the community.
                </p>
                <button
                  onClick={() => setShowGuideModal(true)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    backgroundColor: "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.875rem",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#047857"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#059669"}
                >
                  View Guide
                </button>

                {/* Guide Modal */}
                <AnimatePresence>
                  {showGuideModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                        padding: "20px"
                      }}
                      onClick={() => setShowGuideModal(false)}
                    >
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: "spring", damping: 20 }}
                        style={{
                          backgroundColor: "white",
                          borderRadius: "12px",
                          maxWidth: "600px",
                          width: "100%",
                          maxHeight: "80vh",
                          overflow: "auto",
                          padding: "2rem",
                          position: "relative"
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Close Button */}
                        <button
                          onClick={() => setShowGuideModal(false)}
                          style={{
                            position: "absolute",
                            top: "1rem",
                            right: "1rem",
                            background: "none",
                            border: "none",
                            fontSize: "1.5rem",
                            cursor: "pointer",
                            color: "#64748B",
                            padding: "5px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "color 0.3s ease",
                          }}
                        >
                          ×
                        </button>

                        {/* Guide Content */}
                        <h2 style={{
                          fontSize: "1.5rem",
                          fontWeight: "600",
                          color: "#1E293B",
                          marginBottom: "1.5rem",
                          textAlign: "center",
                          fontFamily: "Poppins, sans-serif"
                        }}>
                          UnityStack Community Guide
                        </h2>

                        {guideContent.map((section, index) => (
                          <div
                            key={index}
                            style={{
                              marginBottom: "2rem",
                              padding: "1.5rem",
                              backgroundColor: "#F8FAFC",
                              borderRadius: "8px",
                              border: "1px solid #E2E8F0"
                            }}
                          >
                            <div style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              marginBottom: "1rem"
                            }}>
                              <span style={{ fontSize: "1.5rem" }}>{section.icon}</span>
                              <h3 style={{
                                fontSize: "1.25rem",
                                fontWeight: "600",
                                color: "#1E293B",
                                fontFamily: "Poppins, sans-serif"
                              }}>
                                {section.title}
                              </h3>
                            </div>
                            <ul style={{
                              listStyle: "none",
                              padding: 0,
                              margin: 0
                            }}>
                              {section.steps.map((step, stepIndex) => (
                                <li
                                  key={stepIndex}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    marginBottom: "0.5rem",
                                    color: "#4B5563",
                                    fontSize: "0.875rem",
                                    fontFamily: "Poppins, sans-serif"
                                  }}
                                >
                                  <span style={{
                                    color: "#2563EB",
                                    fontWeight: "600"
                                  }}>
                                    {stepIndex + 1}.
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </aside>
          </div>
        </div>
        <Footer />
      </motion.div>

      <AnimatePresence>

      </AnimatePresence>
      {editModalOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "white", padding: "2rem", borderRadius: "10px",
            width: "90%", maxWidth: "800px", position: "relative"
          }}>
            <button onClick={() => setEditModalOpen(false)} style={{
              position: "absolute", top: "10px", right: "15px",
              border: "none", fontSize: "1.5rem", background: "transparent", cursor: "pointer"
            }}>×</button>

            <h2>Edit Your Question</h2>
            <label>Title:</label>
            <ReactQuill value={editData.title} onChange={(val) => setEditData({ ...editData, title: val })} />

            <label style={{ marginTop: "1rem" }}>Details:</label>
            <ReactQuill value={editData.details} onChange={(val) => setEditData({ ...editData, details: val })} />

            <label style={{ marginTop: "1rem" }}>Tags (comma separated):</label>
            <input
              type="text"
              value={editData.tags}
              onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />

            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setEditModalOpen(false)} style={{
                padding: "0.5rem 1rem", border: "1px solid #ccc", borderRadius: "6px"
              }}>Cancel</button>
              <button onClick={handleSaveEdit} style={{
                padding: "0.5rem 1rem", backgroundColor: "#2563EB", color: "white", border: "none", borderRadius: "6px"
              }}>Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Question;