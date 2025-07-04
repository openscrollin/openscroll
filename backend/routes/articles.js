const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const authMiddleware = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/verifyAdmin');

// POST /api/articles (JWT Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      shortDesc,
      excerpt, // Accept excerpt as alias for shortDesc
      summary,
      body,
      price,
      coverImage,
      createdAt,
      authorEmail,
      authorName,
      category
    } = req.body;

    const { email: tokenEmail } = req.user;

    // Accept either shortDesc or excerpt for flexibility
    const desc = shortDesc || excerpt;

    // Validate required fields (allow drafts without coverImage/price)
    if (!title || !desc || !body || !authorEmail || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Author identity check
    if (authorEmail !== tokenEmail) {
      return res.status(403).json({ message: 'Author identity mismatch' });
    }

    const newArticle = new Article({
      title,
      shortDesc: desc,
      summary: summary || '',
      body,
      price: price || '0',
      coverImage: coverImage || '',
      authorEmail,
      authorName,
      category,
      createdAt: createdAt || new Date().toISOString()
    });

    await newArticle.save();
    res.status(201).json({ message: 'Article created successfully', article: newArticle });
  } catch (err) {
    console.error('Article creation error:', err);
    res.status(500).json({ message: 'Server error while creating article' });
  }
});

// DELETE /api/articles/:id (JWT Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;

    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    if (article.authorEmail !== email) return res.status(403).json({ message: 'Unauthorized' });

    await Article.findByIdAndDelete(id);
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error while deleting article' });
  }
});

// PUT /api/articles/:id (JWT protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;

    const existingArticle = await Article.findById(id);
    if (!existingArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    if (existingArticle.authorEmail !== email) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedData = {
      title: req.body.title,
      shortDesc: req.body.shortDesc || req.body.excerpt,
      summary: req.body.summary,
      body: req.body.body,
      price: req.body.price,
      category: req.body.category,
      coverImage: req.body.coverImage,
      updatedAt: new Date().toISOString()
    };

    await Article.findByIdAndUpdate(id, updatedData, { new: true });

    res.json({ message: 'Article updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error while updating article' });
  }
});

// GET /api/articles/public — List all public articles
router.get('/public', async (req, res) => {
  try {
    const articles = await Article.find()
      .select('title shortDesc summary price createdAt coverImage authorEmail authorName category')
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (err) {
    console.error('Public article fetch error:', err);
    res.status(500).json({ message: 'Failed to load public articles' });
  }
});

// GET /api/articles/public/:id — Single article
router.get('/public/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).lean();
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    console.error('Error fetching article:', err);
    res.status(500).json({ message: 'Server error while fetching article' });
  }
});

// GET /api/articles/all – Admin-only route for dashboard
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error('Admin fetch error:', err);
    res.status(500).json({ message: 'Server error while fetching articles' });
  }
});

module.exports = router;
