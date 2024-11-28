const OpenAI = require('openai');
const Campaign = require('../models/Campaign');
const { config } = require('dotenv');
config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const getCampaignDetails = async (campaignId) => {
  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return null;
    }

    // Calculate progress percentage
    const progressPercentage = (campaign.collectedAmount / campaign.goalAmount) * 100;
    
    // Calculate remaining amount
    const remainingAmount = campaign.goalAmount - campaign.collectedAmount;

    // Get total number of donors
    const totalDonors = campaign.donations.length;

    return {
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
      collectedAmount: campaign.collectedAmount,
      progressPercentage: progressPercentage.toFixed(2),
      remainingAmount: remainingAmount,
      totalDonors: totalDonors,
      isCompleted: campaign.isCompleted
    };
  } catch (error) {
    console.error('Error fetching campaign details:', error);
    throw error;
  }
};

const getUserCampaignContributions = async (userId) => {
  try {
    const campaigns = await Campaign.find({
      'donations.userId': userId
    });

    return campaigns.map(campaign => ({
      campaignId: campaign._id,
      title: campaign.title,
      userDonations: campaign.donations
        .filter(donation => donation.userId.toString() === userId.toString())
        .map(donation => ({
          amount: donation.amount,
          date: donation.date
        }))
    }));
  } catch (error) {
    console.error('Error fetching user contributions:', error);
    throw error;
  }
};

const processWithOpenAI = async (messages) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        ...messages,
        {
          role: "system",
          content: `You are a campaign information specialist. Follow these rules:
          1. Provide clear updates on campaign progress
          2. Share milestone achievements
          3. Explain fund allocation clearly
          4. Keep responses concise and informative
          5. Escalate complex queries to human agents`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

const handleCampaignInquiry = async (req, res) => {
  try {
    const { message, campaignId } = req.body;
    const userId = req.user?.id; // From auth middleware

    // Check for complex queries that need human intervention
    const complexQueryTerms = [
      'specific allocation',
      'detailed breakdown',
      'financial report',
      'audit',
      'legal',
      'complaint'
    ];

    if (complexQueryTerms.some(term => message.toLowerCase().includes(term))) {
      return res.json({
        response: "I'll connect you with a human agent who can provide more detailed information about this campaign.",
        needsHumanReview: true
      });
    }

    // Get campaign details
    const campaignDetails = await getCampaignDetails(campaignId);
    if (!campaignDetails) {
      return res.json({
        response: "I couldn't find information about this campaign. Let me connect you with a human agent.",
        needsHumanReview: true
      });
    }

    // Get user's contributions if authenticated
    let userContributions = null;
    if (userId) {
      userContributions = await getUserCampaignContributions(userId);
    }

    // Prepare context for AI
    const context = `
      Campaign: ${campaignDetails.title}
      Progress: ${campaignDetails.progressPercentage}% (${campaignDetails.collectedAmount}/${campaignDetails.goalAmount})
      Total Donors: ${campaignDetails.totalDonors}
      Status: ${campaignDetails.isCompleted ? 'Completed' : 'Ongoing'}
      ${userContributions ? `Your Contributions: ${JSON.stringify(userContributions)}` : ''}
    `;

    const response = await processWithOpenAI([
      {
        role: "system",
        content: "You are a campaign information specialist. Provide clear updates on campaign progress and milestones."
      },
      {
        role: "user",
        content: `Context: ${context}\nUser Query: ${message}`
      }
    ]);

    return res.json({
      response,
      campaignDetails,
      userContributions
    });

  } catch (error) {
    console.error('Campaign inquiry error:', error);
    return res.json({
      response: "I'm having trouble getting campaign information. Let me connect you with a human agent.",
      needsHumanReview: true
    });
  }
};

module.exports = {
  handleCampaignInquiry
};
