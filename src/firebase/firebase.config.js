import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBpLeyan7LT4-s1byv4LlokL0z5AlnETns",
  authDomain: "bluemedixauth.firebaseapp.com",
  projectId: "bluemedixauth",
  storageBucket: "bluemedixauth.firebasestorage.app",
  messagingSenderId: "806816581906",
  appId: "1:806816581906:web:9af054065129342c730bcb",
  measurementId: "G-PC8VDDGDWB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);