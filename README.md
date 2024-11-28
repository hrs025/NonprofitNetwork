# NonprofitNetwork Platform

A comprehensive platform designed to connect nonprofits with donors, volunteers, and communities. The platform features event management, fundraising campaigns, news sharing, and AI-powered customer support to create meaningful impact in communities.

## Project Overview

The platform consists of several integrated modules:

1. **Event Management**
   - Create and manage community events
   - Track attendance and registrations
   - Event details with image support
   - Registration system

2. **Fundraising System**
   - Campaign creation and management
   - Secure donation processing
   - Progress tracking
   - Donor recognition
   - Campaign analytics

3. **News & Updates**
   - Article publishing system
   - Community updates
   - News categorization
   - Search functionality

4. **AI-Powered Support**
   - Intelligent chatbot assistance
   - Receipt management
   - Fraud detection
   - Customer service automation

## Project Structure

```
nonprofit-project/
├── backend/
│   ├── config/
│   │   ├── database.js     # Database configuration
│   │   ├── multer.js       # File upload configuration
│   │   └── express.js      # Express configuration
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── eventController.js
│   │   ├── campaignController.js
│   │   ├── newsController.js
│   │   └── chatbotController.js
│   ├── middleware/
│   │   ├── auth.js         # Authentication middleware
│   │   └── fileUpload.js   # File upload middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Campaign.js
│   │   └── News.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── campaignRoutes.js
│   │   └── newsRoutes.js
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── components/
        │   ├── Events/
        │   ├── Fundraising/
        │   ├── News/
        │   └── CustomerService/
        ├── config/
        └── App.js

```

## Prerequisites

1. **Node.js & npm**
   - Download and install from: https://nodejs.org/
   - Recommended version: 14.x or higher

2. **MongoDB**
   - Download and install from: https://www.mongodb.com/try/download/community
   - Create a database named 'nonprofit-network'
   - Start MongoDB service

3. **OpenAI API Key**
   - Sign up at: https://platform.openai.com/signup
   - Create an API key from: https://platform.openai.com/api-keys
   - Save the API key for configuration

## Environment Variables

### Backend (.env)
Create a `.env` file in the backend directory with the following variables:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nonprofit-network
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
OPENAI_API_KEY=your_openai_api_key_here
MAX_FILE_SIZE=5242880
```

### Frontend (.env)
Create a `.env` file in the frontend directory with the following variables:
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_SOCKET_URL=http://localhost:3000
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
```

Note: Never commit your `.env` files to version control. They are already included in `.gitignore`.

## Detailed Setup Instructions

### 1. Database Setup
```bash
# Start MongoDB service
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod

# Create database
mongosh
use nonprofit-network
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start backend server
npm start
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend application
npm start
```

## Features in Detail

### Event Management
- Create events with details, images, and capacity limits
- Track registrations and attendance
- Event categories and filtering
- Registration confirmation system

### Fundraising Campaigns
- Create fundraising campaigns with goals
- Track donation progress
- Secure payment processing
- Donor recognition system
- Campaign updates and notifications

### News System
- Article creation and management
- Rich text editor for content
- Image upload support
- Search and filter functionality

### AI Support System
- Chatbot for common queries
- Receipt processing and management
- Fraud detection for donations
- Automated customer support

## Access Points

1. **Backend API**: http://localhost:3000
   - API documentation available at /api-docs
   - Health check at /health

2. **Frontend Application**: http://localhost:3001
   - Main application interface
   - Responsive design for all devices

## Key Pages for Screenshots

1. Home Page (/)
2. Events Page (/events)
3. Fundraising Hub (/fundraising-hub)
4. News Section (/news)
5. Customer Service (/customer-service)
6. User Profile (/profile)

[Add screenshots here]

## Technologies Used

### Frontend
- React.js 18
- CSS3 with modern features
- HTML5
- Axios for API calls
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- OpenAI API Integration
- Multer for file uploads

### Additional Tools
- OpenAI GPT for chatbot
- MongoDB Atlas (optional for cloud database)
- JWT for secure authentication
- Express Validator for input validation
