// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace with your existing Firebase config (this is the one you've used already)
const firebaseConfig = {
  apiKey: "AIzaSyDXGvYVxFNXjR-w1TAtM5dyB7zgFhoHU3c",
  authDomain: "defecttrackersystem-566a8.firebaseapp.com",
  projectId: "defecttrackersystem-566a8",
  storageBucket: "defecttrackersystem-566a8.appspot.com",
  messagingSenderId: "114778010276",
  appId: "1:114778010276:web:33782a6a6872f92b876c31",
  measurementId: "G-MFCPPWWKN9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
