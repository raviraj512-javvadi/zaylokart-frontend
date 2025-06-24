import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace the object below with the firebaseConfig you copied from the website
const firebaseConfig = {
  apiKey: "AIzaSyD3Fn4L-32GTC_B5M7C4vEAxZCnfoo7nL8",
  authDomain: "zaylocart.firebaseapp.com",
  projectId: "zaylocart",
  storageBucket: "zaylocart.firebasestorage.app",
  messagingSenderId: "665467606045",
  appId: "1:665467606045:web:8356e431716ec3f2dba2f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firebase auth instance to be used in other components
export const auth = getAuth(app);