const mongoose = require('mongoose');

const CarouselImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CarouselImage', CarouselImageSchema);
