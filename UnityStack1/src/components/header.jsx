import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bgLogo from "../assets/Vector.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Header = () => {
  const [isExploreDropdownOpen, setIsExploreDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Dropdown close timers
  const exploreDropdownTimeout = useRef();
  const userDropdownTimeout = useRef();
  const notificationDropdownTimeout = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true,
        });

        if (response.data) {
          console.log("Header - Fetched user:", response.data);
          setUser(response.data);
          // Fetch notifications after user is loaded
          fetchNotifications();
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications);
      // Count unread notifications
      const unread = response.data.notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update notifications list
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, {
        withCredentials: true,
      });

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Get display name based on user data
  const getDisplayName = () => {
    if (!user) return "";
    return user.displayName || 
      (user.role === 'organization' 
        ? user.companyName 
        : `${user.firstName || ''} ${user.lastName || ''}`.trim());
  };

  // Add function to handle header login click
  const handleHeaderLogin = () => {
    // Clear any stored return location when clicking login from header
    localStorage.removeItem('returnTo');
    localStorage.removeItem('returnAction');
    localStorage.removeItem('selectedChatDeveloper');
    navigate('/login');
  };

  return (
    <header
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
        position: "sticky",
        top: 0,
        zIndex: "1000",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          alignItems: "center",
          padding: "12px 40px",
          maxWidth: "1400px",
          margin: "0 auto",
          height: "70px",
        }}
      >
        {/* Logo Section */}
        <div style={{ justifySelf: "start" }}>
          <Link to="/">
            <img
              src={bgLogo}
              alt="Logo"
              style={{
                width: "150px",
                height: "auto",
                objectFit: "contain",
                cursor: "pointer",
              }}
            />
          </Link>
        </div>

        {/* Center Navigation */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "40px",
          }}
        >
          <Link 
            to="/" 
            style={{ 
              textDecoration: "none", 
              color: "#1e293b",
              fontSize: "16px",
              fontWeight: "500",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              ':hover': {
                backgroundColor: "#f1f5f9"
              }
            }}
          >
            Home
          </Link>
          <Link 
            to="/aboutus" 
            style={{ 
              textDecoration: "none", 
              color: "#1e293b",
              fontSize: "16px",
              fontWeight: "500",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "all 0.2s ease"
            }}
          >
            About Us
          </Link>
          <Link 
            to="/Getexperthelp" 
            style={{ 
              textDecoration: "none", 
              color: "#1e293b",
              fontSize: "16px",
              fontWeight: "500",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "all 0.2s ease"
            }}
          >
            Get Help
          </Link>

          {/* Explore Dropdown */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => {
              clearTimeout(exploreDropdownTimeout.current);
              setIsExploreDropdownOpen(true);
            }}
            onMouseLeave={() => {
              exploreDropdownTimeout.current = setTimeout(() => setIsExploreDropdownOpen(false), 200);
            }}
          >
            <span style={{ 
              cursor: "pointer", 
              color: "#1e293b",
              fontSize: "16px",
              fontWeight: "500",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              Explore
              <i className="fas fa-chevron-down" style={{ fontSize: "12px" }}></i>
            </span>
            {isExploreDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                  borderRadius: "12px",
                  padding: "8px",
                  minWidth: "180px",
                  marginTop: "8px"
                }}
                onMouseEnter={() => {
                  clearTimeout(exploreDropdownTimeout.current);
                  setIsExploreDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  exploreDropdownTimeout.current = setTimeout(() => setIsExploreDropdownOpen(false), 200);
                }}
              >
                <Link 
                  to="/question" 
                  style={{ 
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textDecoration: "none", 
                    color: "#1e293b",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                    ':hover': {
                      backgroundColor: "#f1f5f9"
                    }
                  }}
                >
                  <i className="fas fa-question-circle"></i>
                  Questions
                </Link>
                <Link 
                  to="/companies" 
                  style={{ 
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textDecoration: "none", 
                    color: "#1e293b",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                    ':hover': {
                      backgroundColor: "#f1f5f9"
                    }
                  }}
                >
                  <i className="fas fa-building"></i>
                  Companies
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right Section - User & Notifications */}
        <div style={{ 
          justifySelf: "end",
          display: "flex",
          alignItems: "center",
          gap: "24px"
        }}>
          {/* Notification Icon with Dropdown */}
          {user && (
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => {
                clearTimeout(notificationDropdownTimeout.current);
                setIsNotificationDropdownOpen(true);
              }}
              onMouseLeave={() => {
                notificationDropdownTimeout.current = setTimeout(() => setIsNotificationDropdownOpen(false), 200);
              }}
            >
              <div style={{ 
                position: "relative", 
                cursor: "pointer",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                transition: "all 0.2s ease",
                ':hover': {
                  backgroundColor: "#f1f5f9"
                }
              }}>
                <i className="fas fa-bell" style={{ color: "#1e293b", fontSize: "20px" }}></i>
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                      minWidth: "18px",
                      textAlign: "center",
                      fontWeight: "600"
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
              {isNotificationDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: "-16px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    borderRadius: "12px",
                    width: "360px",
                    maxHeight: "480px",
                    overflowY: "auto"
                  }}
                  onMouseEnter={() => {
                    clearTimeout(notificationDropdownTimeout.current);
                    setIsNotificationDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    notificationDropdownTimeout.current = setTimeout(() => setIsNotificationDropdownOpen(false), 200);
                  }}
                >
                  <div style={{ 
                    padding: "16px 20px",
                    borderBottom: "1px solid #e2e8f0",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#ffffff",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px"
                  }}>
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#1e293b"
                    }}>
                      Notifications
                    </h3>
                  </div>
                  <div style={{ padding: "8px" }}>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          style={{
                            padding: "12px 16px",
                            margin: "4px",
                            borderRadius: "8px",
                            backgroundColor: notification.read ? "transparent" : "#f8fafc",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            ':hover': {
                              backgroundColor: "#f1f5f9"
                            }
                          }}
                          onClick={() => markAsRead(notification._id)}
                        >
                          <p style={{ 
                            margin: "0 0 4px 0", 
                            color: "#1e293b",
                            fontSize: "14px",
                            lineHeight: "1.5"
                          }}>
                            {notification.message}
                          </p>
                          <small style={{ 
                            color: "#64748b",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}>
                            <i className="far fa-clock"></i>
                            {new Date(notification.createdAt).toLocaleString()}
                          </small>
                        </div>
                      ))
                    ) : (
                      <div style={{ 
                        padding: "32px 16px",
                        textAlign: "center",
                        color: "#64748b"
                      }}>
                        <i className="far fa-bell-slash" style={{ 
                          fontSize: "24px",
                          marginBottom: "8px",
                          display: "block"
                        }}></i>
                        <p style={{ margin: 0 }}>No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Section */}
          {user ? (
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => {
                clearTimeout(userDropdownTimeout.current);
                setIsUserDropdownOpen(true);
              }}
              onMouseLeave={() => {
                userDropdownTimeout.current = setTimeout(() => setIsUserDropdownOpen(false), 200);
              }}
            >
              <div style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 8px",
                borderRadius: "8px",
                transition: "all 0.2s ease",
                ':hover': {
                  backgroundColor: "#f1f5f9"
                }
              }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                  fontSize: "16px",
                  fontWeight: "600"
                }}>
                  {getDisplayName().charAt(0).toUpperCase()}
                </div>
                <span style={{ 
                  color: "#1e293b",
                  fontWeight: "500"
                }}>
                  {getDisplayName()}
                </span>
                <i className="fas fa-chevron-down" style={{ 
                  fontSize: "12px",
                  color: "#64748b"
                }}></i>
              </div>
              {isUserDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: "0",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    borderRadius: "12px",
                    minWidth: "220px",
                    padding: "8px"
                  }}
                  onMouseEnter={() => {
                    clearTimeout(userDropdownTimeout.current);
                    setIsUserDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    userDropdownTimeout.current = setTimeout(() => setIsUserDropdownOpen(false), 200);
                  }}
                >
                  {/* Profile & Dashboard Links */}
                  {user?.role === "student" ? (
                    <>
                      <Link
                        to="/studentprofile"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          textDecoration: "none",
                          color: "#1e293b",
                          padding: "10px 16px",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                          ':hover': {
                            backgroundColor: "#f1f5f9"
                          }
                        }}
                      >
                        <i className="fas fa-user"></i>
                        My Profile
                      </Link>
                      <Link
                        to="/studentdashboard"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          textDecoration: "none",
                          color: "#2563eb",
                          padding: "10px 16px",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                          marginBottom: "8px",
                          ':hover': {
                            backgroundColor: "#f1f5f9"
                          }
                        }}
                      >
                        <i className="fas fa-tachometer-alt"></i>
                        My Dashboard
                      </Link>
                    </>
                  ) : user?.role === "developer" ? (
                    <>
                      <Link
                        to={`/profile/${user._id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          textDecoration: "none",
                          color: "#1e293b",
                          padding: "10px 16px",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                          ':hover': {
                            backgroundColor: "#f1f5f9"
                          }
                        }}
                      >
                        <i className="fas fa-user"></i>
                        My Profile
                      </Link>
                      <Link
                        to="/developerdashboard"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          textDecoration: "none",
                          color: "#2563eb",
                          padding: "10px 16px",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                          marginBottom: "8px",
                          ':hover': {
                            backgroundColor: "#f1f5f9"
                          }
                        }}
                      >
                        <i className="fas fa-tachometer-alt"></i>
                        My Dashboard
                      </Link>
                    </>
                  ) : user?.role === "organization" ? (
                    <>
                      <Link
                        to={`/companiesprofile/${user._id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          textDecoration: "none",
                          color: "#1e293b",
                          padding: "10px 16px",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                          ':hover': {
                            backgroundColor: "#f1f5f9"
                          }
                        }}
                      >
                        <i className="fas fa-user"></i>
                        My Profile
                      </Link>
                      <Link
                        to="/companydashboard"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          textDecoration: "none",
                          color: "#2563eb",
                          padding: "10px 16px",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                          marginBottom: "8px",
                          ':hover': {
                            backgroundColor: "#f1f5f9"
                          }
                        }}
                      >
                        <i className="fas fa-tachometer-alt"></i>
                        My Dashboard
                      </Link>
                    </>
                  ) : null}

                  <div style={{ 
                    margin: "4px 8px",
                    height: "1px",
                    backgroundColor: "#e2e8f0"
                  }}></div>

                  {/* Logout Button */}
                  <button 
                    onClick={handleLogout} 
                    style={{ 
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                      ':hover': {
                        backgroundColor: "#fef2f2"
                      }
                    }}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={handleHeaderLogin}
              style={{ 
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "#ffffff",
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "500",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(37, 99, 235, 0.1)",
                ':hover': {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 6px rgba(37, 99, 235, 0.2)"
                }
              }}
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
