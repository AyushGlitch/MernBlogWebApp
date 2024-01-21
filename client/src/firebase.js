// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-webapp-9fd04.firebaseapp.com",
  projectId: "mern-blog-webapp-9fd04",
  storageBucket: "mern-blog-webapp-9fd04.appspot.com",
  messagingSenderId: "902663346990",
  appId: "1:902663346990:web:1bc4792c2105864df5b8bf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);