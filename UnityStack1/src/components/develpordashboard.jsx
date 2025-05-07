import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import ComHeader from '../components/header';
import ComSidebar from '../components/sidebar';

const DeveloperDashboard = () => {
  const [selectedPage, setSelectedPage] = useState('dashboard'); // Default page

  const handleSidebarSelection = (page) => {
    setSelectedPage(page); // Update selected page based on sidebar selection
  };

  const renderContent = () => {
    if (selectedPage === 'messages') {
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
        <div className="dashboard-content">
          {/* Top Section */}
          <div className="row g-4">
            <div className="col-lg-6">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>Revenue</h5>
                    <Button variant="outline-primary" size="sm">
                      View Report
                    </Button>
                  </div>
                  <h2>PKR 7,852,000</h2>
                  <small className="text-muted">+2% from last week</small>
                  <div style={{ height: '200px' }}>
                    <Line
                      data={{
                        labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
                        datasets: [
                          {
                            label: 'Sales',
                            data: [100, 120, 150, 170, 180, 200, 220, 230, 250, 280],
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </div>

            <div className="col-lg-6">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>Order Time</h5>
                    <Button variant="outline-primary" size="sm">
                      View Report
                    </Button>
                  </div>
                  <div style={{ height: '200px' }}>
                    <Doughnut
                      data={{
                        labels: ['Afternoon', 'Evening', 'Morning'],
                        datasets: [
                          {
                            data: [32, 25, 43],
                            backgroundColor: ['#ADD8E6', '#4682B4', '#1E90FF'],
                            hoverBackgroundColor: ['#87CEFA', '#4169E1', '#0000FF'],
                          },
                        ],
                      }}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                  <p className="text-center mt-3">Afternoon orders: 32%</p>
                </Card.Body>
              </Card>
            </div>
          </div>

          {/* Rating and Feedback Section */}
          <div className="row g-4 mt-4">
            <div className="col-lg-6">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <h5>Ratings and Reviews</h5>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="rating-left">
                      <h2>4.6</h2>
                      <div style={{ color: 'gold' }}>
                        ★★★★☆
                      </div>
                      <p>189,561 ratings</p>
                    </div>
                    <div className="rating-bars">
                      <p>5 Stars: <span style={{ color: 'blue' }}>████████████████</span></p>
                      <p>4 Stars: <span style={{ color: 'blue' }}>██████</span></p>
                      <p>3 Stars: <span style={{ color: 'blue' }}>████</span></p>
                      <p>2 Stars: <span style={{ color: 'blue' }}>██</span></p>
                      <p>1 Star: <span style={{ color: 'blue' }}>█</span></p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>

            <div className="col-lg-6">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <h5>Feedback</h5>
                  <div
                    className="feedback-container"
                    style={{ maxHeight: '300px', overflowY: 'auto' }}
                  >
                    {[
                      {
                        img: 'https://via.placeholder.com/50',
                        name: 'Dileep Singh',
                        stars: 5,
                        comment: "It's fantastic to stay connected with clients via a mobile app, allowing for prompt and frequent responses to their project needs.",
                      },
                      {
                        img: 'https://via.placeholder.com/50',
                        name: 'John Doe',
                        stars: 4,
                        comment: 'The new updates have improved the experience significantly. Great work!',
                      },
                      {
                        img: 'https://via.placeholder.com/50',
                        name: 'Jane Smith',
                        stars: 5,
                        comment: 'I appreciate the quick response time and the helpful features.',
                      },
                      {
                        img: 'https://via.placeholder.com/50',
                        name: 'Michael Lee',
                        stars: 3,
                        comment: 'Some features could be streamlined, but overall a great platform.',
                      },
                    ].map((feedback, index) => (
                      <div key={index} className="d-flex align-items-start mb-3">
                        <img
                          src={feedback.img}
                          alt={feedback.name}
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            marginRight: '15px',
                          }}
                        />
                        <div>
                          <h6 className="mb-0">{feedback.name}</h6>
                          <div style={{ color: 'gold' }}>
                            {'★'.repeat(feedback.stars)}
                            {'☆'.repeat(5 - feedback.stars)}
                          </div>
                          <p className="mb-0">{feedback.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
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
                    <Button variant="primary" size="sm">
                      View all project
                    </Button>
                  </div>
                  <h2>182</h2>
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
                    <Button variant="primary" size="sm">
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
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>Time Slots</h5>
                    <Button variant="outline-primary" size="sm">View Report</Button>
                  </div>
                  <div className="table-container overflow-auto" style={{ maxHeight: '365px' }}>
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>Days</th>
                          <th>9 AM - 12 PM</th>
                          <th>12 PM - 3 PM</th>
                          <th>3 PM - 6 PM</th>
                          <th>6 PM - 9 PM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { day: 'Monday', slots: ['Booked', 'Free', '', 'Booked'] },
                          { day: 'Tuesday', slots: ['', 'Booked', 'Free', 'Booked'] },
                          { day: 'Wednesday', slots: ['Booked', '', 'Booked', ''] },
                          { day: 'Thursday', slots: ['', 'Free', '', 'Free'] },
                          { day: 'Friday', slots: ['Booked', '', '', 'Free'] },
                          { day: 'Saturday', slots: ['', 'Free', '', ''] },
                        ].map((timeSlot, index) => (
                          <tr key={index}>
                            <td>{timeSlot.day}</td>
                            {timeSlot.slots.map((slot, i) => (
                              <td key={i} className={slot === 'Booked' ? 'bg-danger text-white' : 'bg-success text-white'}>
                                {slot}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <ComHeader />

      <div className="d-flex">
        <ComSidebar onSelectPage={handleSidebarSelection} />

        <div
          className="container mt-4"
          style={{ marginLeft: '10px', flexGrow: 1, paddingBottom: '50px' }}
        >
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default DeveloperDashboard;
