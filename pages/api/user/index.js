import nextConnect from 'next-connect';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import middleware from '../../../middlewares/middleware';
import { extractUser } from '../../../lib/api-helpers';

const upload = multer({ dest: '/tmp' });
const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => res.json({ user: extractUser(req) }));

handler.patch(upload.single('profilePicture'), async (req, res) => {
  if (!req.user) {
    req.status(401).end();
    return;
  }
  let profilePicture;
  if (req.file) {
    const image = await cloudinary.uploader.upload(req.file.path, {
      width: 512,
      height: 512,
      crop: 'fill',
    });
    profilePicture = image.secure_url;
  }
  const { name, bio } = req.body;
  await req.db.collection('users').updateOne(
    { _id: req.user._id },
    {
      $set: {
        ...(name && { name }),
        bio: bio || '',
        ...(profilePicture && { profilePicture }),
      },
    },
  );
  res.json({ user: { name, bio } });
});

handler.delete(async (req, res) => {
  await req.db.collection('appointments').deleteMany({ creatorId: req.user._id.toString() });
  await req.db.collection('tokens').deleteMany({ userId: req.user._id });
  await req.db.collection('sessions').deleteMany({ session: { passport: req.user._id.toString() }})
  await req.db.collection('users').deleteOne({ _id: req.user._id });
  res.status(204).end();
})

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;