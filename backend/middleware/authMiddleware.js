const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        response: "Please log in to access this feature. I'll connect you with a human agent who can help you with the login process.",
        needsHumanReview: true
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        response: "Your session has expired. Please log in again. I'll connect you with a human agent who can help.",
        needsHumanReview: true
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      response: "I'm having trouble verifying your login. I'll connect you with a human agent who can help.",
      needsHumanReview: true
    });
  }
};

module.exports = authMiddleware;
