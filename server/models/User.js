const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' }
});

module.exports = mongoose.model('User', UserSchema);
