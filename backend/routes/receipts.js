const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { handleReceiptRetrieval } = require('../controllers/receiptRetrievalController');
const authMiddleware = require('../middleware/authMiddleware');

// Ensure receipts directory exists
const receiptsDir = path.join(__dirname, '..', 'receipts');
if (!fs.existsSync(receiptsDir)) {
  fs.mkdirSync(receiptsDir, { recursive: true });
}

// Route for getting all user receipts
router.get('/user-receipts', authMiddleware, async (req, res) => {
  try {
    return await handleReceiptRetrieval(req, res);
  } catch (error) {
    console.error('Receipt route error:', error);
    return res.status(500).json({
      response: "I'm having trouble accessing your receipts. I'll connect you with a human agent who can help.",
      needsHumanReview: true
    });
  }
});

// Route for downloading a specific receipt
router.get('/download/:filename', authMiddleware, (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'receipts', filename);
    
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({
        response: "I couldn't find that receipt. Let me connect you with a human agent for assistance.",
        needsHumanReview: true
      });
    }
  } catch (error) {
    console.error('Receipt download error:', error);
    res.status(500).json({
      response: "I'm having trouble downloading the receipt. I'll connect you with a human agent who can help.",
      needsHumanReview: true
    });
  }
});

module.exports = router;
