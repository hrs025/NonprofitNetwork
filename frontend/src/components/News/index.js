import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/news');
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news', error);
        setMessage('Failed to load news articles');
      } finally {
        setIsLoading(false);
      }
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'admin') {
      setIsAdmin(true);
    }

    fetchNews();
  }, []);

  const handlePostNews = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/news',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNews([response.data, ...news]);
      setTitle('');
      setContent('');
      setMessage('News posted successfully!');
    } catch (error) {
      console.error('Error posting news:', error);
      setMessage('Failed to post news');
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/news/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNews(news.filter((item) => item._id !== id));
      setMessage('News deleted successfully!');
    } catch (error) {
      console.error('Error deleting news:', error);
      setMessage('Failed to delete news');
    }
  };

  const filteredNews = news.filter(item => {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="news-loading">
        <div className="loading-spinner"></div>
        <p>Loading news articles...</p>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="news-header">
        <h1>Latest News</h1>
        <p className="news-subtitle">Stay updated with our latest announcements and updates</p>
      </div>

      {message && (
        <div className={`message-banner ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="news-controls">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search news articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isAdmin && (
        <div className="post-news-section">
          <h2>Post New Article</h2>
          <form onSubmit={handlePostNews} className="post-news-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                required
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                required
                rows="6"
              />
            </div>
            <button type="submit" className="submit-button">
              <i className="fas fa-paper-plane"></i>
              Publish Article
            </button>
          </form>
        </div>
      )}

      <div className="news-list">
        {filteredNews.length === 0 ? (
          <div className="no-news">
            <i className="fas fa-newspaper"></i>
            <h2>No News Articles Found</h2>
            <p>There are no articles matching your search.</p>
            {isAdmin && <p>Create your first article to get started!</p>}
          </div>
        ) : (
          filteredNews.map((item) => (
            <article key={item._id} className="news-card">
              <div className="news-card-header">
                <div className="news-meta">
                  <span className="news-date">
                    <i className="far fa-clock"></i>
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h2>{item.title}</h2>
              </div>
              
              <div className="news-content">
                <p>{item.content}</p>
              </div>
              
              <div className="news-footer">
                <div className="news-actions">
                  {isAdmin && (
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteNews(item._id)}
                      title="Delete Article"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default News;
