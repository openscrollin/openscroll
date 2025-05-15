const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // ✅ renamed from fullName
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: { // ✅ add this to distinguish reader/writer
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
