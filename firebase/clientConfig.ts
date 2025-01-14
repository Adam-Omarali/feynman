// Import the functions you need from the SDKs you need
import { getApp, getApps } from 'firebase/app';
import firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE,
  authDomain: "feynman-361723.firebaseapp.com",
  projectId: "feynman-361723",
  storageBucket: "feynman-361723.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: "G-3S9NBMVE7C"
};

// Initialize Firebase
export const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
const analytics = async() => await isSupported() ? getAnalytics(app) : null
// export const per = getPerformance(app)
// const analytics = typeof window !== undefined ? getAnalytics(app) : null