import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaBuilding, FaCalendarAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/header";
import Footer from "../components/footer";

const ReadBlog = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/organizations/posts/${blogId}`
        );
        setBlog(response.data);
      } catch (err) {
        setError("Failed to fetch blog post. Please try again later.");
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={handleBack}>
          <FaArrowLeft className="me-2" />
          Go Back
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning" role="alert">
          Blog post not found.
        </div>
        <button className="btn btn-primary" onClick={handleBack}>
          <FaArrowLeft className="me-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Back Button */}
            <button
              className="btn btn-outline-secondary mb-4"
              onClick={handleBack}
            >
              <FaArrowLeft className="me-2" />
              Back
            </button>

            <div className="card shadow-lg border-0 rounded-3">
              {/* Blog Image */}
              {blog.image && (
                <img
                  src={`http://localhost:5000/${blog.image.replace(/\\/g, '/')}`}
                  className="card-img-top"
                  alt={blog.title}
                  style={{
                    maxHeight: "500px",
                    objectFit: "cover",
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/1200x500?text=Image+Not+Available";
                  }}
                />
              )}

              <div className="card-body p-4 p-md-5">
                {/* Blog Title */}
                <h1 className="card-title fw-bold display-5 mb-3">
                  {blog.title}
                </h1>

                {/* Meta Info */}
                <div className="d-flex flex-wrap align-items-center text-muted mb-4">
                  {blog.organization && (
                    <div className="d-flex align-items-center me-4 mb-2 mb-md-0">
                      {blog.organization.logo && (
                        <img
                          src={`http://localhost:5000/uploads/${blog.organization.logo}`}
                          alt={`${blog.organization.companyName} logo`}
                          className="rounded-circle me-2"
                          style={{ width: "30px", height: "30px" }}
                        />
                      )}
                      <span className="fw-medium">
                        <FaBuilding className="me-2" />
                        {blog.organization.companyName}
                      </span>
                    </div>
                  )}
                  <div className="d-flex align-items-center">
                    <FaCalendarAlt className="me-2" />
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Blog Description */}
                <div
                  className="blog-description fs-5"
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style jsx>{`
        .blog-description img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
        }
      `}</style>
    </>
  );
};

export default ReadBlog; 