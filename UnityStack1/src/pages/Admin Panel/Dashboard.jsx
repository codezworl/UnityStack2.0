import React, { useState, useEffect, useRef } from "react";
import DashboardHome from "./DashboardHome";
import UsersPage from "/Final Year Project/UnityStack2.0/UnityStack1/src/pages/UsersPage";
import TransactionsPage from "./ShowTranssactions";
import SettingsPage from "./Adminsettings";
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [activePage, setActivePage] = useState("Home"); // State to track active page

  const profileDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);

  const navigate = useNavigate();

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

  const notifications = [
    {
      type: "new",
      name: "John Doe",
      message: "New ticket Added",
      time: "30 min",
      avatar: "https://via.placeholder.com/40",
    },
    {
      type: "earlier",
      name: "Joseph William",
      message: "arrange session and make payment",
      time: "30 min",
      avatar: "https://via.placeholder.com/40",
    },
    {
      type: "earlier",
      name: "Sara Soudein",
      message: "Currently login",
      time: "30 min",
      avatar: "https://via.placeholder.com/40",
    },
    {
      type: "earlier",
      name: "Suzen",
      message: "Session Arranged",
      time: "yesterday",
      avatar: "https://via.placeholder.com/40",
    },
  ];

  // Render the active page based on state
  const renderActivePage = () => {
    switch (activePage) {
      case "Home":
        return <DashboardHome />;
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
    switch(action) {
      case 'My Profile':
        navigate('/profile');
        break;
      case 'Transactions':
        navigate('/transactions');
        break;
      case 'Settings':
        navigate('/Settings');
        break;
      case 'Logout':
       
        navigate('/login');
        break;
      default:
        break;
    }
    setShowProfileDropdown(false); // Close dropdown after action
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
          Admin Panel
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
                }}
                onClick={() =>
                  setShowNotificationsDropdown(!showNotificationsDropdown)
                }
                onMouseOver={(e) => (e.target.style.transform = "scale(1.2)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                🔔
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
                        style={{ textDecoration: "none", color: "#0074D9" }}
                      >
                        mark as read
                      </a>
                      <a
                        href="#"
                        style={{ textDecoration: "none", color: "#0074D9" }}
                      >
                        clear all
                      </a>
                    </span>
                  </div>

                  {/* New Notifications Section */}
                  <div style={{ padding: "10px" }}>
                    <p style={{ fontSize: "12px", color: "#555", fontWeight: "500" }}>NEW</p>
                    {notifications
                      .filter((n) => n.type === "new")
                      .map((n, index) => (
                        <NotificationItem key={`new-${index}`} notification={n} />
                      ))}
                  </div>

                  {/* Earlier Notifications Section */}
                  <div style={{ padding: "10px" }}>
                    <p style={{ fontSize: "12px", color: "#555", fontWeight: "500" }}>EARLIER</p>
                    {notifications
                      .filter((n) => n.type === "earlier")
                      .map((n, index) => (
                        <NotificationItem key={`earlier-${index}`} notification={n} />
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div style={{ position: "relative" }} ref={profileDropdownRef}>
              <img
                src={`https://ui-avatars.com/api/?name=Waqas+Zafar&background=random&rounded=true&size=40`}
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  transition: "transform 0.3s",
                }}
                onClick={() => setShowProfileDropdown((prev) => !prev)}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              />
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
                    <img
                      src={`https://ui-avatars.com/api/?name=Waqas+Zafar&background=random&rounded=true&size=50`}
                      alt="Profile"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "bold",
                          color: "black",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        Waqas Zafar
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          color: "#555",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        waqaszafar771@gmail.com
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
                    {["My Profile", "Transactions", "Settings", "Logout"].map((item, index) => (
                      <li
                        key={index}
                        onClick={() => handleProfileAction(item)}
                        style={{
                          padding: "10px 0",
                          cursor: "pointer",
                          color: item === "Logout" ? "#FF0000" : "black",
                          fontWeight: item === "Logout" ? "bold" : "normal",
                          transition: "background-color 0.3s",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#f5f5f5")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "transparent")
                        }
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ padding: "20px" }}>{renderActivePage()}</main>
      </div>
    </div>
  );
};

// Add this component for consistent notification styling
const NotificationItem = ({ notification }) => (
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

export default DashboardLayout;