// backend/models/Donation.js
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Donation', donationSchema);
