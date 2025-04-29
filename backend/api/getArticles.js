// /api/getArticles.js
import clientPromise from '../src/lib/mongodb'; // adjust path if needed

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('openscroll'); // your database name
    const articles = await db.collection('articles').find({}).toArray();

    res.status(200).json({ articles });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error fetching articles' });
  }
}
