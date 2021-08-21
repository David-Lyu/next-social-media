import Client from '../../../../utils/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'invalid method' });
  }
  const data = req.body;

  const clientConnect = await Client.connect();
  const db = await clientConnect.db('next-social');
  const postCollection = await db.collection('posts');

  postCollection.insertOne(data);

  res.status(201).json({ message: 'post saved!' });
}
