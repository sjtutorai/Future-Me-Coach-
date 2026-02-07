import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARKXr4R5eD7Nlw9JYj0SjwotuXGnCTUog",
  authDomain: "futuremecoach.firebaseapp.com",
  projectId: "futuremecoach",
  storageBucket: "futuremecoach.firebasestorage.app",
  messagingSenderId: "941595733056",
  appId: "1:941595733056:web:f56290a97363829af143a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;