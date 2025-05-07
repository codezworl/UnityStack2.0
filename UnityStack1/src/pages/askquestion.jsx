import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css"; // Import Quill CSS
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { motion } from "framer-motion";
const editData = JSON.parse(sessionStorage.getItem("editQuestion"));
const isEditMode = !!editData;

const MIN_CHAR_COUNT = 20;

const AskQuestion = () => {
  // Declare state for userName and userRole inside the component
  const [userName, setUserName] = useState("");  
  const [userRole, setUserRole] = useState("");  

  const [title, setTitle] = useState(sessionStorage.getItem("title") || "");
  const [details, setDetails] = useState(sessionStorage.getItem("details") || "");
  const [tried, setTried] = useState(sessionStorage.getItem("tried") || "");
  const [tags, setTags] = useState(JSON.parse(sessionStorage.getItem("tags")) || []);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [detailsHeight, setDetailsHeight] = useState(150);
  const [triedHeight, setTriedHeight] = useState(150);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user", {
          credentials: "include"
        });
        if (!res.ok) throw new Error("User fetch failed");

        const data = await res.json();
        setUserName(data.name);
        setUserRole(data.role);
        console.log("✅ Logged in as:", data.name, data.role);
      } catch (err) {
        console.warn("❌ User not logged in:", err.message);
      }
    };
    fetchUser();
  }, []);

  // Auto-expand editor as text increases
  useEffect(() => {
    setDetailsHeight(Math.max(150, details.length * 1.2));
    setTriedHeight(Math.max(150, tried.length * 1.2));
    sessionStorage.setItem("title", title);
    sessionStorage.setItem("details", details);
    sessionStorage.setItem("tried", tried);
    sessionStorage.setItem("tags", JSON.stringify(tags));
  }, [title, details, tried, tags]);

  const handlePreview = () => {
    if (!title || !details || !tried || tags.length === 0 || !userRole || !userName) {
      setError("Please fill in all fields before previewing.");
      return;
    }
  
    setError("");  // Clear error if validation passes
  
    // Save data and navigate
    sessionStorage.setItem("title", title);
    sessionStorage.setItem("details", details);
    sessionStorage.setItem("tried", tried);
    sessionStorage.setItem("tags", JSON.stringify(tags)); // Save tags entered by the user
  
    // Ensure proper navigation to preview page, passing userRole and userName
    navigate("/previewquestion", {
      state: {
        title,
        details,
        tried,
        tags,
        userRole, // Pass userRole here
        userName, // Pass userName here
      },
    });
  };
  
  

  // Add tag
  const addTag = () => {
    if (tagInput && !tags.includes(tagInput) && tags.length < 5) {
      setTags([...tags, tagInput]);
      setTagInput("");  // Reset the input field
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  // Submit handler



  // Quill Editor Toolbar
  const modules = {
    toolbar: [
      [{ 'bold': true }, { 'italic': true }, { 'underline': true }, { 'strike': true }],
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false, // Ensures pasting from other sources keeps Quill formatting
    },
    keyboard: {
      bindings: {
        // No custom spacebar bindings, so default behavior is maintained
      },
    },
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

                navigate("/question")
              }}
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

            <form onSubmit={handlePreview}>
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
                <ReactQuill
                  key="details"  // Ensuring separate state for details
                  value={details}
                  onChange={setDetails}
                  modules={modules}
                  theme="snow"
                />
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
                <ReactQuill
                  key="tried"  // Ensuring separate state for tried
                  value={tried}
                  onChange={setTried}
                  modules={modules}
                  theme="snow"
                />
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
        background: "#007BFF",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: "20px",
        marginRight: "5px",
        fontSize: "14px",
        cursor: "pointer",  // Make the tag clickable
      }}
      onClick={() => removeTag(tag)}  // Call removeTag when the tag is clicked
    >
      #{tag} ✖
    </span>
  ))}
</div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: "50%",
                  marginLeft: "200px",
                  padding: "14px",
                  borderRadius: "5px",
                  border: "none",
                  background: isEditMode ? "#facc15" : "#28a745",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                {isEditMode ? "Save Changes" : "Preview Your Question"}
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
