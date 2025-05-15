const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Featured = require('../models/Featured');
const Admin = require('../models/Admin');
const verifyAdmin = require('../middleware/verifyAdmin');

// POST /api/admin/feature-article (up to 3 articles)
router.post('/feature-article', verifyAdmin, async (req, res) => {
  try {
    const { articleIds } = req.body;

    if (!Array.isArray(articleIds) || articleIds.length > 3) {
      return res.status(400).json({
        success: false,
        message: 'You must provide an array of up to 3 article IDs.',
      });
    }

    const validArticles = await Article.find({ _id: { $in: articleIds } });
    if (validArticles.length !== articleIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more article IDs are invalid.',
      });
    }

    await Featured.findOneAndUpdate({}, { articleIds }, { upsert: true, new: true });

    res.json({ success: true, message: 'Featured articles updated successfully' });
  } catch (error) {
    console.error('Error saving featured articles:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/promotions (retrieve featured article IDs)
router.get('/promotions', verifyAdmin, async (req, res) => {
  try {
    const featured = await Featured.findOne({});
    res.json({ featuredArticles: featured?.articleIds || [] });
  } catch (err) {
    console.error('Error fetching promotions:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/admin/change-password
router.post('/change-password', verifyAdmin, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = req.admin; // Set by verifyAdmin middleware

    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Old password is incorrect' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
