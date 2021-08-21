import Client from '/utils/lib/mongodb';
import { ObjectID } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(403).json({ error: 'method not allowed' });
  }
  const id = req.query.userId;

  const clientConnect = await Client.connect();
  const db = await clientConnect.db('next-social');
  const friendCollection = await db.collection('friend');
  const postCollection = await db.collection('posts');

  const users = await friendCollection.find({
    $or: [{ friend1Id: id }, { friend2Id: id }]
  });

  const friends = [];
  await users.forEach((user) => {
    if (user.friend1Id === id) friends.push(user.friend2Id);
    if (user.friend2Id === id) friends.push(user.friend1Id);
  });

  let posts = [];

  //not sure if i want their regular userId or to be ObjectID
  if (friends.length) {
    posts = await postCollection.find({ userId: { $in: friends } });
  }
  const myPosts = await postCollection.find({ userId: id });

  const results = [];

  await posts.forEach((post) => {
    results.push(post);
  });

  await myPosts.forEach((post) => {
    results.push(post);
  });

  //need to filter posts

  res.status(200).json({ posts: results });
}
