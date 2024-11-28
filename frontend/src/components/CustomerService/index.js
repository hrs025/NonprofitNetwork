import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReceiptIssueForm from './ReceiptIssueForm';
import CampaignInquiryForm from './CampaignInquiryForm';
import FraudDetectionForm from './FraudDetectionForm';
import './CustomerService.css';

const CustomerService = () => {
  const [activeForm, setActiveForm] = useState('receipt');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const formType = params.get('form');
    if (formType && ['receipt', 'campaign', 'fraud'].includes(formType)) {
      setActiveForm(formType);
    }
  }, [location]);

  const formInfo = {
    receipt: {
      title: 'Receipt Issues',
      icon: 'fas fa-receipt',
      description: 'Having trouble with your donation receipt? We can help you resolve any receipt-related issues.',
    },
    campaign: {
      title: 'Campaign Inquiries',
      icon: 'fas fa-hand-holding-heart',
      description: 'Questions about a specific campaign? Get assistance with campaign-related inquiries.',
    },
    fraud: {
      title: 'Report Fraud',
      icon: 'fas fa-shield-alt',
      description: 'Help us maintain a safe platform by reporting suspicious activities or potential fraud.',
    },
  };

  const renderForm = () => {
    switch (activeForm) {
      case 'receipt':
        return <ReceiptIssueForm setIsLoading={setIsLoading} />;
      case 'campaign':
        return <CampaignInquiryForm setIsLoading={setIsLoading} />;
      case 'fraud':
        return <FraudDetectionForm setIsLoading={setIsLoading} />;
      default:
        return <ReceiptIssueForm setIsLoading={setIsLoading} />;
    }
  };

  return (
    <div className="customer-service-container">
      <div className="service-header">
        <h1>Customer Support Center</h1>
        <p className="service-subtitle">
          AI-powered assistance for quick and efficient support
        </p>
      </div>

      <div className="service-content">
        <div className="service-navigation">
          {Object.entries(formInfo).map(([key, info]) => (
            <button
              key={key}
              className={`nav-button ${activeForm === key ? 'active' : ''}`}
              onClick={() => setActiveForm(key)}
              aria-label={`Switch to ${info.title} form`}
            >
              <i className={info.icon}></i>
              <span className="button-text">{info.title}</span>
            </button>
          ))}
        </div>

        <div className="service-main">
          <div className="form-header">
            <i className={formInfo[activeForm].icon}></i>
            <div className="form-header-text">
              <h2>{formInfo[activeForm].title}</h2>
              <p>{formInfo[activeForm].description}</p>
            </div>
          </div>

          <div className="form-wrapper" role="main" aria-label={`${formInfo[activeForm].title} Form`}>
            {isLoading ? (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <p>Processing your request...</p>
              </div>
            ) : (
              renderForm()
            )}
          </div>
        </div>

        <div className="help-section">
          <div className="help-card chatbot-info">
            <i className="fas fa-robot"></i>
            <h3>24/7 AI Assistant</h3>
            <p>Get instant help from our AI chatbot for common questions and quick assistance.</p>
          </div>

          <div className="help-card contact-info">
            <i className="fas fa-headset"></i>
            <h3>Need More Help?</h3>
            <p>Our support team is available Monday to Friday, 9 AM - 5 PM EST.</p>
            <div className="contact-methods">
              <a href="mailto:support@nonprofitnetwork.com" className="contact-link">
                <i className="fas fa-envelope"></i>
                Email Support
              </a>
              <a href="tel:+1234567890" className="contact-link">
                <i className="fas fa-phone"></i>
                Call Support
              </a>
            </div>
          </div>

          <div className="help-card faq-info">
            <i className="fas fa-question-circle"></i>
            <h3>Common Questions</h3>
            <ul className="faq-list">
              <li>
                <a href="#receipt-faq">How to download my donation receipt?</a>
              </li>
              <li>
                <a href="#campaign-faq">Starting a new campaign</a>
              </li>
              <li>
                <a href="#donation-faq">Donation process guide</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="service-footer">
        <p>
          <i className="fas fa-info-circle"></i>
          Our AI system processes your request immediately. For complex issues, our support team will follow up within 24 hours.
        </p>
      </div>
    </div>
  );
};

export default CustomerService;
