import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./header";
import StudentSidebar from "../components/sidebar"; // ✅ Ensure correct path
import FindDeveloper from '../pages/finddevelpor';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("dashboard"); // Default page
  const navigate = useNavigate();
  const [topQuestions, setTopQuestions] = useState([]);
  const [topDevelopers, setTopDevelopers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSidebarSelection = (page) => {
    setSelectedPage(page); // Update selected page based on sidebar selection
  };

  const handleLiveHelpClick = () => {
    navigate('/Getexperthelp');
  };

  const handleProjectHelpClick = () => {
    navigate('/finddevelpor');
  };

  const handleAskQuestionClick = () => {
    navigate('/question');
  };

  // Fetch top questions and developers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch top questions
        const questionsResponse = await fetch('http://localhost:5000/api/questions?sortBy=mostViewed');
        if (!questionsResponse.ok) throw new Error('Failed to fetch questions');
        const questionsData = await questionsResponse.json();
        setTopQuestions(questionsData.questions?.slice(0, 3) || []);

        // Fetch top developers
        const developersResponse = await fetch('http://localhost:5000/api/developers');
        if (!developersResponse.ok) throw new Error('Failed to fetch developers');
        const developersData = await developersResponse.json();
        const sortedDevelopers = (developersData || [])
          .sort((a, b) => (b.expertise?.length || 0) - (a.expertise?.length || 0))
          .slice(0, 2);
        setTopDevelopers(sortedDevelopers);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setTopQuestions([]);
        setTopDevelopers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (selectedPage === 'finddeveloper') {
      return <FindDeveloper />;
    }

    if (isLoading) {
      return (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger m-3" role="alert">
          {error}
        </div>
      );
    }

    return (
      <div className="dashboard-content">
        <div className="row g-4">
          {/* Quick Action Cards */}
          <div className="col-lg-4">
            <div 
              className="card text-center shadow-sm p-3" 
              onClick={handleLiveHelpClick}
              style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '16px'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
            >
              <i className="bi bi-chat-dots fs-1"></i>
              <h5 className="mt-3" style={{ fontWeight: '600' }}>Get Live Help</h5>
              <p style={{ opacity: '0.9' }}>1:1 mentorship session</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div 
              className="card text-center shadow-sm p-3" 
              onClick={handleProjectHelpClick}
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '16px'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
            >
              <i className="bi bi-code-slash fs-1"></i>
              <h5 className="mt-3" style={{ fontWeight: '600' }}>Get Project Help</h5>
              <p style={{ opacity: '0.9' }}>Find best developer for help</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div 
              className="card text-center shadow-sm p-3" 
              onClick={handleAskQuestionClick}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '16px'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
            >
              <i className="bi bi-question-circle fs-1"></i>
              <h5 className="mt-3" style={{ fontWeight: '600' }}>Ask a Question</h5>
              <p style={{ opacity: '0.9' }}>Get expert opinion</p>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="row g-4 mt-4">
          <div className="col-lg-8">
            {/* Membership Promo Section */}
            <div className="card mb-4 shadow-sm">
              <div className="card-body d-flex align-items-center">
                <i className="bi bi-gift-fill fs-1 text-info"></i>
                <div className="ms-3">
                  <h5>Enhance your skill With us</h5>
                  <p className="text-muted">
                    Maximize developers of every domain always available for you.
                  </p>
                  <Link to="/aboutus" className="text-primary" style={{ textDecoration: 'none' }}>
                    Learn more about Us →
                  </Link>
                </div>
              </div>
            </div>

            {/* Find Mentors Section */}
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Find Mentors</h5>
                <Link to="/Getexperthelp" className="btn btn-sm btn-outline-primary">View More</Link>
              </div>
              <div className="card-body">
                {topDevelopers && topDevelopers.length > 0 ? (
                  topDevelopers.map((developer, index) => (
                    <div key={index} className="d-flex align-items-center mb-4 p-3" style={{ 
                      background: '#fff', 
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
                      <img
                        src={developer.profileImage || "https://via.placeholder.com/50"}
                        alt={developer.firstName}
                        className="rounded-circle"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                      <div className="ms-3 flex-grow-1">
                        <h6 className="mb-1" style={{ fontWeight: '600' }}>{`${developer.firstName} ${developer.lastName}`}</h6>
                        <p className="text-muted mb-1">{developer.expertise?.[0]?.domain || 'No expertise listed'}</p>
                        <div className="d-flex gap-2 mb-2">
                          {developer.domainTags?.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="badge bg-light text-dark" style={{ fontSize: '12px' }}>{tag}</span>
                          ))}
                        </div>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/profile/${developer._id}`)}
                            style={{ fontSize: '14px' }}
                          >
                            View Profile
                          </button>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => navigate('/chat')}
                            style={{ fontSize: '14px' }}
                          >
                            Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center mb-0">No developers available</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-lg-4">
            {/* Top Questions Section */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Top Questions</h5>
                <Link to="/question" className="btn btn-sm btn-outline-primary">View More</Link>
              </div>
              <div className="card-body">
                {topQuestions && topQuestions.length > 0 ? (
                  topQuestions.map((question, index) => (
                    <div key={index} className="mb-3 pb-3 border-bottom">
                      <h6 className="mb-1">{question.title}</h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="bi bi-eye me-2"></i>{question.views || 0} views
                          <i className="bi bi-chat ms-3 me-2"></i>{question.answers?.length || 0} answers
                        </small>
                        <small className="text-muted">{new Date(question.createdAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center mb-0">No questions available</p>
                )}
              </div>
            </div>

            {/* Help & Support Section */}
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>Help & Support</h6>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <Link to="/Getexperthelp" className="text-primary" style={{ textDecoration: 'none' }}>
                      How do live 1:1 sessions work?
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/finddevelpor" className="text-primary" style={{ textDecoration: 'none' }}>
                      How do I hire for freelance work?
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/contact" className="text-primary" style={{ textDecoration: 'none' }}>
                      Contact our support team
                    </Link>
                  </li>
                  <li>
                    <Link to="/feedback" className="text-primary" style={{ textDecoration: 'none' }}>
                      Share your feedback
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />

      <div className="d-flex">
        {/* Sidebar */}
        <div
          style={{
            width: "20%",
            backgroundColor: "#f8f9fa",
            height: "100vh",
            borderRight: "1px solid #ddd",
          }}
        >
          <StudentSidebar onSelectPage={handleSidebarSelection} />
        </div>

        {/* Main Content */}
        <div
          className="flex-grow-1"
          style={{
            padding: "20px",
            overflowY: "auto",
            backgroundColor: "#f4f6f9",
          }}
        >
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
