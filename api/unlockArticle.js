// /api/unlockArticle.js
import clientPromise from '../src/lib/mongodb'; // adjust if needed

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('openscroll');
    const { userEmail, articleId } = req.body;

    if (!userEmail || !articleId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const unlockCollection = db.collection('unlocks');

    await unlockCollection.updateOne(
      { userEmail },
      { $addToSet: { articles: articleId } },
      { upsert: true }
    );

    res.status(200).json({ message: 'Article unlocked successfully' });
  } catch (error) {
    console.error('Error unlocking article:', error);
    res.status(500).json({ message: 'Error unlocking article' });
  }
}
