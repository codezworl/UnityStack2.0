import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AskQuestionPage = () => {
  const [title, setTitle] = useState("");
  const [problemDetails, setProblemDetails] = useState("");
  const [triedAndExpected, setTriedAndExpected] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate backend submission
    const questionData = {
      title,
      problemDetails,
      triedAndExpected,
      tags: tags.split(",").map((tag) => tag.trim()),
    };

    console.log("Submitting question:", questionData);

    // Reset form after submission
    setTimeout(() => {
      setTitle("");
      setProblemDetails("");
      setTriedAndExpected("");
      setTags("");
      setIsSubmitting(false);
      alert("Question submitted successfully!");
    }, 1000);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>
        Ask a Question
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Question Title */}
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="title"
            style={{ display: "block", fontSize: "1.1rem", marginBottom: "8px" }}
          >
            Question Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are the details of your problem?"
            required
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "1rem",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          />
          <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
            Introduce the problem and expand on what you put in the title. Minimum
            20 characters.
          </p>
        </div>

        {/* Problem Details */}
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="problemDetails"
            style={{ display: "block", fontSize: "1.1rem", marginBottom: "8px" }}
          >
            What are the details of your problem?
          </label>
          <ReactQuill
            value={problemDetails}
            onChange={setProblemDetails}
            placeholder="Describe your problem in detail..."
            style={{ height: "200px", marginBottom: "10px" }}
          />
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            Minimum 30 characters.
          </p>
        </div>

        {/* What Did You Try and Expect? */}
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="triedAndExpected"
            style={{ display: "block", fontSize: "1.1rem", marginBottom: "8px" }}
          >
            What did you try and what were you expecting?
          </label>
          <ReactQuill
            value={triedAndExpected}
            onChange={setTriedAndExpected}
            placeholder="Describe what you tried, what you expected, and what actually happened..."
            style={{ height: "200px", marginBottom: "10px" }}
          />
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            Minimum 30 characters.
          </p>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="tags"
            style={{ display: "block", fontSize: "1.1rem", marginBottom: "8px" }}
          >
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., react, javascript, node.js"
            required
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "1rem",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          />
          <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "5px" }}>
            Add tags to help others find your question.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: "#2563EB",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {isSubmitting ? "Submitting..." : "Post Your Question"}
        </button>
      </form>

      {/* Tips Section */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "10px" }}>
          Tips for a great question:
        </h2>
        <ul style={{ listStyle: "disc", paddingLeft: "20px", color: "#666" }}>
          <li>Summarize your problem in a one-line title.</li>
          <li>Describe what you’ve tried and what you expected to happen.</li>
          <li>Add “tags” to help surface your question to the community.</li>
          <li>Proofread for clarity and correctness.</li>
        </ul>
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: "40px",
          padding: "20px 0",
          borderTop: "1px solid #ddd",
          textAlign: "center",
          color: "#666",
        }}
      >
        <p>© 2025 UnityStack. All rights reserved.</p>
        <p>
          <a href="/privacy" style={{ color: "#2563EB", textDecoration: "none" }}>
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="/terms" style={{ color: "#2563EB", textDecoration: "none" }}>
            Terms of Service
          </a>{" "}
          |{" "}
          <a
            href="/conduct"
            style={{ color: "#2563EB", textDecoration: "none" }}
          >
            Code of Conduct
          </a>
        </p>
      </footer>
    </div>
  );
};

export default AskQuestionPage;