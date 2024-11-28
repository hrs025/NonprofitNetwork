const OpenAI = require('openai');
const { config } = require('dotenv');
config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Helper function to process messages through OpenAI
const processWithOpenAI = async (messages) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        ...messages,
        {
          role: "system",
          content: "Provide brief, concise responses. If the query is complex or requires human intervention, respond with 'Escalating to human agent: [brief reason]'"
        }
      ],
      temperature: 0.7,
      max_tokens: 100 // Limit response length
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

// Handle receipt issues
const handleReceiptIssue = async (req, res) => {
  try {
    const { message, imageUrl } = req.body;
    
    const messages = [
      { 
        role: "system", 
        content: "You are a receipt verification specialist. Keep responses brief and escalate complex issues."
      },
      { 
        role: "user", 
        content: `Receipt issue: ${message}${imageUrl ? `\nImage provided: ${imageUrl}` : ''}`
      }
    ];

    const response = await processWithOpenAI(messages);
    return res.json({ response });
  } catch (error) {
    console.error('Receipt agent error:', error);
    return res.status(500).json({ error: 'Error processing receipt issue' });
  }
};

// Handle campaign inquiries
const handleCampaignInquiry = async (req, res) => {
  try {
    const { message, campaignId } = req.body;
    
    const messages = [
      { 
        role: "system", 
        content: "You are a campaign information specialist. Provide brief updates and escalate complex inquiries."
      },
      { 
        role: "user", 
        content: `Campaign inquiry: ${message}${campaignId ? `\nCampaign ID: ${campaignId}` : ''}`
      }
    ];

    const response = await processWithOpenAI(messages);
    return res.json({ response });
  } catch (error) {
    console.error('Campaign agent error:', error);
    return res.status(500).json({ error: 'Error processing campaign inquiry' });
  }
};

// Handle fraud reports
const handleFraudReport = async (req, res) => {
  try {
    const { message, imageUrl, transactionDetails } = req.body;
    
    const messages = [
      { 
        role: "system", 
        content: "You are a fraud detection specialist. Provide brief assessments and always escalate suspicious cases."
      },
      { 
        role: "user", 
        content: `Fraud report: ${message}
                 ${imageUrl ? `\nImage provided: ${imageUrl}` : ''}
                 ${transactionDetails ? `\nTransaction Details: ${JSON.stringify(transactionDetails)}` : ''}`
      }
    ];

    const response = await processWithOpenAI(messages);
    return res.json({ response });
  } catch (error) {
    console.error('Fraud agent error:', error);
    return res.status(500).json({ error: 'Error processing fraud report' });
  }
};

// Main chatbot handler
const handleChatbotMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const routingMessages = [
      { 
        role: "system", 
        content: "Route inquiries to: receipt, campaign, or fraud. Respond with only the category name."
      },
      { role: "user", content: message }
    ];

    const routingDecision = await processWithOpenAI(routingMessages);
    
    let response;
    const requestBody = { ...req.body };

    if (routingDecision.toLowerCase().includes('receipt')) {
      const result = await handleReceiptIssue({ body: requestBody });
      response = { response: result.response, type: 'receipt' };
    } else if (routingDecision.toLowerCase().includes('campaign')) {
      const result = await handleCampaignInquiry({ body: requestBody });
      response = { response: result.response, type: 'campaign' };
    } else if (routingDecision.toLowerCase().includes('fraud')) {
      const result = await handleFraudReport({ body: requestBody });
      response = { response: result.response, type: 'fraud' };
    } else {
      response = {
        response: "Unable to determine issue type. Please try the specific forms for better assistance.",
        type: 'unknown'
      };
    }

    if (response.type !== 'unknown') {
      response.redirect = response.type;
    }

    return res.json(response);
  } catch (error) {
    console.error('Chatbot error:', error);
    return res.status(500).json({ error: 'Error processing message' });
  }
};

module.exports = {
  handleReceiptIssue,
  handleCampaignInquiry,
  handleFraudReport,
  handleChatbotMessage
};
