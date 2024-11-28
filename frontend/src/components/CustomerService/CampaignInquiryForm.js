import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerService.css';

const CampaignInquiryForm = ({ setIsLoading }) => {
  const [message, setMessage] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem('token');
        const result = await axios.get('http://localhost:3000/api/campaigns', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCampaigns(result.data);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Error loading campaigns. Please try again later.');
      } finally {
        setLoadingCampaigns(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResponse('');
    setCampaignDetails(null);

    try {
      const token = localStorage.getItem('token');
      const result = await axios.post(
        'http://localhost:3000/api/ai/campaign',
        {
          message,
          campaignId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (result.data.needsHumanReview) {
        setResponse(result.data.response);
      } else {
        setResponse(result.data.response);
        setCampaignDetails(result.data.campaignDetails);
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message || 'Error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCampaign = campaigns.find(c => c._id === campaignId);

  return (
    <form onSubmit={handleSubmit} className="service-form">
      <div className="form-group">
        <label htmlFor="campaign">Select Campaign</label>
        {loadingCampaigns ? (
          <div className="loading-placeholder">
            <i className="fas fa-spinner fa-spin"></i>
            Loading campaigns...
          </div>
        ) : (
          <div className="campaign-select-wrapper">
            <select
              id="campaign"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              required
            >
              <option value="">Select a campaign...</option>
              {campaigns.map((campaign) => (
                <option key={campaign._id} value={campaign._id}>
                  {campaign.title}
                </option>
              ))}
            </select>
            <i className="fas fa-chevron-down select-arrow"></i>
          </div>
        )}
      </div>

      {selectedCampaign && (
        <div className="selected-campaign-info">
          <div className="campaign-preview">
            {selectedCampaign.imageUrl ? (
              <img src={selectedCampaign.imageUrl} alt={selectedCampaign.title} />
            ) : (
              <div className="campaign-image-placeholder">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
            )}
            <div className="campaign-quick-info">
              <h4>{selectedCampaign.title}</h4>
              <p>{selectedCampaign.description}</p>
              <div className="campaign-stats">
                <span>
                  <i className="fas fa-chart-line"></i>
                  Goal: ${selectedCampaign.goalAmount}
                </span>
                <span>
                  <i className="fas fa-users"></i>
                  {selectedCampaign.donorCount || 0} Donors
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="message">Your Inquiry</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What would you like to know about this campaign? (e.g., progress updates, fund allocation, milestones)"
          required
          rows="4"
        />
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="submit-button"
        disabled={!campaignId || !message}
      >
        <i className="fas fa-paper-plane"></i>
        Submit Inquiry
      </button>

      {response && (
        <div className="response-section">
          <div className="ai-response">
            <i className="fas fa-robot"></i>
            <div className="response-content">
              <h4>AI Assistant Response</h4>
              <p>{response}</p>
            </div>
          </div>

          {campaignDetails && (
            <div className="campaign-status-card">
              <h4>
                <i className="fas fa-chart-bar"></i>
                Campaign Status Overview
              </h4>
              
              <div className="status-grid">
                <div className="status-item progress">
                  <label>Progress</label>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${campaignDetails.progressPercentage}%` }}
                    >
                      <span className="progress-text">
                        {Math.round(campaignDetails.progressPercentage)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="status-item">
                  <label>
                    <i className="fas fa-dollar-sign"></i>
                    Amount Raised
                  </label>
                  <span className="value">${campaignDetails.collectedAmount}</span>
                </div>

                <div className="status-item">
                  <label>
                    <i className="fas fa-bullseye"></i>
                    Goal Amount
                  </label>
                  <span className="value">${campaignDetails.goalAmount}</span>
                </div>

                <div className="status-item">
                  <label>
                    <i className="fas fa-users"></i>
                    Total Donors
                  </label>
                  <span className="value">{campaignDetails.totalDonors}</span>
                </div>

                <div className="status-item">
                  <label>
                    <i className="fas fa-flag-checkered"></i>
                    Status
                  </label>
                  <span className={`status-badge ${campaignDetails.isCompleted ? 'completed' : 'ongoing'}`}>
                    {campaignDetails.isCompleted ? 'Completed' : 'Ongoing'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default CampaignInquiryForm;
