const mongoose = require('mongoose');
const HeroImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('HeroImage', HeroImageSchema);
