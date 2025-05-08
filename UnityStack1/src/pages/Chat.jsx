import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/header';
import { format } from 'date-fns';

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

    return () => {
      newSocket.close();
    };
  }, []); // Remove socket dependency

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
      fetchAllUsers(res.data._id);
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

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <Header />

      <div className="d-flex flex-grow-1">
      {/* Users List */}
      <div className="col-3 border-end bg-light">
        <div className="p-3">
          <h5>Chats</h5>
          <div className="list-group" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {Array.isArray(users) && users.length > 0 ? (
              users.map(user => (
                <button
                  key={user._id}
                  onClick={() => handleUserClick(user)}
                  className={`list-group-item list-group-item-action d-flex align-items-center ${selectedUser?._id === user._id ? 'active' : ''}`}
                >
                  <div className="position-relative">
                    <img 
                      src={user.profileImage || 'https://via.placeholder.com/40'} 
                      alt={user.displayName} 
                      style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} 
                    />
                    {user.isOnline && (
                      <span 
                        className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                        style={{ width: '10px', height: '10px', border: '2px solid white' }}
                      />
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>{user.displayName}</div>
                      {unreadCounts[user._id] > 0 && (
                        <span className="badge bg-primary rounded-pill">
                          {unreadCounts[user._id]}
                        </span>
                      )}
                    </div>
                    <small className="text-muted">{user.role}</small>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center p-3 text-muted">
                No users available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="col-9 d-flex flex-column">
        {selectedUser ? (
          <>
            <div className="p-3 border-bottom bg-white d-flex align-items-center">
              <div className="position-relative">
                <img 
                  src={selectedUser.profileImage || 'https://via.placeholder.com/40'} 
                  alt={selectedUser.displayName}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                />
                {selectedUser.isOnline && (
                  <span 
                    className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                    style={{ width: '10px', height: '10px', border: '2px solid white' }}
                  />
                )}
              </div>
              <div>
                <div>{selectedUser.displayName}</div>
                <small className="text-muted">{selectedUser.role}</small>
              </div>
            </div>

            <div className="flex-grow-1 p-3" style={{ overflowY: 'auto', backgroundColor: '#e5ddd5' }}>
              {messages.map(message => (
                <div key={message.id} className={`d-flex ${message.sender === 'Me' ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
                  <div 
                    className={`p-2 rounded-3 ${message.sender === 'Me' ? 'bg-primary text-white' : 'bg-white text-dark'}`} 
                    style={{ 
                      maxWidth: '70%',
                      position: 'relative',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div>{message.text}</div>
                    <div className="d-flex justify-content-end align-items-center" style={{ fontSize: '0.7rem' }}>
                      <span className="text-muted me-1">
                        {formatMessageTime(message.time)}
                      </span>
                      {message.sender === 'Me' && (
                        <span className="text-muted">
                          {getMessageStatusIcon(message.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-top bg-white d-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="btn btn-primary ms-2" onClick={handleSendMessage}>
                Send
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
      `}</style>
    </div>
  );
}

export default Chat;
