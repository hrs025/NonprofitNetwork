const News = require('../models/News');

// Get all news
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
};

// Create new news (Admin only)
exports.createNews = async (req, res) => {
  const { title, date, content } = req.body;

  try {
    const newNews = new News({ title, date, content });
    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ message: 'Error creating news', error });
  }
};

// Delete news (Admin only)
// Delete news (Admin only)
exports.deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    // Use findByIdAndDelete to remove the news item
    const news = await News.findByIdAndDelete(id);

    if (!news) {
      return res.status(404).json({ message: 'News item not found' });
    }

    res.status(200).json({ message: 'News item deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Error deleting news', error });
  }
};

