const mongoose = require('mongoose');

const unlockSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  readerEmail: {
    type: String,
    required: true,
  },
  unlockedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Unlock', unlockSchema);
