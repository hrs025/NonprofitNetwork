import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchUserProfile();
    fetchUserDonations();
  }, []);

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

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      {user ? (
        <div className="profile-content">
          <section className="profile-details">
            <h3>Profile Details</h3>
            <div className="profile-item">
              <p><strong>Name:</strong> {user.name}</p>
            </div>
            <div className="profile-item">
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="profile-item">
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          </section>

          <section className="donation-history-section">
            <h3>Donation History</h3>
            {donations.length > 0 ? (
              <ul className="donation-history">
                {donations.map((donation, index) => (
                  <li key={index} className="donation-item">
                    <p><strong>Campaign:</strong> {donation.campaignTitle}</p>
                    <p><strong>Amount Donated:</strong> ${donation.amount}</p>
                    <p><strong>Date:</strong> {new Date(donation.date).toLocaleDateString()}</p>
                    <button
                      className="download-button"
                      onClick={() => downloadReceipt(donation)}
                    >
                      Download Receipt
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-donations">No donations yet.</p>
            )}
          </section>

          {message && <p className="error-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
