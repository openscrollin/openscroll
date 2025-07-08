// backend/config/firebase.js

const admin = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage');
require('dotenv').config();

if (!admin.apps.length) {
  // Check if required environment variables are present
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.warn('⚠️ Firebase credentials not found in environment variables. Firebase uploads will not work.');
    console.warn('Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.');
    module.exports = null; // Export null to prevent crashes
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    storageBucket: 'openscroll-auth.appspot.com', // ✅ Use consistent .appspot.com format
  });
}

// Only export bucket if Firebase is properly configured
try {
  const bucket = getStorage().bucket();
  module.exports = bucket;
} catch (error) {
  console.warn('⚠️ Failed to initialize Firebase Storage bucket:', error.message);
  module.exports = null;
}
