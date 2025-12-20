import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES, ROLES } from '../constants';
import '../styles/Layout.css';

const MainLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <img src="/movie-logo.svg" alt="Movie Logo" className="header-logo" />
            {currentUser && currentUser.role === ROLES.VIEWER && (
              <nav className="header-nav">
                <Link 
                  to={ROUTES.VIEWER_RECOMMENDATIONS} 
                  className={`header-nav-link ${location.pathname === ROUTES.VIEWER_RECOMMENDATIONS ? 'active' : ''}`}
                >
                  Recommendations
                </Link>
                <Link 
                  to={ROUTES.VIEWER_MOVIES} 
                  className={`header-nav-link ${location.pathname === ROUTES.VIEWER_MOVIES ? 'active' : ''}`}
                >
                  All Movies
                </Link>
              </nav>
            )}
          </div>
          {currentUser && (
            <div className="header-user">
              <span className="user-name">{currentUser.username}</span>
              <span className="user-role">({currentUser.role})</span>
              <button onClick={logout} className="btn-logout">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

