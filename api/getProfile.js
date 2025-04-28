// /api/getProfile.js
import clientPromise from '../src/lib/mongodb'; // adjust path if needed

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('openscroll');
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ message: 'Missing userEmail' });
    }

    const unlockCollection = db.collection('unlocks');
    const articlesCollection = db.collection('articles');

    const unlockRecord = await unlockCollection.findOne({ userEmail });

    if (!unlockRecord || !unlockRecord.articles || unlockRecord.articles.length === 0) {
      return res.status(200).json({ unlockedArticles: [] });
    }

    const unlockedArticles = await articlesCollection.find({
      _id: { $in: unlockRecord.articles.map(id => new ObjectId(id)) }
    }).toArray();

    res.status(200).json({ unlockedArticles });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
}
