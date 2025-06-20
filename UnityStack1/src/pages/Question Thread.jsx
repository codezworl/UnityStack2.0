import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Header from "../components/header";

// Animation keyframes and global styles
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
@keyframes spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 120 }}>
      <div style={{
        width: 48, height: 48, border: "6px solid #e0e7ef", borderTop: "6px solid #2563eb",
        borderRadius: "50%", animation: "spinner 1s linear infinite"
      }} />
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      background: "#fff", padding: "2rem", borderRadius: 16, textAlign: "center",
      marginTop: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", animation: "fadeIn 0.7s"
    }}>
      <div style={{ fontSize: 48, marginBottom: 12, animation: "pop 0.7s" }}>🤖</div>
      <h3 style={{ fontSize: "1.25rem", color: "#4B5563", marginBottom: 8 }}>No answers yet</h3>
      <div style={{ color: "#64748B" }}>Be the first to help!</div>
    </div>
  );
}

export default function QuestionDetailsPage() {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [emoji, setEmoji] = useState(null);
  const [userId, setUserId] = useState("");
  const [filterOption, setFilterOption] = useState(null);
  const [filteredAnswers, setFilteredAnswers] = useState([]);
  const [showCancelFilter, setShowCancelFilter] = useState(false);
  const [likeAnim, setLikeAnim] = useState({});
  const [dislikeAnim, setDislikeAnim] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (filterOption) setShowCancelFilter(true);
    else setShowCancelFilter(false);
  }, [filterOption]);

  useEffect(() => {
    const fetchQuestionById = async () => {
      try {
        const response = await fetch(`/api/questions/${id}`);
        const data = await response.json();
        setAnswers(Array.isArray(data.answers) ? data.answers : []);
        setQuestion(data);
      } catch (err) {
        setAnswers([]);
      }
    };
    fetchQuestionById();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setIsLoggedIn(false); return; }
        const res = await fetch("http://localhost:5000/api/user", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("User fetch failed");
        const data = await res.json();
        setUserName(data.firstName || data.displayName || data.name || "");
        setUserRole(data.role || "");
        setUserId(data._id || data.id || "");
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };
    fetchUser();
  }, []);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!isLoggedIn) { alert("You must be logged in to submit an answer"); navigate("/login"); return; }
      if (!answerText.trim()) { alert("Please enter your answer"); setIsSubmitting(false); return; }
      if (!userName || !userRole || !userId) { alert("User data is missing. Please try logging in again."); setIsSubmitting(false); return; }
      const newAnswer = { text: answerText, userRole, userName, userId };
      const response = await fetch(`http://localhost:5000/api/questions/${id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(newAnswer),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error posting answer");
      setAnswerText("");
      const updatedQuestion = await fetch(`/api/questions/${id}`);
      const updatedData = await updatedQuestion.json();
      setAnswers(Array.isArray(updatedData.answers) ? updatedData.answers : []);
      setQuestion(updatedData);
      // Animation for confirmation
      setIsSubmitting("done");
      setTimeout(() => setIsSubmitting(false), 1200);
    } catch (err) {
      alert(err.message || "An error occurred while posting your answer");
    } finally {
      if (isSubmitting !== "done") setIsSubmitting(false);
    }
  };

  const handleEditAnswer = async (answerId) => {
    const newText = prompt("Edit your answer:", answerText);
    if (newText && newText !== answerText) {
      try {
        const response = await fetch(`http://localhost:5000/api/questions/${id}/answers/${answerId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("token")}` },
          body: JSON.stringify({ text: newText }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error editing answer");
        setAnswers((prev) => prev.map((a) => a._id === answerId ? { ...a, text: newText } : a));
      } catch (err) {
        alert(err.message || "An error occurred while editing your answer");
      }
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (window.confirm("Are you sure you want to delete your answer?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/questions/${id}/answers/${answerId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error deleting answer");
        setAnswers((prev) => prev.filter((a) => a._id !== answerId));
      } catch (err) {
        alert(err.message || "An error occurred while deleting your answer");
      }
    }
  };

  const handleLike = async (answerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${id}/answers/${answerId}/like`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      });
      const result = await response.json();
      if (response.ok) {
        setAnswers((prev) => prev.map((a) => a._id === answerId ? result.answer : a));
        setLikeAnim((prev) => ({ ...prev, [answerId]: true }));
        setTimeout(() => setLikeAnim((prev) => ({ ...prev, [answerId]: false })), 600);
      } else {
        alert(result.message);
      }
    } catch {}
  };

  const handleDislike = async (answerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${id}/answers/${answerId}/dislike`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      });
      const result = await response.json();
      if (response.ok) {
        setAnswers((prev) => prev.map((a) => a._id === answerId ? result.answer : a));
        setDislikeAnim((prev) => ({ ...prev, [answerId]: true }));
        setTimeout(() => setDislikeAnim((prev) => ({ ...prev, [answerId]: false })), 600);
      } else {
        alert(result.message);
      }
    } catch {}
  };

  useEffect(() => {
    const filterAnswers = () => {
      let filtered = [...answers];
      switch (filterOption) {
        case "latest": filtered = filtered.sort((a, b) => new Date(b.time) - new Date(a.time)); break;
        case "oldest": filtered = filtered.sort((a, b) => new Date(a.time) - new Date(b.time)); break;
        case "own": filtered = filtered.filter(a => a.userId === userId); break;
        case "mostLiked": filtered = filtered.sort((a, b) => b.likes - a.likes); break;
        case "mostDisliked": filtered = filtered.sort((a, b) => b.dislikes - a.dislikes); break;
        case "noLikesDislikes": filtered = filtered.filter(a => a.likes === 0 && a.dislikes === 0); break;
        default: break;
      }
      setFilteredAnswers(filtered);
    };
    if (answers.length > 0) filterAnswers();
    else setFilteredAnswers([]);
  }, [filterOption, answers, userId]);

  const stripHtml = (html) => {
    const doc = new window.DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // --- Styles ---
  const card = {
    background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(30,41,59,0.08)",
    padding: "2rem 2.5rem", marginBottom: "2rem", maxWidth: 900, marginLeft: "auto", marginRight: "auto",
    animation: "fadeIn 0.7s"
  };
  const answerCard = {
    ...card, padding: "1.5rem 2rem", marginBottom: "1.5rem", border: "1px solid #E5E7EB",
    boxShadow: "0 4px 10px rgba(0,0,0,0.07)", animation: "fadeIn 0.7s"
  };
  const button = (color, bg, hoverBg) => ({
    fontSize: "1rem", color, background: bg, border: "none", borderRadius: 24, padding: "10px 28px",
    cursor: "pointer", fontWeight: 600, margin: "0 0.5rem 0 0", transition: "background 0.2s, color 0.2s",
    outline: "none", boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    ':hover': { background: hoverBg }
  });
  const filterBtn = (active) => ({
    background: "none", border: "none", color: active ? "#2563EB" : "#64748B", fontWeight: 600,
    fontSize: "1rem", padding: "6px 0", borderBottom: active ? "2.5px solid #2563EB" : "2.5px solid transparent",
    marginRight: 18, cursor: "pointer", transition: "border 0.2s, color 0.2s"
  });

  if (!question) return <><style>{globalStyles}</style><Spinner /></>;

  return (
    <>
      <style>{globalStyles}</style>
      <Header />
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 3fr", gap: "2rem", padding: "2rem",
        background: "linear-gradient(120deg,#f8fafc 60%,#e0e7ff 100%)", minHeight: "100vh"
      }}>
        {/* Sidebar */}
        <div style={{ gridColumn: "1 / 2", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", marginBottom: "1rem" }}>
            <h3 style={{ textDecoration: "underline", textDecorationColor: "#2563EB", textDecorationThickness: 2, fontWeight: 700, fontSize: "1.1rem" }}>Filter Answers</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
              {[
                { key: "latest", label: "Latest Answers" },
                { key: "oldest", label: "Oldest Answers" },
                { key: "own", label: "User's Own Answers" },
                { key: "mostLiked", label: "Most Liked Answers" },
                { key: "mostDisliked", label: "Most Disliked Answers" },
                { key: "noLikesDislikes", label: "No Likes/Dislikes" },
              ].map(opt => (
                <button key={opt.key} style={filterBtn(filterOption === opt.key)} onClick={() => setFilterOption(opt.key)}>{opt.label}</button>
              ))}
              {showCancelFilter && (
                <button onClick={() => { setFilterOption(null); setShowCancelFilter(false); }}
                  style={{ ...button("#fff", "#FF4B4B", "#e53e3e"), marginTop: 18, borderRadius: 8, fontWeight: 700 }}>
                  Cancel Filter
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div style={{ gridColumn: "2 / 3" }}>
          {/* Question Card */}
          <div style={card}>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "#1E293B", letterSpacing: "-1px", lineHeight: 1.2 }}>{stripHtml(question.title)}</h1>
            <div style={{ color: "#64748B", fontSize: "1rem", marginBottom: 18 }}>
              Asked {new Date(question.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })} • Viewed {question.views} times
            </div>
            <div style={{ fontSize: "1.1rem", marginBottom: 18, color: "#334155", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: question.details }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2563EB", marginBottom: 8, marginTop: 18, letterSpacing: 0.5 }}>Tried Solution</h3>
            <div style={{ fontSize: "1rem", marginBottom: 18, color: "#475569", background: "#F1F5F9", borderRadius: 8, padding: "1rem 1.2rem", fontStyle: "italic" }} dangerouslySetInnerHTML={{ __html: question.tried }} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              {question.tags.map((tag) => (
                <span key={tag} style={{ background: "linear-gradient(90deg,#e0e7ff,#f1f5f9)", color: "#3730A3", padding: "0.3rem 0.8rem", borderRadius: 999, fontSize: "0.97rem", fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
            <div style={{ fontSize: "1rem", color: "#64748B", marginBottom: 0 }}>
              <span style={{ fontWeight: 700, color: "#1E293B" }}>{question.userName} ({question.userRole})</span>
            </div>
          </div>
          {/* Answers Section */}
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ marginBottom: 24, color: "#1E293B", fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.5px" }}>
              {filteredAnswers && filteredAnswers.length > 0 ? `${filteredAnswers.length} Answer(s)` : "No answers yet"}
            </h2>
            {/* Render answers after applying filter */}
            {filteredAnswers && filteredAnswers.length > 0 ? (
              filteredAnswers.map((answer) => (
                <div key={answer._id} style={{ ...answerCard, animation: "fadeIn 0.7s" }}>
                  <div style={{ fontSize: "1rem", marginBottom: 10, fontWeight: 700, color: "#1E293B" }}>
                    {answer.userName} ({answer.userRole}) - {new Date(answer.time).toLocaleString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                  </div>
                  <div style={{ fontSize: "1.07rem", marginBottom: 10, lineHeight: 1.7, color: "#64748B" }} dangerouslySetInnerHTML={{ __html: answer.text }} />
                  <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 10 }}>
                    <button
                      style={{ ...button("#2563EB", "#EFF6FF", "#dbeafe"), animation: likeAnim[answer._id] ? "pop 0.6s" : undefined }}
                      onClick={() => handleLike(answer._id)}
                    >
                      👍 Like <span style={{ marginLeft: 6 }}>{answer.likes}</span>
                    </button>
                    <button
                      style={{ ...button("#FF4B4B", "#FFF1F2", "#fee2e2"), animation: dislikeAnim[answer._id] ? "pop 0.6s" : undefined }}
                      onClick={() => handleDislike(answer._id)}
                    >
                      👎 Dislike <span style={{ marginLeft: 6 }}>{answer.dislikes}</span>
                    </button>
                  </div>
                  {/* Edit and Delete buttons */}
                  {answer.user === userId && (
                    <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
                      <button onClick={() => handleEditAnswer(answer._id)} style={{ ...button("#fff", "#4CAF50", "#43a047"), borderRadius: 8, fontWeight: 700 }}>✏️ Edit</button>
                      <button onClick={() => handleDeleteAnswer(answer._id)} style={{ ...button("#fff", "#FF4B4B", "#e53e3e"), borderRadius: 8, fontWeight: 700 }}>🗑️ Delete</button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <EmptyState />
            )}
          </div>
          {/* Submit Answer Section */}
          <div style={{ ...card, padding: "1.5rem", marginTop: 32 }}>
            <h2 style={{ marginBottom: 18, color: "#1E293B", fontSize: "1.25rem", fontWeight: 800 }}>Submit Your Answer</h2>
            {isLoggedIn ? (
              <>
                <ReactQuill
                  value={answerText}
                  onChange={setAnswerText}
                  theme="snow"
                  placeholder="Write your answer here..."
                  style={{ height: 180, marginBottom: 18, borderRadius: 8 }}
                />
                <button
                  onClick={handleAnswerSubmit}
                  style={{ ...button("#fff", "#2563EB", "#1d4ed8"), fontSize: 18, borderRadius: 8, minWidth: 160, minHeight: 48, fontWeight: 700 }}
                  disabled={isSubmitting === true}
                >
                  {isSubmitting === true ? "Submitting..." : isSubmitting === "done" ? "✔️ Submitted!" : "Submit Answer"}
                </button>
              </>
            ) : (
              <>
                <p style={{ color: "#FF4B4B", marginBottom: 12, fontWeight: 600 }}>You need to log in to submit an answer.</p>
                <button
                  onClick={() => navigate("/login")}
                  style={{ ...button("#fff", "#2563EB", "#1d4ed8"), fontSize: 18, borderRadius: 8, minWidth: 160, minHeight: 48, fontWeight: 700 }}
                >
                  Log in to Answer
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
