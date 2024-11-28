// DonationForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './DonationForm.css';

const DonationForm = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const { id } = useParams(); // Assuming campaign ID is passed as a URL parameter
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:3000/campaigns/${id}/donate`,
        {
          donationAmount,
          name,
          cardNumber,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Donation successful!');
      setTimeout(() => {
        navigate(`/campaigns/${id}`);
      }, 2000); // Redirect to fundraiser page after 2 seconds
    } catch (error) {
      console.error('Error donating:', error);
      setMessage('Failed to donate.');
    }
  };

  return (
    <div className="donation-form-container">
      <h2>Donate to Campaign</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Credit Card Number</label>
          <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Donation Amount</label>
          <input type="number" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} required />
        </div>
        <button type="submit">Confirm Donation</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DonationForm;
