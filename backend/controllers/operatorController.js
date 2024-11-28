const OpenAI = require('openai');
const { config } = require('dotenv');
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
          content: "You are a routing operator. Analyze user requests and respond with one of these categories: receipt_request, receipt_update, campaign, fraud, or general. For receipt requests, detect if user wants to view their receipts."
        }
      ],
      temperature: 0.7,
      max_tokens: 50
    });

    return completion.choices[0].message.content.toLowerCase().trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

const handleRouting = async (req, res) => {
  try {
    const { message } = req.body;

    const routingDecision = await processWithOpenAI([
      { 
        role: "user", 
        content: message 
      }
    ]);

    // If it's a receipt request, forward to receipts endpoint
    if (routingDecision.includes('receipt_request')) {
      return res.json({
        agentType: 'receipt',
        action: 'view',
        originalMessage: message
      });
    }

    // For other types, return the routing decision
    return res.json({ 
      agentType: routingDecision.includes('receipt') ? 'receipt' :
                 routingDecision.includes('campaign') ? 'campaign' :
                 routingDecision.includes('fraud') ? 'fraud' : 'general',
      originalMessage: message
    });
  } catch (error) {
    console.error('Routing error:', error);
    return res.status(500).json({ error: 'Error determining query type' });
  }
};

module.exports = {
  handleRouting
};
