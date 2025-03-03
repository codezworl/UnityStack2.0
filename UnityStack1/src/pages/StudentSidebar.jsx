import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faChartSimple, faComments, faProjectDiagram, faVideo, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import profileBg from '../assets/silver1.jpeg';
import profileImage from '../assets/logo.jpg';

const Sidebar = ({ onSelectPage }) => {
  const location = useLocation();

  // Determine the user role based on the URL
  const userRole = location.pathname.includes('developerdashboard') ? 'Developer' : 'Student';

  const handleNavigation = (path) => {
    onSelectPage(path);
  };

  return (
    <>
      {/* Sidebar for Larger Screens */}
      <aside
        className="d-none d-lg-block bg-light shadow-sm"
        style={{
          width: '243px', // Further reduced the width by 10% (from 270px to 243px)
          height: 'calc(100vh - 120px)',
          margin: '24px',
        }}
      >
        {/* Profile Section */}
        <div className="text-center position-relative">
          <img
            src={profileBg}
            alt="Profile Background"
            className="img-fluid"
            style={{
              width: '100%',
              height: '120px',
              objectFit: 'cover',
            }}
          />
          <img
            src={profileImage}
            alt="Profile"
            className="rounded-circle border border-3 border-white position-absolute"
            style={{
              width: '70px',
              height: '70px',
              top: '70px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
          <div className="mt-5">
            <p className="fw-bold mb-0" style={{ fontSize: '1.2rem' }}>
              Ahmed Ali
            </p>
            <p className="text-muted small" style={{ fontSize: '1rem' }}>
              {userRole}
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
              <a
                href="/studentdashboard"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                Dashboard
              </a>
            </li>
            <li
              className="d-flex align-items-center px-4 py-2 text-dark"
              onClick={() => handleNavigation('dashboard')}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faChartSimple} className="me-3" />
              <a
                href="/account"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                Account
              </a>
            </li>
            <li
              className="d-flex align-items-center px-4 py-2 text-dark"
              onClick={() => handleNavigation('chat')}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faComments} className="me-3" />
              <a
                href="/chat"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                Chat
              </a>
            </li>
            <li
              className="d-flex align-items-center px-4 py-2 text-dark"
              onClick={() => handleNavigation('projects')}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faProjectDiagram} className="me-3" />
              <a
                href="/sessionShedule"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                Schedule Session
              </a>
            </li>
            <li
              className="d-flex align-items-center px-4 py-2 text-dark"
              onClick={() => handleNavigation('sessions')}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faVideo} className="me-3" />
              <a
                href="/SessionHistory"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                Session History
              </a>
            </li>
          </ul>
        </nav>

        {/* Log Out Button */}
        <div className="mt-5 px-4">
          <button
            className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
            onClick={() => handleNavigation('logout')}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Bottom Navbar for Smaller Screens */}
      <nav
        className="d-lg-none bg-light border-top position-fixed bottom-0 w-100"
        style={{ height: '60px', zIndex: 999 }}
      >
        <ul className="d-flex justify-content-around align-items-center list-unstyled m-0 p-0 h-100">
          {[
            { icon: faHouse, label: 'Home', path: 'home' },
            { icon: faChartSimple, label: 'Dashboard', path: 'dashboard' },
            { icon: faComments, label: 'Chat', path: 'chat' },
            { icon: faProjectDiagram, label: 'Projects', path: 'projects' },
            { icon: faVideo, label: 'Sessions', path: 'sessions' },
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

export default Sidebar;
