const express = require('express');
const router = express.Router();
const Unlock = require('../models/Unlock');
const Article = require('../models/Article');

// GET /api/reader/purchases/:email
router.get('/purchases/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Find all unlocks by the reader
    const unlocks = await Unlock.find({ readerEmail: email }).sort({ unlockedAt: -1 });

    // Fetch article details for each unlock
    const purchases = await Promise.all(
      unlocks.map(async (unlock) => {
        const article = await Article.findById(unlock.articleId).lean();
        return {
          _id: article._id,
          title: article.title,
          category: article.category,
          price: article.price,
          unlockedAt: unlock.unlockedAt,
        };
      })
    );

    res.json(purchases);
  } catch (err) {
    console.error('Error fetching reader purchases:', err);
    res.status(500).json({ message: 'Server error fetching purchases' });
  }
});

module.exports = router;
