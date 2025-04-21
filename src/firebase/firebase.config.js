// firebase.config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBpLeyan7LT4-s1byv4LlokL0z5AlnETns",
  authDomain: "bluemedixauth.firebaseapp.com",
  projectId: "bluemedixauth",
  storageBucket: "bluemedixauth.firebasestorage.app",
  messagingSenderId: "806816581906",
  appId: "1:806816581906:web:9af054065129342c730bcb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);