import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUsers, faBuilding, faQuestion, faInfoCircle, faBook } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import profileImage from '../assets/vector.png';

const ComSidebar = ({ onSelectPage }) => {
  const location = useLocation();

  const handleNavigation = (path) => {
    onSelectPage(path);
  };

  return (
    <>
      {/* Sidebar for Larger Screens */}
      <aside
        className="d-none d-lg-block bg-light shadow-sm"
        style={{
          width: '240px',
          height: 'calc(100vh - 60px)', // Increased sidebar height
          margin: '16px',
        }}
      >
        {/* Profile Section */}
        <div className="text-center">
          <img
            src={profileImage}
            alt="Vector"
            className="img-fluid"
            style={{
              width: '120px', // Increased width of vector image
              height: '120px', // Increased height of vector image
              marginTop: '20px',
            }}
          />
          <div className="mt-3">
            <p className="fw-bold mb-0" style={{ fontSize: '1rem' }}>
              Welcome
            </p>
            <p className="text-muted small" style={{ fontSize: '0.9rem' }}>
              Explore the sections
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4">
          <ul className="list-unstyled">
            <li
              className="d-flex align-items-center px-4 py-2 text-dark"
              onClick={() => handleNavigation('home')}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faHouse} className="me-3" />
              Home
            </li>
            <li
              className="d-flex align-items-center px-4 py-2 text-dark"
              onClick={() => handleNavigation('developers')}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faUsers} className="me-3" />
              Developers
            </li>
            <li
              className="d-flex align-items-center px-4 py-2 text-dark"
              onClick={() => handleNavigation('companies')}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faBuilding} className="me-3" />
              Companies
            </li>
            <li
              className="d-flex align-items-center px-4 py-2 text-dark"
              onClick={() => handleNavigation('questions')}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faQuestion} className="me-3" />
              Questions
            </li>
            <li
              className="d-flex align-items-center px-4 py-2 text-dark"
              onClick={() => handleNavigation('about')}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faInfoCircle} className="me-3" />
              About Us
            </li>
            <li
              className="d-flex align-items-center px-4 py-2 text-dark"
              onClick={() => handleNavigation('faq')}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faBook} className="me-3" />
              FAQ
            </li>
          </ul>
        </nav>
      </aside>

      {/* Bottom Navbar for Smaller Screens */}
      <nav
        className="d-lg-none bg-light border-top position-fixed bottom-0 w-100"
        style={{ height: '60px', zIndex: 999 }}
      >
        <ul className="d-flex justify-content-around align-items-center list-unstyled m-0 p-0 h-100">
          {[ 
            { icon: faHouse, label: 'Home', path: 'home' },
            { icon: faUsers, label: 'Developers', path: 'developers' },
            { icon: faBuilding, label: 'Companies', path: 'companies' },
            { icon: faQuestion, label: 'Questions', path: 'questions' },
            { icon: faInfoCircle, label: 'About Us', path: 'about' },
          ].map(({ icon, label, path }) => (
            <li
              key={path}
              onClick={() => handleNavigation(path)}
              className="d-flex flex-column align-items-center justify-content-center"
              style={{ cursor: 'pointer', width: '20%' }}
            >
              <FontAwesomeIcon icon={icon} style={{ fontSize: '1.5rem' }} />
              <span className="small" style={{ fontSize: '0.85rem' }}>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default ComSidebar;
