// Controller: campaignController.js
const Campaign = require('../models/Campaign');

// Get all campaigns
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns', error });
  }
};

// Create new campaign (Admin only)
exports.createCampaign = async (req, res) => {
  const { title, description, goalAmount } = req.body;

  try {
    const newCampaign = new Campaign({
      title,
      description,
      goalAmount,
      createdBy: req.user.id, // Admin who creates the campaign
    });

    await newCampaign.save();

    res.status(201).json({ message: 'Campaign created successfully', campaign: newCampaign });
  } catch (error) {
    res.status(500).json({ message: 'Error creating campaign', error });
  }
};

// Donate to a campaign
exports.donateToCampaign = async (req, res) => {
  const { id } = req.params;
  const { donationAmount } = req.body;

  try {
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Add donation amount to the collected amount
    campaign.collectedAmount += donationAmount;

    // Add the user and donation amount to the donations array
    campaign.donations.push({ userId: req.user.id, amount: donationAmount });

    // Check if the goal amount is fulfilled
    if (campaign.collectedAmount >= campaign.goalAmount) {
      campaign.isCompleted = true; // Mark campaign as completed
    }

    await campaign.save();

    res.status(200).json({ message: 'Donation successful', campaign });
  } catch (error) {
    res.status(500).json({ message: 'Error processing donation', error });
  }
};

// Delete a campaign (Admin only)
exports.deleteCampaign = async (req, res) => {
  const { id } = req.params;

  try {
    const campaign = await Campaign.findByIdAndDelete(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting campaign', error });
  }
};

// Get campaign by ID
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('donations.userId', 'name');
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaign', error });
  }
};

// List active campaigns (for querying all non-completed campaigns)
exports.getActiveCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isCompleted: false });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active campaigns', error });
  }
};

// List finished campaigns (for querying all completed campaigns)
exports.getFinishedCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isCompleted: true });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching finished campaigns', error });
  }
};

// Get all donations by a specific user
exports.getUserDonations = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find campaigns that contain donations made by this user
    const campaigns = await Campaign.find({ "donations.userId": userId });

    // Extract the donations specific to the user
    const userDonations = campaigns.flatMap(campaign => 
      campaign.donations
        .filter(donation => donation.userId.toString() === userId)
        .map(donation => ({
          campaignTitle: campaign.title,
          amount: donation.amount,
          date: campaign.createdAt, // Assuming createdAt as donation date
        }))
    );

    res.status(200).json(userDonations);
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({ message: 'Error fetching user donations' });
  }
};