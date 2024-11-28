// backend/routes/donations.js
const express = require('express');
const router = express.Router();
const { processDonation } = require('../controllers/donations');

router.post('/donate', processDonation);

module.exports = router;
