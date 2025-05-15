const mongoose = require('mongoose');

const readerSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'reader' },
  unlockedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }], // ✅ Add this line
});

module.exports = mongoose.model('Reader', readerSchema);
