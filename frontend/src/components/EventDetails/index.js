import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/events/${id}`);
        setEvent(response.data);
        
        // Check if current user is registered
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && response.data.attendees) {
          const isUserRegistered = response.data.attendees.some(
            attendee => attendee._id === userData._id
          );
          setIsRegistered(isUserRegistered);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching event details', error);
        if (error.response && error.response.status === 404) {
          setMessage('Event not found.');
        } else {
          setMessage('Error fetching event details.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      setMessage('Please log in to register for events.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:3000/api/events/register/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Successfully registered for the event!');
      setIsRegistered(true);
      setEvent(response.data.event);
    } catch (error) {
      console.error('Error registering for event', error);
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message || 'Already registered for this event.');
      } else {
        setMessage('Failed to register for the event. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className="event-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-not-found">
        <i className="fas fa-calendar-times"></i>
        <h2>Event Not Found</h2>
        <p>{message}</p>
        <Link to="/events" className="back-to-events">Return to Events</Link>
      </div>
    );
  }

  return (
    <div className="event-details-page">
      <div className="event-details-container">
        {message && (
          <div className={`message-banner ${message.includes('Success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="event-header">
          <div className="event-title-section">
            <div className="date-badge">
              <span className="month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
              <span className="day">{new Date(event.date).getDate()}</span>
            </div>
            <h1>{event.title}</h1>
          </div>

          <div className="event-meta">
            <div className="meta-item">
              <i className="far fa-clock"></i>
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="meta-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>{event.location}</span>
            </div>
            <div className="meta-item">
              <i className="fas fa-users"></i>
              <span>{event.attendees ? event.attendees.length : 0} Attendees</span>
            </div>
          </div>
        </div>

        <div className="event-content">
          <div className="event-description">
            <h2>About This Event</h2>
            <p>{event.description}</p>
          </div>

          <div className="registration-section">
            {user ? (
              isRegistered ? (
                <div className="registered-badge">
                  <i className="fas fa-check-circle"></i>
                  <span>You're registered for this event</span>
                </div>
              ) : (
                <button onClick={handleRegister} className="register-button">
                  Register for Event
                </button>
              )
            ) : (
              <div className="login-prompt">
                <p>Please log in to register for this event</p>
                <Link to="/login" className="login-button">Log In</Link>
              </div>
            )}
          </div>

          <div className="attendees-section">
            <h2>Attendees ({event.attendees ? event.attendees.length : 0})</h2>
            {event.attendees && event.attendees.length > 0 ? (
              <div className="attendees-grid">
                {event.attendees.map((attendee) => (
                  <div key={attendee._id} className="attendee-card">
                    <div className="attendee-avatar">
                      {attendee.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="attendee-name">
                      {attendee.name}
                      {attendee._id === user?._id && <span className="you-badge">You</span>}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-attendees">Be the first to register for this event!</p>
            )}
          </div>
        </div>

        <div className="event-footer">
          <Link to="/events" className="back-button">
            <i className="fas fa-arrow-left"></i>
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
