// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { TWITTER_API_KEY, TWITTER_AUTH_DOMAIN, TWITTER_PROJECT_ID, TWITTER_STORAGE_BUCKET, TWITTER_MESSAGING_SENDER_ID, TWITTER_APP_ID } from '../../auth/authdata';
const firebaseConfig = {
  apiKey: TWITTER_API_KEY,
  authDomain: TWITTER_AUTH_DOMAIN,
  projectId: TWITTER_PROJECT_ID,
  storageBucket: TWITTER_STORAGE_BUCKET,
  messagingSenderId: TWITTER_MESSAGING_SENDER_ID,
  appId: TWITTER_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;
