// backend/config/firebase.js

const admin = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage');
require('dotenv').config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    storageBucket: 'openscroll-auth.firebasestorage.app', // ✅ Replace with your actual Firebase Storage bucket
  });
}

const bucket = getStorage().bucket();
module.exports = bucket;
