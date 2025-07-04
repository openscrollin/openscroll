const admin = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = require('./firebaseServiceAccountKey.json'); // download from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'openscroll-auth.firebasestorage.app', // replace with your bucket name
});

const bucket = getStorage().bucket();

module.exports = bucket;
