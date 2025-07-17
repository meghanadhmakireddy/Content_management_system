const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  // we got poassword , now we should hash it using bcrypt (in AWAIT) so,:
  const hashed = await bcrypt.hash(password, 10);

  //now we should store all these with new password in user
  const user = new User({ username, password: hashed, role });

  await user.save();
  res.send({ message: 'User registered' });
});

// Login
router.post('/login', async (req, res) => {
  console.log("Incoming request body:", req.body);

  // in log in : extracting username and password
  const { username, password } = req.body;

  // FOR SECURITY : WE COMPARE USERNAME AND BCRYPT PASSWORD from model - USER
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password)))
  {
    return res.status(401).send(
    {  
      message: 'Invalid credentials'
    });
    //401 : unauthorized
  }

  req.session.user = {
    id: user._id,
    role: user.role,
    username: user.username
  };
  res.send({ message: 'Login successful', user: req.session.user });
});

// Logout
router.post('/logout', (req, res) => {
  
  // simply destroy session
  req.session.destroy();
  res.send({ message: 'Logged out' });
});

// Check auth
router.get('/me', (req, res) => {
  res.send({ user: req.session.user || null });
});

module.exports = router;
