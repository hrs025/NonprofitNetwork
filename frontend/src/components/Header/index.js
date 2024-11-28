import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          NonprofitNetwork
        </Link>

        <nav className="nav-menu">
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/events" className="nav-link">Events</Link>
            <Link to="/news" className="nav-link">News</Link>
            {user && <Link to="/fundraising-hub" className="nav-link">Fundraising</Link>}
            {user && <Link to="/customer-service" className="nav-link">Customer Service</Link>}
          </div>

          <div className="auth-buttons">
            {user ? (
              <>
                <Link to="/profile" className="profile-button">
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-button">Login</Link>
                <Link to="/signup" className="signup-button">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
