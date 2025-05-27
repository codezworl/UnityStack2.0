import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { FaStar } from 'react-icons/fa';

const DashboardHome = ({ adminName }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDevelopers: 0,
    totalOrganizations: 0,
    totalQuestions: 0,
    revenue: 0,
    totalProjects: 0,
    activeProjects: 0,
    assignedProjects: 0,
    completedProjects: 0
  });
  const [percentages, setPercentages] = useState({
    students: 0,
    developers: 0,
    organizations: 0
  });
  const [activities, setActivities] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [revenueData, setRevenueData] = useState([{ name: 'Revenue', value: 0 }]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setStats(data.stats);
        setPercentages(data.percentages);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/today-activities', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        // Filter out feedback activities
        const filteredActivities = data.activities.filter(activity => 
          !activity.text.toLowerCase().includes('feedback')
        );
        setActivities(filteredActivities);
      } catch (error) {
        console.error('Error fetching today activities:', error);
      }
    };
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/feedback/recent', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
    const interval = setInterval(fetchFeedbacks, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add new useEffect for fetching revenue data
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/revenue', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        
        // Update stats with platform fee
        setStats(prevStats => ({
          ...prevStats,
          revenue: data.totalRevenue // This is now the platform fee
        }));

        // Update revenue data for chart
        setRevenueData([{
          name: 'Platform Fee',
          value: data.totalRevenue
        }]);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenueData();
    const interval = setInterval(fetchRevenueData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Data for pie chart
  const pieData = [
    { name: 'Students', value: percentages.students, color: '#FFD700' },
    { name: 'Developers', value: percentages.developers, color: '#0074D9' },
    { name: 'Organizations', value: percentages.organizations, color: '#2ECC40' }
  ];

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#F8F9FA",
      }}
    >
      {/* Greeting */}
      <h2 style={{ color: "#001f3f", fontWeight: "bold", marginBottom: "30px" }}>
        Hello Mr {adminName.split(' ')[0]} sir
      </h2>
      {/* Top Overview Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Card 1 */}
        <div style={overviewCardStyle}>
          <p style={overviewCardTitleStyle}>Total Developers</p>
          <h2 style={overviewCardValueStyle}>{stats.totalDevelopers}</h2>
          <p style={overviewCardSubtitleStyle}>Active Developers</p>
        </div>
        {/* Card 2 */}
        <div style={overviewCardStyle}>
          <p style={overviewCardTitleStyle}>Total Organizations</p>
          <h2 style={overviewCardValueStyle}>{stats.totalOrganizations}</h2>
          <p style={overviewCardSubtitleStyle}>Registered Companies</p>
        </div>
        {/* Card 3 */}
        <div style={overviewCardStyle}>
          <p style={overviewCardTitleStyle}>Total Students</p>
          <h2 style={overviewCardValueStyle}>{stats.totalStudents}</h2>
          <p style={overviewCardSubtitleStyle}>Active Students</p>
        </div>
        {/* Card 4 */}
        <div style={overviewCardStyle}>
          <p style={overviewCardTitleStyle}>Total Questions</p>
          <h2 style={overviewCardValueStyle}>{stats.totalQuestions}</h2>
          <p style={overviewCardSubtitleStyle}>Questions Asked</p>
        </div>
      </div>

      {/* Project Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Total Projects Uploaded */}
        <div style={overviewCardStyle}>
          <p style={overviewCardTitleStyle}>Total Projects Uploaded</p>
          <h2 style={overviewCardValueStyle}>{stats.totalProjects}</h2>
        </div>
        {/* Active Projects */}
        <div style={overviewCardStyle}>
          <p style={overviewCardTitleStyle}>Active Projects</p>
          <h2 style={overviewCardValueStyle}>{stats.activeProjects}</h2>
        </div>
        {/* Assigned Projects */}
        <div style={overviewCardStyle}>
          <p style={overviewCardTitleStyle}>Assigned Projects</p>
          <h2 style={overviewCardValueStyle}>{stats.assignedProjects}</h2>
        </div>
        {/* Completed Projects */}
        <div style={overviewCardStyle}>
          <p style={overviewCardTitleStyle}>Completed Projects</p>
          <h2 style={overviewCardValueStyle}>{stats.completedProjects}</h2>
        </div>
      </div>

      {/* Charts Section: Pie and Revenue Side by Side */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {/* Pie Chart Section */}
        <div style={{ ...contentCardStyle, flex: 1, minWidth: 320 }}>
          <h3 style={sectionTitleStyle}>User Distribution</h3>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Revenue Chart Section */}
        <div style={{ ...contentCardStyle, flex: 1, minWidth: 320 }}>
          <h3 style={sectionTitleStyle}>Platform Fee Overview</h3>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer>
              <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`PKR ${value.toLocaleString()}`, 'Platform Fee']}
                  labelFormatter={() => 'Total Platform Fee'}
                />
                <Bar dataKey="value" fill="#82ca9d">
                  <LabelList dataKey="value" position="top" formatter={(value) => `PKR ${value.toLocaleString()}`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
            <p>Total Platform Fee (10% of completed project payments)</p>
          </div>
        </div>
      </div>

      {/* Main Content Area: Activities/Notifications */}
      <div style={{ ...contentCardStyle, marginBottom: '30px' }}>
        <h3 style={sectionTitleStyle}>Today's Activities</h3>
        {activities.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>No activities yet today.</p>
        ) : (
          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            {activities.map((activity, idx) => (
              <li key={idx} style={listItemStyle}>
                {activity.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Feedback Cards Section */}
      <div style={{ ...contentCardStyle, marginBottom: '30px' }}>
        <h3 style={sectionTitleStyle}>Recent Feedback</h3>
        {feedbacks.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>No feedback received yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {feedbacks.map((feedback) => (
              <div key={feedback._id} style={feedbackCardStyle}>
                <div style={feedbackHeaderStyle}>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(feedback.name)}&background=random`}
                    alt={feedback.name}
                    style={feedbackAvatarStyle}
                  />
                  <div>
                    <h4 style={feedbackNameStyle}>{feedback.name}</h4>
                    <span style={feedbackRoleStyle}>{feedback.role}</span>
                  </div>
                </div>
                <div style={feedbackRatingStyle}>
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      style={{
                        color: index < feedback.rating ? "#FFD700" : "#ddd",
                        fontSize: "16px"
                      }}
                    />
                  ))}
                </div>
                <p style={feedbackDescriptionStyle}>{feedback.description}</p>
                <span style={feedbackTimeStyle}>
                  {new Date(feedback.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Website Traffic & Earnings Overview Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Website Traffic Card */}
        
      </div>
    </div>
  );
};

// Reusable Styles
const overviewCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const overviewCardTitleStyle = {
  color: "#777",
  fontSize: "14px",
};

const overviewCardValueStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#001f3f",
};

const overviewCardSubtitleStyle = {
  fontSize: "12px",
  color: "#0074D9",
};

const contentCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const sectionTitleStyle = {
  color: "#001f3f",
  fontWeight: "bold",
  marginBottom: "20px",
};

const listItemStyle = {
  marginBottom: "10px",
  fontSize: "14px",
  color: "#555",
};

// Add new styles
const feedbackCardStyle = {
  backgroundColor: '#fff',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
  ':hover': {
    transform: 'translateY(-5px)'
  }
};

const feedbackHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '15px'
};

const feedbackAvatarStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  marginRight: '15px'
};

const feedbackNameStyle = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#001f3f'
};

const feedbackRoleStyle = {
  fontSize: '12px',
  color: '#666',
  textTransform: 'capitalize'
};

const feedbackRatingStyle = {
  display: 'flex',
  gap: '4px',
  marginBottom: '10px'
};

const feedbackDescriptionStyle = {
  margin: '10px 0',
  fontSize: '14px',
  color: '#555',
  lineHeight: '1.5'
};

const feedbackTimeStyle = {
  fontSize: '12px',
  color: '#888',
  display: 'block',
  marginTop: '10px'
};

export default DashboardHome;
