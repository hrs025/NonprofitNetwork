const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getDonationReceiptResponse } = require('./donationReceiptAgent'); // Adjust the path to your module

// Initialize multer for file handling
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Pass the uploaded file path and prompt to your function
    const responseMessage = await getDonationReceiptResponse(imageFile.path, prompt);

    res.status(200).json({ response: responseMessage });
  } catch (error) {
    console.error('Error processing donation receipt:', error);
    res.status(500).json({ message: 'Error processing your receipt' });
  }
});

module.exports = router;
