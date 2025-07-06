const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  try {
    const db = mongoose.connection;

    const { title, shortDesc, excerpt, body, price, authorName, authorEmail } = req.body;
    const desc = shortDesc || excerpt;

    if (!title || !desc || !body || !authorEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newArticle = {
      title,
      shortDesc: desc,
      body,
      price: price || '0',
      authorName,
      authorEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('articles').insertOne(newArticle);

    res.status(201).json({
      message: 'Article added successfully',
      articleId: result.insertedId,
    });
  } catch (error) {
    console.error('Error adding article:', error);
    res.status(500).json({ message: 'Error adding article' });
  }
});

module.exports = router;
