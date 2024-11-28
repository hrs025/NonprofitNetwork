import React, { useState } from 'react';
import axios from 'axios';
import './CustomerService.css';

const ReceiptIssueForm = ({ setIsLoading }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [receiptContent, setReceiptContent] = useState(null);
  const [updates, setUpdates] = useState({
    name: '',
    email: ''
  });
  const [updatedReceiptUrl, setUpdatedReceiptUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResponse('');
    setUpdatedReceiptUrl(null);

    try {
      const formData = new FormData();
      formData.append('message', message);
      if (file) {
        formData.append('file', file);
      }

      const hasNameChange = updates.name && updates.name !== receiptContent?.name;
      const hasEmailChange = updates.email && updates.email !== receiptContent?.email;

      if (hasNameChange || hasEmailChange) {
        const updateData = {
          name: hasNameChange ? updates.name : receiptContent?.name,
          email: hasEmailChange ? updates.email : receiptContent?.email,
          amount: receiptContent?.amount,
          date: receiptContent?.date,
          campaign: receiptContent?.campaign
        };
        formData.append('updates', JSON.stringify(updateData));
      }

      const result = await axios.post('http://localhost:3000/api/ai/receipt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        validateStatus: function (status) {
          return status < 500;
        }
      });

      if (result.status === 200) {
        setResponse(result.data.response);
        if (result.data.receiptContent && !result.data.newReceiptPath) {
          setReceiptContent(result.data.receiptContent);
          setUpdates({
            name: result.data.receiptContent.name,
            email: result.data.receiptContent.email
          });
        }
        if (result.data.newReceiptPath) {
          setUpdatedReceiptUrl(`http://localhost:3000${result.data.newReceiptPath}`);
        }
      } else {
        throw new Error(result.data.error || 'Failed to process receipt issue');
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message || 'Error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload only PDF files.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        return;
      }
      setFile(selectedFile);
      setError('');
      setReceiptContent(null);
      setUpdatedReceiptUrl(null);
      setUpdates({ name: '', email: '' });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdates(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="service-form">
      <div className="form-group">
        <label htmlFor="message">Describe Your Issue</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe what needs to be updated on your receipt..."
          required
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Upload Receipt</label>
        <div 
          className={`file-upload-area ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            id="file-input"
            className="hidden-input"
          />
          <label htmlFor="file-input" className="file-upload-label">
            {file ? (
              <>
                <i className="fas fa-file-pdf"></i>
                <span>{file.name}</span>
                <button 
                  type="button" 
                  className="remove-file"
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null);
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </>
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt"></i>
                <span>Drag & drop your receipt here or click to browse</span>
                <small>Only PDF files are accepted (Max size: 5MB)</small>
              </>
            )}
          </label>
        </div>
      </div>

      {receiptContent && !receiptContent.error && (
        <div className="receipt-details-card">
          <h3>
            <i className="fas fa-receipt"></i>
            Current Receipt Information
          </h3>
          
          <div className="receipt-info-grid">
            <div className="info-item">
              <label>Name</label>
              <p>{receiptContent.name}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{receiptContent.email}</p>
            </div>
            <div className="info-item">
              <label>Amount</label>
              <p>{receiptContent.amount}</p>
            </div>
            <div className="info-item">
              <label>Date</label>
              <p>{receiptContent.date}</p>
            </div>
            <div className="info-item">
              <label>Campaign</label>
              <p>{receiptContent.campaign}</p>
            </div>
          </div>

          <div className="update-section">
            <h4>Update Information</h4>
            <p className="update-note">
              <i className="fas fa-info-circle"></i>
              Only name and email can be updated. Other details will remain unchanged.
            </p>
            
            <div className="update-fields">
              <div className="form-group">
                <label htmlFor="name">New Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={updates.name}
                  onChange={handleUpdateChange}
                  placeholder="Enter new name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">New Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={updates.email}
                  onChange={handleUpdateChange}
                  placeholder="Enter new email"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="submit-button"
        disabled={!message || !file}
      >
        <i className="fas fa-paper-plane"></i>
        Submit Request
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

          {updatedReceiptUrl && (
            <a 
              href={updatedReceiptUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-button"
            >
              <i className="fas fa-download"></i>
              Download Updated Receipt
            </a>
          )}
        </div>
      )}
    </form>
  );
};

export default ReceiptIssueForm;
