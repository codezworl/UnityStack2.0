import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaUser, FaBuilding, FaCode, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === filter));
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = users.filter(user => {
      const searchStr = query.toLowerCase();
      if (user.role === 'organization') {
        return user.companyName.toLowerCase().includes(searchStr) ||
               user.companyEmail.toLowerCase().includes(searchStr);
      }
      return `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchStr) ||
             user.email.toLowerCase().includes(searchStr);
    });
    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm(user);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${editForm.role}/${editForm._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        toast.success('User updated successfully');
        setIsEditing(false);
        fetchUsers();
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async (userId, role) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/admin/users/${role}/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          toast.success('User deleted successfully');
          fetchUsers();
        } else {
          throw new Error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
  };

  const renderUserDetails = () => {
    if (!selectedUser) return null;

    return (
      <div style={userDetailsStyle}>
        <h3 style={detailsTitleStyle}>User Details</h3>
        <div style={detailsContentStyle}>
          {selectedUser.role === 'student' && (
            <>
              <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>University:</strong> {selectedUser.university}</p>
              <p><strong>Semester:</strong> {selectedUser.semester}</p>
            </>
          )}
          {selectedUser.role === 'developer' && (
            <>
              <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Expertise:</strong> {selectedUser.domainTags?.join(', ')}</p>
              <p><strong>Experience:</strong> {selectedUser.experience}</p>
            </>
          )}
          {selectedUser.role === 'organization' && (
            <>
              <p><strong>Company Name:</strong> {selectedUser.companyName}</p>
              <p><strong>Email:</strong> {selectedUser.companyEmail}</p>
              <p><strong>Website:</strong> {selectedUser.website}</p>
              <p><strong>Services:</strong> {selectedUser.selectedServices?.join(', ')}</p>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderEditForm = () => {
    if (!editForm) return null;

    return (
      <div style={editFormStyle}>
        <h3>Edit User</h3>
        {editForm.role === 'student' && (
          <>
            <input
              type="text"
              value={editForm.firstName}
              onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
              placeholder="First Name"
              style={inputStyle}
            />
            <input
              type="text"
              value={editForm.lastName}
              onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
              placeholder="Last Name"
              style={inputStyle}
            />
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              placeholder="Email"
              style={inputStyle}
            />
            <input
              type="text"
              value={editForm.university}
              onChange={(e) => setEditForm({...editForm, university: e.target.value})}
              placeholder="University"
              style={inputStyle}
            />
          </>
        )}
        {editForm.role === 'developer' && (
          <>
            <input
              type="text"
              value={editForm.firstName}
              onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
              placeholder="First Name"
              style={inputStyle}
            />
            <input
              type="text"
              value={editForm.lastName}
              onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
              placeholder="Last Name"
              style={inputStyle}
            />
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              placeholder="Email"
              style={inputStyle}
            />
            <input
              type="text"
              value={editForm.experience}
              onChange={(e) => setEditForm({...editForm, experience: e.target.value})}
              placeholder="Experience"
              style={inputStyle}
            />
          </>
        )}
        {editForm.role === 'organization' && (
          <>
            <input
              type="text"
              value={editForm.companyName}
              onChange={(e) => setEditForm({...editForm, companyName: e.target.value})}
              placeholder="Company Name"
              style={inputStyle}
            />
            <input
              type="email"
              value={editForm.companyEmail}
              onChange={(e) => setEditForm({...editForm, companyEmail: e.target.value})}
              placeholder="Company Email"
              style={inputStyle}
            />
            <input
              type="text"
              value={editForm.website}
              onChange={(e) => setEditForm({...editForm, website: e.target.value})}
              placeholder="Website"
              style={inputStyle}
            />
          </>
        )}
        <div style={editButtonsStyle}>
          <button onClick={handleSaveEdit} style={saveButtonStyle}>Save</button>
          <button onClick={() => setIsEditing(false)} style={cancelButtonStyle}>Cancel</button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div style={loadingStyle}>Loading...</div>;
  }

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2 style={sidebarTitleStyle}>User Management</h2>
        <div style={searchContainerStyle}>
          <FaSearch style={searchIconStyle} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={searchInputStyle}
          />
        </div>
        <div style={filterButtonsStyle}>
          <button 
            style={{...filterButtonStyle, ...(activeFilter === 'all' && activeFilterStyle)}}
            onClick={() => handleFilter('all')}
          >
            <FaUser /> All Users
          </button>
          <button 
            style={{...filterButtonStyle, ...(activeFilter === 'student' && activeFilterStyle)}}
            onClick={() => handleFilter('student')}
          >
            <FaUser /> Students
          </button>
          <button 
            style={{...filterButtonStyle, ...(activeFilter === 'developer' && activeFilterStyle)}}
            onClick={() => handleFilter('developer')}
          >
            <FaCode /> Developers
          </button>
          <button 
            style={{...filterButtonStyle, ...(activeFilter === 'organization' && activeFilterStyle)}}
            onClick={() => handleFilter('organization')}
          >
            <FaBuilding /> Organizations
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        {isEditing ? (
          renderEditForm()
        ) : (
          <div style={contentGridStyle}>
            <div style={usersGridStyle}>
              {filteredUsers.map(user => (
                <div 
                  key={user._id} 
                  style={{
                    ...userCardStyle,
                    ...(selectedUser?._id === user._id && selectedUserCardStyle)
                  }}
                  onClick={() => handleUserClick(user)}
                >
                  <div style={userInfoStyle}>
                    <h3>{user.role === 'organization' ? user.companyName : `${user.firstName} ${user.lastName}`}</h3>
                    <p>{user.role === 'organization' ? user.companyEmail : user.email}</p>
                    <span style={roleBadgeStyle}>{user.role}</span>
                  </div>
                  <div style={actionButtonsStyle}>
                    <button 
                      style={editButtonStyle}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(user);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      style={deleteButtonStyle}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(user._id, user.role);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {renderUserDetails()}
          </div>
        )}
      </div>
    </div>
  );
};

// Updated Styles
const containerStyle = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa'
};

const sidebarStyle = {
  width: '250px',
  backgroundColor: '#fff',
  padding: '20px',
  boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const sidebarTitleStyle = {
  color: '#001f3f',
  marginBottom: '20px'
};

const searchContainerStyle = {
  position: 'relative',
  marginBottom: '20px'
};

const searchIconStyle = {
  position: 'absolute',
  left: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#666'
};

const searchInputStyle = {
  width: '100%',
  padding: '10px 10px 10px 35px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  fontSize: '14px'
};

const mainContentStyle = {
  flex: 1,
  padding: '20px',
  overflowY: 'auto'
};

const usersGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px'
};

const filterButtonsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const filterButtonStyle = {
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: '#f8f9fa',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  transition: 'all 0.3s ease'
};

const activeFilterStyle = {
  backgroundColor: '#0074D9',
  color: '#fff'
};

const userCardStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const userInfoStyle = {
  flex: 1
};

const roleBadgeStyle = {
  backgroundColor: '#e9ecef',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  textTransform: 'capitalize',
  display: 'inline-block',
  marginTop: '5px'
};

const actionButtonsStyle = {
  display: 'flex',
  gap: '10px'
};

const editButtonStyle = {
  backgroundColor: '#0074D9',
  color: '#fff',
  border: 'none',
  padding: '8px',
  borderRadius: '4px',
  cursor: 'pointer'
};

const deleteButtonStyle = {
  backgroundColor: '#FF4136',
  color: '#fff',
  border: 'none',
  padding: '8px',
  borderRadius: '4px',
  cursor: 'pointer'
};

const editFormStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  maxWidth: '500px',
  margin: '0 auto'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  fontSize: '14px'
};

const editButtonsStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '20px'
};

const saveButtonStyle = {
  backgroundColor: '#0074D9',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer'
};

const cancelButtonStyle = {
  backgroundColor: '#6c757d',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer'
};

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontSize: '18px'
};

const contentGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  height: '100%'
};

const selectedUserCardStyle = {
  border: '2px solid #0074D9',
  backgroundColor: '#f0f7ff'
};

const userDetailsStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  height: 'fit-content',
  position: 'sticky',
  top: '20px'
};

const detailsTitleStyle = {
  marginBottom: '15px',
  color: '#001f3f',
  borderBottom: '2px solid #0074D9',
  paddingBottom: '10px'
};

const detailsContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

export default UsersPage; 