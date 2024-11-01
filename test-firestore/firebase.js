// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDc6sNls7tTC-XAbhWQ4pHRGUDMe6ZozSQ",
    authDomain: "test-f9e8b.firebaseapp.com",
    projectId: "test-f9e8b",
    storageBucket: "test-f9e8b.firebasestorage.app",
    messagingSenderId: "946771061054",
    appId: "1:946771061054:web:f0866b62f51b04e04c646f"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
