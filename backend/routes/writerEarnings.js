const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Unlock = require('../models/Unlock');

// GET /api/writer/earnings/:email
router.get('/earnings/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Find all articles by this writer
    const articles = await Article.find({ authorEmail: email });

    let totalEarnings = 0;
    const enrichedArticles = await Promise.all(
      articles.map(async (article) => {
        const unlockCount = await Unlock.countDocuments({ articleId: article._id });
        const price = Number(article.price);
        const articleEarnings = price * unlockCount;

        totalEarnings += articleEarnings;

        return {
          ...article.toObject(),
          unlockCount,
          articleEarnings,
        };
      })
    );

    res.json({
      totalEarnings,
      articles: enrichedArticles,
    });
  } catch (err) {
    console.error('Error fetching earnings:', err);
    res.status(500).json({ message: 'Server error fetching earnings' });
  }
});

module.exports = router;
