const express = require('express');
const { getAllNews, createNews, deleteNews } = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware'); // Authenticate the user
const checkAdmin = require('../middleware/checkAdmin'); // Check if user is admin

const router = express.Router();

// View all news (accessible to everyone)
router.get('/', getAllNews);

// Admin-only routes
router.post('/', authMiddleware, checkAdmin, createNews); // Only admins can post news
router.delete('/:id', authMiddleware, checkAdmin, deleteNews); // Only admins can delete news

module.exports = router;
