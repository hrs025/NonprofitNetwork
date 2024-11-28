const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); // User is admin, allow the action
    } else {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  };
  
  module.exports = checkAdmin;
  