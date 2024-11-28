import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Event.css';

const Event = () => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleViewEvents = () => {
    navigate('/events'); // Navigate to the events page
  };

  return (
    <div className="feature event">
      <h3>Upcoming Events</h3>
      <p>Stay updated with our latest events and community activities.</p>
      <button className="event-button" onClick={handleViewEvents}>
        View Events
      </button>
    </div>
  );
};

export default Event;
