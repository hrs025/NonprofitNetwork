const jwt = require('jsonwebtoken');
const Campaign = require('../models/Campaign');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const getUserDonations = async (userId) => {
  try {
    const campaigns = await Campaign.find({
      'donations.userId': userId
    });

    const donations = [];
    campaigns.forEach(campaign => {
      campaign.donations
        .filter(donation => donation.userId.toString() === userId.toString())
        .forEach(donation => {
          donations.push({
            campaignTitle: campaign.title,
            amount: donation.amount,
            date: donation.date || campaign.createdAt,
            campaignId: campaign._id
          });
        });
    });

    return donations;
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
};

const generateReceipt = async (donation, userName, userEmail) => {
  const doc = new PDFDocument();
  const timestamp = Date.now();
  const filename = `Receipt_${donation.campaignTitle}_${timestamp}.pdf`;
  const filePath = path.join(__dirname, '..', 'receipts', filename);
  
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    
    // Add content to PDF
    doc.fontSize(16).text('Donation Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    
    doc.text(`Date: ${new Date(donation.date).toLocaleDateString()}`, 20, 40);
    doc.text(`Donor: ${userName}`, 20, 50);
    doc.text(`Email: ${userEmail}`, 20, 60);
    doc.text(`Campaign: ${donation.campaignTitle}`, 20, 80);
    doc.text(`Amount Donated: $${donation.amount}`, 20, 90);
    doc.text(`Thank you for your generous donation!`, 20, 110);
    
    doc.end();

    writeStream.on('finish', () => resolve({ filename, filePath }));
    writeStream.on('error', reject);
  });
};

const handleReceiptRetrieval = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.json({
      response: "Please log in to view your receipts. I'll connect you with a human agent who can help you with the login process.",
      needsHumanReview: true
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const donations = await getUserDonations(userId);

    if (donations.length === 0) {
      return res.json({
        response: "I don't see any donation records for your account. Would you like to speak with a human agent for assistance?",
        needsHumanReview: true
      });
    }

    // Generate receipts
    const receiptPromises = donations.map(donation => 
      generateReceipt(donation, decoded.name, decoded.email)
    );

    const receipts = await Promise.all(receiptPromises);

    return res.json({
      response: `I found ${donations.length} donation receipt${donations.length > 1 ? 's' : ''} for you. You can download them below.`,
      receipts: receipts.map(receipt => ({
        url: `/receipts/${receipt.filename}`,
        filename: receipt.filename
      }))
    });

  } catch (error) {
    console.error('Receipt retrieval error:', error);
    return res.json({
      response: "I'm having trouble accessing your receipts. I'll connect you with a human agent who can help.",
      needsHumanReview: true
    });
  }
};

module.exports = {
  handleReceiptRetrieval
};
