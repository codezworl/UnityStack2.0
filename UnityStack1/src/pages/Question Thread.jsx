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
        // Fetch the current user data from localStorage or your API
        const res = await fetch("http://localhost:5000/api/user", { credentials: "include" });
        if (!res.ok) throw new Error("User fetch failed");
  
        const data = await res.json();
        setUserName(data.name);  // Set userName
        setUserRole(data.role);  // Set userRole
        setUserId(data.id);  // Set currentUserId from fetched data (assuming 'id' is the user ID)
        console.log("✅ Logged in as:", data.name, data.role, data.id);
      } catch (err) {
        console.warn("❌ User not logged in:", err.message);
      }
    };
  
    fetchUser();
  }, []);
  


  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure all required fields are included
    if (!answerText.trim() || !userName || !userRole || !userId) {
      alert("Please fill in all fields before submitting.");
      return;
    }
  
    // Prepare the data to send to the backend
    const newAnswer = {
      text: answerText,  // The answer text
      userRole: userRole, // User role (student, developer, organization)
      userName: userName, // User's name
      userId: userId,  // The logged-in user ID
    };
  
    try {
      // Send the answer to the backend
      const response = await fetch(`http://localhost:5000/api/questions/${id}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,  // Ensure the token is set correctly
        },
        body: JSON.stringify(newAnswer),
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Error posting answer");
      }
  
      alert("Answer submitted successfully!");
      setAnswerText("");  // Clear the answer text after submission
      // Optionally, navigate to a different page or update the UI
      // navigate(`/questions/${id}`);  // If you want to show the updated question page
    } catch (err) {
      console.error("Error posting answer:", err);
      alert(err.message || "An error occurred while posting your answer");
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
            display: "flex",
            gap: "1rem",
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "2rem",
          }}
        >
          <div style={{ flex: "1" }}>
            {/* Title */}
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                color: "#1E293B",
              }}
            >
              {question.title}
            </h1>
  
            {/* Question Metadata (Asked time, views, etc.) */}
            <p
              style={{
                color: "#64748B",
                fontSize: "0.875rem",
                marginBottom: "1rem",
              }}
            >
              Asked{" "}
              {new Date(question.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}{" "}
              • Viewed {question.views} times
            </p>
  
            {/* Question Description */}
            <p
              style={{
                fontSize: "1rem",
                marginBottom: "1rem",
                lineHeight: "1.6",
              }}
              
              dangerouslySetInnerHTML={{ __html: question.details }}
            />
           
            {/* Tried Information */}
            <p
              style={{
                fontSize: "1rem",
                marginBottom: "1rem",
                fontStyle: "italic",
                color: "#1E293B",
              }}
            >
              Tried:{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: question.tried,
                }}
              />
            </p>
  
            {/* Tags */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "1rem",
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
                    cursor: "pointer",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
  
        {/* Answers Section */}
        <div>
  <h2
    style={{
      marginBottom: "1.5rem",
      color: "#1E293B",
      fontSize: "1.25rem",
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
          padding: "1.5rem",
          borderRadius: "8px",
          border: "1px solid #E5E7EB",
          marginBottom: "1.5rem",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
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
            fontSize: "1rem",
            marginBottom: "1rem",
            lineHeight: "1.6",
            color: "#64748B",
          }}
          dangerouslySetInnerHTML={{ __html: answer.text }}
        />

        {/* Like/Dislike Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <div
            style={{
              fontSize: "1rem",
              color: "#2563EB",
              cursor: "pointer",
            }}
            onClick={() => handleLike(answer._id)}
          >
            Like {answer.likes}
          </div>
          <div
            style={{
              fontSize: "1rem",
              color: "#FF4B4B",
              cursor: "pointer",
            }}
            onClick={() => handleDislike(answer._id)}
          >
            Dislike {answer.dislikes}
          </div>
        </div>

        {/* Edit and Delete buttons */}
        {answer.user === userId && (  // Only show Edit and Delete for the answer posted by the logged-in user
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button
              onClick={() => handleEditAnswer(answer._id)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#4CAF50",
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteAnswer(answer._id)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#FF4B4B",
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    ))
  ) : (
    <div>No answers yet</div> // Display a fallback message if no answers are available
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
