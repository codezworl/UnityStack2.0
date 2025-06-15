import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from 'react-icons/fa';

const HandleRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/requests', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.requests) {
        setRequests(response.data.requests);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      if (error.response?.status === 403) {
        toast.error('You are not authorized to view requests');
      } else {
        toast.error('Failed to fetch requests');
      }
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async (request) => {
    if (!request?.sessionId?._id) {
      toast.error('Invalid session data');
      return;
    }

    setSelectedRequest(request);
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
    await fetchAvailableSlots(request, tomorrow.toISOString().split('T')[0]);
  };

  const fetchAvailableSlots = async (request, date) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/sessions/available-slots?developerId=${request.sessionId.developerId._id}&date=${date}&hours=${request.sessionId.hours || 1}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.availableSlots) {
        setAvailableSlots(response.data.availableSlots);
        setShowRescheduleModal(true);
      } else {
        setAvailableSlots([]);
        toast.error('No available slots found');
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      toast.error('Failed to fetch available time slots');
    }
  };

  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    if (selectedRequest) {
      await fetchAvailableSlots(selectedRequest, newDate);
    }
  };

  const handleApproveReschedule = async () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    if (!selectedRequest?._id) {
      toast.error('Invalid request data');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axios.put(
        `http://localhost:5000/api/requests/${selectedRequest._id}/approve`,
        {
          newTimeSlot: selectedSlot,
          newDate: selectedDate
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success('Session rescheduled successfully');
      setShowRescheduleModal(false);
      setSelectedSlot('');
      setSelectedDate('');
      fetchRequests();
    } catch (error) {
      console.error('Error approving reschedule:', error);
      toast.error('Failed to reschedule session');
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (!requestId) {
      toast.error('Invalid request ID');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axios.put(
        `http://localhost:5000/api/requests/${requestId}/reject`,
        {},
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success('Request rejected successfully');
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '0.25rem solid #007bff',
          borderRightColor: 'transparent',
          borderRadius: '50%',
          animation: 'spinner-border 0.75s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Rescheduling Requests</h2>
      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          No pending requests
        </div>
      ) : (
        <>
          {/* Pending Requests Cards */}
          <div style={{ display: 'grid', gap: '20px', marginBottom: '40px' }}>
            {requests.filter(request => request.status === 'pending').map((request) => (
              <div
                key={request._id}
                style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#fff'
                }}
              >
                <div style={{ marginBottom: '15px' }}>
                  <strong>Session:</strong> {request.sessionId?.title || 'N/A'}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Developer:</strong>{' '}
                  {request.sessionId?.developerId?.firstName} {request.sessionId?.developerId?.lastName}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Student:</strong>{' '}
                  {request.sessionId?.studentId?.firstName} {request.sessionId?.studentId?.lastName}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Reason:</strong> {request.reason}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Original Time:</strong> {request.originalSessionTime}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Requested Time:</strong> {request.requestedTimeSlot}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleReschedule(request)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <FaCheck /> Reschedule
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request._id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Completed Requests Table */}
          {requests.filter(request => request.status !== 'pending').length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ marginBottom: '20px' }}>Completed Requests</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Session</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Developer</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Student</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Original Time</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>New Time</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.filter(request => request.status !== 'pending').map((request) => (
                      <tr key={request._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '12px' }}>{request.sessionId?.title || 'N/A'}</td>
                        <td style={{ padding: '12px' }}>
                          {request.sessionId?.developerId?.firstName} {request.sessionId?.developerId?.lastName}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {request.sessionId?.studentId?.firstName} {request.sessionId?.studentId?.lastName}
                        </td>
                        <td style={{ padding: '12px' }}>{request.originalSessionTime}</td>
                        <td style={{ padding: '12px' }}>{request.newTimeSlot || request.requestedTimeSlot}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: request.status === 'approved' ? '#28a745' : '#dc3545',
                            color: 'white'
                          }}>
                            {request.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          {new Date(request.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Reschedule Session</h3>
            
            {/* Date Picker */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Select Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6'
                }}
              />
            </div>

            {/* Time Slots */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Available Time Slots:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: selectedSlot === slot ? '#007bff' : '#f8f9fa',
                        color: selectedSlot === slot ? 'white' : '#212529',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {slot}
                    </button>
                  ))
                ) : (
                  <div style={{ color: '#6c757d' }}>
                    No available slots for selected date
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setSelectedSlot('');
                  setSelectedDate('');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleApproveReschedule}
                disabled={!selectedSlot}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedSlot ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: selectedSlot ? 'pointer' : 'not-allowed'
                }}
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandleRequest; 