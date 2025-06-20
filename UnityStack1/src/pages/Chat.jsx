import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/header';
import { format } from 'date-fns';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      // Only fetch user data after socket is connected
      fetchUser(newSocket);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    // Check for selected developer ID on component mount
    const storedDeveloperId = localStorage.getItem('selectedChatDeveloper');
    if (storedDeveloperId) {
      setSelectedDeveloperId(storedDeveloperId);
      localStorage.removeItem('selectedChatDeveloper');
    }

    return () => {
      newSocket.close();
    };
  }, []); // Remove socket dependency

  // Add new useEffect to handle automatic chat opening
  useEffect(() => {
    if (selectedDeveloperId && users.length > 0) {
      const developer = users.find(user => user._id === selectedDeveloperId);
      if (developer) {
        console.log("Opening chat with developer:", developer);
        handleUserClick(developer);
        setSelectedDeveloperId(null); // Clear the ID after opening chat
      }
    }
  }, [selectedDeveloperId, users]);

  // Fetch logged-in user and all users
  const fetchUser = async (socketInstance) => {
    try {
      // Fetch the logged-in user
      const res = await axios.get("http://localhost:5000/api/user", {
        withCredentials: true,
      });

      console.log("Fetched current user:", res.data);

      if (!res.data || !res.data._id) {
        console.warn("Invalid user data received:", res.data);
        setCurrentUser(null);
        setUsers([]);
        return;
      }

      // Set the current user data
      setCurrentUser(res.data);

      // Now that the user data is available, emit join room and fetch users
      const displayName = res.data.displayName || (res.data.role === 'organization' 
        ? res.data.companyName 
        : `${res.data.firstName} ${res.data.lastName || ''}`.trim());

      console.log("Joining room with:", {
        userId: res.data._id,
        role: res.data.role,
        displayName
      });

      // Use the passed socket instance
      socketInstance.emit('joinRoom', res.data._id, res.data.role, displayName);

      // Fetch users excluding the current logged-in user
      await fetchAllUsers(res.data._id);
    } catch (err) {
      console.error("Error fetching user:", err);
      setCurrentUser(null);
      setUsers([]);
    }
  };

  const fetchAllUsers = async (currentUserId) => {
    if (!currentUserId) {
      console.warn("No currentUserId provided");
      setUsers([]);
      return;
    }

    try {
      console.log("Fetching users with currentUserId:", currentUserId);
      const response = await axios.get(
        `http://localhost:5000/api/users?currentUserId=${currentUserId}`,
        { withCredentials: true }
      );

      if (Array.isArray(response.data)) {
        console.log("Fetched users:", response.data);
        // Map the users to ensure consistent role names and handle missing data
        const mappedUsers = response.data.map(user => ({
          ...user,
          role: user.role === 'develpor' ? 'developer' : user.role,
          displayName: user.displayName || (user.role === 'organization' 
            ? user.companyName 
            : `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'),
          profileImage: user.profileImage || 'https://via.placeholder.com/40'
        }));
        setUsers(mappedUsers);
      } else {
        console.error("Expected array of users but got:", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  // Log users state to ensure data is being set
  useEffect(() => {
    console.log("Users state:", users);
  }, [users]);
  
  

  const formatMessageTime = (timestamp) => {
    try {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      return format(date, 'HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Handle socket events
  useEffect(() => {
    if (!socket) return;
  
    socket.on('receiveMessage', (messageData) => {
      if (messageData.fromUserId === selectedUser?._id || messageData.fromUserId === currentUser?._id) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: messageData.fromUserId === currentUser?._id ? 'Me' : messageData.fromUserName,
          text: messageData.message,
          time: messageData.timestamp || new Date().toISOString(),
          status: messageData.fromUserId === currentUser?._id ? 'sent' : 'received'
        }]);

        if (messageData.fromUserId !== currentUser?._id) {
          socket.emit('messageReceived', messageData.id, currentUser?._id);
        }
      } else {
        setUnreadCounts(prev => ({
          ...prev,
          [messageData.fromUserId]: (prev[messageData.fromUserId] || 0) + 1
        }));
      }
    });
  
    socket.on('chatHistory', (messages) => {
      setMessages(messages.map(msg => ({
        id: msg._id,
        sender: msg.fromUserId === currentUser?._id ? 'Me' : msg.fromUserName,
        text: msg.message,
        time: msg.timestamp || new Date().toISOString(),
        status: msg.status || (msg.fromUserId === currentUser?._id ? 'sent' : 'received')
      })));
    });

    socket.on('messageStatus', (messageId, status) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ));
    });

    socket.on('userTyping', (userId, roomId) => {
      if (roomId === currentRoom) {
        setTypingUsers(prev => ({ ...prev, [userId]: true }));
        setTimeout(() => {
          setTypingUsers(prev => ({ ...prev, [userId]: false }));
        }, 3000);
      }
    });

    socket.on('userOnline', (userId) => {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, isOnline: true } : user
        )
      );
    });

    socket.on('userOffline', (userId) => {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, isOnline: false } : user
        )
      );
    });
  
    return () => {
      socket.off('receiveMessage');
      socket.off('chatHistory');
      socket.off('messageStatus');
      socket.off('userTyping');
      socket.off('userOnline');
      socket.off('userOffline');
    };
  }, [socket, currentUser, selectedUser, currentRoom]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setMessages([]); // Clear previous messages when switching chats
  
    // Join private chat room
    if (socket && currentUser) {
      const roomId = [currentUser._id, user._id].sort().join('_');
      socket.emit('joinPrivateChat', roomId);
      setCurrentRoom(roomId);
  
      // Mark messages as seen
      socket.emit('markMessagesAsSeen', { roomId, userId: currentUser._id });
  
      // Immediately fetch updated unread counts so the badge disappears
      fetchUnreadCounts(currentUser._id);
    }
  };
  

  const handleTyping = () => {
    if (socket && currentRoom) {
      socket.emit('typing', currentUser._id, currentRoom);
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUser || !socket || !currentUser) return;
  
    const displayName = currentUser.role === 'organization' 
      ? currentUser.companyName 
      : currentUser.firstName || currentUser.name;
  
    const roomId = [currentUser._id, selectedUser._id].sort().join('_');
    const messageId = Date.now();
  
    socket.emit('sendMessage', messageInput, selectedUser._id, currentUser._id, displayName, roomId, messageId);
    setMessageInput('');
  };
  

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  // Fetch per-user unread counts from backend
  const fetchUnreadCounts = async (userId) => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/unread-counts/${userId}`);
      setUnreadCounts(res.data);
    } catch (error) {
      console.error("Failed to fetch per-user unread counts", error);
    }
  };

  // Fetch unread counts after users are loaded
  useEffect(() => {
    if (currentUser && users.length > 0) {
      fetchUnreadCounts(currentUser._id);
    }
  }, [currentUser, users]);

  // Update unread counts when a new message is received
  useEffect(() => {
    if (!socket || !currentUser) return;
    const handleReceiveMessage = (messageData) => {
      fetchUnreadCounts(currentUser._id);
    };
    socket.on('receiveMessage', handleReceiveMessage);

    // Listen for real-time updateUnreadCounts event
    const handleUpdateUnreadCounts = () => {
      fetchUnreadCounts(currentUser._id);
    };
    socket.on('updateUnreadCounts', handleUpdateUnreadCounts);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('updateUnreadCounts', handleUpdateUnreadCounts);
    };
  }, [socket, currentUser]);

  // Helper to get last message for a user
  const getLastMessageForUser = (userId) => {
    // Find the last message exchanged with this user
    const relevantMessages = messages.filter(
      msg => (selectedUser && (msg.sender === 'Me' || msg.sender === selectedUser.displayName))
    );
    if (relevantMessages.length === 0) return '';
    return relevantMessages[relevantMessages.length - 1].text;
  };

  // Helper to get last message time for a user
  const getLastMessageTimeForUser = (userId) => {
    // Find the last message exchanged with this user
    const relevantMessages = messages.filter(
      msg => (selectedUser && (msg.sender === 'Me' || msg.sender === selectedUser.displayName))
    );
    if (relevantMessages.length === 0) return '';
    return formatMessageTime(relevantMessages[relevantMessages.length - 1].time);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const nameMatch = user.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    // Optionally, you could also search last message
    // const lastMsg = getLastMessageForUser(user._id).toLowerCase();
    // return nameMatch || lastMsg.includes(searchQuery.toLowerCase());
    return nameMatch;
  });

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <Header />

      <div className="d-flex flex-grow-1">
      {/* Users List */}
      <div className="col-3 border-end sidebar-glass" style={{padding: 0, minHeight: '100vh', position: 'relative', zIndex: 2}}>
        <div className="p-3" style={{paddingBottom: 0}}>
          {/* Search Bar */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0" style={{borderRadius: '20px 0 0 20px'}}>
                <i className="bi bi-search" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{borderRadius: '0 20px 20px 0'}}
              />
            </div>
          </div>
          <div className="list-group" style={{ maxHeight: '80vh', overflowY: 'auto', border: 'none' }}>
            {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => {
                // Avatar fallback
                const showAvatar = !user.profileImage || user.profileImage === 'https://via.placeholder.com/40';
                const avatarColor = `hsl(${(user.displayName.charCodeAt(0) * 39) % 360}, 70%, 60%)`;
                return (
                  <React.Fragment key={user._id}>
                    <button
                      onClick={() => handleUserClick(user)}
                      className={`list-group-item list-group-item-action d-flex align-items-center border-0 chat-list-fade ${selectedUser?._id === user._id ? 'active' : ''}`}
                      style={{ background: 'transparent', borderRadius: 0, padding: '12px 0', animationDelay: `${idx * 60}ms` }}
                    >
                      {showAvatar ? (
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: avatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, marginRight: 16, userSelect: 'none' }}>
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <img
                          src={user.profileImage}
                          alt={user.displayName}
                          style={{ width: '48px', height: '48px', borderRadius: '50%', marginRight: '16px', objectFit: 'cover' }}
                        />
                      )}
                      <div className="flex-grow-1 text-start">
                        <div className="d-flex justify-content-between align-items-center">
                          <span style={{ fontWeight: 600 }}>{user.displayName}</span>
                          <span style={{ fontSize: '0.85rem', color: '#888' }}>{getLastMessageTimeForUser(user._id) || 'May 10, 25'}</span>
                        </div>
                        <div style={{ fontSize: '0.95rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                          {getLastMessageForUser(user._id) || '...'}
                        </div>
                      </div>
                      {/* Unread badge for this user */}
                      {unreadCounts[user._id] > 0 && selectedUser?._id !== user._id && (
                        <span className="badge rounded-pill bg-danger ms-2" style={{ fontSize: '0.85rem', minWidth: '28px', textAlign: 'center' }}>
                          {unreadCounts[user._id]}
                        </span>
                      )}
                    </button>
                    <hr style={{ margin: 0, borderColor: '#eee' }} />
                  </React.Fragment>
                );
              })
            ) : (
              <div className="text-center p-3 text-muted">
                No users available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="col-9 d-flex flex-column p-0" style={{background: '#eaf4fb'}}>
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-3 border-bottom bg-white d-flex align-items-center" style={{minHeight: '72px'}}>
              <img 
                src={selectedUser.profileImage || 'https://via.placeholder.com/40'} 
                alt={selectedUser.displayName}
                style={{ width: '48px', height: '48px', borderRadius: '50%', marginRight: '16px', objectFit: 'cover' }}
              />
              <div>
                <div style={{fontWeight: 600, fontSize: '1.1rem'}}>{selectedUser.displayName}</div>
                <div style={{fontSize: '0.95rem', color: selectedUser.isOnline ? '#28a745' : '#888'}}>
                  <span style={{display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: selectedUser.isOnline ? '#28a745' : '#ccc', marginRight: 6, verticalAlign: 'middle'}}></span>
                  {selectedUser.isOnline ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow-1 p-4" style={{ height: '65vh', overflowY: 'auto', background: '#eaf4fb', position: 'relative' }}>
              {/* Date Separator (show only if valid date) */}
              {messages.length > 0 && (() => {
                const firstDate = messages[0].time && !isNaN(new Date(messages[0].time).getTime())
                  ? new Date(messages[0].time)
                  : null;
                return firstDate ? (
                  <div className="d-flex justify-content-center mb-4">
                    <span style={{background: '#d3d3d3', color: '#555', borderRadius: 16, padding: '4px 18px', fontSize: '0.95rem'}}>
                      {firstDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                ) : null;
              })()}
              {messages.map((message, idx) => {
                const isMe = message.sender === 'Me';
                const showProfile = !isMe && (idx === 0 || messages[idx-1].sender === 'Me');
                // Linkify URLs
                const textWithLinks = message.text.replace(/(https?:\/\/[^\s]+)/g, url => `<a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color:#2196f3;text-decoration:underline;\">${url}</a>`);
                return (
                  <div key={message.id} className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'} chat-msg-fade`}> 
                    {!isMe && showProfile && (
                      selectedUser.profileImage && selectedUser.profileImage !== 'https://via.placeholder.com/40' ? (
                        <img
                          src={selectedUser.profileImage}
                          alt={selectedUser.displayName}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', marginRight: 10, alignSelf: 'flex-end' }}
                        />
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: avatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, marginRight: 10, alignSelf: 'flex-end', userSelect: 'none' }}>
                          {selectedUser.displayName.charAt(0).toUpperCase()}
                        </div>
                      )
                    )}
                    <div style={{ maxWidth: '65%' }}>
                      <div 
                        className={isMe ? 'bg-primary text-white' : 'bg-white text-dark'}
                        style={{
                          borderRadius: '18px',
                          padding: '10px 18px',
                          marginLeft: isMe ? 0 : (showProfile ? 0 : 46),
                          marginRight: isMe ? 0 : 0,
                          fontSize: '1rem',
                          wordBreak: 'break-word',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.07)'
                        }}
                        dangerouslySetInnerHTML={{__html: textWithLinks}}
                      />
                      <div className="text-muted mt-1" style={{fontSize: '0.85rem', textAlign: isMe ? 'right' : 'left'}}>
                        {message.time && !isNaN(new Date(message.time).getTime()) ? new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-top bg-white d-flex align-items-center" style={{minHeight: '70px'}}>
              <input
                type="text"
                className="form-control rounded-pill px-4"
                placeholder="Type Something..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                style={{background: '#f5f5f5', border: 'none', fontSize: '1.05rem'}}
              />
              <button className="btn btn-primary ms-2 rounded-circle d-flex align-items-center justify-content-center" style={{width: 44, height: 44}} onClick={handleSendMessage}>
                <i className="bi bi-send" style={{fontSize: '1.3rem'}} />
              </button>
            </div>
          </>
        ) : (
          <div className="d-flex justify-content-center align-items-center flex-grow-1 text-muted">
            Select a user to start chatting
          </div>
        )}
        </div>
      </div>

      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
          padding: 5px 10px;
        }
        .typing-indicator span {
          height: 8px;
          width: 8px;
          background: #90949c;
          border-radius: 50%;
          display: inline-block;
          margin: 0 1px;
          animation: bounce 1.3s linear infinite;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.15s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }
        .sidebar-glass {
          background: rgba(255, 255, 255, 0.25) !important;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-right: 1.5px solid rgba(255,255,255,0.18);
          transition: box-shadow 0.4s cubic-bezier(.4,2,.6,1), background 0.4s;
        }
        .chat-list-fade {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.5s forwards;
        }
        .chat-msg-fade {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.5s forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

export default Chat;
