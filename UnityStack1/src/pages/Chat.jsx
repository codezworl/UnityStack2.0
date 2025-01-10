import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import 'bootstrap/dist/css/bootstrap.min.css';

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Aiden Chavez', time: '10:10 AM', text: 'Hi Aiden, how are you? How is the project coming along?' },
    { id: 2, sender: 'Me', time: '10:12 AM', text: 'Are we meeting today?' },
    { id: 3, sender: 'Me', time: '10:15 AM', text: 'Project has been already finished and I have results to show you.' },
  ]);

  const users = [
    { id: 1, name: 'Vincent Porter', time: '38m', online: true, avatar: 'https://via.placeholder.com/40?text=VP' },
    { id: 2, name: 'Aiden Chavez', time: '45m', online: true, avatar: 'https://via.placeholder.com/40?text=AC' },
    { id: 3, name: 'Mike Thomas', time: '1h', online: false, avatar: 'https://via.placeholder.com/40?text=MT' },
    { id: 4, name: 'Christian Kelly', time: '2h', online: true, avatar: 'https://via.placeholder.com/40?text=CK' },
    { id: 5, name: 'Monica Ward', time: '2h', online: false, avatar: 'https://via.placeholder.com/40?text=MW' },
    { id: 6, name: 'Dean Henry', time: '3h', online: false, avatar: 'https://via.placeholder.com/40?text=DH' },
  ];

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: 'Me', time: 'Now', text: messageInput }]);
      setMessageInput('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Header />

      <div style={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Chat Content */}
        <div style={{ flex: 1, display: 'flex' }}>
          {/* Left Sidebar */}
          <div style={{ width: '300px', borderRight: '1px solid #e6e9f0', backgroundColor: '#fff' }}>
            {/* Search Bar */}
            <div style={{ padding: '20px' }}>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0 bg-light" 
                  placeholder="Search..." 
                  style={{ boxShadow: 'none' }}
                />
              </div>
            </div>

            {/* Users List */}
            <div style={{ overflowY: 'auto', height: 'calc(100vh - 80px)' }}>
              {users.map(user => (
                <div 
                  key={user.id} 
                  onClick={() => handleUserClick(user)}
                  style={{ 
                    padding: '15px 20px',
                    borderBottom: '1px solid #f0f2f7',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  className="hover-bg-light"
                >
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }} 
                    />
                    {user.online && (
                      <span style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#42b72a',
                        border: '2px solid #fff'
                      }}></span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#2b2b2b' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{user.time} ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div style={{ 
                  padding: '20px', 
                  borderBottom: '1px solid #e6e9f0',
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <img 
                    src={selectedUser.avatar} 
                    alt={selectedUser.name}
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                  <div>
                    <div style={{ fontWeight: '500' }}>{selectedUser.name}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>Last seen {selectedUser.time} ago</div>
                  </div>
                  <div className="ms-auto">
                    <button className="btn btn-light btn-sm me-2">
                      <i className="bi bi-telephone"></i>
                    </button>
                    <button className="btn btn-light btn-sm me-2">
                      <i className="bi bi-camera-video"></i>
                    </button>
                    <button className="btn btn-light btn-sm">
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div style={{ 
                  flex: 1, 
                  padding: '20px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  backgroundColor: '#ffffff'
                }}>
                  {messages.map(message => (
                    <div 
                      key={message.id}
                      style={{
                        alignSelf: message.sender === 'Me' ? 'flex-end' : 'flex-start',
                        maxWidth: '70%'
                      }}
                    >
                      <div style={{
                        backgroundColor: message.sender === 'Me' ? '#007bff' : '#e3f2fd',
                        color: message.sender === 'Me' ? '#fff' : '#000',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}>
                        {message.text}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#999',
                        marginTop: '5px',
                        textAlign: message.sender === 'Me' ? 'right' : 'left'
                      }}>
                        {message.time}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div style={{ 
                  padding: '20px',
                  backgroundColor: '#fff',
                  borderTop: '1px solid #e6e9f0'
                }}>
                  <div className="input-group">
                    <button className="btn btn-light">
                      <i className="bi bi-paperclip"></i>
                    </button>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Enter text here..."
                      style={{ boxShadow: 'none' }}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button 
                      className="btn"
                      style={{
                        border: '1px solid #007bff',
                        color: '#007bff',
                        backgroundColor: '#fff',
                      }}
                      onClick={handleSendMessage}
                      onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                      onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#999' 
              }}>
                Select a user to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
