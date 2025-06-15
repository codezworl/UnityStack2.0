import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import ComHeader from '../components/header';
import ComSidebar from '../components/sidebar';
import FindDeveloper from '../pages/finddevelpor';
import FindWork from '../pages/findwork';
import DevSessions from '../pages/Session/devsessions';
import { FaEdit, FaTrash, FaEye, FaCalendarAlt, FaVideo, FaComments, FaSyncAlt, FaPrint, FaChevronDown, FaSearch, FaDownload, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DeveloperDashboard = () => {
  const [selectedPage, setSelectedPage] = useState('dashboard'); // Default page
  const navigate = useNavigate();

  // Weekly schedule state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedule, setSchedule] = useState({
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
    Saturday: {},
    Sunday: {}
  });
  const [editSchedule, setEditSchedule] = useState({
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
    Saturday: {},
    Sunday: {}
  });
  const [bookedSessions, setBookedSessions] = useState([]);
  const [workingHours, setWorkingHours] = useState({ from: "21:00", to: "00:00" }); // Default to 9 PM - 12 AM

  // Generate hourly slots based on working hours
  const generateHourlySlots = () => {
    const slots = {};
    const [startHour] = workingHours.from.split(':').map(Number);
    const [endHour] = workingHours.to.split(':').map(Number);
    
    const effectiveEndHour = endHour === 0 ? 24 : endHour;
    
    for (let hour = startHour; hour < effectiveEndHour; hour++) {
      const slot = `${hour}:00-${hour + 1}:00`;
      slots[slot] = 'Available';
    }
    return slots;
  };

  // Fetch developer's working hours and initialize schedule
  useEffect(() => {
    const fetchDeveloperDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const developerId = localStorage.getItem('developerId');
        if (!developerId) {
          console.error('No developer ID found');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/developers/${developerId}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch developer details');
        }

        const data = await response.json();
        
        if (data.workingHours) {
          setWorkingHours(data.workingHours);
        }

        const initialSchedule = {
          Monday: generateHourlySlots(),
          Tuesday: generateHourlySlots(),
          Wednesday: generateHourlySlots(),
          Thursday: generateHourlySlots(),
          Friday: generateHourlySlots(),
          Saturday: generateHourlySlots(),
          Sunday: generateHourlySlots()
        };

        if (data.schedule && Object.keys(data.schedule).length > 0) {
          // Convert Map to object if needed
          const scheduleObj = {};
          for (const [day, slots] of Object.entries(data.schedule)) {
            scheduleObj[day] = {};
            for (const [slot, status] of Object.entries(slots)) {
              scheduleObj[day][slot] = status;
            }
          }
          setSchedule(scheduleObj);
          setEditSchedule(scheduleObj);
        } else {
          setSchedule(initialSchedule);
          setEditSchedule(initialSchedule);
          // Save the initial schedule to the database
          await handleSaveSchedule(initialSchedule);
        }
      } catch (error) {
        console.error('Error fetching developer details:', error);
      }
    };

    fetchDeveloperDetails();
  }, []);

  const handleEditSchedule = () => {
    // When opening the modal, use the current schedule
    setEditSchedule(schedule);
    setShowScheduleModal(true);
  };

  const handleScheduleChange = (day, slot) => {
    // Check if slot is booked
    const isBooked = bookedSessions.some(session => {
      const sessionDate = new Date(session.date);
      const sessionDay = sessionDate.toLocaleDateString('en-US', { weekday: 'long' });
      const sessionStartTime = session.startTime;
      const sessionEndTime = session.endTime;
      return sessionDay === day && 
             sessionStartTime === slot.split('-')[0] && 
             sessionEndTime === slot.split('-')[1];
    });

    if (isBooked) {
      return;
    }

    setEditSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: prev[day][slot] === 'Available' ? 'Not Available' : 'Available'
      }
    }));
  };

  const handleSaveSchedule = async (scheduleToSave = null) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const scheduleData = scheduleToSave || editSchedule;

      // Validate schedule structure before sending
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      for (const day of days) {
        if (!scheduleData[day]) {
          console.error(`Missing schedule for ${day}`);
          return;
        }
      }

      const response = await fetch('http://localhost:5000/api/developers/schedule', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ schedule: scheduleData })
      });

      if (!response.ok) {
        throw new Error('Failed to save schedule');
      }

      const data = await response.json();
      setSchedule(data.schedule);
      setEditSchedule(data.schedule);
      if (!scheduleToSave) {
        setShowScheduleModal(false);
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  // Fetch booked sessions
  useEffect(() => {
    const fetchBookedSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:5000/api/sessions/developer', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch sessions');
        }
        
        const data = await response.json();
        setBookedSessions(data.sessions || []);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        alert(error.message || 'Failed to load sessions');
      }
    };
    fetchBookedSessions();
  }, []);

  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [revenueTab, setRevenueTab] = useState('overview');
  const lastUpdated = 'May 10, 2025';
  const [revenueData, setRevenueData] = useState({
    total: 0,
    monthly: 0,
    annual: 0,
    totalChange: '0%',
    monthlyChange: '0%',
    annualChange: '0%'
  });
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [projectsTab, setProjectsTab] = useState('all');
  const [sessionsTab, setSessionsTab] = useState('all');
  const [developerProjects, setDeveloperProjects] = useState([]);
  const [projectStats, setProjectStats] = useState({ completed: 0, inProgress: 0, pending: 0 });
  const [sessions, setSessions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const developerId = localStorage.getItem('developerId'); // Or get from auth context

  // Fetch developer's own projects
  useEffect(() => {
    const fetchDeveloperProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/projects/assigned', {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        
        // Set the projects from the response
        setDeveloperProjects(data.projects || []);
        
        // Update project stats
        setProjectStats({
          completed: data.stats?.completed || 0,
          inProgress: data.stats?.total - (data.stats?.completed || 0) - (data.stats?.cancelled || 0),
          pending: data.stats?.cancelled || 0
        });
      } catch (err) {
        console.error('Error fetching projects:', err);
        setDeveloperProjects([]);
        setProjectStats({ completed: 0, inProgress: 0, pending: 0 });
      }
    };
    fetchDeveloperProjects();
  }, [showProjectsModal]);

  // Fetch revenue and reviews data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const developerId = localStorage.getItem('developerId');

        // Fetch completed projects for revenue calculation
        const projectsResponse = await fetch('http://localhost:5000/api/projects/assigned', {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });
        const projectsData = await projectsResponse.json();
        const projects = projectsData.projects || [];

        // Fetch completed sessions
        const sessionsResponse = await fetch('http://localhost:5000/api/sessions/developer', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
        });

        if (!sessionsResponse.ok) {
          throw new Error('Failed to fetch sessions');
        }

        const sessionsData = await sessionsResponse.json();
        const sessions = sessionsData.sessions || [];

        console.log('Fetched sessions:', sessions);

        // Calculate revenue from completed projects with released payments
        const completedProjects = projects.filter(p => 
          p.status === 'completed' && 
          p.paymentStatus === 'released'
        );

        // Calculate revenue from completed sessions
        const completedSessions = sessions.filter(s => 
          s.status === 'completed' && 
          s.paymentStatus === 'released'
        );

        console.log('Completed projects:', completedProjects);
        console.log('Completed sessions:', completedSessions);

        // Calculate project revenue (90% of bid amount after platform fee)
        const projectRevenue = completedProjects.reduce((sum, project) => {
          const bidAmount = project.acceptedBidAmount || project.budget || 0;
          return sum + (bidAmount * 0.9);
        }, 0);

        // Calculate session revenue (90% of session amount after platform fee)
        const sessionRevenue = completedSessions.reduce((sum, session) => {
          const sessionAmount = session.amount || 0;
          return sum + (sessionAmount * 0.9);
        }, 0);

        // Total revenue combining projects and sessions
        const totalRevenue = projectRevenue + sessionRevenue;

        // Calculate monthly and annual revenue
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Monthly revenue calculation
        const monthlyProjectRevenue = completedProjects
          .filter(p => {
            const projectDate = new Date(p.completedAt);
            return projectDate.getMonth() === currentMonth && 
                   projectDate.getFullYear() === currentYear;
          })
          .reduce((sum, project) => {
            const bidAmount = project.acceptedBidAmount || project.budget || 0;
            return sum + (bidAmount * 0.9);
          }, 0);

        const monthlySessionRevenue = completedSessions
          .filter(s => {
            const sessionDate = new Date(s.completedAt);
            return sessionDate.getMonth() === currentMonth && 
                   sessionDate.getFullYear() === currentYear;
          })
          .reduce((sum, session) => {
            const sessionAmount = session.amount || 0;
            return sum + (sessionAmount * 0.9);
          }, 0);

        const monthlyRevenue = monthlyProjectRevenue + monthlySessionRevenue;

        // Annual revenue calculation
        const annualProjectRevenue = completedProjects
          .filter(p => {
            const projectDate = new Date(p.completedAt);
            return projectDate.getFullYear() === currentYear;
          })
          .reduce((sum, project) => {
            const bidAmount = project.acceptedBidAmount || project.budget || 0;
            return sum + (bidAmount * 0.9);
          }, 0);

        const annualSessionRevenue = completedSessions
          .filter(s => {
            const sessionDate = new Date(s.completedAt);
            return sessionDate.getFullYear() === currentYear;
          })
          .reduce((sum, session) => {
            const sessionAmount = session.amount || 0;
            return sum + (sessionAmount * 0.9);
          }, 0);

        const annualRevenue = annualProjectRevenue + annualSessionRevenue;

        console.log('Revenue calculations:', {
          totalRevenue,
          monthlyRevenue,
          annualRevenue,
          completedProjectsCount: completedProjects.length,
          completedSessionsCount: completedSessions.length
        });

        // Fetch reviews for both projects and sessions
        console.log('Fetching reviews for assigned projects and sessions...');
        const [projectReviewsResponse, sessionReviewsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/reviews/assigned', {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          }),
          fetch('http://localhost:5000/api/reviews/sessions', {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          })
        ]);
        
        if (!projectReviewsResponse.ok || !sessionReviewsResponse.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const projectReviewsData = await projectReviewsResponse.json();
        const sessionReviewsData = await sessionReviewsResponse.json();
        
        // Combine project and session reviews
        const allReviews = [
          ...(projectReviewsData.reviews || []),
          ...(sessionReviewsData.reviews || [])
        ];

        // Calculate combined average rating
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

        // Calculate combined rating distribution
        const ratingDistribution = {
          5: allReviews.filter(r => r.rating === 5).length,
          4: allReviews.filter(r => r.rating === 4).length,
          3: allReviews.filter(r => r.rating === 3).length,
          2: allReviews.filter(r => r.rating === 2).length,
          1: allReviews.filter(r => r.rating === 1).length
        };

        setRevenueData({
          total: totalRevenue,
          monthly: monthlyRevenue,
          annual: annualRevenue,
          totalChange: '0%',
          monthlyChange: '0%',
          annualChange: '0%'
        });

        // Update reviews state with combined data
        setReviews(allReviews);
        setAverageRating(averageRating);
        setTotalRatings(allReviews.length);

        // Update session count
        setSessions(sessions);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setReviews([]);
        setAverageRating(0);
        setTotalRatings(0);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch questions and answers data
  useEffect(() => {
    const fetchQuestionsAndAnswers = async () => {
      try {
        const token = localStorage.getItem('token');
        const developerId = localStorage.getItem('developerId');

        console.log('Developer ID:', developerId); // Debug log

        // Fetch all questions
        const questionsResponse = await fetch('http://localhost:5000/api/questions', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
        });

        if (!questionsResponse.ok) {
          throw new Error('Failed to fetch questions');
        }

        const questionsData = await questionsResponse.json();
        console.log('All Questions Data:', questionsData); // Debug log
        
        // Filter questions asked by this developer
        const developerQuestions = questionsData.questions.filter(q => {
          console.log('Question:', q); // Debug log for each question
          console.log('Question user:', q.user); // Debug log for user ID
          console.log('Question userRole:', q.userRole); // Debug log for user role
          return q.userRole.toLowerCase() === 'developer' && 
                 q.user && 
                 q.user.toString() === developerId;
        });
        
        console.log('Filtered Developer Questions:', developerQuestions); // Debug log
        setQuestions(developerQuestions);

        // Get all answers from questions
        const allAnswers = questionsData.questions.reduce((acc, question) => {
          if (question.answers && Array.isArray(question.answers)) {
            const questionAnswers = question.answers.filter(a => 
              a.userRole === 'developer' && 
              a.user && 
              a.user.toString() === developerId
            );
            return [...acc, ...questionAnswers];
          }
          return acc;
        }, []);
        
        setAnswers(allAnswers);

        console.log('Developer Questions Count:', developerQuestions.length);
        console.log('Developer Answers Count:', allAnswers.length);

      } catch (error) {
        console.error('Error fetching questions and answers:', error);
        setQuestions([]);
        setAnswers([]);
      }
    };

    fetchQuestionsAndAnswers();
  }, []);

  // Add a useEffect to monitor reviews state changes
  useEffect(() => {
    console.log('Current reviews state:', reviews);
    console.log('Current average rating:', averageRating);
    console.log('Current total ratings:', totalRatings);
  }, [reviews, averageRating, totalRatings]);

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

  const renderContent = () => {
    if (selectedPage === 'finddeveloper') {
      return <FindDeveloper />;
    } else if (selectedPage === 'findwork') {
      return <FindWork />;
    } else if (selectedPage === 'devsessions') {
      return <DevSessions />;
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
                      <div style={{ fontWeight: 700, fontSize: 32, color: '#222', marginBottom: 0 }}>PKR {(developerProjects
                        .filter(p => p.status === 'completed' && p.paymentStatus === 'released')
                        .reduce((sum, p) => sum + ((p.acceptedBidAmount || p.budget) * 0.9), 0) +
                        sessions
                        .filter(s => s.status === 'completed' && s.paymentStatus === 'released')
                        .reduce((sum, s) => sum + ((s.amount || 0) * 0.9), 0))
                        .toLocaleString()}</div>
                      <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 16, marginBottom: 0 }}>{revenueData.totalChange} from last week</div>
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
                    <div style={{ fontWeight: 700, fontSize: 28, color: '#111' }}>Activity Overview</div>
                    <Button variant="outline-dark" size="sm" style={{ borderRadius: 10, fontWeight: 600, fontSize: 16, border: '1px solid #D1D5DB', background: '#fff', color: '#222', boxShadow: 'none' }}>View Details</Button>
                  </div>
                  <div style={{ height: '200px', marginTop: 16 }}>
                    <Doughnut
                      data={{
                        labels: ['Completed Projects', 'Questions Asked', 'Answers Given', 'Completed Sessions'],
                        datasets: [
                          {
                            data: [
                              developerProjects.filter(p => p.status === 'completed').length,
                              questions.length,
                              answers.length,
                              sessions.filter(s => s.status === 'completed').length
                            ],
                            backgroundColor: ['#A5D8FF', '#2563EB', '#3B82F6', '#60A5FA'],
                            hoverBackgroundColor: ['#60A5FA', '#1D4ED8', '#2563EB', '#3B82F6'],
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
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: '#A5D8FF', display: 'inline-block' }}></span>Projects</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: '#2563EB', display: 'inline-block' }}></span>Questions</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: '#3B82F6', display: 'inline-block' }}></span>Answers</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: '#60A5FA', display: 'inline-block' }}></span>Sessions</span>
                  </div>
                  <div className="text-center mt-2" style={{ color: '#222', fontWeight: 500, fontSize: 17 }}>
                    Total Activities: {
                      developerProjects.filter(p => p.status === 'completed').length +
                      questions.length +
                      answers.length +
                      sessions.filter(s => s.status === 'completed').length
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Rating and Feedback Section */}
            <div className="row g-4 mt-4">
              <div className="col-lg-6">
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 32, minHeight: 370, boxShadow: 'none', height: '100%' }}>
                  <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 18, color: '#111', letterSpacing: -1 }}>Ratings and Reviews</div>
                  {reviews.length > 0 ? (
                    <>
                      <div className="d-flex align-items-center mb-2" style={{ gap: 18 }}>
                        <span style={{ fontSize: 48, fontWeight: 700, color: '#111', lineHeight: 1 }}>{averageRating.toFixed(1)}</span>
                        <span style={{ fontSize: 32, color: '#FFD600', marginTop: 4 }}>
                          {'★'.repeat(Math.floor(averageRating))}
                          {averageRating % 1 >= 0.5 ? '★' : ''}
                          <span style={{ color: '#E5E7EB' }}>{'★'.repeat(5 - Math.ceil(averageRating))}</span>
                        </span>
                      </div>
                      <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 18, marginBottom: 18 }}>{totalRatings} ratings</div>
                      {/* Star bars */}
                      {[5, 4, 3, 2, 1].map((star, idx) => {
                        const count = reviews.filter(review => review.rating === star).length;
                        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                        return (
                          <div key={star} className="d-flex align-items-center mb-2" style={{ gap: 10 }}>
                            <span style={{ width: 60, fontWeight: 500, color: '#222', fontSize: 16 }}>{star} Star{star > 1 ? 's' : ''}:</span>
                            <div style={{ flex: 1, background: '#F3F4F6', borderRadius: 8, height: 10, position: 'relative' }}>
                              <div style={{ width: `${percentage}%`, background: '#111', height: 10, borderRadius: 8 }}></div>
                            </div>
                            <span style={{ width: 40, textAlign: 'right', color: '#6B7280', fontSize: 14 }}>{count}</span>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <div style={{ fontSize: 48, color: '#E5E7EB', marginBottom: 16 }}>★</div>
                      <div style={{ fontSize: 20, fontWeight: 600, color: '#111', marginBottom: 8 }}>No Reviews Yet</div>
                      <div style={{ color: '#6B7280', fontSize: 16 }}>Complete projects to receive reviews from clients</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-6">
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 32, minHeight: 370, boxShadow: 'none', height: '100%' }}>
                  <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 18, color: '#111', letterSpacing: -1 }}>Feedback</div>
                  <div style={{ maxHeight: 270, overflowY: 'auto', paddingRight: 8 }}>
                    {reviews && reviews.length > 0 ? (
                      reviews.map((review, index) => (
                        <div key={index} className="d-flex align-items-start mb-4" style={{ gap: 18 }}>
                          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: '#222', flexShrink: 0 }}>
                            {review.reviewerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 18, color: '#111', marginBottom: 2 }}>{review.reviewerName}</div>
                            <div style={{ color: '#6B7280', fontSize: 14, marginBottom: 2 }}>{review.reviewerRole}</div>
                            <div style={{ color: '#FFD600', fontSize: 18, marginBottom: 2 }}>
                              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </div>
                            <div style={{ color: '#222', fontSize: 16, lineHeight: 1.5 }}>{review.description}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ fontSize: 48, color: '#E5E7EB', marginBottom: 16 }}>💬</div>
                        <div style={{ fontSize: 20, fontWeight: 600, color: '#111', marginBottom: 8 }}>No Feedback Yet</div>
                        <div style={{ color: '#6B7280', fontSize: 16 }}>Your feedback will appear here once clients review your work</div>
                      </div>
                    )}
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
                    <h2>{sessions ? sessions.length : 0}</h2>
                  </Card.Body>
                </Card>
              </div>
            </div>

            {/* Small Cards for Project Types */}
            <div className="row g-4 mt-4">
              {(() => {
                // Get all completed projects
                const completedProjects = developerProjects.filter(p => p.status === 'completed');
                
                // Create a map to count skills
                const skillCounts = {};
                completedProjects.forEach(project => {
                  if (project.skills && Array.isArray(project.skills)) {
                    project.skills.forEach(skill => {
                      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
                    });
                  }
                });

                // Convert to array of objects for rendering
                const skillCards = Object.entries(skillCounts).map(([skill, count]) => ({
                  label: skill,
                  count: count
                }));

                // Sort by count in descending order
                skillCards.sort((a, b) => b.count - a.count);

                // Take top 4 skills
                const topSkills = skillCards.slice(0, 4);

                return topSkills.map((skill, index) => (
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
                        <h6>{skill.label} Projects</h6>
                        <h3>{skill.count}</h3>
                      </Card.Body>
                    </Card>
                  </div>
                ));
              })()}
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
                          {(() => {
                            const [startHour] = workingHours.from.split(':').map(Number);
                            const [endHour] = workingHours.to.split(':').map(Number);
                            const effectiveEndHour = endHour === 0 ? 24 : endHour;
                            return Array.from({ length: effectiveEndHour - startHour }, (_, i) => startHour + i).map(hour => (
                              <th key={hour} style={{ fontWeight: 600, color: '#6B7280', background: '#F9FAFB' }}>
                                {hour}:00 - {hour + 1}:00
                              </th>
                            ));
                          })()}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(schedule).map(day => (
                          <tr key={day}>
                            <td style={{ fontWeight: 600 }}>{day}</td>
                            {(() => {
                              const [startHour] = workingHours.from.split(':').map(Number);
                              const [endHour] = workingHours.to.split(':').map(Number);
                              const effectiveEndHour = endHour === 0 ? 24 : endHour;
                              return Array.from({ length: effectiveEndHour - startHour }, (_, i) => startHour + i).map(hour => {
                                const slot = `${hour}:00-${hour + 1}:00`;
                                const status = schedule[day][slot] || 'Not Available';
                                const isBooked = bookedSessions.some(session => {
                                  const sessionDate = new Date(session.date);
                                  const sessionDay = sessionDate.toLocaleDateString('en-US', { weekday: 'long' });
                                  const sessionStartTime = session.startTime;
                                  const sessionEndTime = session.endTime;
                                  return sessionDay === day && 
                                         sessionStartTime === slot.split('-')[0] && 
                                         sessionEndTime === slot.split('-')[1];
                                });
                                return (
                                  <td key={hour}>
                                    <span style={{
                                      display: 'inline-block',
                                      padding: '4px 16px',
                                      borderRadius: 16,
                                      fontWeight: 600,
                                      fontSize: 15,
                                      background: isBooked ? '#FEE2E2' : status === 'Available' ? '#D1FAE5' : '#F3F4F6',
                                      color: isBooked ? '#DC2626' : status === 'Available' ? '#059669' : '#6B7280',
                                    }}>{isBooked ? 'Booked' : status}</span>
                                  </td>
                                );
                              });
                            })()}
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
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 800, width: '100%', padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}>
            <button onClick={() => setShowScheduleModal(false)} style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', fontSize: 28, color: '#888', cursor: 'pointer' }}>×</button>
            <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Edit Weekly Schedule</h4>
            <div style={{ color: '#6B7280', marginBottom: 24 }}>Select the time slots when you are available for sessions. Clients will be able to book sessions during these times.</div>
            {Object.keys(editSchedule).map(day => (
              <div key={day} style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 6 }}>{day}</div>
                <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                  {(() => {
                    const [startHour] = workingHours.from.split(':').map(Number);
                    const [endHour] = workingHours.to.split(':').map(Number);
                    const effectiveEndHour = endHour === 0 ? 24 : endHour;
                    return Array.from({ length: effectiveEndHour - startHour }, (_, i) => startHour + i).map(hour => {
                      const slot = `${hour}:00-${hour + 1}:00`;
                      const isBooked = bookedSessions.some(session => {
                        const sessionDate = new Date(session.date);
                        const sessionDay = sessionDate.toLocaleDateString('en-US', { weekday: 'long' });
                        const sessionStartTime = session.startTime;
                        const sessionEndTime = session.endTime;
                        return sessionDay === day && 
                               sessionStartTime === slot.split('-')[0] && 
                               sessionEndTime === slot.split('-')[1];
                      });
                      return (
                        <label key={hour} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 8, 
                          fontWeight: 500, 
                          fontSize: 15, 
                          cursor: isBooked ? 'not-allowed' : 'pointer',
                          color: isBooked ? '#DC2626' : editSchedule[day][slot] === 'Available' ? '#059669' : '#6B7280'
                        }}>
                          <input
                            type="checkbox"
                            checked={editSchedule[day][slot] === 'Available'}
                            onChange={() => handleScheduleChange(day, slot)}
                            disabled={isBooked}
                            style={{ 
                              accentColor: editSchedule[day][slot] === 'Available' ? '#059669' : '#6B7280',
                              width: 18, 
                              height: 18 
                            }}
                          />
                          {hour}:00 - {hour + 1}:00
                          {isBooked && <span style={{ color: '#DC2626', fontSize: 13 }}>(Booked)</span>}
                        </label>
                      );
                    });
                  })()}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
              <Button variant="outline-secondary" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSaveSchedule()}>Save Changes</Button>
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
                    <div style={{ fontWeight: 700, fontSize: 32, color: '#111', marginBottom: 8 }}>{revenueData.total.toLocaleString()}</div>
                    <div style={{ color: '#22C55E', fontWeight: 600, fontSize: 16, background: '#ECFDF5', borderRadius: 8, display: 'inline-block', padding: '2px 12px' }}>↑ {revenueData.totalChange}</div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 32, height: '100%' }}>
                    <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 2 }}>Monthly Average</div>
                    <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Last 12 months</div>
                    <div style={{ fontWeight: 700, fontSize: 32, color: '#111', marginBottom: 8 }}>{revenueData.monthly.toLocaleString()}</div>
                    <div style={{ color: '#22C55E', fontWeight: 600, fontSize: 16, background: '#ECFDF5', borderRadius: 8, display: 'inline-block', padding: '2px 12px' }}>↑ {revenueData.monthlyChange}</div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 32, height: '100%' }}>
                    <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 2 }}>Projected Annual</div>
                    <div style={{ color: '#6B7280', fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Based on current growth</div>
                    <div style={{ fontWeight: 700, fontSize: 32, color: '#111', marginBottom: 8 }}>{revenueData.annual.toLocaleString()}</div>
                    <div style={{ color: '#22C55E', fontWeight: 600, fontSize: 16, background: '#ECFDF5', borderRadius: 8, display: 'inline-block', padding: '2px 12px' }}>↑ {revenueData.annualChange}</div>
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
