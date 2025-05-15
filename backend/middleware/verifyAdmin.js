const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: 'Not an admin' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error('verifyAdmin error:', err);
    res.status(401).json({ message: 'Invalid admin token' });
  }
};

module.exports = verifyAdmin;
