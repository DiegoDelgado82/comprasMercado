
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';





const firebaseConfig = {
    apiKey: "AIzaSyAkmsAu2UkC9eE1zXx8xn0rLRPIEWCGFj8",
    authDomain: "compra-mercado-628f1.firebaseapp.com",
    projectId: "compra-mercado-628f1",
    storageBucket: "compra-mercado-628f1.firebasestorage.app",
    messagingSenderId: "844545002346",
    appId: "1:844545002346:web:eec1bf4b20b555d068b313",
    measurementId: "G-J4NE51MS43"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };




