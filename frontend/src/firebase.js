// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getStorage } from 'firebase/storage'; // ✅ make sure this is imported

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBShlYC1nohKQwqBJAm5aBz5KXHcY3oMSU",
  authDomain: "openscroll-auth.firebaseapp.com",
  projectId: "openscroll-auth",
  storageBucket: "openscroll-auth.appspot.com", // ✅ Use `.appspot.com` not `.firebasestorage.app`
  messagingSenderId: "986464804310",
  appId: "1:986464804310:web:34a8ce506fc74ce821d877",
  measurementId: "G-0JZKZREZE3"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Auth
const auth = getAuth(app);

// ✅ Initialize Firebase Storage
const storage = getStorage(app); // ✅ NOW it's defined

// ✅ Conditionally initialize Analytics
let analytics = null;
isAnalyticsSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized.");
  } else {
    console.warn("Firebase Analytics not supported.");
  }
});

// ✅ Export everything needed
export {
  app,
  auth,
  storage,             // ✅ now correctly exported
  analytics,
  RecaptchaVerifier
};
