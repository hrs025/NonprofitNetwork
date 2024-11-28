import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventTile from '../EventTile';  // Import EventTile component
import './Eventpage.css';  // Import CSS for the page

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);  // Track if user is admin

  useEffect(() => {
    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    // Check if the user is an admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    }

    fetchEvents();
  }, []);

  // Handle event posting (only for admins)
  const handlePostEvent = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');  // Get the authentication token

    try {
      const response = await axios.post(
        'http://localhost:3000/events',
        { title, date, location, description },  // Event details
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Authorization header
          },
        }
      );

      setMessage('Event posted successfully!');
      setEvents([...events, response.data]);  // Add the new event to the list
      setTitle('');  // Clear input fields
      setDate('');
      setLocation('');
      setDescription('');
    } catch (error) {
      setMessage('Failed to post event.');
      console.error('Error posting event:', error);
    }
  };

  // Handle event deletion
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event._id !== eventId));  // Remove the deleted event from the list
  };

  return (
    <div className="events-page-container">
      <div className="events-header">
        <h2>Upcoming Events</h2>
      </div>

      {/* Event Tiles */}
      <div className="events-grid">
        {events.length > 0 ? (
          events.map((event) => (
            <EventTile
              key={event._id}
              event={event}
              isAdmin={isAdmin}  // Pass the isAdmin prop
              onDelete={handleDeleteEvent}  // Pass the delete handler
            />
          ))
        ) : (
          <p className="no-events">No upcoming events at the moment.</p>
        )}
      </div>

      {/* Show event posting form only for admins */}
      {isAdmin && (
        <div className="post-event-section">
          <h3>Post a New Event</h3>
          <form onSubmit={handlePostEvent} className="post-event-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
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
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <button type="submit">Post Event</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
