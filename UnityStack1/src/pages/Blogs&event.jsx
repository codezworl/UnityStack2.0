import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "bootstrap/dist/css/bootstrap.min.css";

const BlogsAndEvents = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    description: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Fetch posts from API
  const fetchBlogs = async () => {
    setLoading(true);
    setError(null); // ✅ Reset error state before fetching
  
    try {
      const token = localStorage.getItem("token"); // ✅ Get token from localStorage
  
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
  
      const response = await axios.get("http://localhost:5000/api/organizations/posts", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Send token in request
      });
  
      setBlogs(response.data);
      console.log("✅ Blogs fetched successfully:", response.data);
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
  
      if (error.response) {
        // Server responded with a specific error
        if (error.response.status === 403) {
          setError("Access denied! Only organizations can fetch posts.");
        } else if (error.response.status === 401) {
          setError("Unauthorized! Please log in again.");
        } else {
          setError(error.response.data.message || "Failed to load posts.");
        }
      } else {
        // Network or other issue
        setError("Failed to connect to the server. Please try again later.");
      }
    }
  
    setLoading(false);
  };
  

  // ✅ Handle input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle image selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  // ✅ Handle Quill editor change
  const handleQuillChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  // ✅ Submit new or edited post
  const handleSubmit = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No token found. Please log in again.");
            setError("Unauthorized: Please log in first.");
            return;
        }

        const formDataObj = new FormData();
        formDataObj.append("title", formData.title.trim());
        formDataObj.append("description", formData.description.trim());

        if (formData.image) {
            formDataObj.append("image", formData.image);
        }

        let response;

        if (currentPost) {
            // ✅ Update an existing post
            response = await axios.put(
                `http://localhost:5000/api/organizations/posts/${currentPost._id}`,
                formDataObj,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
        } else {
            // ✅ Create a new post
            response = await axios.post(
                "http://localhost:5000/api/organizations/posts",
                formDataObj,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
        }

        console.log("✅ Post submitted successfully:", response.data);

        // Refresh posts
        fetchBlogs();

        // Close the modal and reset form
        setShowModal(false);
        setFormData({ title: "", image: null, description: "" });
        setCurrentPost(null);
        setError(null);
    } catch (error) {
        console.error("❌ Error submitting post:", error);

        // Handle different error types
        if (error.response) {
            if (error.response.status === 403) {
                setError("You are not authorized to create or update this post.");
            } else if (error.response.status === 400) {
                setError("Invalid post data. Please fill in all required fields.");
            } else {
                setError("Failed to submit post. Please try again.");
            }
        } else {
            setError("Network error. Check your internet connection and try again.");
        }
    }
};


  // ✅ Open modal for editing
  const handleEdit = (post) => {
    setCurrentPost(post);
    setFormData({ title: post.title, image: post.image, description: post.description });
    setShowModal(true);
  };

  // ✅ Delete post
  const handleDelete = async (postId) => {
    if (window.confirm("⚠ Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/organizations/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchBlogs();
      } catch (error) {
        console.error("❌ Error deleting post:", error);
        setError("Failed to delete post. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-4">
      {/* ✅ Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">📢 Blogs & Events ({blogs.length})</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" /> Add Post
        </Button>
      </div>

      {/* ✅ Show Loading Spinner */}
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p>Loading posts...</p>
        </div>
      )}

      {/* ✅ Show Error Message */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* ✅ Blog Cards */}
      <div className="row g-4">
        {blogs.length === 0 && !loading ? (
          <p className="text-muted text-center">No posts available. Click "Add Post" to create one.</p>
        ) : (
          blogs.map((blog) => (
            <div className="col-md-4" key={blog._id}>
              <div className="card shadow-sm">
                {/* ✅ Blog Image */}
                <img
                  src={`http://localhost:5000/uploads/${blog.image}`}
                  alt={blog.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                {/* ✅ Blog Body */}
                <div className="card-body">
                  <h5 className="card-title">{blog.title}</h5>
                  <p className="card-text text-muted">{blog.description.substring(0, 100)}...</p>
                  <p className="text-muted">
                    <small>🗓 {new Date(blog.createdAt).toLocaleDateString()}</small>
                  </p>
                  {/* ✅ Actions */}
                  <div className="d-flex justify-content-between">
                    <Button variant="warning" size="sm" onClick={() => handleEdit(blog)}>
                      <FaEdit className="me-1" /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(blog._id)}>
                      <FaTrashAlt className="me-1" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Modal for Adding/Editing Post */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentPost ? "✏ Edit Post" : "📝 Add New Post"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleImageUpload} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <ReactQuill value={formData.description} onChange={handleQuillChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {currentPost ? "Update" : "Post"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BlogsAndEvents;
