import React, { useState } from "react";

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  // Sample user data
  const users = [
    {
      id: 1,
      name: "Georgeanna Ramero",
      department: "Sales",
      email: "georgeanna.ramero@example.com",
      phone: "456-485-5623",
      address: "19214 110th Rd, Saint Albans, NY",
    },
    {
      id: 2,
      name: "Janita Vogl",
      department: "Sales",
      email: "janita.vogl@example.com",
      phone: "123-456-7890",
      address: "23412 Central Blvd, Dallas, TX",
    },
    {
      id: 3,
      name: "Jeneva Bridgeforth",
      department: "Engineering",
      email: "jeneva.bridgeforth@example.com",
      phone: "789-456-1230",
      address: "123 Hill Street, San Francisco, CA",
    },
  ];

  // User feedback data
  const feedback = {
    totalReviews: 25426,
    newReviews: 346,
    positive: 25547,
    negative: 5547,
    neutral: 547,
  };

  const handleEdit = (user) => {
    alert(`Edit User: ${user.name}`);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      alert(`User ${user.name} deleted!`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "20px",
        gap: "20px",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#F8F9FA",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          flex: "1",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        <button
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#FF4C4C",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
          disabled
        >
          Add New User (Disabled)
        </button>

        <h3 style={{ marginBottom: "20px", color: "#001f3f" }}>Filter</h3>
        <ul style={{ listStyle: "none", padding: 0, fontSize: "16px", color: "#555" }}>
          <li style={{ marginBottom: "10px", cursor: "pointer" }}>👥 All</li>
          <li style={{ marginBottom: "10px", cursor: "pointer" }}>⭐ Starred</li>
          <li style={{ marginBottom: "10px", cursor: "pointer" }}>📂 Engineering</li>
          <li style={{ marginBottom: "10px", cursor: "pointer" }}>📂 Sales</li>
        </ul>
      </aside>

      {/* Main Content */}
      <div style={{ flex: "3" }}>
        {/* User List */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginBottom: "20px", color: "#001f3f" }}>Users List</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Search User..."
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            />
          </div>

          <div>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedUser(user)}
              >
                <div>
                  <h4 style={{ margin: 0, fontWeight: "bold", color: "#001f3f" }}>
                    {user.name}
                  </h4>
                  <p style={{ margin: 0, color: "#555", fontSize: "14px" }}>
                    {user.department}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    style={editButtonStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(user);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    style={deleteButtonStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(user);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Feedback Section */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          }}
        >
          <h3 style={{ marginBottom: "20px", color: "#001f3f" }}>User Feedback</h3>
          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              <h2 style={{ margin: 0, fontWeight: "bold", color: "#001f3f" }}>
                {feedback.totalReviews}
              </h2>
              <p style={{ margin: 0, color: "#777" }}>This month we got {feedback.newReviews} new reviews</p>
            </div>
            <div>
              <p style={{ color: "#0074D9" }}>😊 Positive Reviews: {feedback.positive}</p>
              <p style={{ color: "#FF4C4C" }}>😡 Negative Reviews: {feedback.negative}</p>
              <p style={{ color: "#FFA500" }}>😐 Neutral Reviews: {feedback.neutral}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Details */}
      {selectedUser && (
        <div
          style={{
            flex: "2",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          }}
        >
          <h3 style={{ marginBottom: "20px", color: "#001f3f" }}>User Details</h3>
          <p>
            <strong>Name:</strong> {selectedUser.name}
          </p>
          <p>
            <strong>Department:</strong> {selectedUser.department}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <p>
            <strong>Phone:</strong> {selectedUser.phone}
          </p>
          <p>
            <strong>Address:</strong> {selectedUser.address}
          </p>
        </div>
      )}
    </div>
  );
};

// Styles
const editButtonStyle = {
  backgroundColor: "#0074D9",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  padding: "5px 10px",
  cursor: "pointer",
};

const deleteButtonStyle = {
  backgroundColor: "#FF4C4C",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  padding: "5px 10px",
  cursor: "pointer",
};

export default UsersPage;
