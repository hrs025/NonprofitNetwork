const express = require('express');
const router = express.Router();

// Import controllers
const { handleRouting } = require('../controllers/operatorController');
const { handleReceiptIssue } = require('../controllers/receiptAgentController');
const { handleCampaignInquiry } = require('../controllers/campaignAgentController');
const { handleFraudReport } = require('../controllers/fraudAgentController');

// Main chatbot endpoint - First routes through operator
router.post('/chat', async (req, res) => {
  try {
    // Get routing decision from operator
    const routingResult = await handleRouting(req, res);
    
    // Based on operator's decision, route to appropriate agent
    let response;
    switch (routingResult.agentType) {
      case 'receipt':
        response = await handleReceiptIssue(req, res);
        break;
      case 'campaign':
        response = await handleCampaignInquiry(req, res);
        break;
      case 'fraud':
        response = await handleFraudReport(req, res);
        break;
      default:
        response = {
          response: "I couldn't determine how to help. Please try using our specialized forms for better assistance.",
          type: 'unknown'
        };
    }

    return res.json(response);
  } catch (error) {
    console.error('Chat routing error:', error);
    return res.status(500).json({ error: 'Error processing request' });
  }
});

// Direct agent endpoints
router.post('/receipt', async (req, res) => {
  try {
    // Add file path to request body if file was uploaded
    if (req.file) {
      req.body.imageUrl = `/uploads/${req.file.filename}`;
    }
    return await handleReceiptIssue(req, res);
  } catch (error) {
    console.error('Receipt endpoint error:', error);
    return res.status(500).json({ error: 'Error processing receipt issue' });
  }
});

router.post('/campaign', async (req, res) => {
  try {
    return await handleCampaignInquiry(req, res);
  } catch (error) {
    console.error('Campaign endpoint error:', error);
    return res.status(500).json({ error: 'Error processing campaign inquiry' });
  }
});

router.post('/fraud', async (req, res) => {
  try {
    // Add file path to request body if file was uploaded
    if (req.file) {
      req.body.imageUrl = `/uploads/${req.file.filename}`;
    }
    return await handleFraudReport(req, res);
  } catch (error) {
    console.error('Fraud endpoint error:', error);
    return res.status(500).json({ error: 'Error processing fraud report' });
  }
});

// Operator endpoint for direct routing decisions
router.post('/route', async (req, res) => {
  try {
    return await handleRouting(req, res);
  } catch (error) {
    console.error('Routing endpoint error:', error);
    return res.status(500).json({ error: 'Error determining query type' });
  }
});

module.exports = router;
