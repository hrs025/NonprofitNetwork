const express = require('express');
const {
  getAllCampaigns,
  createCampaign,
  donateToCampaign,  // <-- Make sure this function is imported
  deleteCampaign,
  getCampaignById,
  getUserDonations
} = require('../controllers/campaignController');
const authMiddleware = require('../middleware/authMiddleware'); // Authenticate the user
const checkAdmin = require('../middleware/checkAdmin'); // Check if the user is admin

const router = express.Router();

// View all campaigns (accessible to everyone)
router.get('/', getAllCampaigns);

// Create a new campaign (Admin only)
router.post('/', authMiddleware, checkAdmin, createCampaign);

// Donate to a campaign (accessible to everyone)
router.post('/:id/donate', authMiddleware, donateToCampaign);  // Ensure this route is defined

// Get a campaign by ID
router.get('/:id', getCampaignById);

// Delete a campaign (Admin only)
router.delete('/:id', authMiddleware, checkAdmin, deleteCampaign);

// In userRoutes.js (or similar)
router.get('/user/:userId/donations', authMiddleware, getUserDonations);

module.exports = router;
