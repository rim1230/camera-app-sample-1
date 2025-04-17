// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIOVjIobs1xiAJmNJESeB9S6pOCBl9Iys",
  authDomain: "camera-app-sample.firebaseapp.com",
  projectId: "camera-app-sample",
  storageBucket: "camera-app-sample.firebasestorage.app",
  messagingSenderId: "7031791568",
  appId: "1:7031791568:web:146ce1c333b172b714e3d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };