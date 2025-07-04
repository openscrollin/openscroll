// firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getAuth, RecaptchaVerifier } from "firebase/auth"; // ✅ this was missing before

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBShlYC1nohKQwqBJAm5aBz5KXHcY3oMSU",
  authDomain: "openscroll-auth.firebaseapp.com",
  projectId: "openscroll-auth",
  storageBucket: "openscroll-auth.firebasestorage.app",
  messagingSenderId: "986464804310",
  appId: "1:986464804310:web:34a8ce506fc74ce821d877",
  measurementId: "G-0JZKZREZE3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ✅ define auth properly here

// Initialize Analytics only if supported
let analytics = null;
isAnalyticsSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics is supported and initialized.");
  } else {
    console.warn("Firebase Analytics is not supported in this environment.");
  }
});

// ✅ Export required Firebase modules
export {
  app,
  auth,              // ✅ now it exists
  analytics,
  RecaptchaVerifier  // ✅ also needed for phone OTP
};
