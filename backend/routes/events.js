const express = require('express');
const { getAllEvents, createEvent, deleteEvent, registerForEvent, getEventById } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware'); // Authentication middleware
const checkAdmin = require('../middleware/checkAdmin'); // Admin check middleware

const router = express.Router();

// Routes
router.get('/', getAllEvents); // Open to all
router.post('/', authMiddleware, checkAdmin, createEvent); // Admin only
router.delete('/:id', authMiddleware, checkAdmin, deleteEvent); // Admin only

router.post('/register/:eventId', authMiddleware, registerForEvent);  

router.get('/:id', getEventById);

module.exports = router;
