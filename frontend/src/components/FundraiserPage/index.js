import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import './FundraiserPage.css';

const FundraiserPage = () => {
  const { id } = useParams();
  const [fundraiser, setFundraiser] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const predefinedAmounts = [10, 25, 50, 100, 250, 500];

  useEffect(() => {
    const fetchFundraiserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/campaigns/${id}`);
        setFundraiser(response.data);
        
        // Pre-fill user info if logged in
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.name) setName(userData.name);
        if (userData.email) setEmail(userData.email);
      } catch (error) {
        console.error('Error fetching fundraiser details', error);
        setErrorMessage('Failed to load fundraiser details');
      } finally {
        setIsLoading(false);
      }
    };
      
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    fetchFundraiserDetails();
  }, [id]);

  const generatePDFReceipt = (donation) => {
    const doc = new jsPDF();
    
    // Add logo or header
    doc.setFontSize(20);
    doc.setTextColor(0, 123, 255);
    doc.text('NonprofitNetwork', 20, 20);
    
    // Set main title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Donation Receipt', 20, 40);
    
    // Add line separator
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);
    
    // Set receipt details
    doc.setFontSize(12);
    doc.text(`Receipt Date: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.text(`Donor Name: ${name}`, 20, 70);
    doc.text(`Donor Email: ${email}`, 20, 80);
    doc.text(`Campaign: ${fundraiser.title}`, 20, 100);
    doc.text(`Amount Donated: $${donationAmount}`, 20, 110);
    
    // Add thank you message
    doc.setFontSize(14);
    doc.setTextColor(40, 167, 69);
    doc.text('Thank you for your generous donation!', 20, 140);
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('This receipt is valid for tax purposes.', 20, 260);
    doc.text(`Receipt ID: ${Date.now()}`, 20, 270);
    
    // Save the PDF
    doc.save(`Donation_Receipt_${fundraiser.title}_${Date.now()}.pdf`);
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const donationAmountParsed = parseFloat(donationAmount);
      if (!donationAmountParsed || donationAmountParsed <= 0) {
        setMessage('Please enter a valid donation amount');
        return;
      }

      const response = await axios.post(
        `http://localhost:3000/api/campaigns/${id}/donate`,
        { donationAmount: donationAmountParsed, name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Thank you for your generous donation! Your receipt has been generated.');
      setShowDonationForm(false);

      setFundraiser((prevFundraiser) => ({
        ...prevFundraiser,
        collectedAmount: prevFundraiser.collectedAmount + donationAmountParsed,
        donations: prevFundraiser.donations
          ? [...prevFundraiser.donations, { userId: { name }, amount: donationAmountParsed }]
          : [{ userId: { name }, amount: donationAmountParsed }],
      }));

      // Generate PDF receipt
      generatePDFReceipt();

      // Reset form
      setDonationAmount('');
      if (!isLoggedIn) {
        setName('');
        setEmail('');
      }
    } catch (error) {
      console.error('Error donating to campaign:', error);
      setMessage('Failed to process donation. Please try again.');
    }
  };

  const calculateProgress = (collected, goal) => {
    return Math.min((collected / goal) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="fundraiser-loading">
        <div className="loading-spinner"></div>
        <p>Loading campaign details...</p>
      </div>
    );
  }

  if (!fundraiser) {
    return (
      <div className="fundraiser-error">
        <i className="fas fa-exclamation-circle"></i>
        <h2>Campaign Not Found</h2>
        <p>{errorMessage}</p>
        <Link to="/fundraising-hub" className="back-link">
          Return to Fundraising Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="fundraiser-page">
      <div className="fundraiser-header">
        {fundraiser.imageUrl && (
          <div className="fundraiser-image">
            <img src={fundraiser.imageUrl} alt={fundraiser.title} />
          </div>
        )}
        <div className="fundraiser-title-section">
          <h1>{fundraiser.title}</h1>
          <div className="fundraiser-meta">
            <span className="category">{fundraiser.category || 'General'}</span>
            <span className="organizer">
              <i className="fas fa-user"></i>
              Organized by {fundraiser.organizer || 'NonprofitNetwork'}
            </span>
          </div>
        </div>
      </div>

      <div className="fundraiser-content">
        <div className="fundraiser-main">
          <div className="fundraiser-description">
            <h2>About This Campaign</h2>
            <p>{fundraiser.description}</p>
          </div>

          <div className="donations-section">
            <h2>Recent Donations</h2>
            {fundraiser.donations && fundraiser.donations.length > 0 ? (
              <div className="donations-list">
                {fundraiser.donations.map((donation, index) => (
                  <div key={index} className="donation-item">
                    <div className="donor-avatar">
                      {(donation.userId?.name || 'Anonymous').charAt(0)}
                    </div>
                    <div className="donation-details">
                      <span className="donor-name">{donation.userId?.name || 'Anonymous'}</span>
                      <span className="donation-amount">${donation.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-donations">
                <i className="fas fa-heart"></i>
                <p>No donations yet. Be the first to support this campaign!</p>
              </div>
            )}
          </div>
        </div>

        <div className="fundraiser-sidebar">
          <div className="progress-card">
            <div className="progress-stats">
              <div className="amount-raised">
                <span className="value">${fundraiser.collectedAmount}</span>
                <span className="label">raised of ${fundraiser.goalAmount} goal</span>
              </div>
              <div className="donor-count">
                <span className="value">{fundraiser.donations?.length || 0}</span>
                <span className="label">donors</span>
              </div>
            </div>

            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${calculateProgress(fundraiser.collectedAmount, fundraiser.goalAmount)}%` }}
              >
                <span className="progress-text">
                  {Math.round(calculateProgress(fundraiser.collectedAmount, fundraiser.goalAmount))}%
                </span>
              </div>
            </div>

            {isLoggedIn ? (
              fundraiser.collectedAmount < fundraiser.goalAmount ? (
                <button 
                  className="donate-button"
                  onClick={() => setShowDonationForm(true)}
                >
                  Donate Now
                </button>
              ) : (
                <div className="goal-reached">
                  <i className="fas fa-check-circle"></i>
                  Goal Reached!
                </div>
              )
            ) : (
              <Link to="/login" className="login-to-donate">
                Log in to Donate
              </Link>
            )}
          </div>

          <div className="share-card">
            <h3>Share This Campaign</h3>
            <div className="share-buttons">
              <button className="share-button facebook">
                <i className="fab fa-facebook-f"></i>
                Share
              </button>
              <button className="share-button twitter">
                <i className="fab fa-twitter"></i>
                Tweet
              </button>
              <button className="share-button email">
                <i className="fas fa-envelope"></i>
                Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDonationForm && (
        <div className="donation-modal">
          <div className="donation-modal-content">
            <button className="close-modal" onClick={() => setShowDonationForm(false)}>
              ×
            </button>
            <form onSubmit={handleDonate} className="donation-form">
              <h2>Support This Campaign</h2>
              
              <div className="predefined-amounts">
                {predefinedAmounts.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    className={`amount-button ${donationAmount === amount.toString() ? 'active' : ''}`}
                    onClick={() => setDonationAmount(amount.toString())}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label>Custom Amount</label>
                <div className="amount-input">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    step="1"
                    required
                  />
                </div>
              </div>

              {!isLoggedIn && (
                <>
                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </>
              )}

              <button type="submit" className="submit-donation">
                Complete Donation
              </button>
            </form>
          </div>
        </div>
      )}

      {message && (
        <div className={`message-banner ${message.includes('Thank you') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FundraiserPage;
