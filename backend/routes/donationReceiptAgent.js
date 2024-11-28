const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Read and parse the receipt file.
 * @param {string} filePath - Path to the receipt file.
 * @returns {object} - Parsed receipt details.
 */
function parseReceipt(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const receiptDetails = {
    date: 'N/A',
    donor: 'N/A',
    email: 'N/A',
    campaign: 'N/A',
    amount: 'N/A'
  };

  // Basic parsing based on expected receipt format
  content.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':'); // Split by colon once
    const value = valueParts.join(':').trim(); // Join remaining parts in case there's a colon in the value

    if (key && value) {
      switch (key.toLowerCase()) {
        case 'date':
          receiptDetails.date = value;
          break;
        case 'donor':
          receiptDetails.donor = value;
          break;
        case 'email':
          receiptDetails.email = value;
          break;
        case 'campaign':
          receiptDetails.campaign = value;
          break;
        case 'amount donated':
          receiptDetails.amount = value;
          break;
        default:
          break;
      }
    }
  });

  return receiptDetails;
}

/**
 * Process the user's request to modify receipt details.
 * @param {object} receiptDetails - Parsed details of the receipt.
 * @param {string} userRequest - User's request to modify details.
 * @returns {object|string} - Updated receipt details or escalation message.
 */
function handleModificationRequest(receiptDetails, userRequest) {
  const updatedReceipt = { ...receiptDetails }; // Clone original details

  if (userRequest.includes("change name of donor")) {
    const newName = userRequest.split("to ")[1];
    if (newName) {
      updatedReceipt['donor'] = newName;
    }
  }

  if (userRequest.includes("change email")) {
    const newEmail = userRequest.split("to ")[1];
    if (newEmail) {
      updatedReceipt['email'] = newEmail;
    }
  }

  if (userRequest.includes("change amount")) {
    return "Escalate to human for changing donation amount.";
  }

  return updatedReceipt;
}

/**
 * Save the updated receipt to a file for download.
 * @param {object} receiptDetails - Updated receipt details.
 * @returns {string} - Path to the saved receipt file.
 */
function saveUpdatedReceipt(receiptDetails) {
  const receiptsDir = path.join(__dirname, 'receipts');

  // Ensure the receipts directory exists
  if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir);
  }

  const fileName = `Updated_Receipt_${Date.now()}.txt`;
  const filePath = path.join(receiptsDir, fileName);

  const receiptContent = `
    Donation Receipt
    Date: ${receiptDetails.date}
    Donor: ${receiptDetails.donor}
    Email: ${receiptDetails.email}
    Campaign: ${receiptDetails.campaign}
    Amount Donated: ${receiptDetails.amount}
    Thank you for your generous donation!
    *This is a reprinted receipt*
  `;

  fs.writeFileSync(filePath, receiptContent.trim());
  return filePath;
}

/**
 * Main function to handle donation receipt requests.
 * @param {string} filePath - Path to the uploaded receipt file.
 * @param {string} userRequest - User's modification request.
 * @returns {Promise<string>} - Path to download the updated receipt file.
 */
async function getDonationReceiptResponse(filePath, userRequest) {
  try {
    // Step 1: Parse receipt details
    const receiptDetails = parseReceipt(filePath);

    // Step 2: Handle modification request
    const updatedReceipt = handleModificationRequest(receiptDetails, userRequest);

    // Check if escalation is needed
    if (typeof updatedReceipt === "string" && updatedReceipt.includes("Escalate to human")) {
      return updatedReceipt;
    }

    // Step 3: Save the updated receipt to a file for download
    const updatedReceiptPath = saveUpdatedReceipt(updatedReceipt);
    return updatedReceiptPath;
  } catch (error) {
    console.error("Error processing donation receipt:", error);
    return "There was an error processing your request.";
  }
}

module.exports = { getDonationReceiptResponse };
