import React, { useState } from 'react';
import { Card, Table, ProgressBar, Button } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import ComHeader from '../components/header';
import ComSidebar from '../components/Sidebar';


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
      // Add condition for Discussion Forum
      return (
        <div className="discussion-forum-container">
          <h5 className="text-center">Discussion Forum</h5>
          <DiscussionForum /> {/* Render the DiscussionForum component */}
        </div>
      );
    } else {
      // Default: Dashboard content
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

          {/* Rating and Orders Section */}
          <div className="row g-4 mt-4">
            <div className="col-lg-6">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <h5>Your Rating</h5>
                  <div className="d-flex justify-content-between align-items-center">
                    <div style={{ width: '80px' }}>
                      <Doughnut
                        data={{
                          datasets: [
                            {
                              data: [85, 100 - 85],
                              backgroundColor: ['#FFCE56', '#E0E0E0'],
                              hoverBackgroundColor: ['#FFCE56', '#E0E0E0'],
                            },
                          ],
                        }}
                        options={{ cutout: '75%' }}
                      />
                      <p className="text-center">Communication (85%)</p>
                    </div>
                    <div style={{ width: '80px' }}>
                      <Doughnut
                        data={{
                          datasets: [
                            {
                              data: [85, 100 - 85],
                              backgroundColor: ['#36A2EB', '#E0E0E0'],
                              hoverBackgroundColor: ['#36A2EB', '#E0E0E0'],
                            },
                          ],
                        }}
                        options={{ cutout: '75%' }}
                      />
                      <p className="text-center">Quality (85%)</p>
                    </div>
                    <div style={{ width: '80px' }}>
                      <Doughnut
                        data={{
                          datasets: [
                            {
                              data: [92, 100 - 92],
                              backgroundColor: ['#4BC0C0', '#E0E0E0'],
                              hoverBackgroundColor: ['#4BC0C0', '#E0E0E0'],
                            },
                          ],
                        }}
                        options={{ cutout: '75%' }}
                      />
                      <p className="text-center">Delivery Time (92%)</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>

            <div className="col-lg-6">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <h5>Orders</h5>
                  <small>2,568 orders this week</small>
                  <div style={{ height: '200px' }}>
                    <Line
                      data={{
                        labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
                        datasets: [
                          {
                            label: 'Orders',
                            data: [80, 100, 130, 140, 160, 170, 180, 220, 260, 300],
                            borderColor: '#FF6384',
                            fill: false,
                          },
                        ],
                      }}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>

{/* Participants and Projects Section */}
{/* Participants and Projects Section */}
<div className="row g-4 mt-4">
  <div className="col-lg-6">
    {/* Projects */}
    <Card className="projects-card shadow-sm h-100">
      <Card.Body>
        <h5>Projects</h5>
        <div className="table-container overflow-auto" style={{ maxHeight: '365px' }}>
          <Table striped bordered hover size="sm" responsive>
            <thead>
              <tr>
                <th>Company</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Chakra Soft UI Version', budget: '$14,000', status: 'Working', completion: 60 },
                { name: 'Add Progress Track', budget: '$3,500', status: 'Canceled', completion: 0 },
                { name: 'Fix Platform Errors', budget: '$2,500', status: 'Done', completion: 100 },
                { name: 'Launch Mobile App', budget: '$32,000', status: 'Done', completion: 100 },
                { name: 'Add New Pricing Page', budget: '$400', status: 'Working', completion: 25 },
                { name: 'Build Admin Dashboard', budget: '$20,000', status: 'Working', completion: 45 },
                { name: 'Optimize Backend APIs', budget: '$10,500', status: 'In Progress', completion: 70 },
                { name: 'Deploy Marketing Website', budget: '$5,000', status: 'Done', completion: 100 },
                { name: 'Design New UI', budget: '$7,800', status: 'Working', completion: 50 },
                { name: 'Integrate Payment Gateway', budget: '$12,000', status: 'In Progress', completion: 35 },
              ].map((project, index) => (
                <tr key={index}>
                  <td>{project.name}</td>
                  <td>{project.budget}</td>
                  <td>{project.status}</td>
                  <td>
                    <ProgressBar now={project.completion} label={`${project.completion}%`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  </div>

  <div className="col-lg-6">
    {/* Participants */}
    <Card className="participants-card shadow-sm h-100">
      <Card.Body>
        <h5>Participants</h5>
        <div className="table-container overflow-auto" style={{ maxHeight: '365px' }}>
          <Table striped bordered hover size="sm" responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Message</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Esthera Jackson', message: 'I will need more information...', action: 'Reply' },
                { name: 'Esthera Jackson', message: 'Awesome work, can you change...', action: 'Reply' },
                { name: 'Esthera Jackson', message: 'Have a great afternoon...', action: 'Reply' },
                { name: 'Esthera Jackson', message: 'About files I can...', action: 'Reply' },
                { name: 'John Doe', message: 'Need your input on this...', action: 'Reply' },
                { name: 'Jane Smith', message: 'Let’s discuss further...', action: 'Reply' },
              ].map((participant, index) => (
                <tr key={index}>
                  <td>{participant.name}</td>
                  <td>{participant.message}</td>
                  <td>
                    <Button variant="link">{participant.action}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  </div>
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
          <Table striped bordered hover size="sm" responsive>
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
          </Table>
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
      {/* Header */}
      <ComHeader />

      <div className="d-flex">
        {/* Sidebar */}
        <ComSidebar onSelectPage={handleSidebarSelection} />

        {/* Main Content */}
        <div className="container mt-4" style={{ marginLeft: '10px', flexGrow: 1, paddingBottom: '50px' }}>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default DeveloperDashboard;
