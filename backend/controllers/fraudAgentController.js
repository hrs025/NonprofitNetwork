const OpenAI = require('openai');
const { config } = require('dotenv');
const Donation = require('../models/Donation');
config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const processWithOpenAI = async (messages) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        ...messages,
        {
          role: "system",
          content: `You are a fraud detection specialist. Analyze fraud reports and decide:
          1. If clearly unauthorized: Recommend immediate refund
          2. If clearly valid: Decline refund
          3. If unclear: Escalate to human agent
          Keep responses brief and clear.`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

const analyzeFraudRisk = (transactionDetails, message) => {
  const riskFactors = {
    highRisk: [
      'unauthorized',
      'not me',
      'stolen',
      'fraud',
      'never donated',
      'wrong amount',
      'duplicate charge'
    ],
    mediumRisk: [
      'suspicious',
      'dont recognize',
      'unfamiliar',
      'mistake',
      'error'
    ]
  };

  let riskScore = 0;
  const messageText = message.toLowerCase();

  // Check high risk factors
  riskFactors.highRisk.forEach(factor => {
    if (messageText.includes(factor)) riskScore += 2;
  });

  // Check medium risk factors
  riskFactors.mediumRisk.forEach(factor => {
    if (messageText.includes(factor)) riskScore += 1;
  });

  // Additional risk checks
  if (transactionDetails) {
    // Check for recent transaction (within last 24 hours)
    const transactionDate = new Date(transactionDetails.date);
    const now = new Date();
    const hoursSinceTransaction = (now - transactionDate) / (1000 * 60 * 60);
    if (hoursSinceTransaction < 24) riskScore += 1;

    // Check for unusual amount
    if (transactionDetails.amount > 1000) riskScore += 1;
  }

  return {
    score: riskScore,
    recommendation: riskScore >= 4 ? 'refund' : 
                    riskScore >= 2 ? 'escalate' : 
                    'decline'
  };
};

const handleFraudReport = async (req, res) => {
  try {
    const { message, transactionDetails } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Immediate escalation cases
    const escalationKeywords = [
      'legal',
      'lawyer',
      'police',
      'report',
      'investigation',
      'multiple transactions'
    ];

    if (escalationKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      return res.json({
        response: "Due to the nature of your report, I'll connect you with our fraud investigation team immediately.",
        needsHumanReview: true,
        priority: 'high'
      });
    }

    // Analyze risk
    const riskAnalysis = analyzeFraudRisk(transactionDetails, message);

    // Prepare context for AI
    const context = `
      Report: ${message}
      Transaction Date: ${transactionDetails?.date || 'Not provided'}
      Amount: ${transactionDetails?.amount || 'Not provided'}
      Transaction ID: ${transactionDetails?.transactionId || 'Not provided'}
      Evidence Provided: ${imageUrl ? 'Yes' : 'No'}
      Risk Analysis: ${riskAnalysis.recommendation.toUpperCase()}
      Risk Score: ${riskAnalysis.score}
    `;

    const aiResponse = await processWithOpenAI([
      {
        role: "user",
        content: `Analyze this fraud report:\n${context}`
      }
    ]);

    // Determine action based on risk analysis and AI response
    let action;
    if (riskAnalysis.recommendation === 'refund') {
      action = {
        type: 'refund',
        message: "I've initiated a refund for this transaction. You should see it in 3-5 business days."
      };
    } else if (riskAnalysis.recommendation === 'escalate') {
      action = {
        type: 'escalate',
        message: "I need to escalate this to our fraud investigation team for a thorough review."
      };
    } else {
      action = {
        type: 'decline',
        message: "Based on our review, this appears to be a valid transaction. Would you like to speak with a human agent for more details?"
      };
    }

    return res.json({
      response: action.message,
      needsHumanReview: action.type === 'escalate',
      action: action.type,
      riskAnalysis: {
        score: riskAnalysis.score,
        recommendation: riskAnalysis.recommendation
      }
    });

  } catch (error) {
    console.error('Fraud report error:', error);
    return res.json({
      response: "I'm having trouble processing your fraud report. Let me connect you with our fraud team immediately.",
      needsHumanReview: true,
      priority: 'high'
    });
  }
};

module.exports = {
  handleFraudReport
};
