const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware'); // Correct path to the auth middleware

const router = express.Router();

router.post('/register', registerUser); // Route for user registration
router.post('/login', loginUser); // Route for user login
router.get('/profile', auth, getUserProfile); // Protected route for user profile

module.exports = router;
