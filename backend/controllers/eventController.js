const Event = require('../models/Event');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find(); // Mongoose query to get all events
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, date, location, description } = req.body;

  try {
    // Create new event using Mongoose
    const newEvent = new Event({ title, date, location, description });
    await newEvent.save(); // Save to MongoDB

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event', error });
  }
};

// Update an event by ID
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, date, location, description } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, { title, date, location, description }, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
};

// Delete an event by ID
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findByIdAndDelete(id); // Use Mongoose to delete by ID
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event', error });
  }
};


// Register a user for an event
exports.registerForEvent = async (req, res) => {
  const { eventId } = req.params;  // Event ID from URL
  const userId = req.user.id;  // User ID from token (assuming user is authenticated)

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is already registered for the event
    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Add user to the attendees list
    event.attendees.push(userId);
    await event.save();

    res.status(200).json({ message: 'Successfully registered for the event', event });
  } catch (error) {
    res.status(500).json({ message: 'Error registering for the event', error });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('attendees');  // Assuming attendees are users
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event details', error });
  }
};