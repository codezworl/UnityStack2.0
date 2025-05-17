import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function QuestionDetailsPage() {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false); // Define the state here
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]); // Initialize answers as an empty array
  const [answerText, setAnswerText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") ? true : false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [emoji, setEmoji] = useState(null);
  const [userId, setUserId] = useState("");
   // Assuming currentUserId is saved in localStorage
   const [filterOption, setFilterOption] = useState(null);
   const [filteredAnswers, setFilteredAnswers] = useState([]); 
   const [showCancelFilter, setShowCancelFilter] = useState(false);
 // To store the selected filter option


  const navigate = useNavigate();
  useEffect(() => {
    if (filterOption) {
      setShowCancelFilter(true);
    } else {
      setShowCancelFilter(false);
    }
  }, [filterOption]);
  

  useEffect(() => {
    const fetchQuestionById = async () => {
      try {
        const response = await fetch(`/api/questions/${id}`);
        const data = await response.json();
        console.log("Fetched Question with Answers:", data);
        
        // Ensure that answers is always an array
        setAnswers(Array.isArray(data.answers) ? data.answers : []);  // Set to empty array if not an array
        setQuestion(data);  // Set the question data
      } catch (err) {
        console.error("Error fetching question:", err);
        setAnswers([]);  // Ensure answers is always an empty array on error
      }
    };
    
    fetchQuestionById();
  }, [id]);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found, user not logged in");
          setIsLoggedIn(false);
          return;
        }
        
        // Fetch user data with the token in Authorization header
        const res = await fetch("http://localhost:5000/api/user", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error("User fetch failed");
  
        const data = await res.json();
        // Handle different user data formats
        setUserName(data.firstName || data.displayName || data.name || "");
        setUserRole(data.role || "");
        setUserId(data._id || data.id || "");
        setIsLoggedIn(true);
        
        console.log("✅ User data loaded:", { 
          name: data.firstName || data.displayName || data.name, 
          role: data.role, 
          id: data._id || data.id 
        });
      } catch (err) {
        console.warn("❌ User not logged in:", err.message);
        setIsLoggedIn(false);
      }
    };
  
    fetchUser();
  }, []);
  


  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Check if user is logged in
      if (!isLoggedIn) {
        alert("You must be logged in to submit an answer");
        navigate("/login");
        return;
      }

      // Validate the form data
      if (!answerText.trim()) {
        alert("Please enter your answer");
        setIsSubmitting(false);
        return;
      }
      
      // Log the user data for debugging
      console.log("Submitting answer with user data:", { userName, userRole, userId });
      
      if (!userName || !userRole || !userId) {
        console.error("Missing user data:", { userName, userRole, userId });
        alert("User data is missing. Please try logging in again.");
        setIsSubmitting(false);
        return;
      }
    
      // Prepare the data to send to the backend
      const newAnswer = {
        text: answerText,
        userRole,
        userName,
        userId,
      };
    
      // Send the answer to the backend
      const response = await fetch(`http://localhost:5000/api/questions/${id}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newAnswer),
      });
    
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Error posting answer");
      }
    
      // On success, update the UI
      alert("Answer submitted successfully!");
      setAnswerText("");  // Clear the answer text
      
      // Refresh the question and answers to show the new answer
      const updatedQuestion = await fetch(`/api/questions/${id}`);
      const updatedData = await updatedQuestion.json();
      setAnswers(Array.isArray(updatedData.answers) ? updatedData.answers : []);
      setQuestion(updatedData);
      
    } catch (err) {
      console.error("Error posting answer:", err);
      alert(err.message || "An error occurred while posting your answer");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  const handleEditAnswer = async (answerId) => {
    const newText = prompt("Edit your answer:", answerText);
    if (newText && newText !== answerText) {
      try {
        const response = await fetch(`http://localhost:5000/api/questions/${id}/answers/${answerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            text: newText,
          }),
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Error editing answer");
        }
  
        // Update the answer text in the state
        setAnswers((prevAnswers) =>
          prevAnswers.map((answer) =>
            answer._id === answerId ? { ...answer, text: newText } : answer
          )
        );
        alert("Answer edited successfully!");
      } catch (err) {
        console.error("Error editing answer:", err);
        alert(err.message || "An error occurred while editing your answer");
      }
    }
  };
  
  
  const handleDeleteAnswer = async (answerId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete your answer?");
    if (confirmDelete) {
      try {
        // Log the answerId before sending the request to ensure it's correct
        console.log("Deleting answer with ID:", answerId);
  
        const response = await fetch(`http://localhost:5000/api/questions/${id}/answers/${answerId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Error deleting answer");
        }
  
        // Remove the answer from the state
        setAnswers((prevAnswers) =>
          prevAnswers.filter((answer) => answer._id !== answerId)
        );
        alert("Answer deleted successfully!");
      } catch (err) {
        console.error("Error deleting answer:", err);
        alert(err.message || "An error occurred while deleting your answer");
      }
    }
  };
  
  
  
  


 

  const sidebarStyle = {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    marginBottom: "1rem",
  };

  

  
  const handleLike = async (answerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${id}/answers/${answerId}/like`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setAnswers((prevAnswers) =>
          prevAnswers.map((answer) =>
            answer._id === answerId ? result.answer : answer
          )
        );
        setEmoji("🎉"); // Show party popper emoji
        setTimeout(() => setEmoji(null), 3000); // Hide emoji after 3 seconds
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error liking answer:", error);
    }
  };

  const handleDislike = async (answerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${id}/answers/${answerId}/dislike`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setAnswers((prevAnswers) =>
          prevAnswers.map((answer) =>
            answer._id === answerId ? result.answer : answer
          )
        );
        setEmoji("😢"); // Show sad emoji
        setTimeout(() => setEmoji(null), 3000); // Hide emoji after 3 seconds
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error disliking answer:", error);
    }
  };
  useEffect(() => {
    const filterAnswers = () => {
      let filteredAnswers = [...answers];
      switch (filterOption) {
        case "latest":
          filteredAnswers = filteredAnswers.sort((a, b) => new Date(b.time) - new Date(a.time));
          break;
        case "oldest":
          filteredAnswers = filteredAnswers.sort((a, b) => new Date(a.time) - new Date(b.time));
          break;
        case "own":
          filteredAnswers = filteredAnswers.filter(answer => answer.userId === userId);
          break;
        case "mostLiked":
          filteredAnswers = filteredAnswers.sort((a, b) => b.likes - a.likes);
          break;
        case "mostDisliked":
          filteredAnswers = filteredAnswers.sort((a, b) => b.dislikes - a.dislikes);
          break;
        case "noLikesDislikes":
          filteredAnswers = filteredAnswers.filter(answer => answer.likes === 0 && answer.dislikes === 0);
          break;
        default:
          break;
      }
      setFilteredAnswers(filteredAnswers);
    };

    if (answers.length > 0) {
      filterAnswers();
    }
  }, [filterOption, answers, userId]);  // Dependencies include filterOption, answers, and userId
  
  // Utility function to strip HTML tags
  const stripHtml = (html) => {
    const doc = new window.DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  if (!question) {
    return <div>Loading...</div>; // Show loading if question is still being fetched
  }

  return (
    
    <div
    
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr", // Sidebar on the left, main content on the right
        gap: "2rem",
        padding: "2rem",
        backgroundColor: "#F8FAFC",
        minHeight: "100vh",
      }}

    >
      
      
      {/* Sidebar */}
      <div style={{ gridColumn: "1 / 2", position: "sticky", top: "0", zIndex: "10" }}>

      <div style={sidebarStyle}> 
      <h3 style={{ textDecoration: "underline", textDecorationColor: "#2563EB", textDecorationThickness: "2px" }}>
      Filter Answers</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
    <label className="filter-label">
  <input
    type="radio"
    name="filter"
    checked={filterOption === "latest"}
    onChange={() => setFilterOption("latest")}
  />
  <span>Latest Answers</span>
</label>
      <label className="filter-label">
        <input
          type="radio"
          name="filter"
          checked={filterOption === "oldest"}
          onChange={() => setFilterOption("oldest")}
        /> Oldest Answers
      </label>
      <label className="filter-label">
        <input
          type="radio"
          name="filter"
          checked={filterOption === "own"}
          onChange={() => setFilterOption("own")}
        /> User's Own Answers
      </label>
      <label className="filter-label">
        <input
          type="radio"
          name="filter"
          checked={filterOption === "mostLiked"}
          onChange={() => setFilterOption("mostLiked")}
        /> Most Liked Answers
      </label>
      <label className="filter-label">
        <input
          type="radio"
          name="filter"
          checked={filterOption === "mostDisliked"}
          onChange={() => setFilterOption("mostDisliked")}
        /> Most Disliked Answers
      </label>
      <label className="filter-label">
        <input
          type="radio"
          name="filter"
          checked={filterOption === "noLikesDislikes"}
          onChange={() => setFilterOption("noLikesDislikes")}
        /> No Likes/Dislikes
      </label>
      {showCancelFilter && (
  <button
    onClick={() => {
      setFilterOption(null); // Reset filter
      setShowCancelFilter(false); // Hide the cancel filter button
    }}
    style={{
      backgroundColor: "#FF4B4B",
      color: "white",
      padding: "8px 12px",
      borderRadius: "4px",
      cursor: "pointer",
      marginBottom: "1rem",
    }}
  >
    Cancel Filter
  </button>
)}


    </div>
  </div>
</div>
  
      {/* Main Content */}
      <div style={{ gridColumn: "2 / 3" }}>
        {/* Question Details */}
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem 2.5rem",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            marginBottom: "2rem",
            maxWidth: "900px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
              color: "#1E293B",
              letterSpacing: "-1px",
              lineHeight: 1.2,
            }}
          >
            {stripHtml(question.title)}
          </h1>
          {/* Metadata */}
          <div style={{ color: "#64748B", fontSize: "0.95rem", marginBottom: "1.2rem" }}>
            Asked {new Date(question.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })} • Viewed {question.views} times
          </div>
          {/* Description/Details */}
          <div
            style={{
              fontSize: "1.1rem",
              marginBottom: "1.5rem",
              color: "#334155",
              lineHeight: 1.7,
            }}
            dangerouslySetInnerHTML={{ __html: question.details }}
          />
          {/* Tried Solution Heading */}
          <h3 style={{
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "#2563EB",
            marginBottom: "0.5rem",
            marginTop: "1.5rem",
            letterSpacing: "0.5px"
          }}>
            Tried Solution
          </h3>
          {/* Tried Content */}
          <div
            style={{
              fontSize: "1rem",
              marginBottom: "1.5rem",
              color: "#475569",
              background: "#F1F5F9",
              borderRadius: "6px",
              padding: "1rem 1.2rem",
              fontStyle: "italic"
            }}
            dangerouslySetInnerHTML={{ __html: question.tried }}
          />
          {/* Tags */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {question.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  backgroundColor: "#E0E7FF",
                  color: "#3730A3",
                  padding: "0.3rem 0.8rem",
                  borderRadius: "999px",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          {/* User Info */}
          <div style={{ fontSize: "0.98rem", color: "#64748B", marginBottom: "0.5rem" }}>
            <span style={{ fontWeight: 600, color: "#1E293B" }}>
              {question.userName} ({question.userRole})
            </span>
          </div>
        </div>
  
        {/* Answers Section */}
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              marginBottom: "1.5rem",
              color: "#1E293B",
              fontSize: "1.25rem",
              fontWeight: 700,
              letterSpacing: "-0.5px"
            }}
          >
            {filteredAnswers && Array.isArray(filteredAnswers) && filteredAnswers.length > 0
              ? `${filteredAnswers.length} Answer(s)`
              : "No answers yet"}
          </h2>

          {/* Render answers after applying filter */}
          {filteredAnswers && Array.isArray(filteredAnswers) && filteredAnswers.length > 0 ? (
            filteredAnswers.map((answer) => (
              <div
                key={answer._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#F9FAFB",
                  padding: "1.5rem 2rem",
                  borderRadius: "10px",
                  border: "1px solid #E5E7EB",
                  marginBottom: "1.5rem",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.07)",
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* User Info */}
                <div
                  style={{
                    fontSize: "1rem",
                    marginBottom: "1rem",
                    fontWeight: "bold",
                    color: "#1E293B",
                  }}
                >
                  {answer.userName} ({answer.userRole}) -{" "}
                  {new Date(answer.time).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                {/* Answer Description */}
                <div
                  style={{
                    fontSize: "1.05rem",
                    marginBottom: "1rem",
                    lineHeight: "1.7",
                    color: "#64748B",
                  }}
                  dangerouslySetInnerHTML={{ __html: answer.text }}
                />

                {/* Like/Dislike Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "1.2rem",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                >
                  <button
                    style={{
                      fontSize: "1rem",
                      color: "#2563EB",
                      background: "#EFF6FF",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 18px",
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onClick={() => handleLike(answer._id)}
                  >
                    👍 Like {answer.likes}
                  </button>
                  <button
                    style={{
                      fontSize: "1rem",
                      color: "#FF4B4B",
                      background: "#FFF1F2",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 18px",
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onClick={() => handleDislike(answer._id)}
                  >
                    👎 Dislike {answer.dislikes}
                  </button>
                </div>

                {/* Edit and Delete buttons */}
                {answer.user === userId && (
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginTop: "1.2rem",
                    }}
                  >
                    <button
                      onClick={() => handleEditAnswer(answer._id)}
                      style={{
                        padding: "0.5rem 1.2rem",
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "1rem",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAnswer(answer._id)}
                      style={{
                        padding: "0.5rem 1.2rem",
                        backgroundColor: "#FF4B4B",
                        color: "#fff",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "1rem",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{
              backgroundColor: "#FFFFFF",
              padding: "2rem",
              borderRadius: "8px",
              textAlign: "center",
              marginTop: "1rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
            }}>
              <h3 style={{ fontSize: "1.25rem", color: "#4B5563", marginBottom: "1rem" }}>
                No answers yet
              </h3>
            </div>
          )}
        </div>

        {/* Submit Answer Section */}  
        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #E2E8F0",
            marginTop: "2rem",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              marginBottom: "1rem",
              color: "#1E293B",
              fontSize: "1.25rem",
            }}
          >
            Submit Your Answer
          </h2>
  
          {isLoggedIn ? (
            <>
              <ReactQuill
                value={answerText}
                onChange={setAnswerText}
                theme="snow"
                placeholder="Write your answer here..."
                style={{ height: "200px", marginBottom: "1rem" }}
              />
  
              <button
                onClick={handleAnswerSubmit}
                style={{
                  padding: "12px 20px",
                  borderRadius: "5px",
                  border: "none",
                  background: "#2563EB",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "16px",
                  marginTop: "10px",
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </button>
            </>
          ) : (
            <>
              <p style={{ color: "red", marginBottom: "1rem" }}>
                You need to log in to submit an answer.
              </p>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "12px 20px",
                  borderRadius: "5px",
                  border: "none",
                  background: "#2563EB",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Log in to Answer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
