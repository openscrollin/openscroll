import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
      }

      await client.connect();
      const db = client.db('openscroll');
      const usersCollection = db.collection('users');

      const user = await usersCollection.findOne({ email });

      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      return res.status(200).json({ message: 'Login successful', user: { fullName: user.fullName, email: user.email } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
