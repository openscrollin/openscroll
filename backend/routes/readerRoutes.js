const express = require('express');
const router = express.Router();
const Reader = require('../models/Reader');
const Article = require('../models/Article');
const verifyReaderToken = require('../middleware/verifyReader');

// GET /api/reader/stats
router.get('/stats', verifyReaderToken, async (req, res) => {
  try {
    const readerId = req.reader._id;

    const reader = await Reader.findById(readerId).populate('purchased favorites');

    const purchased = reader.purchased || [];
    const favorites = reader.favorites || [];

    const categories = [
      ...new Set(purchased.map((a) => a.category).filter(Boolean)),
    ];

    res.json({
      purchased,
      favorites,
      categories,
    });
  } catch (err) {
    console.error('Reader stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
