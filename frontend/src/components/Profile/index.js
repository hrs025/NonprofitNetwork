import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { FaUser, FaEdit, FaDownload, FaHistory } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    await Promise.all([fetchUserProfile(), fetchUserDonations()]);
    setLoading(false);
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:3000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setEditedUser(response.data);
    } catch (error) {
      setMessage('Error fetching profile');
      console.error('Profile fetch error:', error);
    }
  };

  const fetchUserDonations = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user || !user.id) {
      setError('User ID is missing');
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:3000/api/campaigns/user/${user.id}/donations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
      setError('Failed to fetch donations');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.put(
        'http://localhost:3000/api/users/profile',
        editedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
      setEditing(false);
      setMessage('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile');
      console.error('Update error:', error);
    }
  };

  const downloadReceipt = (donation) => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Donation Receipt', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date(donation.date).toLocaleDateString()}`, 20, 40);
    doc.text(`Donor: ${user.name}`, 20, 50);
    doc.text(`Email: ${user.email}`, 20, 60);
    doc.text(`Campaign: ${donation.campaignTitle}`, 20, 80);
    doc.text(`Amount Donated: $${donation.amount}`, 20, 90);
    doc.text(`Thank you for your generous donation!`, 20, 110);
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('* This is a reprinted receipt.', 20, 130);
    
    doc.save(`Receipt_${donation.campaignTitle}.pdf`);
  };

  const calculateTotalDonations = () => {
    return donations.reduce((total, donation) => total + donation.amount, 0);
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser className="avatar-icon" />
        </div>
        <h2>{user?.name}'s Profile</h2>
      </div>

      <div className="profile-content">
        <section className="profile-stats">
          <div className="stat-card">
            <h4>Total Donations</h4>
            <p>${calculateTotalDonations()}</p>
          </div>
          <div className="stat-card">
            <h4>Donations Made</h4>
            <p>{donations.length}</p>
          </div>
          <div className="stat-card">
            <h4>Member Since</h4>
            <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        </section>

        <section className="profile-details">
          <div className="section-header">
            <h3>Profile Information</h3>
            <button 
              className="edit-button"
              onClick={() => setEditing(!editing)}
            >
              <FaEdit /> {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                />
              </div>
              <button type="submit" className="save-button">Save Changes</button>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <label>Name</label>
                <p>{user?.name}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{user?.email}</p>
              </div>
              <div className="info-item">
                <label>Role</label>
                <p>{user?.role}</p>
              </div>
            </div>
          )}
        </section>

        <section className="donation-history-section">
          <div className="section-header">
            <h3><FaHistory /> Donation History</h3>
          </div>
          
          {donations.length > 0 ? (
            <div className="donation-list">
              {donations.map((donation, index) => (
                <div key={index} className="donation-card">
                  <div className="donation-info">
                    <h4>{donation.campaignTitle}</h4>
                    <p className="donation-amount">${donation.amount}</p>
                    <p className="donation-date">
                      {new Date(donation.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="download-button"
                    onClick={() => downloadReceipt(donation)}
                    title="Download Receipt"
                  >
                    <FaDownload />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-donations">
              <p>No donations made yet.</p>
              <a href="/fundraising-hub" className="cta-button">
                Explore Campaigns
              </a>
            </div>
          )}
        </section>
      </div>

      {(message || error) && (
        <div className={`notification ${error ? 'error' : 'success'}`}>
          {message || error}
        </div>
      )}
    </div>
  );
};

export default Profile;
