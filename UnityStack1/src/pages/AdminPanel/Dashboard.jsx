import React, { useState, useEffect, useRef } from "react";
import DashboardHome from "./DashboardHome";
import UsersPage from "./UsersPage";
import TransactionsPage from "./ShowTranssactions";
import SettingsPage from "./Adminsettings";
import { useNavigate } from 'react-router-dom';
import { FaStar } from "react-icons/fa";

const DashboardLayout = ({ children }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [activePage, setActivePage] = useState("Home"); // State to track active page
  const [unseenFeedbackCount, setUnseenFeedbackCount] = useState(0);
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);

  const profileDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);

  const navigate = useNavigate();

  // Get admin info from localStorage
  const adminName = localStorage.getItem('adminName') || 'Admin';
  const adminEmail = localStorage.getItem('adminEmail') || '';
  // Compute initials
  const getInitials = (name) => {
    if (!name) return 'AD';
    const words = name.trim().split(' ');
    if (words.length === 1) return name.substring(0, 2).toUpperCase();
    return (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase();
  };
  const initials = getInitials(adminName);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(event.target)
      ) {
        setShowNotificationsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add this useEffect for fetching feedback notifications
  useEffect(() => {
    const fetchFeedbackNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const [countResponse, feedbacksResponse] = await Promise.all([
          fetch('http://localhost:5000/api/feedback/unseen-count', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('http://localhost:5000/api/feedback/recent', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        const countData = await countResponse.json();
        const feedbacksData = await feedbacksResponse.json();

        setUnseenFeedbackCount(countData.count);
        setRecentFeedbacks(feedbacksData);
      } catch (error) {
        console.error('Error fetching feedback notifications:', error);
      }
    };

    fetchFeedbackNotifications();
    const interval = setInterval(fetchFeedbackNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Add this function to mark feedback as seen
  const handleMarkFeedbackAsSeen = async (feedbackId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/feedback/mark-seen/${feedbackId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUnseenFeedbackCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking feedback as seen:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/feedback/mark-all-seen', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUnseenFeedbackCount(0);
      setRecentFeedbacks([]);
    } catch (error) {
      console.error('Error marking all feedback as seen:', error);
    }
  };

  // Update the notifications array to only include unseen feedback
  const notifications = recentFeedbacks
    .filter(feedback => !feedback.seen)
    .map(feedback => ({
      type: "new",
      name: feedback.name,
      message: `New feedback submitted: ${feedback.description.substring(0, 50)}...`,
      time: new Date(feedback.createdAt).toLocaleTimeString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(feedback.name)}&background=random`,
      feedbackId: feedback._id,
      rating: feedback.rating
    }));

  // Render the active page based on state
  const renderActivePage = () => {
    switch (activePage) {
      case "Home":
        return <DashboardHome adminName={adminName} />;
      case "Users":
        return <UsersPage />;
      case "Transactions":
        return <TransactionsPage />;
      case "Settings":
        return <SettingsPage notifications={notifications} />;
      default:
        return <DashboardHome />;
    }
  };

  // Add handler functions for profile menu items
  const handleProfileAction = (action) => {
    if (action === 'Logout') {
      // Clear all auth-related localStorage items
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminEmail');
      // Redirect to login page
      navigate('/login');
      return;
    }
    setShowProfileDropdown(false); // Close dropdown after action
  };

  // Update the NotificationItem component
  const NotificationItem = ({ notification }) => {
    const handleClick = () => {
      if (notification.feedbackId) {
        handleMarkFeedbackAsSeen(notification.feedbackId);
      }
    };

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "15px",
          padding: "8px",
          borderRadius: "8px",
          transition: "background-color 0.3s",
          cursor: "pointer",
        }}
        onClick={handleClick}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
      >
        <img
          src={notification.avatar}
          alt={notification.name}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: 0,
              fontWeight: "bold",
              fontSize: "14px",
              color: "black",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {notification.name}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: "#777",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {notification.message}
          </p>
          {notification.rating && (
            <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  style={{
                    color: index < notification.rating ? "#FFD700" : "#ddd",
                    fontSize: "12px"
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "12px",
            color: "#AAA",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {notification.time}
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          backgroundColor: "#001f3f",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <div
          style={{
            marginBottom: "30px",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {adminName}
        </div>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              { name: "Home", value: "Home" },
              { name: "Users", value: "Users" },
              { name: "Transactions", value: "Transactions" },
              { name: "Analytics", value: "Analytics" },
              { name: "Settings", value: "Settings" },
            ].map((item, index) => (
              <li
                key={index}
                onClick={() => setActivePage(item.value)} // Set active page on click
                style={{
                  padding: "10px 15px",
                  cursor: "pointer",
                  backgroundColor:
                    activePage === item.value ? "#004080" : "transparent",
                  color: activePage === item.value ? "#FFD700" : "#ffffff",
                  borderRadius: "5px",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#004080")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor =
                    activePage === item.value ? "#004080" : "transparent")
                }
              >
                {item.name}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: "#F8F9FA", overflowY: "auto" }}>
        {/* Header */}
        <header
          style={{
            backgroundColor: "#0074D9",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#ffffff",
          }}
        >
          {/* Search Bar */}
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="text"
              placeholder="Search..."
              style={{
                padding: "10px 20px",
                width: "100%",
                borderRadius: "20px",
                border: "none",
                outline: "none",
                fontSize: "16px",
                paddingRight: "40px",
                marginRight: "100px",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#0074D9",
                fontSize: "20px",
              }}
            >
              🔍
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginLeft: "20px",
            }}
          >
            {/* Notifications Dropdown */}
            <div
              style={{ position: "relative" }}
              ref={notificationsDropdownRef}
            >
              <span
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  transition: "transform 0.3s",
                  position: "relative"
                }}
                onClick={() =>
                  setShowNotificationsDropdown(!showNotificationsDropdown)
                }
                onMouseOver={(e) => (e.target.style.transform = "scale(1.2)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                🔔
                {unseenFeedbackCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      backgroundColor: "#FF4136",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                  >
                    {unseenFeedbackCount}
                  </span>
                )}
              </span>

              {showNotificationsDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "30px",
                    right: "0",
                    width: "300px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px",
                    zIndex: 1000,
                    overflow: "hidden",
                    animation: "fadeIn 0.3s ease-in-out",
                  }}
                >
                  <div
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #E5E5E5",
                      fontWeight: "bold",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Notifications</span>
                    {notifications.length > 0 && (
                      <span
                        style={{
                          display: "flex",
                          gap: "10px",
                          fontSize: "12px",
                          color: "#0074D9",
                        }}
                      >
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleMarkAllAsRead();
                          }}
                          style={{ textDecoration: "none", color: "#0074D9" }}
                        >
                          mark all as read
                        </a>
                      </span>
                    )}
                  </div>

                  {/* Notifications Section */}
                  <div style={{ padding: "10px" }}>
                    {notifications.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                        No new notifications
                      </p>
                    ) : (
                      notifications.map((notification, index) => (
                        <NotificationItem key={index} notification={notification} />
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div style={{ position: "relative" }} ref={profileDropdownRef}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#EFF6FF",
                  color: "#2563EB",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "transform 0.3s",
                }}
                onClick={() => setShowProfileDropdown((prev) => !prev)}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                {initials}
              </div>
              {showProfileDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "50px",
                    right: "0",
                    width: "250px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    borderRadius: "5px",
                    zIndex: 1000,
                    animation: "fadeIn 0.3s ease-in-out",
                  }}
                >
                  <div
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background: "#EFF6FF",
                        color: "#2563EB",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "10px",
                      }}
                    >
                      {initials}
                    </div>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "bold",
                          color: "black",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {adminName}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          color: "#555",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {adminEmail}
                      </p>
                    </div>
                  </div>
                  <ul
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: "10px",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    <li
                      onClick={() => handleProfileAction('Logout')}
                      style={{
                        padding: "10px 0",
                        cursor: "pointer",
                        color: "#FF0000",
                        fontWeight: "bold",
                        transition: "background-color 0.3s",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#f5f5f5")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ padding: "20px" }}>{
          activePage === "Home" ? <DashboardHome adminName={adminName} /> : renderActivePage()
        }</main>
      </div>
    </div>
  );
};

export default DashboardLayout;