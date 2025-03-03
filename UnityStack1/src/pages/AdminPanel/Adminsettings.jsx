import React, { useState } from "react";


const initialSettings = {
  general: {},
  notifications: {
    emailNotifications: true,
    newsAndUpdateSettings: ["Session Updates", "Issues", "User Complains"],
    moreActivity: true,
    activitySettings: [
      "All Reminders & Activity",
      "Notify me",
      "Important Reminder only",
    ],
  },
  userPermissions: {
    admins: [
      {
        id: 1,
        name: "Waqas",
        email: "waqas@gmail.com",
        role: "Super Admin",
      },
      {
        id: 2,
        name: "Alyan",
        email: "alyan@gmail.com",
        role: "Super Admin",
      },
    ],
  },
};

const SettingsPage = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "Admin",
  });

  // Toggle for notifications
  const handleNotificationToggle = (section, key) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      notifications: {
        ...prevSettings.notifications,
        [key]: !prevSettings.notifications[key],
      },
    }));
  };

  // Function to add a new admin
  const handleAddAdmin = () => {
    if (newAdmin.name && newAdmin.email) {
      const newAdminToAdd = {
        id: settings.userPermissions.admins.length + 1,
        ...newAdmin,
      };
      setSettings((prevSettings) => ({
        ...prevSettings,
        userPermissions: {
          ...prevSettings.userPermissions,
          admins: [...prevSettings.userPermissions.admins, newAdminToAdd],
        },
      }));
      setNewAdmin({ name: "", email: "", role: "Admin" }); // Reset form
    } else {
      alert("Please fill in all fields");
    }
  };

  // Function to handle input change for new admin form
  const handleNewAdminChange = (event) => {
    const { name, value } = event.target;
    setNewAdmin((prevAdmin) => ({
      ...prevAdmin,
      [name]: value,
    }));
  };

  // Function to remove an admin
  const handleRemoveAdmin = (id) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      userPermissions: {
        ...prevSettings.userPermissions,
        admins: prevSettings.userPermissions.admins.filter(
          (admin) => admin.id !== id
        ),
      },
    }));
  };
  // Function to edit an admin
  const handleEditAdmin = (id, field, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      userPermissions: {
        ...prevSettings.userPermissions,
        admins: prevSettings.userPermissions.admins.map((admin) =>
          admin.id === id ? { ...admin, [field]: value } : admin
        ),
      },
    }));
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#F8F9FA",
        minHeight: "100vh",
      }}
    >
      {/* General Section */}
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h1>General</h1>
          <div>
            <button
              style={{
                marginRight: "10px",
                padding: "10px 20px",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
        {/* General Content - Admin Management */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <h2>Admin Management</h2>
          <p>Manage the admins of your system</p>
          {/* Form to add new admin */}
          <div style={{ marginBottom: "20px" }}>
            <h3>Add New Admin</h3>
            <input
              type="text"
              name="name"
              value={newAdmin.name}
              onChange={handleNewAdminChange}
              placeholder="Name"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="email"
              name="email"
              value={newAdmin.email}
              onChange={handleNewAdminChange}
              placeholder="Email"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <select
              name="role"
              value={newAdmin.role}
              onChange={handleNewAdminChange}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
            <button
              onClick={handleAddAdmin}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add Admin
            </button>
          </div>
        </div>
      </div>
      {/* My Account */}
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h1>My Profile</h1>
          <div>
            <button
              style={{
                marginRight: "10px",
                padding: "10px 20px",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>My Profile</h2>
          <p>Manage your personal information here.</p>

          {/* Profile Picture */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <img
            //   src={img1}
              alt="Profile"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                marginRight: "20px",
              }}
            />
            <div>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Upload new
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>

          {/* Profile Information */}
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <label style={{ width: "100px", fontWeight: "bold" }}>
              First Name
            </label>
            <input
              type="text"
              value="Alexandro"
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <label style={{ width: "100px", fontWeight: "bold" }}>
              Last Name
            </label>
            <input
              type="text"
              value="Bernard"
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <label style={{ width: "100px", fontWeight: "bold" }}>
              Phone Number
            </label>
            <input
              type="text"
              value="+123 4523 1312"
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <label style={{ width: "100px", fontWeight: "bold" }}>
              Birth Date
            </label>
            <input
              type="date"
              value="2019-12-20"
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <label style={{ width: "100px", fontWeight: "bold" }}>
              Email Address
            </label>
            <input
              type="email"
              value="alexandrobern@gmail.com"
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <label style={{ width: "100px", fontWeight: "bold" }}>
              Password
            </label>
            <input
              type="password"
              value="********"
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <button
              style={{
                padding: "10px",
                backgroundColor: "white",
                border: "none",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              🔄
            </button>{" "}
            {/* Change Password Icon */}
          </div>

          {/* Delete Account */}
          <div style={{ marginTop: "20px" }}>
            <h3>Delete account</h3>
            <p>
              When you delete your account, you lose access to Front account
              services, and we permanently delete your personal data. You can
              cancel the deletion for 14 days.
            </p>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Delete Account
            </button>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h1>Notifications</h1>
          <div>
            <button
              style={{
                marginRight: "10px",
                padding: "10px 20px",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>Notifications</h2>
          <p>
            Get notified what's happening right now, you can turn off at any
            time
          </p>
          {/* Email Notifications Section */}
          <div style={{ marginBottom: "20px" }}>
            <h3>Email Notifications</h3>
            <p>
              Substance can send you email notifications for any new direct
              messages
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <label style={{ marginRight: "10px", fontWeight: "bold" }}>
                On
              </label>
              <label
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "60px",
                  height: "34px",
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={() =>
                    handleNotificationToggle(
                      "notifications",
                      "emailNotifications"
                    )
                  }
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: settings.notifications.emailNotifications
                      ? "#28a745"
                      : "#ccc",
                    transition: ".4s",
                    borderRadius: "34px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      content: '""',
                      height: "26px",
                      width: "26px",
                      left: settings.notifications.emailNotifications
                        ? "30px"
                        : "4px",
                      bottom: "4px",
                      backgroundColor: "white",
                      transition: ".4s",
                      borderRadius: "50%",
                    }}
                  ></span>
                </span>
              </label>
            </div>
            {settings.notifications.emailNotifications && (
              <div>
                {settings.notifications.newsAndUpdateSettings.map(
                  (setting, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <input type="checkbox" style={{ marginRight: "10px" }} />
                      <label>{setting}</label>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          {/* More Activity Section */}
          <div>
            <h3>More Activity</h3>
            <p>
              Substance can send you email notifications for any new direct
              messages
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <label style={{ marginRight: "10px", fontWeight: "bold" }}>
                On
              </label>
              <label
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "60px",
                  height: "34px",
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.notifications.moreActivity}
                  onChange={() =>
                    handleNotificationToggle("notifications", "moreActivity")
                  }
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: settings.notifications.moreActivity
                      ? "#28a745"
                      : "#ccc",
                    transition: ".4s",
                    borderRadius: "34px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      content: '""',
                      height: "26px",
                      width: "26px",
                      left: settings.notifications.moreActivity
                        ? "30px"
                        : "4px",
                      bottom: "4px",
                      backgroundColor: "white",
                      transition: ".4s",
                      borderRadius: "50%",
                    }}
                  ></span>
                </span>
              </label>
            </div>
            {settings.notifications.moreActivity && (
              <div>
                {settings.notifications.activitySettings.map(
                  (setting, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <input type="checkbox" style={{ marginRight: "10px" }} />
                      <label>{setting}</label>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Permissions Section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h1>User Permissions</h1>
          <div>
            <button
              style={{
                marginRight: "10px",
                padding: "10px 20px",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>User Permissions</h2>
          <p>Manage the permissions and admins of your system</p>

          {/* List of current admins */}
          <div>
            <h3>Current Admins</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Role
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {settings.userPermissions.admins.map((admin) => (
                  <tr key={admin.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px" }}>{admin.name}</td>
                    <td style={{ padding: "10px" }}>{admin.email}</td>
                    <td style={{ padding: "10px" }}>{admin.role}</td>
                    <td style={{ padding: "10px" }}>
                      <button
                        style={{
                          marginRight: "5px",
                          padding: "5px 10px",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveAdmin(admin.id)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
