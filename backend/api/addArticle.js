// /api/addArticle.js
import clientPromise from '../src/lib/mongodb'; // Adjust if needed

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('openscroll');
    const { title, shortDesc, body, price, authorName, authorEmail } = req.body;

    if (!title || !shortDesc || !body || !authorEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newArticle = {
      title,
      shortDesc,
      body,
      price: price || '0',
      authorName,
      authorEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('articles').insertOne(newArticle);

    res.status(201).json({ message: 'Article added successfully', articleId: result.insertedId });
  } catch (error) {
    console.error('Error adding article:', error);
    res.status(500).json({ message: 'Error adding article' });
  }
}
