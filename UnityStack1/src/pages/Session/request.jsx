import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Request = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to access this page');
        navigate('/login');
        return;
      }

      try {
        const userData = JSON.parse(atob(token.split('.')[1]));
        if (userData.role !== 'student') {
          toast.error('Only students can submit rescheduling requests');
          navigate('/');
          return;
        }
        setUserRole(userData.role);
      } catch (error) {
        toast.error('Invalid session. Please login again');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/sessions/detail/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSession(response.data.session);
      } catch (error) {
        toast.error('Error fetching session details');
      }
    };

    if (userRole === 'student') {
      fetchSession();
    }
  }, [sessionId, userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please provide a reason for rescheduling');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(atob(token.split('.')[1]));

      // Verify user is a student
      if (userData.role !== 'student') {
        toast.error('Only students can submit rescheduling requests');
        return;
      }

      // Create request payload with all required fields
      const requestPayload = {
        sessionId,
        reason: description,
        requestedTimeSlot: 'TBD', // Placeholder until actual rescheduling
        userRole: userData.role,
        requestedBy: userData.id,
        originalSessionDate: session.date,
        originalSessionTime: session.startTime
      };

      const response = await axios.post(
        'http://localhost:5000/api/requests/create',
        requestPayload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Rescheduling request submitted successfully');
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error(error.response?.data?.message || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  if (!session || !userRole) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title mb-4">Request Session Reschedule</h2>
              <div className="mb-4">
                <h5>Session Details</h5>
                <p><strong>Title:</strong> {session.title}</p>
                <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {session.startTime} - {session.endTime}</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Reason for Rescheduling</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    required
                    placeholder="Please provide a detailed reason for rescheduling this session..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Request; 