import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ScheduleSession = () => {
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
        const studentId = userData.id || userData._id;
        const response = await axios.get(`http://localhost:5000/api/sessions?studentId=${studentId}`, {
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

  const handleRequest = (sessionId) => {
    navigate(`/session/${sessionId}/request`);
  };

  // Function to check if session time has passed
  const isSessionTimePassed = (session) => {
    const now = new Date();
    const sessionDate = new Date(session.date);
    const [startHour] = session.startTime.split(':');
    sessionDate.setHours(parseInt(startHour), 0, 0, 0);
    
    // Calculate end time
    const endTime = new Date(sessionDate);
    endTime.setHours(endTime.getHours() + session.hours);
    
    // Only consider session passed if it's after the end time
    return now > endTime;
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
                <th>Developer</th>
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
                  <td>{session.developerId?.firstName} {session.developerId?.lastName}</td>
                  <td>{session.status}</td>
                  <td>{new Date(session.date).toLocaleDateString()}</td>
                  <td>{session.startTime} - {session.endTime}</td>
                  <td>
                    {session.status === 'completed' ? (
                      session.recordingPath ? (
                        <a
                          href={`http://localhost:5000/${session.recordingPath}`}
                          download
                          className="btn btn-outline-info btn-sm"
                          title="Download Recording"
                        >
                          <i className="fa fa-download"></i> Download
                        </a>
                      ) : null
                    ) : isSessionTimePassed(session) ? (
                      <div>
                        <div className="text-danger mb-2">Session time has passed</div>
                        <button 
                          className="btn btn-warning btn-sm" 
                          onClick={() => handleRequest(session._id)}
                        >
                          Request Reschedule
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleView(session._id)}
                      >
                        View
                      </button>
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

export default ScheduleSession;
