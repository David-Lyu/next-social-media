import Client from '../../../../utils/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(403).json({ error: 'method not allowed' });
  }
  const { searchVal } = req.query;
  const regex = new RegExp(`.*${searchVal}.*`, 'i');

  const clientConnect = await Client.connect();
  const db = await clientConnect.db('next-social');
  const userCollection = await db.collection('users');

  const users = await userCollection.find({
    $or: [
      { name: regex },
      { username: regex },
      { firstName: regex },
      { lastName: regex },
      { email: regex }
    ]
  });
  const results = [];

  await users.forEach((user) => {
    const name = user.urlPath ? 'urlPath' : 'id';
    results.push({
      [name]: user.urlPath ? user.urlPath : user._id,
      username: user.username ? user.username : user.email,
      firstName: user.firstName ? user.firstName : user.name,
      lastName: user.lastName
    });
  });

  res.status(200).json({ results });
}
