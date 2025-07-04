// /api/addArticle.js

import clientPromise from '../src/lib/mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); // ✅ Load .env variables

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  // --- JWT Authentication ---
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔐 Token received:', token);
  console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET);

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('openscroll');

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
}
