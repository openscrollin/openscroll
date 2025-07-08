const express = require('express');
const router = express.Router();
const CarouselImage = require('../models/CarouselImage');
const adminAuth = require('../middleware/authenticateAdmin');

// ✅ GET all carousel images
router.get('/', async (req, res) => {
  try {
    const images = await CarouselImage.find().sort({ uploadedAt: -1 });
    res.json({ images });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// ✅ POST: Save image URL to database (image uploaded via Firebase on frontend)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const newImage = await CarouselImage.create({ url });
    res.json({ success: true, image: newImage });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

// ✅ DELETE: Remove image from database
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const img = await CarouselImage.findByIdAndDelete(req.params.id);
    if (!img) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;