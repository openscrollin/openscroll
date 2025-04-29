import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { fullName, email, password } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
      }

      await client.connect();
      const db = client.db('openscroll');
      const usersCollection = db.collection('users');

      const existingUser = await usersCollection.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      await usersCollection.insertOne({ fullName, email, password });

      return res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
