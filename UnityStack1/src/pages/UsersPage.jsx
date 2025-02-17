import React, { useState } from "react";

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Sample user data
  const users = [
    {
      id: 1,
      name: "Muhammad Ahmed",
      department: "Software Development",
      email: "m.ahmed@unitystack.com",
      phone: "0321-1234567",
      address: "DHA Phase 6, Lahore, Pakistan",
    },
    {
      id: 2,
      name: "Fatima Zahra",
      department: "UI/UX Design",
      email: "fatima.zahra@unitystack.com",
      phone: "0333-9876543",
      address: "Gulberg III, Lahore, Pakistan",
    },
    {
      id: 3,
      name: "Ali Hassan",
      department: "Full Stack Development",
      email: "ali.hassan@unitystack.com",
      phone: "0300-1122334",
      address: "Bahria Town, Islamabad, Pakistan",
    },
    {
      id: 4,
      name: "Ayesha Khan",
      department: "Project Management",
      email: "ayesha.khan@unitystack.com",
      phone: "0345-5544332",
      address: "F-8, Islamabad, Pakistan",
    },
    {
      id: 5,
      name: "Usman Malik",
      department: "DevOps",
      email: "usman.malik@unitystack.com",
      phone: "0312-7788990",
      address: "Johar Town, Lahore, Pakistan",
    },
    {
      id: 6,
      name: "Zainab Siddiqui",
      department: "Mobile Development",
      email: "zainab.s@unitystack.com",
      phone: "0334-6677889",
      address: "Gulshan-e-Iqbal, Karachi, Pakistan",
    }
  ];

  // Sample feedback data 
  const feedbackData = [
    {
      id: 1,
      name: "Ali Hassan",
      role: "Developer",
      overall_experience: 8,
      ease_of_use: 9,
      feature_completeness: 7,
      design_appeal: 8,
      recommendation: 9,
      comments: "Great platform for team collaboration!",
      date: "2024-02-15"
    },
    {
      id: 2,
      name: "Fatima Zahra",
      role: "Designer",
      overall_experience: 9,
      ease_of_use: 8,
      feature_completeness: 8,
      design_appeal: 9,
      recommendation: 8,
      comments: "The UI is very intuitive and user-friendly.",
      date: "2024-02-14"
    },
    {
      id: 3,
      name: "Ayesha Khan",
      role: "Project Manager",
      overall_experience: 9,
      ease_of_use: 8,
      feature_completeness: 8,
      design_appeal: 9,
      recommendation: 8,
      comments: "The UI is very intuitive and user-friendly.",
      date: "2024-02-14"
    }
  ];

  // Filter options specific to your project
  const filterOptions = [
    { id: 'all', icon: '👥', label: 'All Users' },
    { id: 'software', icon: '💻', label: 'Software Development' },
    { id: 'ui-ux', icon: '🎨', label: 'UI/UX Design' },
    { id: 'fullstack', icon: '⚡', label: 'Full Stack Development' },
    { id: 'project', icon: '📊', label: 'Project Management' },
    { id: 'devops', icon: '🔧', label: 'DevOps' },
    { id: 'mobile', icon: '📱', label: 'Mobile Development' }
  ];

  // Handle filter selection
  const handleFilterClick = (filterId) => {
    setSelectedFilter(filterId);
    
    if (filterId === 'all') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => {
        const department = user.department.toLowerCase();
        switch(filterId) {
          case 'software':
            return department.includes('software');
          case 'ui-ux':
            return department.includes('ui/ux');
          case 'fullstack':
            return department.includes('full stack');
          case 'project':
            return department.includes('project');
          case 'devops':
            return department.includes('devops');
          case 'mobile':
            return department.includes('mobile');
          default:
            return true;
        }
      });
      setFilteredUsers(filtered);
    }
  };

  // Calculate average rating for each feedback
  const calculateAverageRating = (feedback) => {
    const ratings = [
      feedback.overall_experience,
      feedback.ease_of_use,
      feedback.feature_completeness,
      feedback.design_appeal,
      feedback.recommendation
    ];
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
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
        <h3 style={{ 
          marginBottom: "20px", 
          color: "#001f3f",
          fontFamily: "Poppins, sans-serif" 
        }}>
          Filter Users
        </h3>
        
        <ul style={{ 
          listStyle: "none", 
          padding: 0, 
          fontSize: "16px", 
          color: "#555",
          fontFamily: "Poppins, sans-serif"
        }}>
          {filterOptions.map((filter) => (
            <li
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: selectedFilter === filter.id ? "#f0f9ff" : "transparent",
                color: selectedFilter === filter.id ? "#0074D9" : "#555",
                transition: "all 0.3s ease",
                fontWeight: selectedFilter === filter.id ? "600" : "normal",
              }}
              onMouseOver={(e) => {
                if (selectedFilter !== filter.id) {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                }
              }}
              onMouseOut={(e) => {
                if (selectedFilter !== filter.id) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <span style={{ fontSize: "20px" }}>{filter.icon}</span>
              {filter.label}
            </li>
          ))}
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
            {filteredUsers.map((user) => (
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

        {/* Simplified User Feedback Section */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          }}
        >
          <h3 style={{ 
            marginBottom: "20px", 
            color: "#001f3f",
            fontFamily: "Poppins, sans-serif",
            fontSize: "1.5rem"
          }}>
            User Feedback
          </h3>

          {/* Feedback List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {feedbackData.map((feedback) => (
              <div
                key={feedback.id}
                style={{
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc"
                }}
              >
                {/* Feedback Header */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(feedback.name)}&background=random`}
                      alt={feedback.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%"
                      }}
                    />
                    <div>
                      <h4 style={{ 
                        margin: 0,
                        color: "#001f3f",
                        fontFamily: "Poppins, sans-serif"
                      }}>
                        {feedback.name}
                      </h4>
                      <span style={{ 
                        color: "#64748b",
                        fontSize: "0.875rem",
                        fontFamily: "Poppins, sans-serif"
                      }}>
                        {feedback.role}
                      </span>
                    </div>
                  </div>
                  <span style={{ 
                    color: "#64748b",
                    fontSize: "0.875rem",
                    fontFamily: "Poppins, sans-serif"
                  }}>
                    {new Date(feedback.date).toLocaleDateString()}
                  </span>
                </div>

                {/* Average Rating */}
                <div style={{ 
                  display: "flex", 
                  alignItems: "center",
                  gap: "5px",
                  marginBottom: "10px"
                }}>
                  <span style={{ 
                    color: "#0074D9",
                    fontWeight: "bold",
                    fontSize: "1.125rem",
                    fontFamily: "Poppins, sans-serif"
                  }}>
                    {calculateAverageRating(feedback)}
                  </span>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        style={{
                          color: index < calculateAverageRating(feedback) / 2 ? "#FFD700" : "#e2e8f0"
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <p style={{ 
                  margin: "10px 0 0 0",
                  color: "#4a5568",
                  fontFamily: "Poppins, sans-serif",
                  lineHeight: "1.5"
                }}>
                  {feedback.comments}
                </p>
              </div>
            ))}
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
