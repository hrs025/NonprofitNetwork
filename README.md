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

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/hrs025/NonprofitNetwork.git
cd nonprofit-project
```

### 2. Database Setup
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

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start backend server
npm start
```

### 4. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend application
npm start
```

## Frontend Pages

### 1. Home Page (/)
The landing page showcases featured events, recent news, and active fundraising campaigns.
- Hero section with mission statement
- Featured events carousel
- Latest news highlights
- Active fundraising campaigns
- Quick access to key features

![Home Page](docs/screenshots/Home.png)

### 2. Events Page (/events)
Browse and register for upcoming community events.
- Event calendar view
- Event categories filter
- Search functionality
- Event registration system
- Event details with images

![Events Page](docs/screenshots/Events.png)

### 3. Event Details (/events/:id)
Detailed view of a specific event with registration options.
- Event description and schedule
- Location with map
- Registration form
- Attendee list
- Related events

![Event Details](docs/screenshots/EventDetails.png)

### 4. Fundraising Hub (/fundraising-hub)
Central location for all fundraising activities.
- Active campaigns list
- Campaign progress tracking
- Donation options
- Campaign search and filters
- Featured campaigns

![Fundraising Hub](docs/screenshots/Fundraising%20Hub.png)

### 5. Fundraiser Page (/fundraiser/:id)
Individual fundraising campaign page.
- Campaign details and story
- Progress bar
- Donation form
- Donor wall
- Share options

![Fundraiser Page](docs/screenshots/Fundraiser%20page.png)

### 6. News Section (/news)
Latest updates and articles about the organization and causes.
- News articles grid
- Category filters
- Search functionality
- Featured articles
- Article sharing

![News Section](docs/screenshots/News.png)

### 7. Customer Service (/customer-service)
Support center with various assistance options.
- AI Chatbot interface
- Receipt management
- Fraud detection reporting
- Campaign inquiries
- FAQ section

![Customer Service](docs/screenshots/Customer%20Service.png)

### 8. User Profile (/profile)
Personal dashboard for users.
- User information
- Donation history
- Registered events
- Saved campaigns
- Communication preferences

![User Profile](docs/screenshots/Profile.png)

### 9. About Us (/about)
Information about the organization and its mission.
- Organization history
- Mission and values
- Team members
- Impact statistics
- Contact information

![About Us](docs/screenshots/About.png)

## Features

### Authentication
- Secure user registration and login
- JWT-based authentication
- Role-based access control
- Password recovery system

### Event Management
- Create and manage events
- Event registration system
- Attendance tracking
- Event categories and filtering
- Image upload support

### Fundraising System
- Campaign creation and management
- Secure donation processing
- Progress tracking
- Donor recognition
- Campaign analytics
- Receipt generation

### News System
- Article creation and management
- Rich text editor
- Image upload support
- Category management
- Search functionality

### AI Support System
- OpenAI-powered chatbot
- Natural language processing
- Automated response system
- Context-aware conversations
- Learning capabilities

## API Documentation

### Authentication Endpoints
- POST /api/users/register - User registration
- POST /api/users/login - User login
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile

### Event Endpoints
- GET /api/events - List all events
- POST /api/events - Create new event
- GET /api/events/:id - Get event details
- PUT /api/events/:id - Update event
- DELETE /api/events/:id - Delete event

### Campaign Endpoints
- GET /api/campaigns - List all campaigns
- POST /api/campaigns - Create new campaign
- GET /api/campaigns/:id - Get campaign details
- PUT /api/campaigns/:id - Update campaign
- POST /api/campaigns/:id/donate - Make donation

### News Endpoints
- GET /api/news - List all articles
- POST /api/news - Create new article
- GET /api/news/:id - Get article details
- PUT /api/news/:id - Update article
- DELETE /api/news/:id - Delete article

## Technologies Used

### Frontend
- React.js 18
- React Router for navigation
- Axios for API calls
- CSS3 with modern features
- React Icons
- JWT for authentication

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- OpenAI API Integration
- Multer for file uploads

### Additional Tools
- OpenAI GPT for chatbot
- MongoDB Atlas (optional)
- JWT for authentication
- Express Validator
- Stripe for payments

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/hrs025/NonprofitNetwork](https://github.com/hrs025/NonprofitNetwork)
