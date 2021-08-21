import { ObjectID } from 'mongodb';
import Client from '../../../../utils/lib/mongodb';

export default async function handler(req, res) {
  if (
    req.method !== 'POST' &&
    req.method !== 'DELETE' &&
    req.method !== 'GET'
  ) {
    return res.status(400).json({ error: 'Method not allowed' });
  }

  //Incoming Data
  let friendId;
  let userId = '';
  if (req.method === 'GET') {
    friendId = req.query.friendId;
    userId = req.query.userId;
  } else {
    friendId = req.body.friendId;
    userId = req.body.userId;
  }

  if (!friendId || !userId) {
    return res.status(404).json({ error: 'Id not found' });
  }
  //Connect to mongoDB
  const clientConnect = await Client.connect();
  const db = await clientConnect.db('next-social');
  const friendCollection = await db.collection('friend');
  const friend = await friendCollection.findOne({
    $or: [
      {
        $and: [{ friend1Id: userId }, { friend2Id: friendId }]
      },
      {
        $and: [{ friend1Id: friendId }, { friend2Id: userId }]
      }
    ]
  });

  //What it do
  if (!friend) {
    if (req.method === 'POST') {
      addFriend(userId, friendId, friendCollection, res);
    }
    if (req.method === 'GET') res.status(200).json({ isFriend: false });
    if (req.method === 'DELETE') {
      res.status(404).json({ error: 'friend not found' });
    }
  }

  if (friend) {
    if (req.method === 'GET') res.status(200).json({ isFriend: true });
    if (req.method === 'DELETE') deleteFriend(friend, friendCollection, res);
    if (req.method === 'POST') {
      res.status(403).json({ error: 'method not allowed' });
    }
  }
  return;
}

function addFriend(userId, friendId, friendCollection, res) {
  friendCollection.insertOne({ friend1Id: userId, friend2Id: friendId });
  res.status(201).json({ message: 'added Successfully' });
}

function deleteFriend(friend, friendCollection, res) {
  friendCollection.remove({ _id: ObjectID(friend._id) });
  res.status(200).json({ message: 'deleted Successfully' });
}
