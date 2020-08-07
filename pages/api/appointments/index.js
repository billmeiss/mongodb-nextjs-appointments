import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware';
import moment from 'moment';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  // Pagination: Fetch appointments from before the input date or fetch from newest
  const from = req.query.from ? moment(req.query.from).format('X') : moment().format('X');
  const creatorId = req.query.by;
  const appointments = await req.db
    .collection('appointments')
    .find({
      date: {
        $gte: from
      },
      ...(creatorId && { creatorId })
    })
    .sort({ date: +1 })
    .limit(parseInt(req.query.limit, 10) || 10)
    .toArray();
  return res.send({ appointments });
});

handler.post(async (req, res) => {
  if (!req.user) {
    return res.status(401).send('unauthenticated');
  }

  const { date, time, note, partnerId } = req.body;
  const dateUnix = moment(date + ' ' + time).format('X');

  const creatorId = await req.user._id.toString();

  if (!partnerId) {
    partnerId = creatorId;
  }

  if (!date) return res.status(400).send('You must provide a date');
  if (!time) return res.status(400).send('You must provide a time');

  const appointment = {
    date: dateUnix,
    note,
    createdAt: new Date(),
    creatorId,
    partnerId
  }

  await req.db.collection('appointments').insertOne(appointment);
  return res.send(appointment);
});

handler.patch(async (req, res) => {
  if (!req.user) {
    return res.status(401).send('unauthenticated');
  }

  const { appointmentId, date, time, note, partnerId, creatorId } = req.body;

  const dateUnix = moment(date + ' ' + time).format('X');

  if (req.user._id.toString() !== creatorId) {
    return res.status(401).send('unauthorised access');
  }

  var ObjectId = require('mongodb').ObjectId;
  
  try {
    await req.db.collection('appointments').updateOne(
      { _id: ObjectId(appointmentId) },
      {
        $set: {
          ...(date && { date: dateUnix }),
          ...(note && { note }),
          ...(partnerId && { partnerId })
        }
      }
    );
    res.status(200).end()
  } catch (e) {
    res.status(400).send(e)
  }
});

handler.delete(async (req, res) => {
  if (!req.user) {
    return res.status(401).send('unauthenticated');
  }

  const { appointmentId, creatorId } = req.body;

  if (req.user._id.toString() !== creatorId) {
    return res.status(401).send('unauthorised access');
  }

  var ObjectId = require('mongodb').ObjectId;

  try {
    await req.db.collection('appointments').deleteOne({ _id: ObjectId(appointmentId) });
    res.status(204).end();
  } catch (e) {
    res.status(400).send(e);
  }
})

export default handler;