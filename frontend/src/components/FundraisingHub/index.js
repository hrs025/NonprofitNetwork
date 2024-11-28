import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './FundraisingHub.css';

const FundraisingHub = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        setUserRole(user?.role || '');

        const response = await axios.get('http://localhost:3000/api/campaigns', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCampaigns(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Failed to load campaigns');
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    return campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="fundraising-loading">
        <div className="loading-spinner"></div>
        <p>Loading campaigns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fundraising-error">
        <i className="fas fa-exclamation-circle"></i>
        <h2>Error Loading Campaigns</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="fundraising-hub">
      <div className="fundraising-header">
        <h1>Fundraising Campaigns</h1>
        <p className="fundraising-subtitle">Support causes that matter and make a difference in your community</p>
      </div>

      <div className="fundraising-controls">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {userRole === 'admin' && (
          <Link to="/create-campaign" className="create-campaign-button">
            <i className="fas fa-plus"></i>
            Create Campaign
          </Link>
        )}
      </div>

      <div className="campaigns-grid">
        {filteredCampaigns.length === 0 ? (
          <div className="no-campaigns">
            <i className="fas fa-hand-holding-heart"></i>
            <h2>No Campaigns Found</h2>
            <p>There are no active campaigns matching your search.</p>
            {userRole === 'admin' && (
              <Link to="/create-campaign" className="create-first-campaign">
                Create Your First Campaign
              </Link>
            )}
          </div>
        ) : (
          filteredCampaigns.map(campaign => (
            <div key={campaign._id} className="campaign-card">
              <div className="campaign-image">
                {campaign.imageUrl ? (
                  <img src={campaign.imageUrl} alt={campaign.title} />
                ) : (
                  <div className="placeholder-image">
                    <i className="fas fa-heart"></i>
                  </div>
                )}
              </div>

              <div className="campaign-content">
                <h3>{campaign.title}</h3>
                <p className="campaign-description">{campaign.description}</p>
                
                <div className="campaign-progress">
                  <div className="progress-stats">
                    <div className="amount-raised">
                      <span className="label">Raised</span>
                      <span className="value">${campaign.collectedAmount}</span>
                    </div>
                    <div className="amount-goal">
                      <span className="label">Goal</span>
                      <span className="value">${campaign.goalAmount}</span>
                    </div>
                  </div>
                  
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min((campaign.collectedAmount / campaign.goalAmount) * 100, 100)}%` }}
                    >
                      <span className="progress-percentage">
                        {Math.round((campaign.collectedAmount / campaign.goalAmount) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="campaign-meta">
                  <span className="donor-count">
                    <i className="fas fa-users"></i>
                    {campaign.donorCount || 0} donors
                  </span>
                </div>

                <div className="campaign-actions">
                  <Link 
                    to={`/fundraiser/${campaign._id}`} 
                    className="view-campaign-button"
                  >
                    View Details
                  </Link>
                  <Link 
                    to={`/fundraiser/${campaign._id}/donation`} 
                    className="donate-button"
                  >
                    Donate Now
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FundraisingHub;
