import React from 'react';
import { useNavigate } from 'react-router-dom';
import './News.css';

const NewsPreview  = () => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleViewNews = () => {
    navigate('/news'); // Navigate to the events page
  };

  return (
    <div className="feature news">
      <h3>Latest News</h3>
      <p>Read the latest updates and news from our organization.</p>
      <button className="news-button" onClick={handleViewNews}>Read News</button>
    </div>
  );
};

export default NewsPreview ;
