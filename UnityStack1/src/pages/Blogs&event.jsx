import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaPlus, FaCheck, FaTrash } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "bootstrap/dist/css/bootstrap.min.css";

const BlogsAndEvents = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [successIcon, setSuccessIcon] = useState("check");
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
            setSuccessMessage("Post updated successfully!");
            setSuccessIcon("check");
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
            setSuccessMessage("Post created successfully!");
            setSuccessIcon("check");
        }

        console.log("✅ Post submitted successfully:", response.data);

        // Refresh posts
        fetchBlogs();

        // Close the form modal
        setShowModal(false);
        
        // Show success modal
        setShowSuccessModal(true);
        
        // Reset form
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

  // ✅ Open delete confirmation modal
  const confirmDelete = (post) => {
    setPostToDelete(post);
    setShowDeleteConfirmModal(true);
  };

  // ✅ Delete post
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/organizations/posts/${postToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Close the delete confirmation modal
      setShowDeleteConfirmModal(false);
      
      // Show success message for deletion
      setSuccessMessage("Post deleted successfully!");
      setSuccessIcon("trash");
      setShowSuccessModal(true);
      
      // Refresh blogs
      fetchBlogs();
    } catch (error) {
      console.error("❌ Error deleting post:", error);
      setError("Failed to delete post. Please try again.");
      setShowDeleteConfirmModal(false);
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
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
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
                    <Button variant="danger" size="sm" onClick={() => confirmDelete(blog)}>
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
      
      {/* ✅ Delete Confirmation Modal */}
      <Modal show={showDeleteConfirmModal} onHide={() => setShowDeleteConfirmModal(false)} centered>
        <Modal.Header closeButton style={{ background: "#f8d7da", borderBottom: "1px solid #f5c6cb" }}>
          <Modal.Title style={{ color: "#721c24" }}>
            <FaTrash className="me-2" /> Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="mb-3">
            <span style={{ fontSize: "3rem", color: "#dc3545" }}>
              <FaTrash />
            </span>
          </div>
          <h5>Are you sure you want to delete this post?</h5>
          <p className="text-muted">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* ✅ Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton style={{ 
          background: successIcon === "trash" ? "#f8d7da" : "#d4edda", 
          borderBottom: successIcon === "trash" ? "1px solid #f5c6cb" : "1px solid #c3e6cb" 
        }}>
          <Modal.Title style={{ 
            color: successIcon === "trash" ? "#721c24" : "#155724" 
          }}>
            {successIcon === "trash" ? (
              <><FaTrash className="me-2" /> Success</>
            ) : (
              <><FaCheck className="me-2" /> Success</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="mb-3">
            <span style={{ 
              fontSize: "3rem", 
              color: successIcon === "trash" ? "#dc3545" : "#28a745" 
            }}>
              {successIcon === "trash" ? <FaTrash /> : <FaCheck />}
            </span>
          </div>
          <h5>{successMessage}</h5>
          <p className="text-muted">
            {successIcon === "trash" 
              ? "The post has been successfully removed." 
              : "Your content has been published and is now visible."}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant={successIcon === "trash" ? "danger" : "success"} 
            onClick={() => setShowSuccessModal(false)}
          >
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BlogsAndEvents;
