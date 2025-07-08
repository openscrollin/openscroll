const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/authenticateAdmin');
const HeroImage = require('../models/HeroImage');

// POST: Save hero image URL to database (image uploaded via Firebase on frontend)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Save/update in DB (always one hero image)
    const heroImage = await HeroImage.findOneAndUpdate(
      {}, 
      { url }, 
      { upsert: true, new: true }
    );
    
    res.json({ success: true, url: heroImage.url });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Failed to save hero image' });
  }
});

// GET: fetch current hero image
router.get('/', async (req, res) => {
  try {
    const heroImage = await HeroImage.findOne({});
    res.json({ url: heroImage?.url || null });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch hero image' });
  }
});

// DELETE: remove hero image
router.delete('/', adminAuth, async (req, res) => {
  try {
    await HeroImage.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete hero image' });
  }
});

module.exports = router;