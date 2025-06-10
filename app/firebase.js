// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, onValue,update } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKL_M21XZJs3rH1AGR_UgviqfGPvhiLWs",
  authDomain: "sota-ai-17425.firebaseapp.com",
  projectId: "sota-ai-17425",
  storageBucket: "sota-ai-17425.firebasestorage.app",
  messagingSenderId: "673540929276",
  appId: "1:673540929276:web:718e359e8a546b86d9c979",
  measurementId: "G-NCZLXHRZ3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app)


export { app, auth, createUserWithEmailAndPassword, database, ref, onValue, update};
