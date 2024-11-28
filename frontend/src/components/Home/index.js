import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to NonprofitNetwork</h1>
        <p className="hero-text">Connect, Engage, and Create Impact with Your Community</p>
      </div>

      <div className="features-section">
        <h2>Our Platform Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Community Events</h3>
            <p>Create and join events, connect with attendees, and build meaningful relationships.</p>
            <Link to="/events" className="feature-link">Explore Events</Link>
          </div>

          <div className="feature-card">
            <h3>Fundraising Hub</h3>
            <p>Launch campaigns, process donations, and track your fundraising progress.</p>
            <Link to="/fundraising-hub" className="feature-link">Start Fundraising</Link>
          </div>

          <div className="feature-card">
            <h3>News & Updates</h3>
            <p>Stay informed with the latest news and updates from your community.</p>
            <Link to="/news" className="feature-link">Read News</Link>
          </div>

          <div className="feature-card">
            <h3>Support Center</h3>
            <p>Get assistance with our AI-powered customer service and support team.</p>
            <Link to="/customer-service" className="feature-link">Get Support</Link>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Join Our Growing Community</h2>
        <p>Connect with nonprofits, donors, and volunteers making a difference.</p>
        <div className="cta-buttons">
          <Link to="/signup" className="cta-button primary">Get Started</Link>
          <Link to="/about" className="cta-button secondary">Learn More</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
