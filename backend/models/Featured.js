// models/Featured.js
const mongoose = require('mongoose');

const featuredSchema = new mongoose.Schema({
  articleIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Article',
    default: [],
  },
});

module.exports = mongoose.model('Featured', featuredSchema);
