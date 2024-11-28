const OpenAI = require('openai');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
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
          content: `You are a receipt verification specialist. For any requests about amount, date, or campaign changes, respond: "I'll connect you with a human agent who can help with these changes." For unclear PDFs, respond: "I'll connect you with a human agent to help process your receipt."`
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

const readReceiptContent = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    const pdfText = pdfData.text;
    
    if (!pdfText || pdfText.trim().length === 0) {
      return {
        error: true,
        message: "I'll connect you with a human agent to help process your receipt.",
        needsHumanReview: true
      };
    }

    const extractedData = await extractReceiptData(pdfText);
    
    if (!extractedData.amount || !extractedData.date || !extractedData.campaign) {
      return {
        error: true,
        message: "I'll connect you with a human agent to help process your receipt.",
        needsHumanReview: true
      };
    }

    return {
      name: extractedData.name || "Not found",
      email: extractedData.email || "Not found",
      amount: extractedData.amount,
      date: extractedData.date,
      campaign: extractedData.campaign
    };
  } catch (error) {
    console.error('Error reading receipt:', error);
    return {
      error: true,
      message: "I'll connect you with a human agent to help process your receipt.",
      needsHumanReview: true
    };
  }
};

const extractReceiptData = async (pdfText) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Extract receipt information and return it in valid JSON format with the following fields: name, email, amount, date, campaign"
        },
        {
          role: "user",
          content: `Extract the following information from this receipt text and format as JSON with fields: name, email, amount, date, campaign. Here's the text:\n\n${pdfText}`
        }
      ],
      temperature: 0.1,
      max_tokens: 500
    });

    const jsonStr = response.choices[0].message.content.trim();
    const match = jsonStr.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('No valid JSON found in response');
    }
    return JSON.parse(match[0]);
  } catch (error) {
    console.error('Error extracting receipt data:', error);
    throw error;
  }
};

const generateUpdatedReceipt = async (data) => {
  const doc = new PDFDocument();
  const timestamp = Date.now();
  const newFilePath = path.join(__dirname, '..', 'receipts', `Updated_Receipt_${timestamp}.pdf`);
  const writeStream = fs.createWriteStream(newFilePath);

  return new Promise((resolve, reject) => {
    doc.pipe(writeStream);

    doc.fontSize(16).text('Donation Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    
    doc.rect(50, doc.y, 500, 200).stroke();
    
    const startY = doc.y + 20;
    doc.y = startY;
    
    doc.text(`Name: ${data.name}`, 70, doc.y);
    doc.moveDown();
    doc.text(`Email: ${data.email}`, 70);
    doc.moveDown();
    doc.text(`Amount: ${data.amount}`, 70);
    doc.moveDown();
    doc.text(`Date: ${data.date}`, 70);
    doc.moveDown();
    doc.text(`Campaign: ${data.campaign}`, 70);
    doc.moveDown(2);
    
    doc.fontSize(10)
       .text('Thank you for your donation!', { align: 'center' });
    doc.moveDown();
    doc.text(`Last updated: ${new Date().toLocaleString()}`, { align: 'center' });

    doc.end();

    writeStream.on('finish', () => resolve(newFilePath));
    writeStream.on('error', reject);
  });
};

const handleReceiptIssue = async (req, res) => {
  try {
    const { message } = req.body;

    // Check for restricted changes in message
    if (message && /\b(amount|date|campaign|delete|remove|cancel)\b/i.test(message)) {
      return res.json({
        response: "I'll connect you with a human agent who can help with these changes.",
        needsHumanReview: true
      });
    }

    if (req.file) {
      if (!req.file.mimetype || req.file.mimetype !== 'application/pdf') {
        return res.json({
          response: "I'll connect you with a human agent who can help with non-PDF files.",
          needsHumanReview: true
        });
      }

      const receiptContent = await readReceiptContent(req.file.path);
      
      if (receiptContent.error || receiptContent.needsHumanReview) {
        return res.json({
          response: receiptContent.message,
          needsHumanReview: true
        });
      }

      if (req.body.updates) {
        const updates = JSON.parse(req.body.updates);
        const updatedData = {
          name: updates.name || receiptContent.name,
          email: updates.email || receiptContent.email,
          amount: receiptContent.amount,
          date: receiptContent.date,
          campaign: receiptContent.campaign
        };

        const newReceiptPath = await generateUpdatedReceipt(updatedData);

        if (req.file.path) {
          fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting original file:', err);
          });
        }

        let updateMessage = "Receipt updated successfully";
        if (updates.name && updates.name !== receiptContent.name) {
          updateMessage += ` with new name: ${updates.name}`;
        }
        if (updates.email && updates.email !== receiptContent.email) {
          updateMessage += `${updates.name ? ' and' : ' with'} new email: ${updates.email}`;
        }
        updateMessage += ". Download the updated receipt below.";

        return res.json({ 
          response: updateMessage,
          receiptContent: updatedData,
          newReceiptPath: `/receipts/${path.basename(newReceiptPath)}`
        });
      }

      return res.json({ 
        response: "Receipt processed successfully. You can update the name or email if needed.",
        receiptContent,
        newReceiptPath: null
      });
    }

    return res.json({ 
      response: "Please upload a PDF receipt to proceed with updates.",
      needsHumanReview: false
    });
  } catch (error) {
    console.error('Receipt agent error:', error);
    return res.json({ 
      response: "I'll connect you with a human agent to help resolve this issue.",
      needsHumanReview: true
    });
  }
};

module.exports = {
  handleReceiptIssue
};
