const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ import

// GET /api/dashboard/:email (protected)
router.get('/dashboard/:email', authMiddleware, async (req, res) => {
  try {
    const { email } = req.params;

    // ✅ Optional: Prevent access unless email in token matches requested email
    if (req.user.email !== email) {
      return res.status(403).json({ message: 'Unauthorized access to dashboard' });
    }

    const articles = await Article.find({ authorEmail: email });

    const totalArticles = articles.length;
    const totalEarnings = articles.reduce((sum, article) => {
      const price = parseFloat(article.price);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    res.json({
      totalArticles,
      totalEarnings,
      articles,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
});

module.exports = router;
