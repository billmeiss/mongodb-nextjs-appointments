import nextConnect from 'next-connect';
import middleware from '../../../../middlewares/middleware';
import { ObjectID } from 'mongodb';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const user = await req.db.collection('users').find({
    _id: ObjectID(req.query.userId)
  }).project({ name: 1, profilePicture: 1 }).toArray();
  res.send({ user });
});

export default handler;