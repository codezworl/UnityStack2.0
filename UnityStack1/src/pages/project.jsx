import React, { useState } from 'react';
import { Table, Button, Dropdown } from 'react-bootstrap';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProjectTable = () => {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState([
    { name: 'AI Model Development', author: 'John Doe', status: 'Completed' },
    { name: 'E-commerce Website', author: 'Jane Smith', status: 'In Progress' },
    { name: 'Mobile App Design', author: 'Michael Lee', status: 'Completed' },
    { name: 'Backend Optimization', author: 'Alice Brown', status: 'In Progress' },
    { name: 'UI Redesign', author: 'David Johnson', status: 'Completed' },
  ]);

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return project.status === 'Completed';
    if (filter === 'In Progress') return project.status === 'In Progress';
    if (filter === 'Oldest') return true; // Implement sorting logic below
    if (filter === 'Latest') return true; // Implement sorting logic below
  });

  const sortedProjects = filteredProjects.sort((a, b) => {
    if (filter === 'Oldest') return projects.indexOf(a) - projects.indexOf(b);
    if (filter === 'Latest') return projects.indexOf(b) - projects.indexOf(a);
    return 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Header />

      <div style={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f8f9fa' }}>
          <div className="project-table-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 style={{ color: '#007bff', fontWeight: 'bold' }}>Work</h5>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="filter-dropdown">
                  Filter: {filter}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleFilterChange('All')}>All</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilterChange('Completed')}>Completed</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilterChange('In Progress')}>In Progress</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilterChange('Oldest')}>Oldest</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilterChange('Latest')}>Latest</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <Table striped bordered hover className="shadow-sm" style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
                <tr>
                  <th>Project Name</th>
                  <th>Author Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProjects.map((project, index) => (
                  <tr key={index} style={{ textAlign: 'center' }}>
                    <td>{project.name}</td>
                    <td>{project.author}</td>
                    <td>
                      <span
                        style={{
                          padding: '5px 10px',
                          borderRadius: '15px',
                          color: project.status === 'Completed' ? 'white' : '#333',
                          backgroundColor: project.status === 'Completed' ? '#28a745' : '#ffc107',
                        }}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTable;
