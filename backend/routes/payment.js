const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Reader = require('../models/Reader');

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX;
const BASE_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

// =======================
// Initiate Payment Route
// =======================
router.post('/initiate', async (req, res) => {
  try {
    const { amount, transactionId, userEmail } = req.body;

    const payload = {
      merchantId: MERCHANT_ID,
      transactionId,
      merchantUserId: userEmail,
      amount: amount * 100, // in paise
      redirectUrl: 'http://localhost:3000/payment-success',
      redirectMode: 'POST',
      callbackUrl: 'http://localhost:5002/api/payment/callback',
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    const stringToSign = payloadBase64 + '/pg/v1/pay' + SALT_KEY;
    const checksum = crypto.createHash('sha256').update(stringToSign).digest('hex') + `###${SALT_INDEX}`;

    console.log('🧾 Payload:', payload);
    console.log('🔐 Checksum:', checksum);

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        accept: 'application/json',
      },
      body: JSON.stringify({ request: payloadBase64 }),
    });

    const result = await response.json();
    console.log('📦 PhonePe Response:', result);

    res.json(result);
  } catch (err) {
    console.error('❌ Payment initiation error:', err);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// ======================
// Payment Callback Route
// ======================
router.post('/callback', async (req, res) => {
  try {
    const { transactionId, status } = req.body;

    if (!transactionId || !status) {
      return res.status(400).json({ message: 'Invalid callback payload' });
    }

    // Expected format: txn_user@example.com_66363eaf14c0a21c4b9fdf1b
    const parts = transactionId.split('_');
    const email = parts[1]; // user@example.com
    const articleId = parts[2]; // article MongoDB ID

    if (status !== 'SUCCESS') {
      console.warn(`❌ Payment failed for ${email} / ${articleId}`);
      return res.status(400).json({ message: 'Payment not successful' });
    }

    const reader = await Reader.findOne({ email });
    if (!reader) {
      return res.status(404).json({ message: 'Reader not found' });
    }

    if (!reader.unlockedArticles.includes(articleId)) {
      reader.unlockedArticles.push(articleId);
      await reader.save();
      console.log(`✅ Article ${articleId} unlocked for ${email}`);
    }

    res.status(200).json({ message: 'Callback processed successfully' });
  } catch (err) {
    console.error('❌ Callback error:', err);
    res.status(500).json({ message: 'Server error in callback' });
  }
});

module.exports = router;
