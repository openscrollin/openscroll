const mongoose = require('mongoose');

const writerSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'writer' },
});

module.exports = mongoose.model('Writer', writerSchema);
