import React, { useState } from "react";

const FindDeveloper = () => {
  const [activeTab, setActiveTab] = useState("current"); // Active tab state
  const [showForm, setShowForm] = useState(false); // Toggle for create request form
  const [currentRequests, setCurrentRequests] = useState([]); // Current requests
  const [formData, setFormData] = useState({
    type: "Full Stack Project",
    title: "",
    description: "",
    tags: [],
  });

  const availableTags = [
    "ReactJS",
    "JavaScript",
    "Python",
    "Node.js",
    "HTML",
    "CSS",
    "Java",
    "C++",
    "PHP",
    "Android",
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleCreateRequest = () => {
    // Check if at least 2 tags are selected
    if (formData.title && formData.description && formData.tags.length >= 2) {
      setCurrentRequests([...currentRequests, formData]);
      setFormData({ type: "Full Stack Project", title: "", description: "", tags: [] }); // Reset form
      setShowForm(false); // Close form
    } else {
      alert("Please fill out all fields and add at least 2 tags!");
    }
  };

  const handleDeleteRequest = (index) => {
    setCurrentRequests(currentRequests.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3>Find Developer</h3>

      {/* Tabs */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "current" ? "active" : ""}`}
            onClick={() => setActiveTab("current")}
            style={{ cursor: "pointer" }}
          >
            Current Requests
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "past" ? "active" : ""}`}
            onClick={() => setActiveTab("past")}
            style={{ cursor: "pointer" }}
          >
            Past History
          </a>
        </li>
      </ul>

      <div className="tab-content mt-4">
        {/* Current Requests Tab */}
        {activeTab === "current" && (
          <div className="tab-pane fade show active">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5>Current Requests</h5>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                Create Request
              </button>
            </div>

            {/* Request Form */}
            {showForm && (
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5>Create Request</h5>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Back
                    </button>
                  </div>
                  <div className="mb-3">
                    <label>What kind of help do you need?</label>
                    <select
                      className="form-control"
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                    >
                      <option>Full Stack Project</option>
                      <option>Front End</option>
                      <option>Back End</option>
                      <option>API</option>
                      <option>Routing</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Problem Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="One sentence summary"
                    />
                  </div>
                  <div className="mb-3">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="4"
                      placeholder="Provide more details about your issue"
                    />
                  </div>
                  <div className="mb-3">
                    <label>Tags (add minimum 2 tags)</label>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="badge bg-primary"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} &times;
                        </span>
                      ))}
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <span
                          key={tag}
                          className="badge bg-secondary"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleAddTag(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="btn btn-success"
                    onClick={handleCreateRequest}
                  >
                    Create Request
                  </button>
                </div>
              </div>
            )}

            {/* Current Requests */}
            <div className="row g-4">
              {currentRequests.map((request, index) => (
                <div className="col-md-4" key={index}>
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h6 className="card-title">{request.title}</h6>
                      <p className="text-muted">
                        <small>{request.type}</small>
                      </p>
                      <p className="text-muted">
                        Tags: {request.tags.map((tag) => `#${tag} `)}
                      </p>
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => alert("Edit functionality not implemented yet")}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteRequest(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past History Tab */}
        {activeTab === "past" && (
          <div className="tab-pane fade show active">
            <h5>Past History</h5>
            <table className="table table-striped">
              <thead className="table-light">
                <tr>
                  <th>Problem</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Developer</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fix React Component</td>
                  <td>2025-01-10</td>
                  <td>2025-01-12</td>
                  <td>John Doe</td>
                  <td>
                    <button className="btn btn-primary btn-sm">View</button>
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDeveloper;
