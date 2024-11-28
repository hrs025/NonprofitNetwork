import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-content">
        <h2>About NonprofitNetwork</h2>
        <p className="mission-statement">
          NonprofitNetwork is a comprehensive platform dedicated to connecting nonprofits, donors, volunteers, and communities. We provide the digital infrastructure needed to facilitate meaningful engagement, successful fundraising, and impactful community events.
        </p>

        <h3>Our Platform</h3>
        <p>
          NonprofitNetwork serves as a central hub where nonprofit organizations can manage their events, engage with supporters, and coordinate their fundraising efforts. We believe in the power of technology to amplify social impact and strengthen community bonds.
        </p>

        <div className="features-grid">
          <div className="feature-box">
            <h4>Event Management</h4>
            <p>Create, manage, and promote community events. Track attendance and engage with participants before, during, and after events.</p>
          </div>

          <div className="feature-box">
            <h4>Community Engagement</h4>
            <p>Build and nurture relationships within your community. Share updates, stories, and celebrate achievements together.</p>
          </div>

          <div className="feature-box">
            <h4>Fundraising Tools</h4>
            <p>Launch and manage fundraising campaigns, process donations securely, and track progress in real-time.</p>
          </div>

          <div className="feature-box">
            <h4>Smart Support</h4>
            <p>Access AI-powered customer service, automated receipt management, and fraud protection features.</p>
          </div>
        </div>

        <h3>Why Choose NonprofitNetwork?</h3>
        <ul className="benefits-list">
          <li><strong>Centralized Management:</strong> All your nonprofit needs in one platform</li>
          <li><strong>Community Focus:</strong> Built specifically for nonprofit organizations and their supporters</li>
          <li><strong>Easy to Use:</strong> Intuitive interface designed for users of all technical levels</li>
          <li><strong>Secure & Reliable:</strong> Advanced security measures to protect your organization and donors</li>
        </ul>

        <div className="cta-section">
          <h3>Ready to Join Our Network?</h3>
          <p>
            Start connecting with your community and making a bigger impact today.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-button primary">Get Started</Link>
            <Link to="/events" className="cta-button secondary">Explore Events</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
