import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db('openscroll');
    const articlesCollection = db.collection('articles');

    if (req.method === 'GET') {
      const articles = await articlesCollection.find({}).toArray();
      return res.status(200).json(articles);
    }

    if (req.method === 'POST') {
      const { title, shortDesc, body, price, authorEmail } = req.body;
      
      if (!title || !body || !authorEmail) {
        return res.status(400).json({ message: 'Missing fields' });
      }

      await articlesCollection.insertOne({
        title,
        shortDesc,
        body,
        price,
        authorEmail,
        createdAt: new Date(),
      });

      return res.status(201).json({ message: 'Article created successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}
