// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmcNcVz3MeHYATrOAYktYH6S4xohb-A0Q",
  authDomain: "nova-327ba.firebaseapp.com",
  projectId: "nova-327ba",
  storageBucket: "nova-327ba.firebasestorage.app",
  messagingSenderId: "202722700354",
  appId: "1:202722700354:web:2f870b8b2fbb78034551db",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth };
