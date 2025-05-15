const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: String,
  shortDesc: String,
  summary: String, // ✅ NEW
  body: String,
  price: String,
  coverImage: String,
  authorEmail: String,
  authorName: String,
  category: String, // ✅ NEW
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Article', articleSchema);
