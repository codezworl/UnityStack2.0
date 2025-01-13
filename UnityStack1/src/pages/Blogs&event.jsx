import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const BlogsAndEvents = () => {
  // Sample blogs data
  const blogs = [
    {
      id: 1,
      title: "React Basics",
      date: "2025-01-10",
      image: "https://via.placeholder.com/300x200",
      description: "Learn the basics of React and how to build interactive UIs.",
    },
    {
      id: 2,
      title: "JavaScript Trends in 2025",
      date: "2025-01-15",
      image: "https://via.placeholder.com/300x200",
      description: "Explore the latest trends in JavaScript for the year 2025.",
    },
    {
      id: 3,
      title: "How to Use AI in Web Development",
      date: "2025-01-20",
      image: "https://via.placeholder.com/300x200",
      description:
        "Discover how artificial intelligence is transforming web development.",
    },
    {
      id: 4,
      title: "Top 10 CSS Frameworks",
      date: "2025-01-25",
      image: "https://via.placeholder.com/300x200",
      description: "A review of the top 10 CSS frameworks for modern web design.",
    },
    {
      id: 5,
      title: "Why You Should Learn TypeScript",
      date: "2025-02-01",
      image: "https://via.placeholder.com/300x200",
      description: "The benefits of TypeScript for large-scale web applications.",
    },
    {
      id: 6,
      title: "Building Scalable APIs",
      date: "2025-02-05",
      image: "https://via.placeholder.com/300x200",
      description:
        "A guide to building scalable and maintainable REST APIs with Node.js.",
    },
    {
      id: 7,
      title: "Understanding Next.js",
      date: "2025-02-10",
      image: "https://via.placeholder.com/300x200",
      description:
        "Learn why Next.js is a great framework for building modern web apps.",
    },
    {
      id: 8,
      title: "UI/UX Design Principles",
      date: "2025-02-15",
      image: "https://via.placeholder.com/300x200",
      description: "The fundamental principles of creating user-friendly designs.",
    },
    {
      id: 9,
      title: "Cloud Computing for Developers",
      date: "2025-02-20",
      image: "https://via.placeholder.com/300x200",
      description: "An introduction to cloud computing services for developers.",
    },
    {
      id: 10,
      title: "Mastering Git & GitHub",
      date: "2025-02-25",
      image: "https://via.placeholder.com/300x200",
      description: "How to effectively use Git and GitHub for version control.",
    },
    {
      id: 11,
      title: "Web Accessibility Tips",
      date: "2025-03-01",
      image: "https://via.placeholder.com/300x200",
      description:
        "Make your websites accessible to everyone with these simple tips.",
    },
    {
      id: 12,
      title: "Best Practices for DevOps",
      date: "2025-03-05",
      image: "https://via.placeholder.com/300x200",
      description: "Learn the best practices to streamline your DevOps workflow.",
    },
  ];

  return (
    <div>
      {/* Add Post Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Blogs & Events</h3>
        <button className="btn btn-primary">+ Add Post</button>
      </div>

      {/* Blog Cards */}
      <div className="row g-4">
        {blogs.map((blog) => (
          <div className="col-md-4" key={blog.id}>
            <div className="card shadow-sm">
              {/* Blog Image */}
              <img
                src={blog.image}
                alt={blog.title}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              {/* Blog Body */}
              <div className="card-body">
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text text-muted">{blog.description}</p>
                <p className="text-muted">
                  <small>Posted on: {blog.date}</small>
                </p>
                {/* Actions */}
                <div className="d-flex justify-content-between">
                  <button className="btn btn-warning btn-sm">
                    <FaEdit className="me-1" /> Edit
                  </button>
                  <button className="btn btn-danger btn-sm">
                    <FaTrashAlt className="me-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsAndEvents;
