import React, { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the Quill CSS
import { useNavigate } from "react-router-dom";

export default function QuestionDetailsPage() {
  const location = useLocation();
  const { id } = useParams(); // Extract the question ID from the URL
  const [question, setQuestion] = useState(null); // To store the question data
  const [answers, setAnswers] = useState([]); // To store the answers data
  const [filter, setFilter] = useState("Newest");
  const [bounty, setBounty] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("user") ? true : false
  );

  const navigate = useNavigate();
  useEffect(() => {
    const user = sessionStorage.getItem("user"); // Check if user exists
    setIsLoggedIn(!!user); // Convert to boolean
    if (location.state?.question) {
      setQuestion(location.state.question);
      setAnswers(location.state.question.answers || []);
    } else {
      // If not passed, fetch question data using the ID
      fetchQuestionById(id); // Replace with your API call or mock data
    }
  }, []); // Runs only once on mount
  const handleAnswerSubmit = async () => {
    if (!answerText.trim()) {
      alert("Please enter an answer before submitting.");
      return;
    }

    const username = sessionStorage.getItem("user") || "Anonymous";

    const newAnswer = {
      id: answers.length + 1,
      text: answerText,
      likes: 0,
      dislikes: 0,
      user: username, // Store real username
      time: "Just now",
    };

    setAnswers([...answers, newAnswer]); // Update local state
    setAnswerText(""); // Clear editor after submission

    // If using an API, send data to backend
    // await fetch("https://your-api-url.com/answers", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(newAnswer),
    // });

    alert("Answer submitted successfully!");
  };

  // Mock function to simulate fetching question data by ID
  const fetchQuestionById = (id) => {
    const mockQuestions = [
      {
        id: 1,
        title: "How to implement real-time chat in Next.js?",
        description:
          "I'm trying to implement a real-time chat feature using Next.js and WebSockets...",
        tags: ["next.js", "react", "websockets", "socket.io"],
        answers: [
          {
            id: 1,
            text: "Use WebSocket for bi-directional communication.",
            likes: 12,
            dislikes: 1,
            user: "John Doe",
            time: "1 hour ago",
            isBest: true,
          },
          {
            id: 2,
            text: "Consider using Server-Sent Events if you don't need bi-directional communication.",
            likes: 7,
            dislikes: 0,
            user: "Jane Smith",
            time: "30 minutes ago",
          },
        ],
        user: "Sarah Ahmed",
        time: "2 hours ago",
        bounty: false,
      },
    ];
    const foundQuestion = mockQuestions.find((q) => q.id === parseInt(id));
    if (foundQuestion) {
      setQuestion(foundQuestion);
      setAnswers(foundQuestion.answers || []);
    }
  };

  const handleLike = (answerId) => {
    setAnswers((prev) =>
      prev.map((ans) =>
        ans.id === answerId ? { ...ans, likes: ans.likes + 1 } : ans
      )
    );
  };

  const handleDislike = (answerId) => {
    setAnswers((prev) =>
      prev.map((ans) =>
        ans.id === answerId ? { ...ans, dislikes: ans.dislikes + 1 } : ans
      )
    );
  };

  const relatedQuestions = [
    {
      id: 1,
      title: "How to handle WebSocket reconnection in React?",
      link: "/questionthread/1",
    },
    {
      id: 2,
      title: "Socket.io vs WebSocket - which one to choose?",
      link: "/questionthread/2",
    },
    {
      id: 3,
      title: "Best practices for real-time chat applications",
      link: "/questionthread/3",
    },
    {
      id: 4,
      title: "Implementing typing indicators in chat",
      link: "/questionthread/4",
    },
  ];

  const hotQuestions = [
    {
      id: 5,
      title: "Why is Docker recommended for microservices?",
      link: "/questionthread/5",
    },
    {
      id: 6,
      title: "Understanding async/await in JavaScript",
      link: "/questionthread/6",
    },
    {
      id: 7,
      title: "Best practices for React hooks",
      link: "/questionthread/7",
    },
    {
      id: 8,
      title: "How to optimize MongoDB queries?",
      link: "/questionthread/8",
    },
  ];

  const sidebarStyle = {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    marginBottom: "1rem",
  };

  if (!question) {
    return <div>Loading...</div>;
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
      <div style={{ gridColumn: "1 / 2" }}>
        <div style={sidebarStyle}>
          <h3>Related Questions</h3>
          <ul>
            {relatedQuestions.map((q) => (
              <li key={q.id}>
                <Link to={q.link}>{q.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div style={sidebarStyle}>
          <h3>Hot Questions</h3>
          <ul>
            {hotQuestions.map((q) => (
              <li key={q.id}>
                <Link to={q.link}>{q.title}</Link>
              </li>
            ))}
          </ul>
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
          {/* Vote Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "50px",
            }}
          >
            <button
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#2563EB",
              }}
            >
              ▲
            </button>
            <p style={{ margin: "0", fontWeight: "bold", fontSize: "1.25rem" }}>
              15
            </p>
            <button
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#2563EB",
              }}
            >
              ▼
            </button>
          </div>

          {/* Question Details */}
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
              How to implement real-time chat in Next.js?
            </h1>

            {/* Metadata */}
            <p
              style={{
                color: "#64748B",
                fontSize: "0.875rem",
                marginBottom: "1rem",
              }}
            >
              Asked 2 hours ago • Viewed 324 times
            </p>

            {/* Description */}
            <p
              style={{
                fontSize: "1rem",
                marginBottom: "1rem",
                lineHeight: "1.6",
              }}
            >
              I'm trying to implement a real-time chat feature using Next.js and
              WebSockets. I've tried using Socket.io but I'm running into some
              issues with the connection.
            </p>

            {/* Code Snippet */}
            <div
              style={{
                backgroundColor: "#F3F4F6",
                padding: "1rem",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "0.875rem",
                color: "#1E293B",
                marginBottom: "1rem",
                overflowX: "auto",
              }}
            >
              {`import io from 'socket.io-client';

const socket = io('http://localhost:3000');`}
            </div>

            {/* Bulleted List */}
            <ul
              style={{
                marginBottom: "1rem",
                color: "#1E293B",
                lineHeight: "1.6",
              }}
            >
              <li>Connection doesn't persist after page refresh</li>
              <li>Messages are being duplicated</li>
              <li>Performance issues with multiple connections</li>
            </ul>

            {/* Tags */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "1rem",
              }}
            >
              {["next.js", "react", "websockets", "socket.io"].map((tag) => (
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

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#F9FAFB",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                marginTop: "1rem",
              }}
            >
              {/* Left Section: Share, Save, Report */}
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "center",
                }}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "transparent",
                    border: "none",
                    color: "#64748B",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ marginRight: "0.5rem" }}>🔗</span> Share
                </button>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "transparent",
                    border: "none",
                    color: "#64748B",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ marginRight: "0.5rem" }}>🔖</span> Save
                </button>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "transparent",
                    border: "none",
                    color: "#64748B",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ marginRight: "0.5rem" }}>🚩</span> Report
                </button>
              </div>

              {/* Right Section: Asked by User */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#64748B",
                    margin: "0",
                  }}
                >
                  Asked by
                </p>
                <a
                  href="#"
                  style={{
                    fontSize: "0.875rem",
                    color: "#2563EB",
                    textDecoration: "none",
                  }}
                >
                  Sarah Ahmed
                </a>
                <img
                  src="https://via.placeholder.com/32"
                  alt="Sarah Ahmed"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Options */}
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "1rem" }}>
            {["Newest", "Best Answer", "All"].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  border: "1px solid #E2E8F0",
                  backgroundColor:
                    filter === filterOption ? "#2563EB" : "transparent",
                  color: filter === filterOption ? "#FFFFFF" : "#1E293B",
                  cursor: "pointer",
                }}
              >
                {filterOption}
              </button>
            ))}
          </div>
          <button
            onClick={() => setBounty((prev) => !prev)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: bounty ? "#059669" : "transparent",
              color: bounty ? "#FFFFFF" : "#059669",
              border: "1px solid #059669",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {bounty ? "Remove Bounty" : "Add Bounty"}
          </button>
        </div>

        {/* Answers Section */}
        <div style={{ marginTop: "2rem" }}>
          <h2
            style={{
              marginBottom: "1.5rem",
              color: "#1E293B",
              fontSize: "1.25rem",
            }}
          >
            2 Answers
          </h2>

          {/* Answer 1 */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              backgroundColor: "#F9FAFB",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              marginBottom: "1.5rem",
            }}
          >
            {/* Vote Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "50px",
              }}
            >
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#2563EB",
                }}
              >
                ▲
              </button>
              <p
                style={{
                  margin: "0",
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                }}
              >
                8
              </p>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#2563EB",
                }}
              >
                ▼
              </button>
            </div>

            {/* Answer Content */}
            <div style={{ flex: "1" }}>
              <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
                For your WebSocket implementation issues, here's a better
                approach:
              </p>
              <ol style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
                <li>Use a custom hook for managing the socket connection:</li>
              </ol>

              {/* Code Block */}
              <div
                style={{
                  backgroundColor: "#F3F4F6",
                  padding: "1rem",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  color: "#1E293B",
                  marginBottom: "1rem",
                  overflowX: "auto",
                }}
              >
                {`function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:3000', {
      reconnection: true,
      reconnectionAttempts: 5,
    });
    setSocket(socketInstance);
    return () => socketInstance.close();
  }, []);

  return socket;
}`}
              </div>

              <ul style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
                <li>Implement proper cleanup to prevent memory leaks.</li>
                <li>Use a connection pool for better performance.</li>
              </ul>

              {/* Footer Section */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#64748B",
                      cursor: "pointer",
                    }}
                  >
                    Share
                  </button>
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#64748B",
                      cursor: "pointer",
                    }}
                  >
                    Report
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#64748B",
                      margin: "0",
                    }}
                  >
                    Answered 1 hour ago
                  </p>
                  <a
                    href="#"
                    style={{
                      fontSize: "0.875rem",
                      color: "#2563EB",
                      textDecoration: "none",
                    }}
                  >
                    John Doe
                  </a>
                  <img
                    src="https://via.placeholder.com/32"
                    alt="John Doe"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Answer 2 */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              backgroundColor: "#F9FAFB",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
            }}
          >
            {/* Vote Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "50px",
              }}
            >
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#2563EB",
                }}
              >
                ▲
              </button>
              <p
                style={{
                  margin: "0",
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                }}
              >
                3
              </p>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#2563EB",
                }}
              >
                ▼
              </button>
            </div>

            {/* Answer Content */}
            <div style={{ flex: "1" }}>
              <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
                Have you considered using Server-Sent Events instead? They might
                be more suitable for your use case if you don't need
                bi-directional communication.
              </p>

              {/* Footer Section */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#64748B",
                      cursor: "pointer",
                    }}
                  >
                    Share
                  </button>
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#64748B",
                      cursor: "pointer",
                    }}
                  >
                    Report
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#64748B",
                      margin: "0",
                    }}
                  >
                    Answered 30 mins ago
                  </p>
                  <a
                    href="#"
                    style={{
                      fontSize: "0.875rem",
                      color: "#2563EB",
                      textDecoration: "none",
                    }}
                  >
                    Jane Smith
                  </a>
                  <img
                    src="https://via.placeholder.com/32"
                    alt="Jane Smith"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

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
              {/* Answer Input */}
              <ReactQuill
                value={answerText}
                onChange={setAnswerText}
                theme="snow"
                placeholder="Write your answer here..."
                style={{ height: "200px", marginBottom: "1rem" }}
              />

              {/* Submit Button */}
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
              >
                Submit Answer
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
