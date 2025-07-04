const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const CarouselImage = require('../models/CarouselImage');
const adminAuth = require('../middleware/authenticateAdmin');
const bucket = require('../config/firebase'); // Firebase bucket instance

// Use memory storage (no local disk writing)
const upload = multer({ storage: multer.memoryStorage() });

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

// ✅ POST: Upload image to Firebase and save URL to DB
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const filename = `carousel/${uuidv4()}_${req.file.originalname}`;
    const file = bucket.file(filename);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on('error', (err) => {
      console.error('Firebase upload error:', err);
      return res.status(500).json({ error: 'Upload failed' });
    });

    stream.on('finish', async () => {
      await file.makePublic(); // Optional: makes file public
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

      const newImage = await CarouselImage.create({ url: publicUrl });
      res.json({ success: true, image: newImage });
    });

    stream.end(req.file.buffer);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ✅ DELETE: Remove image from Firebase & DB
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const img = await CarouselImage.findByIdAndDelete(req.params.id);
    if (img) {
      const filePath = img.url.split('.com/')[1]; // extract Firebase path
      const file = bucket.file(filePath);
      await file.delete().catch((err) => {
        console.warn('File not found in Firebase:', err.message);
      });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
