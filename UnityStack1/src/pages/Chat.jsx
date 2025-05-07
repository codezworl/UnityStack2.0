import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/header';

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const messagesEndRef = useRef(null);

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
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Fetch logged-in user and all users
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true,
        });
        setCurrentUser(res.data);
        
        // Join room based on user role
        if (socket && res.data) {
          const displayName = res.data.role === 'organization' 
            ? res.data.companyName 
            : res.data.firstName || res.data.name;
            
          socket.emit('joinRoom', res.data._id, res.data.role, displayName);
          // Fetch users after we have the current user
          fetchAllUsers(res.data._id);
        }
      } catch (err) {
        console.warn("❌ User not logged in:", err.message);
      }
    };

    const fetchAllUsers = async (currentUserId) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users?currentUserId=${currentUserId}`, {
          withCredentials: true
        });
        
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Expected array of users but got:", response.data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchUser();
  }, [socket]);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    // Handle incoming messages
    socket.on('receiveMessage', (messageData) => {
      console.log('Received message:', messageData);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: messageData.fromUserId === currentUser?._id ? 'Me' : messageData.fromUserName,
        text: messageData.message,
        time: messageData.timestamp
      }]);
    });

    // Handle chat history
    socket.on('chatHistory', (messages) => {
      console.log('Received chat history:', messages);
      setMessages(messages.map(msg => ({
        id: msg._id,
        sender: msg.fromUserId === currentUser?._id ? 'Me' : msg.fromUserName,
        text: msg.message,
        time: msg.timestamp
      })));
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Handle user joined
    socket.on('userJoined', ({ userId, role, userName }) => {
      console.log('User joined:', { userId, role, userName });
      setUsers(prev => {
        const updatedUsers = prev.map(user => 
          user._id === userId 
            ? { ...user, isOnline: true }
            : user
        );
        return updatedUsers;
      });
    });

    // Handle user left
    socket.on('userLeft', ({ userId }) => {
      console.log('User left:', userId);
      setUsers(prev => {
        const updatedUsers = prev.map(user => 
          user._id === userId 
            ? { ...user, isOnline: false }
            : user
        );
        return updatedUsers;
      });
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('chatHistory');
      socket.off('error');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [socket, currentUser]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    // Clear messages when switching users
    setMessages([]);
    
    // Join private chat room
    if (socket && currentUser) {
      console.log('Joining private chat with:', user._id);
      socket.emit('joinPrivateChat', user._id);
      setCurrentRoom([currentUser._id, user._id].sort().join('_'));
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUser || !socket || !currentUser) return;

    const displayName = currentUser.role === 'organization' 
      ? currentUser.companyName 
      : currentUser.firstName || currentUser.name;

    console.log('Sending message:', {
      message: messageInput,
      toUserId: selectedUser._id,
      fromUserId: currentUser._id,
      fromUserName: displayName
    });

    // Emit message to server
    socket.emit('sendMessage', 
      messageInput, 
      selectedUser._id, 
      currentUser._id,
      displayName
    );
    
    setMessageInput('');
  };

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <Header />

      <div className="d-flex flex-grow-1">
        <div className="col-3 border-end bg-light">
          <div className="p-3">
            <h5>Users</h5>
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
                    <div>
                      <div>{user.displayName}</div>
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

              <div className="flex-grow-1 p-3" style={{ overflowY: 'auto' }}>
                {messages.map(message => (
                  <div key={message.id} className={`d-flex ${message.sender === 'Me' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className={`p-2 rounded-3 ${message.sender === 'Me' ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '70%' }}>
                      {message.text}
                    </div>
                    <small className={`${message.sender === 'Me' ? 'text-end' : 'text-start'} text-muted ms-2`}>{message.time}</small>
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
    </div>
  );
}

export default Chat;
