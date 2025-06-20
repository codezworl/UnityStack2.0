import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DevSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }
        const userData = JSON.parse(atob(token.split('.')[1]));
        const developerId = userData.id || userData._id;
        const response = await axios.get(`http://localhost:5000/api/sessions/developer?developerId=${developerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSessions(response.data.sessions || []);
        setFilteredSessions(response.data.sessions || []);
      } catch (err) {
        setError('Failed to fetch sessions');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(sessions.filter(session => session.status.toLowerCase() === activeFilter));
    }
  }, [activeFilter, sessions]);

  // Calculate pagination values
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to top of sessions
    document.querySelector('.sessions-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Show max 5 page numbers
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of current group
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(start + 2, totalPages - 1);
      
      // Adjust start if we're near the end
      if (end === totalPages - 1) {
        start = Math.max(2, end - 2);
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const handleView = (sessionId) => {
    navigate(`/joinsession/${sessionId}`);
  };

  const handleWithdraw = (sessionId) => {
    navigate(`/withdrawsession/${sessionId}`);
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'confirmed':
        return '#2196F3';
      case 'cancelled':
        return '#f44336';
      case 'rescheduled':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  const filterButtons = [
    { label: 'All', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Rescheduled', value: 'rescheduled' }
  ];

  return (
    <div style={{
      padding: '30px',
      background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
      minHeight: '100vh',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '600',
          color: '#1a237e',
          marginBottom: '2rem',
          opacity: 0,
          animation: 'slideDown 0.5s ease forwards',
        }}>My Sessions</h2>

        {/* Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px',
          overflowX: 'auto',
          padding: '8px 4px',
          opacity: 0,
          animation: 'slideDown 0.5s ease forwards',
          animationDelay: '0.2s',
        }}>
          {filterButtons.map((filter, index) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: activeFilter === filter.value 
                  ? 'rgba(33, 150, 243, 0.1)'
                  : 'rgba(255, 255, 255, 0.7)',
                color: activeFilter === filter.value 
                  ? '#2196F3'
                  : '#666',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                fontWeight: activeFilter === filter.value ? '600' : '400',
                fontSize: '0.95rem',
                whiteSpace: 'nowrap',
                boxShadow: activeFilter === filter.value 
                  ? '0 4px 12px rgba(33, 150, 243, 0.2)'
                  : '0 2px 8px rgba(0,0,0,0.05)',
                animation: 'slideDown 0.5s ease forwards',
                animationDelay: `${0.3 + index * 0.1}s`,
                opacity: 0,
              }}
            >
              {filter.label}
              {activeFilter === filter.value && (
                <span style={{
                  marginLeft: '8px',
                  background: '#2196F3',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                }}>
                  {filteredSessions.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
          }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'rgba(255,82,82,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,82,82,0.2)',
            color: '#ff5252',
            marginBottom: '20px',
            animation: 'fadeIn 0.5s ease',
          }}>
            {error}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            animation: 'fadeIn 0.5s ease',
          }}>
            No {activeFilter !== 'all' ? activeFilter : ''} sessions found.
          </div>
        ) : (
          <>
            <div className="sessions-grid" style={{
              display: 'grid',
              gap: '20px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              marginBottom: '40px',
            }}>
              {currentSessions.map((session, index) => (
                <div key={session._id} style={{
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  opacity: 0,
                  animation: 'slideUp 0.5s ease forwards',
                  animationDelay: `${index * 0.1}s`,
                  ':hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.12)',
                  },
                }}>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#1a237e',
                    marginBottom: '16px',
                  }}>{session.title}</div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#e3f2fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      fontSize: '1.2rem',
                      color: '#1976d2',
                    }}>
                      {(session.studentId?.firstName?.[0] || '') + (session.studentId?.lastName?.[0] || '')}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500' }}>
                        {session.studentId?.firstName} {session.studentId?.lastName}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        Student
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      <i className="bi bi-calendar3" style={{ marginRight: '8px' }}></i>
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      <i className="bi bi-clock" style={{ marginRight: '8px' }}></i>
                      {session.startTime} - {session.endTime}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      color: getStatusColor(session.status),
                      background: `${getStatusColor(session.status)}15`,
                    }}>
                      {session.status}
                    </div>

                    {session.status === 'completed' ? (
                      session.paymentStatus === 'completed' && (
                        <button
                          onClick={() => handleWithdraw(session._id)}
                          style={{
                            padding: '8px 20px',
                            borderRadius: '20px',
                            border: 'none',
                            background: '#4CAF50',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease',
                            ':hover': {
                              background: '#43A047',
                            },
                          }}
                        >
                          Withdraw
                        </button>
                      )
                    ) : (
                      session.paymentStatus !== 'released' && (
                        <button
                          onClick={() => handleView(session._id)}
                          style={{
                            padding: '8px 20px',
                            borderRadius: '20px',
                            border: 'none',
                            background: '#2196F3',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease',
                            ':hover': {
                              background: '#1976D2',
                            },
                          }}
                        >
                          View
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '32px',
              opacity: 0,
              animation: 'fadeIn 0.5s ease forwards',
              animationDelay: '0.5s',
            }}>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: currentPage === 1 ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.7)',
                  color: currentPage === 1 ? '#999' : '#666',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem',
                }}
              >
                Previous
              </button>

              {getPageNumbers().map((number, index) => (
                <button
                  key={index}
                  onClick={() => typeof number === 'number' ? paginate(number) : null}
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    border: 'none',
                    background: number === currentPage 
                      ? 'rgba(33, 150, 243, 0.1)'
                      : number === '...' 
                        ? 'transparent'
                        : 'rgba(255,255,255,0.7)',
                    color: number === currentPage ? '#2196F3' : '#666',
                    cursor: typeof number === 'number' ? 'pointer' : 'default',
                    backdropFilter: number === '...' ? 'none' : 'blur(10px)',
                    transition: 'all 0.3s ease',
                    fontWeight: number === currentPage ? '600' : '400',
                    boxShadow: number === currentPage 
                      ? '0 4px 12px rgba(33, 150, 243, 0.2)'
                      : number === '...' 
                        ? 'none'
                        : '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: currentPage === totalPages ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.7)',
                  color: currentPage === totalPages ? '#999' : '#666',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem',
                }}
              >
                Next
              </button>
            </div>

            {/* Session count */}
            <div style={{
              textAlign: 'center',
              marginTop: '16px',
              color: '#666',
              fontSize: '0.9rem',
              opacity: 0,
              animation: 'fadeIn 0.5s ease forwards',
              animationDelay: '0.6s',
            }}>
              Showing {indexOfFirstSession + 1}-{Math.min(indexOfLastSession, filteredSessions.length)} of {filteredSessions.length} sessions
            </div>
          </>
        )}
      </div>

      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }

          button:disabled {
            cursor: not-allowed;
          }
        `}
      </style>
    </div>
  );
};

export default DevSessions; 