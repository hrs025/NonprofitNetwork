import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      sender: 'bot',
      message: 'Welcome to NonprofitNetwork! 👋 I\'m your AI assistant. I can help you with:\n\n' +
               '• Event information and registration\n' +
               '• Donation processes\n' +
               '• General platform questions\n' +
               '• Technical support\n\n' +
               'How can I assist you today?'
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    // Add user message to the state
    const newMessage = { sender: 'user', message: userInput };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsLoading(true);

    try {
      // Send message to chatbot endpoint
      const response = await axios.post('http://localhost:3000/api/chatbot/message', {
        message: userInput
      });

      // Add bot response to the state
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', message: response.data.response }
      ]);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          sender: 'bot', 
          message: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact our support team if the issue persists.' 
        },
      ]);
    } finally {
      setIsLoading(false);
      setUserInput('');
      setSelectedFile(null);
    }
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should not exceed 5MB');
        return;
      }
      setSelectedFile(file);

      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);

      try {
        setIsLoading(true);
        const response = await axios.post('http://localhost:3000/api/chatbot/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setMessages(prevMessages => [...prevMessages, {
          sender: 'bot',
          message: response.data.response
        }]);
      } catch (error) {
        console.error('Error uploading file:', error);
        setMessages(prevMessages => [...prevMessages, {
          sender: 'bot',
          message: 'Sorry, I had trouble processing your file. Please try again or use a different file.'
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Toggle chatbox open/close
  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  // Handle keypress (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen ? (
        <button className="chatbot-toggle-button" onClick={toggleChatbox}>
          <span className="chat-icon">💬</span>
          Need Help?
        </button>
      ) : (
        <div className="chatbot-container">
          <div className="chatbox-header">
            <h3>NonprofitNetwork Assistant</h3>
            <button className="close-button" onClick={toggleChatbox}>×</button>
          </div>
          <div className="chat-window" ref={chatWindowRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.link ? (
                  <div className="message-with-link">
                    <p>{msg.message}</p>
                    <a href={msg.link} className="form-link">Go to Form</a>
                  </div>
                ) : (
                  <p>{msg.message}</p>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
          <div className="input-container">
            <div className="file-upload-wrapper">
              <label className="file-upload-label">
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="file-upload"
                  accept="image/*,.pdf"
                />
                📎
              </label>
              {selectedFile && (
                <span className="file-name">{selectedFile.name}</span>
              )}
            </div>
            <div className="message-input-wrapper">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows="1"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !userInput.trim()}
                className="send-button"
                aria-label="Send message"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
