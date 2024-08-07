// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"; 
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUbFsDkD8PcjU058bhqoc-obzZaNEHB3Q",
  authDomain: "inventory-management-e5104.firebaseapp.com",
  projectId: "inventory-management-e5104",
  storageBucket: "inventory-management-e5104.appspot.com",
  messagingSenderId: "996579814149",
  appId: "1:996579814149:web:ef8f617b6acb579937256c",
  measurementId: "G-VCCLZKNYMX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}