import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events', error);
        setMessage('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      const parsedUser = JSON.parse(user);
      setUserRole(parsedUser.role);
      if (parsedUser.role === 'admin') {
        setIsAdmin(true);
      }
    }

    fetchEvents();
  }, []);

  const handleDeleteEvent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(events.filter((event) => event._id !== id));
      setMessage('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event', error);
      setMessage('Failed to delete event');
    }
  };

  const handlePostEvent = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/events',
        { title, date, location, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Event created successfully!');
      setEvents([...events, response.data]);
      setTitle('');
      setDate('');
      setLocation('');
      setDescription('');
    } catch (error) {
      setMessage('Failed to create event');
      console.error('Error posting event:', error);
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
      <div className="events-loading">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Community Events</h1>
        <p className="events-subtitle">Join and participate in upcoming events in your community</p>
      </div>

      {message && (
        <div className={`message-banner ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="event-list">
        {events.length === 0 ? (
          <div className="no-events">
            <i className="fas fa-calendar-times"></i>
            <p>No upcoming events at the moment.</p>
            {isAdmin && <p>Create a new event to get started!</p>}
          </div>
        ) : (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-card-header">
                <div className="event-date">
                  <div className="date-box">
                    <span className="month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="day">{new Date(event.date).getDate()}</span>
                  </div>
                </div>
                <h3>{event.title}</h3>
              </div>
              
              <div className="event-details">
                <p className="event-time">
                  <i className="far fa-clock"></i>
                  {formatDate(event.date)}
                </p>
                <p className="event-location">
                  <i className="fas fa-map-marker-alt"></i>
                  {event.location}
                </p>
                <p className="event-description">{event.description}</p>
              </div>

              <div className="event-actions">
                <Link to={`/events/${event._id}`} className="view-details-button">
                  View Details & Register
                </Link>
                {isAdmin && (
                  <button 
                    className="delete-button" 
                    onClick={() => handleDeleteEvent(event._id)}
                    title="Delete Event"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isAdmin && (
        <div className="create-event-section">
          <h2>Create New Event</h2>
          <form onSubmit={handlePostEvent} className="create-event-form">
            <div className="form-group">
              <label>Event Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter event title"
                required 
              />
            </div>
            <div className="form-group">
              <label>Date and Time</label>
              <input 
                type="datetime-local" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="Enter event location"
                required 
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Enter event description"
                required 
              />
            </div>
            <button type="submit" className="create-button">
              Create Event
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Events;
