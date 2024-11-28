require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const connectDB = require('./config/database');
const path = require('path');

// Import routes
const userRoutes = require('./routes/users');
const campaignRoutes = require('./routes/campaigns');
const eventRoutes = require('./routes/events');
const newsRoutes = require('./routes/news');
const aiRoutes = require('./routes/aiRoutes');
const donationRoutes = require('./routes/donations');
const donationRoute = require('./routes/donationRoute');
const receiptRoutes = require('./routes/receipts');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, 'uploads');
    if (req.baseUrl.includes('receipt')) {
      uploadPath = path.join(__dirname, 'receipts');
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create required directories
const fs = require('fs');
['uploads', 'receipts', 'uploads/chatbot'].forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Connect to MongoDB
connectDB();

// Static file serving
app.use('/receipts', express.static(path.join(__dirname, 'receipts')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/static', express.static(path.join(__dirname, 'static')));

// Mount routes with /api prefix
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/donation-receipt', donationRoute);
app.use('/api/receipts', receiptRoutes);
app.use('/api/chatbot', chatbotRoutes);

// AI routes with file upload handling
app.use('/api/ai', (req, res, next) => {
  if (req.path === '/chat' || req.path === '/receipt' || req.path === '/fraud') {
    upload.single('file')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: 'File upload failed' });
      }
      next();
    });
  } else {
    next();
  }
}, aiRoutes);

// Generic file upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      message: 'File uploaded successfully',
      filePath: req.file.path,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size is too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested resource could not be found.'
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
