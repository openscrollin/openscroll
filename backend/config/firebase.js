const admin = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage');
const path = require('path');
const serviceAccount = require(path.resolve(__dirname, 'firebaseServiceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'openscroll-auth.firebasestorage.app', // Replace with your bucket name
});

const bucket = getStorage().bucket();
module.exports = bucket;
