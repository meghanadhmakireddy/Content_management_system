const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');

// Session Checks
function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send({ message: 'Login required' });
  }
  next();
}

function checkEditorOrAdmin(req, res, next) {
  const role = req.session.user?.role;
  if (role === 'editor' || role === 'admin') return next();
  res.status(403).send({ message: 'No permission' });
}

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'video/mp4', 'video/webm'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only images and videos are allowed'));
  }
});

// ✅ Handle PUT + multer (force method to POST for multer to work)
const handleMultipartPut = (req, res, next) => {
  if (req.method === 'PUT') req.method = 'POST';
  next();
};

// 👉 Create Post
router.post('/', checkAuth, checkEditorOrAdmin, upload.single('image'), async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      mediaUrl: req.file ? req.file.filename : null,
      username: req.session.user.username,
      createdAt: new Date()
    });

    await post.save();
    res.send({ message: '✅ Post created', post });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error creating post' });
  }
});

// ✅ Update Post
router.put('/:id', checkAuth, checkEditorOrAdmin, (req, res, next) => {
  // 🛠️ Change PUT to POST so multer can parse form-data
  req.method = 'POST';
  next();
}, upload.single('image'), async (req, res) => {
  try {
    const updates = {
      title: req.body.title,
      content: req.body.content,
    };

    // ✅ If new image or video uploaded, add it
    if (req.file) {
      updates.mediaUrl = req.file.filename;
    }

    const updated = await Post.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: '✅ Post updated', updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Failed to update' });
  }
});



// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch posts' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.send(post);
});

// Delete Post
router.delete('/:id', checkAuth, async (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).send({ message: 'Only admin can delete' });
  }

  await Post.findByIdAndDelete(req.params.id);
  res.send({ message: 'Post deleted' });
});

module.exports = router;
