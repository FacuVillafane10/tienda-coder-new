// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6IBvFtUNgRdgJWge15yWDjMtgnWdoxIk",
  authDomain: "tienda-coder-app.firebaseapp.com",
  projectId: "tienda-coder-app",
  storageBucket: "tienda-coder-app.firebasestorage.app",
  messagingSenderId: "556891285175",
  appId: "1:556891285175:web:48b52ee1bb739310744f32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);