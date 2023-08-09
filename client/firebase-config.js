// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbaY8rNcFh72XzTCbA5HirSiIup2OHkHU",
  authDomain: "learnt-me-test.firebaseapp.com",
  projectId: "learnt-me-test",
  storageBucket: "learnt-me-test.appspot.com",
  messagingSenderId: "336058311771",
  appId: "1:336058311771:web:8951d587dca31205fccb7e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
