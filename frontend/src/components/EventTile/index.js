import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './EventTile.css';  // Import CSS for EventTile

const EventTile = ({ event, isAdmin, onDelete }) => {
  // Handle delete event
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/events/${event._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Ensure only admins can delete events
        },
      });
      onDelete(event._id);  // Remove the event from the list
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="event-tile">
      <div className="event-tile-header">
        <h3>{event.title}</h3>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      </div>
      <p className="event-description">{event.description}</p>
      <p><strong>Location:</strong> {event.location}</p>

      {/* Link to Event Details */}
      <Link to={`/events/${event._id}`} className="view-event-link">
        View Event
      </Link>

      {/* Show delete button only if the user is an admin */}
      {isAdmin && (
        <button className="delete-button" onClick={handleDelete}>
          Delete Event
        </button>
      )}
    </div>
  );
};

export default EventTile;
