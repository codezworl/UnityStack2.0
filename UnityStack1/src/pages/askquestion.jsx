import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css"; // Import Quill CSS
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { motion } from "framer-motion";
const MIN_CHAR_COUNT = 20;
const AskQuestion = () => {
  const [title, setTitle] = useState(sessionStorage.getItem("title") || "");
  const [details, setDetails] = useState(
    sessionStorage.getItem("details") || ""
  );
  const [tried, setTried] = useState(sessionStorage.getItem("tried") || "");
  const [tags, setTags] = useState(
    JSON.parse(sessionStorage.getItem("tags")) || []
  );
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [detailsHeight, setDetailsHeight] = useState(150);
  const [triedHeight, setTriedHeight] = useState(150);

  // Auto-expand editor as text increases
  useEffect(() => {
    setDetailsHeight(Math.max(150, details.length * 1.2));
    setTriedHeight(Math.max(150, tried.length * 1.2));
    sessionStorage.setItem("title", title);
    sessionStorage.setItem("details", details);
    sessionStorage.setItem("tried", tried);
    sessionStorage.setItem("tags", JSON.stringify(tags));
  }, [title, details, tried, tags]);

  const navigate = useNavigate();
  const handlePreview = () => {
    navigate("/previewquestion", {
      state: { title, details, tried, tags },
    });
  };

  useEffect(() => {
    import("quill/dist/quill.snow.css");
  }, []);

  const tagSuggestions = [
    "react",
    "javascript",
    "node.js",
    "next.js",
    "express",
    "mongodb",
  ];

  // Add tag
  const addTag = () => {
    if (tagInput && !tags.includes(tagInput) && tags.length < 5) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) =>
    setTags(tags.filter((tag) => tag !== tagToRemove));

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !details || !tried) {
      setError("All fields are required.");
      return;
    }
    setError("");

    const questionData = { title, details, tried, tags };

    try {
      const response = await fetch("https://your-api-url.com/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });

      if (response.ok) {
        alert("Question posted successfully!");

        // Clear sessionStorage after successful submission
        sessionStorage.removeItem("title");
        sessionStorage.removeItem("details");
        sessionStorage.removeItem("tried");
        sessionStorage.removeItem("tags");

        // Reset form fields
        setTitle("");
        setDetails("");
        setTried("");
        setTags([]);
      } else {
        throw new Error("Failed to post question.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Quill Editor Toolbar
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["link", "image", "video", "formula"],
      ["clean"],
    ],
  };

  return (
    
    <div>
     <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0 }}
    >
      <Header />
      <div
        style={{
          background: "#f8f9fa",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            width: "100%",
            padding: "30px",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          
          <h2
            style={{
              fontSize: "26px",
              marginBottom: "20px",
              fontWeight: "bold",
              color: "#222",
              textAlign: "center",
            }}
          >
            Ask a Question
          </h2>

          {/* Close Button */}
          <button
            onClick={() => {
              sessionStorage.removeItem("title");
              sessionStorage.removeItem("details");
              sessionStorage.removeItem("tried");
              sessionStorage.removeItem("tags");
          
              navigate("/question")}} 
            style={{
              position: "absolute",
              top: "20px", 
              right: "15px", 
              background: "none",
              border: "none",
              fontSize: "1rem", 
              cursor: "pointer",
              color: "Black",
            }}
            aria-label="Close"
          >
            ✖
          </button>

          {error && (
            <p style={{ color: "red", fontSize: "14px", textAlign: "center" }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Question Title */}
            <label
              style={{
                fontWeight: "bold",
                color: "#444",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Question Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How do I implement authentication in Next.js?"
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "16px",
                background: "#f8f9fa",
              }}
            />
            {/* Problem Details */}
            <label
              style={{
                fontWeight: "bold",
                color: "#444",
                display: "block",
                marginBottom: "5px",
              }}
            >
              What are the details of your problem?
            </label>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
              Introduce the problem and expand on what you put in the title.
              Minimum 20 characters.
            </p>
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
                background: "#fff",
                minHeight: "200px",
                position: "relative",
              }}
            >
              {/* Fixed Toolbar */}
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  background: "#fff",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <ReactQuill
                  value={details}
                  onChange={setDetails}
                  modules={{ toolbar: modules.toolbar }}
                  theme="snow"
                />
              </div>

              {/* Scrollable Content */}
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  padding: "10px",
                }}
              >
                <ReactQuill
                  value={details}
                  onChange={setDetails}
                  modules={{ toolbar: false }} // Disable toolbar inside content
                  theme="snow"
                  placeholder="Provide detailed information about your issue..."
                  style={{ height: "auto", minHeight: "150px" }}
                />
              </div>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: details.length < MIN_CHAR_COUNT ? "red" : "green",
              }}
            >
              {details.length} / {MIN_CHAR_COUNT} characters
            </p>
            {/* Attempted Solutions */}
            <label
              style={{
                fontWeight: "bold",
                color: "#444",
                display: "block",
                marginBottom: "5px",
              }}
            >
              What did you try and what were you expecting?
            </label>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
              Describe what you tried, what you expected to happen, and what
              actually resulted. Minimum 20 characters.
            </p>
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
                background: "#fff",
                minHeight: "200px",
                position: "relative",
              }}
            >
              {/* Fixed Toolbar */}
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  background: "#fff",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <ReactQuill
                  value={tried}
                  onChange={setTried}
                  modules={{ toolbar: modules.toolbar }}
                  theme="snow"
                />
              </div>

              {/* Scrollable Content */}
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  padding: "10px",
                }}
              >
                <ReactQuill
                  value={tried}
                  onChange={setTried}
                  modules={{ toolbar: false }} // Disable toolbar inside content
                  theme="snow"
                  placeholder="Describe your attempted solutions..."
                  style={{ height: "auto", minHeight: "150px" }}
                />
              </div>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: tried.length < MIN_CHAR_COUNT ? "red" : "green",
              }}
            >
              {tried.length} / {MIN_CHAR_COUNT} characters
            </p>
            {/* Tags */}
            <label
              style={{
                fontWeight: "bold",
                color: "#444",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Tags
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. react, javascript, node.js"
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  background: "#f8f9fa",
                }}
              />
              <button
                type="button"
                onClick={addTag}
                style={{
                  marginLeft: "10px",
                  padding: "12px 15px",
                  borderRadius: "5px",
                  border: "none",
                  background: "Black",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Add Tag
              </button>
            </div>
            <div style={{ marginBottom: "15px" }}>
              {tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    display: "inline-block",
                    background: "#e1ecf4",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    marginRight: "5px",
                    fontSize: "14px",
                    cursor: "pointer",
                    color: "#007BFF",
                  }}
                  onClick={() => removeTag(tag)}
                >
                  {tag} ✖
                </span>
              ))}
            </div>
            {/* Suggested Tags */}
            <div style={{ marginBottom: "15px", color: "#007BFF" }}>
              <strong>Suggested:</strong>
              {tagSuggestions.map((suggestion, index) => (
                <span
                  key={index}
                  onClick={() => setTags([...tags, suggestion])}
                  style={{
                    cursor: "pointer",
                    marginLeft: "5px",
                    padding: "6px 10px",
                    background: "#e1ecf4",
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: "#007BFF",
                  }}
                >
                  {suggestion}
                </span>
              ))}
            </div>
            {/* Tips Section */}
            <div
              style={{
                background: "#f8f9fa",
                padding: "15px",
                marginTop: "20px",
                marginBottom: "20px",
                borderRadius: "5px",
                fontSize: "14px",
                color: "#555",
              }}
            >
              <strong>Tips for a great question:</strong>
              <ul>
                <li>Summarize your problem in a one-line title</li>
                <li>
                  Describe what you've tried and what you expected to happen
                </li>
                <li>Add relevant "tags" to help others find your question</li>
                <li>Proofread for clarity and correctness</li>
              </ul>
            </div>
            {/* Submit Button */}
            <button
              type="button"
              onClick={handlePreview}
              style={{
                width: "50%",
                marginLeft: "200px",
                padding: "14px",
                borderRadius: "5px",
                border: "none",
                background: "#28a745",
                color: "#fff",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Preview Your Question
            </button>
          </form>
        </div>
      </div>
      <Footer />
      </motion.div>
    </div>
  );
};

export default AskQuestion;
