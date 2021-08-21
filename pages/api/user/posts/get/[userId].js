import Client from '../../../../../utils/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(400).json({ error: 'wrong http method' });
  }
  const id = req.query.userId;
  const clientConnect = await Client.connect();
  const db = await clientConnect.db('next-social');
  const postCollection = await db.collection('posts');

  const query = {
    userId: id
  };

  // const option = {
  //   sort: { date: 0 }
  // };

  const posts = await postCollection.find(query);
  const results = [];

  await posts.forEach((post) => results.push(post));
  //i think mongo client handles itself with the close so can omit
  //if refresh too fast this Client.close creates error
  // Client.close();

  res.status(200).json({ posts: results });
}
