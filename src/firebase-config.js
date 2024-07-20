// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import 'firebase/storage'
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2a6vTGtZCzCtlvMWh7-BkkwtwbqEEPUM",
  authDomain: "chat-3ac11.firebaseapp.com",
  projectId: "chat-3ac11",
  storageBucket: "chat-3ac11.appspot.com",
  messagingSenderId: "301485714270",
  appId: "1:301485714270:web:945ed5c8ccb8fb66147dcf",
  measurementId: "G-JXVHY0P419"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app)
