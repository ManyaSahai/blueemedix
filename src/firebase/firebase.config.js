// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApoH3f6ojfYl0bKcqzwjkVi9DnzPz3O0o",
  authDomain: "bluemedix-4fa65.firebaseapp.com",
  projectId: "bluemedix-4fa65",
  storageBucket: "bluemedix-4fa65.firebasestorage.app",
  messagingSenderId: "9806899669",
  appId: "1:9806899669:web:069164d7570440e037755c",
  measurementId: "G-74GRR2VTK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
