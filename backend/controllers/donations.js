// backend/controllers/donations.js
const Donation = require('../models/Donation');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

exports.processDonation = async (req, res) => {
  const { name, email, address, creditCard, amount } = req.body;

  try {
    // Store the donation information (excluding credit card details)
    const donation = new Donation({ name, email, address, amount });
    await donation.save();

    // Generate a PDF receipt
    const doc = new PDFDocument();
    const receiptPath = path.join(__dirname, `../../receipts/${name}_receipt.pdf`);
    doc.pipe(fs.createWriteStream(receiptPath));
    doc.fontSize(20).text('Donation Receipt', { align: 'center' });
    doc.text(`\nName: ${name}`);
    doc.text(`Donation Amount: $${amount}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.end();

    // Send back receipt URL
    const receiptUrl = `http://localhost:3000/receipts/${name}_receipt.pdf`;
    res.status(200).json({ message: 'Donation successful', receiptUrl });
  } catch (error) {
    console.error('Error processing donation:', error);
    res.status(500).json({ message: 'Error processing donation' });
  }
};
