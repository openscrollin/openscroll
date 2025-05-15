// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const Featured = require('../models/Featured'); // import model
const authenticateAdmin = require('../middleware/authenticateAdmin'); // you should have this middleware
const mongoose = require('mongoose');

router.post('/feature-article', authenticateAdmin, async (req, res) => {
  const { articleId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    return res.status(400).json({ success: false, message: 'Invalid article ID' });
  }

  try {
    // Remove previous featured article (only one allowed)
    await Featured.deleteMany({});

    // Save new featured article
    const featured = new Featured({ articleId });
    await featured.save();

    res.json({ success: true, message: 'Featured article updated' });
  } catch (err) {
    console.error('Feature article error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
