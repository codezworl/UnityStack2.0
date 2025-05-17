import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import ComHeader from '../components/header';
import ComSidebar from '../components/sidebar';
import FindDeveloper from '../pages/finddevelpor';
import FindWork from '../pages/findwork';
import { FaEdit, FaTrash, FaEye, FaCalendarAlt, FaVideo, FaComments, FaSyncAlt, FaPrint, FaChevronDown, FaSearch, FaDownload, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DeveloperDashboard = () => {
  const [selectedPage, setSelectedPage] = useState('dashboard'); // Default page
  const navigate = useNavigate();

  // Weekly schedule state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedule, setSchedule] = useState({
    Monday:    { Morning: 'Booked', Afternoon: 'Available', Evening: 'Booked' },
    Tuesday:   { Morning: 'Available', Afternoon: 'Booked', Evening: 'Booked' },
    Wednesday: { Morning: 'Booked', Afternoon: 'Available', Evening: 'Available' },
    Thursday:  { Morning: 'Available', Afternoon: 'Booked', Evening: 'Available' },
    Friday:    { Morning: 'Booked', Afternoon: 'Available', Evening: 'Booked' },
    Saturday:  { Morning: 'Not Set', Afternoon: 'Not Set', Evening: 'Not Set' },
    Sunday:    { Morning: 'Not Set', Afternoon: 'Not Set', Evening: 'Not Set' },
  });
  const [editSchedule, setEditSchedule] = useState(schedule);

  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [revenueTab, setRevenueTab] = useState('overview');
  const lastUpdated = 'May 10, 2025';
  const revenueSummary = {
    total: 'PKR 7,852,000',
    monthly: 'PKR 654,333',
    annual: 'PKR 8,500,000',
    totalChange: '+12.5% from last year',
    monthlyChange: '+2.3% from previous period',
    annualChange: '+8.2% year over year',
  };
  const monthlyBreakdown = [
    { month: 'January', revenue: 'PKR 620,000', projects: 12, avg: 'PKR 51,667', growth: '+5.2%' },
    { month: 'February', revenue: 'PKR 580,000', projects: 10, avg: 'PKR 58,000', growth: '-6.5%' },
    { month: 'March', revenue: 'PKR 700,000', projects: 14, avg: 'PKR 50,000', growth: '+8.1%' },
  ];

  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [projectsTab, setProjectsTab] = useState('all');
  const [sessionsTab, setSessionsTab] = useState('all');
  const [developerProjects, setDeveloperProjects] = useState([]);
  const [projectStats, setProjectStats] = useState({ completed: 0, inProgress: 0, pending: 0 });
  const developerId = localStorage.getItem('developerId'); // Or get from auth context

  // Fetch developer's own projects
  useEffect(() => {
    const fetchDeveloperProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch projects');
        const allProjects = await response.json();
        // Filter for projects assigned to this developer
        const myProjects = allProjects.filter(p => p.assignedTo === developerId);
        setDeveloperProjects(myProjects);
        setProjectStats({
          completed: myProjects.filter(p => p.status === 'completed').length,
          inProgress: myProjects.filter(p => p.status === 'in-progress').length,
          pending: myProjects.filter(p => p.status === 'pending').length
        });
      } catch (err) {
        setDeveloperProjects([]);
        setProjectStats({ completed: 0, inProgress: 0, pending: 0 });
      }
    };
    fetchDeveloperProjects();
  }, [showProjectsModal]);

  const handleSidebarSelection = (page) => {
    setSelectedPage(page); // Update selected page based on sidebar selection
  };

  const quickActions = [
    {
      title: 'Get 1 to 1 Live Session',
      subtitle: 'Connect with an expert for personalized guidance',
      color: 'linear-gradient(135deg, #5B6BFF 0%, #6C47FF 100%)',
      page: 'sessions',
    },
    {
      title: 'Answer the Questions',
      subtitle: 'Respond to queries and help other developers',
      color: 'linear-gradient(135deg, #FFA726 0%, #C4711A 100%)',
      page: 'question',
      onClick: () => navigate('/question')
    },
    {
      title: 'Get Some Work Done',
      subtitle: 'Find projects and tasks that match your skills',
      color: 'linear-gradient(135deg, #F8576A 0%, #D72660 100%)',
      page: 'findwork',
    },
  ];

  const handleEditSchedule = () => {
    setEditSchedule(schedule);
    setShowScheduleModal(true);
  };
  const handleScheduleChange = (day, slot) => {
    setEditSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: prev[day][slot] === 'Available' ? 'Booked' : prev[day][slot] === 'Booked' ? 'Not Set' : 'Available',
      }
    }));
  };
  const handleSaveSchedule = () => {
    setSchedule(editSchedule);
    setShowScheduleModal(false);
  };

  const renderContent = () => {
    if (selectedPage === 'finddeveloper') {
      return <FindDeveloper />;
    } else if (selectedPage === 'findwork') {
      return <FindWork />;
    } else if (selectedPage === 'sessions') {
      // You can replace this with your actual sessions page/component
      return <div>Sessions Page (implement navigation as needed)</div>;
    } else if (selectedPage === 'answerquestions') {
      // You can replace this with your actual answer questions page/component
      return <div>Answer Questions Page (implement navigation as needed)</div>;
    } else if (selectedPage === 'messages') {
      return (
        <div className="message-container">
          <h5>Messages</h5>
          <Messages />
        </div>
      );
    } else if (selectedPage === 'notifications') {
      return (
        <div className="notification-container">
          <h5>Notifications</h5>
          <Notifications />
        </div>
      );
    } else if (selectedPage === 'forum') {
      return (
        <div className="discussion-forum-container">
          <h5 className="text-center">Discussion Forum</h5>
          <DiscussionForum />
        </div>
      );
    } else {
      return (
        <>
          {/* Quick Action Cards */}
          <div className="row mb-4" style={{ marginTop: 10 }}>
            {quickActions.map((action, idx) => (
              <div className="col-md-4 mb-3" key={action.title}>
                <div
                  style={{
                    background: action.color,
                    borderRadius: 16,
                    color: '#fff',
                    padding: '28px 28px 24px 28px',
                    minHeight: 140,
                    boxShadow: '0 4px 16px rgba(80,80,120,0.08)',
                    cursor: 'pointer',
                    transition: 'transform 0.15s',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onClick={() => action.onClick ? action.onClick() : setSelectedPage(action.page)}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'none'}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>{action.title}</div>
                    <div style={{ fontSize: 17, opacity: 0.95 }}>{action.subtitle}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 28, fontWeight: 400, marginTop: 10, opacity: 0.7 }}>&#8594;</div>
                </div>
              </div>
            ))}
          </div>
          <div className="dashboard-content">
            {/* Top Section */}
            <div className="row g-4">
              <div className="col-lg-6">
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 32, minHeight: 370, boxShadow: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 0, color: '#111' }}>Revenue</div>
                      <div style={{ fontWeight: 700, fontSize: 32, color: '#222', marginBottom: 0 }}>PKR 7,852,000</div>
                      <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 16, marginBottom: 0 }}>+2% from last week</div>
                    </div>
                    <Button variant="outline-dark" size="sm" style={{ borderRadius: 10, fontWeight: 600, fontSize: 16, border: '1px solid #D1D5DB', background: '#fff', color: '#222', boxShadow: 'none' }} onClick={() => setShowRevenueModal(true)}>View Report</Button>
                  </div>
                  <div style={{ height: '200px', marginTop: 16 }}>
                    <Line
                      data={{
                        labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
                        datasets: [
                          {
                            label: 'Sales',
                            data: [100, 120, 150, 170, 180, 200, 220, 230, 250, 280],
                            backgroundColor: 'rgba(75, 192, 192, 0.08)',
                            borderColor: '#111',
                            borderWidth: 3,
                            pointBackgroundColor: '#111',
                            pointBorderColor: '#fff',
                            pointRadius: 5,
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            labels: { color: '#222', font: { size: 16, weight: 600 } },
                          },
                        },
                        scales: {
                          x: {
                            ticks: { color: '#222', font: { size: 15 } },
                            grid: { color: '#F3F4F6' },
                          },
                          y: {
                            ticks: { color: '#222', font: { size: 15 } },
                            grid: { color: '#F3F4F6' },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 32, minHeight: 370, boxShadow: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div style={{ fontWeight: 700, fontSize: 28, color: '#111' }}>Order Time</div>
                    <Button variant="outline-dark" size="sm" style={{ borderRadius: 10, fontWeight: 600, fontSize: 16, border: '1px solid #D1D5DB', background: '#fff', color: '#222', boxShadow: 'none' }}>View Report</Button>
                  </div>
                  <div style={{ height: '200px', marginTop: 16 }}>
                    <Doughnut
                      data={{
                        labels: ['Afternoon', 'Evening', 'Morning'],
                        datasets: [
                          {
                            data: [32, 25, 43],
                            backgroundColor: ['#A5D8FF', '#2563EB', '#3B82F6'],
                            hoverBackgroundColor: ['#60A5FA', '#1D4ED8', '#2563EB'],
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="d-flex justify-content-center align-items-center mt-3" style={{ gap: 18 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: '#A5D8FF', display: 'inline-block' }}></span>Afternoon</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: '#2563EB', display: 'inline-block' }}></span>Evening</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: '#3B82F6', display: 'inline-block' }}></span>Morning</span>
                  </div>
                  <div className="text-center mt-2" style={{ color: '#222', fontWeight: 500, fontSize: 17 }}>Afternoon orders: 32%</div>
                </div>
              </div>
            </div>

            {/* Rating and Feedback Section */}
            <div className="row g-4 mt-4">
              <div className="col-lg-6">
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 32, minHeight: 370, boxShadow: 'none', height: '100%' }}>
                  <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 18, color: '#111', letterSpacing: -1 }}>Ratings and Reviews</div>
                  <div className="d-flex align-items-center mb-2" style={{ gap: 18 }}>
                    <span style={{ fontSize: 48, fontWeight: 700, color: '#111', lineHeight: 1 }}>4.6</span>
                    <span style={{ fontSize: 32, color: '#FFD600', marginTop: 4 }}>
                      {'★'.repeat(4)}<span style={{ color: '#E5E7EB' }}>★</span>
                    </span>
                  </div>
                  <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 18, marginBottom: 18 }}>189,561 ratings</div>
                  {/* Star bars */}
                  {[5, 4, 3, 2, 1].map((star, idx) => {
                    const barPercents = [0.65, 0.18, 0.08, 0.05, 0.04];
                    return (
                      <div key={star} className="d-flex align-items-center mb-2" style={{ gap: 10 }}>
                        <span style={{ width: 60, fontWeight: 500, color: '#222', fontSize: 16 }}>{star} Star{star > 1 ? 's' : ''}:</span>
                        <div style={{ flex: 1, background: '#F3F4F6', borderRadius: 8, height: 10, position: 'relative' }}>
                          <div style={{ width: `${barPercents[idx] * 100}%`, background: '#111', height: 10, borderRadius: 8 }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="col-lg-6">
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 32, minHeight: 370, boxShadow: 'none', height: '100%' }}>
                  <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 18, color: '#111', letterSpacing: -1 }}>Feedback</div>
                  <div style={{ maxHeight: 270, overflowY: 'auto', paddingRight: 8 }}>
                    {[
                      { name: 'Dileep Singh', stars: 5, comment: "It's fantastic to stay connected with clients via a mobile app, allowing for prompt and frequent responses to their project needs." },
                      { name: 'John Doe', stars: 4, comment: 'The new updates have improved the experience significantly. Great work!' },
                      { name: 'Jane Smith', stars: 5, comment: 'I appreciate the quick response time and the helpful support team.' },
                    ].map((feedback, index) => (
                      <div key={index} className="d-flex align-items-start mb-4" style={{ gap: 18 }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: '#222', flexShrink: 0 }}>
                          {feedback.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 18, color: '#111', marginBottom: 2 }}>{feedback.name}</div>
                          <div style={{ color: '#FFD600', fontSize: 18, marginBottom: 2 }}>
                            {'★'.repeat(feedback.stars)}{'☆'.repeat(5 - feedback.stars)}
                          </div>
                          <div style={{ color: '#222', fontSize: 16, lineHeight: 1.5 }}>{feedback.comment}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cards for Projects and Sessions */}
            <div className="row g-4 mt-4">
              <div className="col-lg-6">
                <Card
                  className="shadow-sm h-100"
                  style={{
                    transition: 'transform 0.3s, border-color 0.3s',
                    border: '1px solid #e0e0e0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.borderColor = '#007bff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = '#e0e0e0';
                  }}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>Total Projects</h5>
                      <Button variant="primary" size="sm" onClick={() => setShowProjectsModal(true)}>
                        View all project
                      </Button>
                    </div>
                    <h2>{developerProjects.length}</h2>
                  </Card.Body>
                </Card>
              </div>

              <div className="col-lg-6">
                <Card
                  className="shadow-sm h-100"
                  style={{
                    transition: 'transform 0.3s, border-color 0.3s',
                    border: '1px solid #e0e0e0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.borderColor = '#007bff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = '#e0e0e0';
                  }}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>Total Sessions</h5>
                      <Button variant="primary" size="sm" onClick={() => setShowSessionsModal(true)}>
                        View Sessions
                      </Button>
                    </div>
                    <h2>48</h2>
                  </Card.Body>
                </Card>
              </div>
            </div>

            {/* Small Cards for Project Types */}
            <div className="row g-4 mt-4">
              {[
                { label: 'AI Projects', count: 24 },
                { label: 'MERN Projects', count: 36 },
                { label: 'UI/UX Projects', count: 18 },
                { label: 'Mobile App Projects', count: 28 },
              ].map((type, index) => (
                <div className="col-lg-3" key={index}>
                  <Card
                    className="shadow-sm h-100"
                    style={{
                      transition: 'transform 0.3s, border-color 0.3s',
                      border: '1px solid #e0e0e0',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.borderColor = '#007bff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.borderColor = '#e0e0e0';
                    }}
                  >
                    <Card.Body>
                      <h6>{type.label}</h6>
                      <h3>{type.count}</h3>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>

            {/* Time Slots Section */}
            <div className="row g-4 mt-4">
              <div className="col-lg-12">
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 32, boxShadow: 'none' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 18 }}>Showing this week's schedule</div>
                    <Button variant="outline-dark" size="sm" style={{ borderRadius: 10, fontWeight: 600, fontSize: 16, border: '1px solid #D1D5DB', background: '#fff', color: '#222', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 8 }} onClick={handleEditSchedule}>
                      <span className="bi bi-calendar"></span> Edit Schedule
                    </Button>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ minWidth: 700, background: '#fff', borderRadius: 12, borderCollapse: 'separate', borderSpacing: 0 }}>
                      <thead className="table-light">
                        <tr>
                          <th style={{ fontWeight: 600, color: '#6B7280', background: '#F9FAFB', borderTopLeftRadius: 12 }}>Days</th>
                          <th style={{ fontWeight: 600, color: '#6B7280', background: '#F9FAFB' }}>Morning</th>
                          <th style={{ fontWeight: 600, color: '#6B7280', background: '#F9FAFB' }}>Afternoon</th>
                          <th style={{ fontWeight: 600, color: '#6B7280', background: '#F9FAFB', borderTopRightRadius: 12 }}>Evening</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(schedule).map(day => (
                          <tr key={day}>
                            <td style={{ fontWeight: 600 }}>{day}</td>
                            {['Morning', 'Afternoon', 'Evening'].map(slot => (
                              <td key={slot}>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '4px 16px',
                                  borderRadius: 16,
                                  fontWeight: 600,
                                  fontSize: 15,
                                  background: schedule[day][slot] === 'Booked' ? '#FEE2E2' : schedule[day][slot] === 'Available' ? '#D1FAE5' : '#F3F4F6',
                                  color: schedule[day][slot] === 'Booked' ? '#DC2626' : schedule[day][slot] === 'Available' ? '#059669' : '#6B7280',
                                }}>{schedule[day][slot]}</span>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <ComHeader />

      <div className="d-flex">
        <ComSidebar onSelectPage={handleSidebarSelection} selectedPage={selectedPage} />

        <div
          className="container mt-4"
          style={{ marginLeft: '10px', flexGrow: 1, paddingBottom: '50px' }}
        >
          {renderContent()}
        </div>
      </div>

      {/* Edit Schedule Modal */}
      {showScheduleModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 700, width: '100%', padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}>
            <button onClick={() => setShowScheduleModal(false)} style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', fontSize: 28, color: '#888', cursor: 'pointer' }}>×</button>
            <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Edit Weekly Schedule</h4>
            <div style={{ color: '#6B7280', marginBottom: 24 }}>Select the time slots when you are available for sessions. Clients will be able to book sessions during these times.</div>
            {Object.keys(editSchedule).map(day => (
              <div key={day} style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 6 }}>{day}</div>
                <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                  {['Morning', 'Afternoon', 'Evening'].map(slot => (
                    <label key={slot} style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={editSchedule[day][slot] === 'Available'}
                        onChange={() => handleScheduleChange(day, slot)}
                        style={{ accentColor: '#2563EB', width: 18, height: 18 }}
                      />
                      {slot} <span style={{ color: '#6B7280', fontWeight: 400, fontSize: 13, marginLeft: 2 }}>
                        {slot === 'Morning' ? '(9 AM - 12 PM)' : slot === 'Afternoon' ? '(12 PM - 3 PM)' : '(6 PM - 9 PM)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
              <Button variant="outline-secondary" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveSchedule}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Report Modal */}
      {showRevenueModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 18, maxWidth: 950, width: '100%', padding: 36, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowRevenueModal(false)} style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', fontSize: 28, color: '#888', cursor: 'pointer' }}>×</button>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div style={{ fontWeight: 700, fontSize: 28 }}>Revenue Report</div>
              <div style={{ color: '#444', fontWeight: 500, fontSize: 17, background: '#F3F4F6', borderRadius: 16, padding: '6px 18px' }}>Last updated: {lastUpdated}</div>
            </div>
            <div className="d-flex align-items-center mb-4" style={{ gap: 16 }}>
              <Button variant="outline-dark" style={{ fontWeight: 600, borderRadius: 10, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}><FaSyncAlt /> Refresh</Button>
              <Button variant="outline-dark" style={{ fontWeight: 600, borderRadius: 10, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}><FaFilter /> Filter</Button>
              <Button variant="outline-dark" style={{ fontWeight: 600, borderRadius: 10, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}><FaPrint /> Print</Button>
              <Button variant="outline-dark" style={{ fontWeight: 600, borderRadius: 10, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}><FaDownload /> Export</Button>
            </div>
            <div className="d-flex mb-4" style={{ gap: 0 }}>
              <button onClick={() => setRevenueTab('overview')} style={{ flex: 1, fontWeight: 600, fontSize: 20, background: revenueTab === 'overview' ? '#F9FAFB' : 'transparent', border: 'none', borderBottom: revenueTab === 'overview' ? '3px solid #2563EB' : '1px solid #E5E7EB', padding: '16px 0', cursor: 'pointer', borderTopLeftRadius: 8 }}>Overview</button>
              <button onClick={() => setRevenueTab('details')} style={{ flex: 1, fontWeight: 600, fontSize: 20, background: revenueTab === 'details' ? '#F9FAFB' : 'transparent', border: 'none', borderBottom: revenueTab === 'details' ? '3px solid #2563EB' : '1px solid #E5E7EB', padding: '16px 0', cursor: 'pointer', borderTopRightRadius: 8 }}>Details</button>
            </div>
            {revenueTab === 'overview' ? (
              <div className="row mb-4" style={{ gap: 0 }}>
                <div className="col-md-4 mb-3">
                  <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 32, height: '100%' }}>
                    <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 2 }}>Total Revenue</div>
                    <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 16, marginBottom: 8 }}>All time</div>
                    <div style={{ fontWeight: 700, fontSize: 32, color: '#111', marginBottom: 8 }}>{revenueSummary.total}</div>
                    <div style={{ color: '#22C55E', fontWeight: 600, fontSize: 16, background: '#ECFDF5', borderRadius: 8, display: 'inline-block', padding: '2px 12px' }}>↑ {revenueSummary.totalChange}</div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 32, height: '100%' }}>
                    <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 2 }}>Monthly Average</div>
                    <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Last 12 months</div>
                    <div style={{ fontWeight: 700, fontSize: 32, color: '#111', marginBottom: 8 }}>{revenueSummary.monthly}</div>
                    <div style={{ color: '#22C55E', fontWeight: 600, fontSize: 16, background: '#ECFDF5', borderRadius: 8, display: 'inline-block', padding: '2px 12px' }}>↑ {revenueSummary.monthlyChange}</div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 32, height: '100%' }}>
                    <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 2 }}>Projected Annual</div>
                    <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Based on current growth</div>
                    <div style={{ fontWeight: 700, fontSize: 32, color: '#111', marginBottom: 8 }}>{revenueSummary.annual}</div>
                    <div style={{ color: '#22C55E', fontWeight: 600, fontSize: 16, background: '#ECFDF5', borderRadius: 8, display: 'inline-block', padding: '2px 12px' }}>↑ {revenueSummary.annualChange}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 32 }}>
                <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Monthly Revenue Breakdown</div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table" style={{ minWidth: 700, background: '#fff', borderRadius: 12, borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead className="table-light">
                      <tr>
                        <th>Month</th>
                        <th>Revenue</th>
                        <th>Projects</th>
                        <th>Avg. Project Value</th>
                        <th>Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyBreakdown.map((row, idx) => (
                        <tr key={idx}>
                          <td>{row.month}</td>
                          <td>{row.revenue}</td>
                          <td>{row.projects}</td>
                          <td>{row.avg}</td>
                          <td style={{ color: row.growth.startsWith('+') ? '#22C55E' : '#EF4444', fontWeight: 600 }}>{row.growth}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="d-flex justify-content-end mt-4">
              <Button variant="outline-dark" size="lg" style={{ borderRadius: 12, fontWeight: 600, fontSize: 18, minWidth: 120 }} onClick={() => setShowRevenueModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Overview Modal */}
      {showProjectsModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 18, maxWidth: 1100, width: '100%', padding: 36, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowProjectsModal(false)} style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', fontSize: 28, color: '#888', cursor: 'pointer' }}>×</button>
            <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 2 }}>Projects Overview</div>
            <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 18, marginBottom: 24 }}>View and manage all your projects</div>
            <div className="d-flex align-items-center mb-4" style={{ gap: 16 }}>
              <Button variant="outline-dark" style={{ fontWeight: 600, borderRadius: 10, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaCalendarAlt /> This Month <FaChevronDown style={{ fontSize: 14, marginLeft: 2 }} />
              </Button>
              <Button variant="outline-dark" style={{ fontWeight: 600, borderRadius: 10, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaSyncAlt />
              </Button>
              <Button variant="outline-dark" style={{ fontWeight: 600, borderRadius: 10, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaPrint />
              </Button>
            </div>
            <div className="d-flex align-items-center mb-4" style={{ gap: 16 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 18 }} />
                <input type="text" placeholder="Search projects..." style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 18px 12px 40px', fontSize: 17 }} />
              </div>
              <Button variant="outline-dark" style={{ fontWeight: 600, borderRadius: 10, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8, minWidth: 160, justifyContent: 'space-between' }}>
                All Projects <FaChevronDown style={{ fontSize: 16, marginLeft: 8 }} />
              </Button>
            </div>
            <div className="d-flex mb-4" style={{ gap: 0 }}>
              {['all', 'AI', 'MERN', 'UI/UX', 'Mobile'].map(tab => (
                <button key={tab} onClick={() => setProjectsTab(tab)} style={{ flex: 1, fontWeight: 600, fontSize: 18, background: projectsTab === tab ? '#F9FAFB' : 'transparent', border: 'none', borderBottom: projectsTab === tab ? '3px solid #2563EB' : '1px solid #E5E7EB', padding: '14px 0', cursor: 'pointer', borderTopLeftRadius: tab === 'all' ? 8 : 0, borderTopRightRadius: tab === 'Mobile' ? 8 : 0 }}>{tab === 'all' ? 'All' : tab}</button>
              ))}
            </div>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#2563EB', marginBottom: 18 }}>
              Completed: {projectStats.completed} | In Progress: {projectStats.inProgress} | Pending: {projectStats.pending}
            </div>
            <div className="row" style={{ gap: 0 }}>
              {developerProjects
                .filter(p => projectsTab === 'all' || (p.tag && p.tag.toLowerCase() === projectsTab.toLowerCase()))
                .map((project, idx) => (
                  <div className="col-md-4 mb-4" key={idx}>
                    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 28, height: '100%' }}>
                      <div className="d-flex align-items-center mb-2" style={{ gap: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: 22 }}>{project.name}</div>
                        <span style={{ background: project.tag === 'AI' ? '#F3E8FF' : project.tag === 'MERN' ? '#DBEAFE' : project.tag === 'UI/UX' ? '#FCE7F3' : '#DCFCE7', color: '#555', fontWeight: 600, fontSize: 15, borderRadius: 8, padding: '2px 12px', marginLeft: 8 }}>{project.tag}</span>
                      </div>
                      <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 15, marginBottom: 8 }}>Last updated {project.updated}</div>
                      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>Progress</div>
                      <div style={{ background: '#E5E7EB', borderRadius: 8, height: 8, width: '100%', marginBottom: 8 }}>
                        <div style={{ width: `${project.progress}%`, background: '#2563EB', height: 8, borderRadius: 8 }}></div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div style={{ color: '#222', fontWeight: 500, fontSize: 15 }}>{project.progress}%</div>
                        <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 15 }}>{project.daysLeft} days left</div>
                      </div>
                      <Button variant="outline-dark" style={{ borderRadius: 10, fontWeight: 600, fontSize: 16, width: '100%' }} onClick={() => window.open(`/findwork?projectId=${project._id}`, '_blank')}>View Details</Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Sessions Overview Modal */}
      {showSessionsModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 18, maxWidth: 1100, width: '100%', padding: 36, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowSessionsModal(false)} style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', fontSize: 28, color: '#888', cursor: 'pointer' }}>×</button>
            <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 2 }}>Sessions Overview</div>
            <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 18, marginBottom: 24 }}>View and manage all your sessions</div>
            <div className="d-flex align-items-center mb-4" style={{ gap: 16 }}>
              <Button variant="outline-dark" style={{ fontWeight: 600, borderRadius: 10, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaCalendarAlt /> This Month <FaChevronDown style={{ fontSize: 14, marginLeft: 2 }} />
              </Button>
              <Button variant="outline-dark" style={{ fontWeight: 600, borderRadius: 10, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaSyncAlt />
              </Button>
              <Button variant="outline-dark" style={{ fontWeight: 600, borderRadius: 10, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaPrint />
              </Button>
            </div>
            <div className="d-flex align-items-center mb-4" style={{ gap: 16 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 18 }} />
                <input type="text" placeholder="Search sessions..." style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 18px 12px 40px', fontSize: 17 }} />
              </div>
              <Button variant="outline-dark" style={{ fontWeight: 600, borderRadius: 10, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8, minWidth: 160, justifyContent: 'space-between' }}>
                All Sessions <FaChevronDown style={{ fontSize: 16, marginLeft: 8 }} />
              </Button>
            </div>
            <div className="d-flex mb-4" style={{ gap: 0 }}>
              {['all', 'Upcoming', 'Completed', 'Cancelled'].map(tab => (
                <button key={tab} onClick={() => setSessionsTab(tab)} style={{ flex: 1, fontWeight: 600, fontSize: 18, background: sessionsTab === tab ? '#F9FAFB' : 'transparent', border: 'none', borderBottom: sessionsTab === tab ? '3px solid #2563EB' : '1px solid #E5E7EB', padding: '14px 0', cursor: 'pointer', borderTopLeftRadius: tab === 'all' ? 8 : 0, borderTopRightRadius: tab === 'Cancelled' ? 8 : 0 }}>{tab}</button>
              ))}
            </div>
            <div>
              {sessions.filter(s => sessionsTab === 'all' || s.status === sessionsTab).map((session, idx) => (
                <div key={idx} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 28, marginBottom: 18 }}>
                  <div className="d-flex align-items-center mb-2" style={{ gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: '#222', flexShrink: 0 }}>
                      {session.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 20 }}>{session.name}</div>
                      <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 15 }}>with {session.client}</div>
                    </div>
                    <span style={{ background: session.status === 'Upcoming' ? '#DCFCE7' : session.status === 'Completed' ? '#DBEAFE' : '#FEE2E2', color: session.status === 'Upcoming' ? '#059669' : session.status === 'Completed' ? '#2563EB' : '#DC2626', fontWeight: 600, fontSize: 15, borderRadius: 8, padding: '2px 12px', marginLeft: 8 }}>{session.status}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2" style={{ gap: 18, color: '#6B7280', fontWeight: 500, fontSize: 15 }}>
                    <span><span className="bi bi-calendar"></span> {session.date}</span>
                    <span><span className="bi bi-clock"></span> {session.time} • {session.duration}</span>
                  </div>
                  <div className="d-flex align-items-center" style={{ gap: 12 }}>
                    {session.status === 'Upcoming' && <Button variant="outline-dark" style={{ borderRadius: 10, fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}><FaComments /> Message</Button>}
                    {session.status === 'Upcoming' && <Button variant="dark" style={{ borderRadius: 10, fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}><FaVideo /> Join</Button>}
                    {session.status === 'Completed' && <Button variant="outline-dark" style={{ borderRadius: 10, fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}><FaEye /> View Details</Button>}
                    {session.status === 'Cancelled' && <Button variant="outline-dark" style={{ borderRadius: 10, fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}><FaCalendarAlt /> Reschedule</Button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeveloperDashboard;
