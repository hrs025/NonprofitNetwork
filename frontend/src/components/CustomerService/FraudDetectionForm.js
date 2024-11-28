import React, { useState } from 'react';
import axios from 'axios';
import './CustomerService.css';

const FraudDetectionForm = ({ setIsLoading }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [transactionDetails, setTransactionDetails] = useState({
    date: '',
    amount: '',
    transactionId: ''
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('transactionDetails', JSON.stringify(transactionDetails));
      if (file) {
        formData.append('file', file);
      }

      const token = localStorage.getItem('token');
      const result = await axios.post(
        'http://localhost:3000/api/ai/fraud',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResponse(result.data.response);
      
      if (!result.data.needsHumanReview) {
        setMessage('');
        setFile(null);
        setTransactionDetails({
          date: '',
          amount: '',
          transactionId: ''
        });
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message || 'Error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile) {
      if (!['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(selectedFile.type)) {
        setError('Please upload only images (JPG, PNG, GIF) or PDF files.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
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

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setTransactionDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="service-form">
      <div className="form-section">
        <h3>
          <i className="fas fa-exclamation-triangle"></i>
          Transaction Details
        </h3>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="transactionDate">
              <i className="far fa-calendar-alt"></i>
              Transaction Date
            </label>
            <input
              type="date"
              id="transactionDate"
              name="date"
              value={transactionDetails.date}
              onChange={handleDetailChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">
              <i className="fas fa-dollar-sign"></i>
              Transaction Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={transactionDetails.amount}
              onChange={handleDetailChange}
              placeholder="Enter amount"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="transactionId">
              <i className="fas fa-hashtag"></i>
              Transaction ID
            </label>
            <input
              type="text"
              id="transactionId"
              name="transactionId"
              value={transactionDetails.transactionId}
              onChange={handleDetailChange}
              placeholder="Optional - Enter transaction ID"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>
          <i className="fas fa-shield-alt"></i>
          Fraud Report Details
        </h3>

        <div className="form-group">
          <label htmlFor="message">Describe the Suspicious Activity</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please provide details about why you believe this transaction is fraudulent. Include any relevant information that might help our investigation."
            required
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Upload Evidence</label>
          <div 
            className={`file-upload-area ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              id="file-input"
              className="hidden-input"
            />
            <label htmlFor="file-input" className="file-upload-label">
              {file ? (
                <>
                  <i className={`fas ${file.type.includes('image') ? 'fa-image' : 'fa-file-pdf'}`}></i>
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
                  <span>Drag & drop evidence files here or click to browse</span>
                  <small>Supported formats: Images (JPG, PNG, GIF) and PDF (Max size: 5MB)</small>
                </>
              )}
            </label>
          </div>
        </div>
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
        disabled={!message || !transactionDetails.date || !transactionDetails.amount}
      >
        <i className="fas fa-paper-plane"></i>
        Submit Fraud Report
      </button>

      {response && (
        <div className="response-section">
          <div className={`ai-response ${response.includes('initiated a refund') ? 'success' : ''}`}>
            <i className="fas fa-robot"></i>
            <div className="response-content">
              <h4>AI Assistant Response</h4>
              <p>{response}</p>
            </div>
          </div>

          <div className="next-steps">
            <h4>
              <i className="fas fa-clipboard-list"></i>
              Next Steps
            </h4>
            <ul>
              <li>Our fraud detection team will review your report within 24 hours</li>
              <li>You will receive email updates about the investigation</li>
              <li>Additional information may be requested if needed</li>
              <li>For urgent matters, please contact our support team directly</li>
            </ul>
          </div>
        </div>
      )}
    </form>
  );
};

export default FraudDetectionForm;
