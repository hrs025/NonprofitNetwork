import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Login from './components/Login';
import AboutUs from './components/AboutUs';
import Events from './components/Events';
import News from './components/News';
import Footer from './components/Footer';
import FundraisingHub from './components/FundraisingHub';
import EventDetails from './components/EventDetails'; 
import FundraiserPage from './components/FundraiserPage';
import Chatbot from './components/Chatbot';
import DonationForm from './components/DonationForm';
import CustomerService from './components/CustomerService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Header user={user} setUser={setUser} />
        <div className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/events" element={<Events />} />
            <Route path="/news" element={<News />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/fundraising-hub" element={
              <ProtectedRoute>
                <FundraisingHub />
              </ProtectedRoute>
            } />
            
            <Route path="/customer-service" element={
              <ProtectedRoute>
                <CustomerService />
              </ProtectedRoute>
            } />

            <Route path="/events/:id" element={<EventDetails />} />
            
            <Route path="/fundraiser/:id" element={
              <ProtectedRoute>
                <FundraiserPage />
              </ProtectedRoute>
            } />
            
            <Route path="/fundraiser/:id/donation" element={
              <ProtectedRoute>
                <DonationForm />
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
