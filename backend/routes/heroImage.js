const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const adminAuth = require('../middleware/authenticateAdmin'); // Or your admin middleware!
const bucket = require('../config/firebase');
const HeroImage = require('../models/HeroImage'); // Create a simple Mongoose model

const upload = multer({ storage: multer.memoryStorage() });

// POST: upload hero image
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    
    if (!bucket) {
      return res.status(500).json({ 
        error: 'Firebase Storage not configured. Please set up Firebase credentials.' 
      });
    }
    const filename = `hero/${uuidv4()}_${req.file.originalname}`;
    const file = bucket.file(filename);

    const stream = file.createWriteStream({
      metadata: { contentType: req.file.mimetype }
    });

    stream.on('error', (err) => res.status(500).json({ error: 'Upload failed' }));

    stream.on('finish', async () => {
      await file.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      // Save/update in DB (always one hero image)
      await HeroImage.findOneAndUpdate({}, { url: publicUrl }, { upsert: true, new: true });
      res.json({ success: true, url: publicUrl });
    });

    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// GET: fetch current hero image
router.get('/', async (req, res) => {
  const heroImage = await HeroImage.findOne({});
  res.json({ url: heroImage?.url || null });
});

module.exports = router;
