import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DevSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } catch (err) {
        setError('Failed to fetch sessions');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleView = (sessionId) => {
    navigate(`/joinsession/${sessionId}`);
  };

  const handleWithdraw = (sessionId) => {
    navigate(`/withdrawsession/${sessionId}`);
  };

  return (
    <div className="container-fluid" style={{ padding: '30px', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <h2 className="mb-4">My Sessions</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : sessions.length === 0 ? (
        <div className="alert alert-info">No sessions found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Student</th>
                <th>Status</th>
                <th>Date</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session._id}>
                  <td>{session.title}</td>
                  <td>{session.studentId?.firstName} {session.studentId?.lastName}</td>
                  <td>{session.status}</td>
                  <td>{new Date(session.date).toLocaleDateString()}</td>
                  <td>{session.startTime} - {session.endTime}</td>
                  <td>
                    {/* If session is completed and payment is completed, show Withdraw. Else if not completed and payment not released, show View. */}
                    {session.status === 'completed' ? (
                      session.paymentStatus === 'completed' ? (
                        <button className="btn btn-success btn-sm" onClick={() => handleWithdraw(session._id)}>Withdraw</button>
                      ) : null
                    ) : (
                      session.paymentStatus !== 'released' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleView(session._id)}>
                          View
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DevSessions; 