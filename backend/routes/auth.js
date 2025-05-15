const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Reader = require('../models/Reader');
const Writer = require('../models/Writer');
const rateLimit = require('express-rate-limit');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// ========== Rate Limiter (Recommended for production) ==========
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10, // limit to 10 login attempts per IP
  message: 'Too many login attempts. Try again after 15 minutes.'
});

// ========== Helper ==========
const getModelByRole = (role) => {
  return role === 'writer' ? Writer : Reader;
};

// =========================
// 🔐 Signup Route
// =========================
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim().toLowerCase();
    const Model = getModelByRole(cleanRole);

    const existingUser = await Model.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Model({ fullName, email: cleanEmail, password: hashedPassword, role: cleanRole });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: cleanEmail, role: cleanRole, fullName },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: { id: newUser._id, fullName, email: cleanEmail, role: cleanRole }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// =========================
// 🔐 Login Route
// =========================
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Missing login credentials' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim().toLowerCase();
    const Model = getModelByRole(cleanRole);

    const user = await Model.findOne({ email: cleanEmail });
    if (!user || user.role !== cleanRole) {
      return res.status(404).json({ message: 'User not found for this role' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
