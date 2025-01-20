import React from "react";

const DashboardHome = () => {
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#F8F9FA",
      }}
    >
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
          <h2 style={overviewCardValueStyle}>125</h2>
          <p style={overviewCardSubtitleStyle}>+10 Active this week</p>
        </div>

        {/* Card 2 */}
        <div style={overviewCardStyle}>
          <p style={overviewCardTitleStyle}>Total Earnings</p>
          <h2 style={overviewCardValueStyle}>$8,200</h2>
          <p style={overviewCardSubtitleStyle}>+15% Increase</p>
        </div>

        {/* Card 3 */}
        <div style={overviewCardStyle}>
          <p style={overviewCardTitleStyle}>Total Students</p>
          <h2 style={overviewCardValueStyle}>350</h2>
          <p style={overviewCardSubtitleStyle}>45 New this month</p>
        </div>

        {/* Card 4 */}
        <div style={overviewCardStyle}>
          <p style={overviewCardTitleStyle}>Questions Answered</p>
          <h2 style={overviewCardValueStyle}>1,520</h2>
          <p style={overviewCardSubtitleStyle}>120 this week</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Left: Recent Sales */}
        <div style={contentCardStyle}>
          <h3 style={sectionTitleStyle}>Recent Activities</h3>
          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            <li style={listItemStyle}>🔹 Jane booked a new session with Mentor John</li>
            <li style={listItemStyle}>🔹 Developer Sarah answered 12 questions</li>
            <li style={listItemStyle}>🔹 5 Students enrolled in Web Development 101</li>
            <li style={listItemStyle}>🔹 Mentor Paul earned $450 from sessions</li>
          </ul>
        </div>

        {/* Right: Notifications */}
        <div style={contentCardStyle}>
          <h3 style={sectionTitleStyle}>Notifications</h3>
          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            <li style={listItemStyle}>🔔 John updated his availability schedule.</li>
            <li style={listItemStyle}>🔔 3 New students joined your platform today.</li>
            <li style={listItemStyle}>🔔 New question: "How to deploy a React app?"</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* Traffic Section */}
        <div style={contentCardStyle}>
          <h3 style={sectionTitleStyle}>Website Traffic</h3>
          <div>
            <p style={{ fontSize: "14px", color: "#777", marginBottom: "10px" }}>
              Traffic this month:
            </p>
            <h2 style={{ fontWeight: "bold", color: "#001f3f" }}>120,000 Visitors</h2>
            <p style={{ fontSize: "14px", color: "#0074D9" }}>+25% since last month</p>
          </div>
        </div>

        {/* Earnings Section */}
        <div style={contentCardStyle}>
          <h3 style={sectionTitleStyle}>Earnings Overview</h3>
          <div>
            <p style={{ fontSize: "14px", color: "#777", marginBottom: "10px" }}>
              Total Earnings:
            </p>
            <h2 style={{ fontWeight: "bold", color: "#001f3f" }}>$12,340</h2>
            <p style={{ fontSize: "14px", color: "#0074D9" }}>+15% Growth</p>
          </div>
        </div>
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

export default DashboardHome;