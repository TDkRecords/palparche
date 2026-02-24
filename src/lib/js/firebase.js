// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6zDE0Dpu94wmoo8KAFV1rCnPiGHYE1RA",
    authDomain: "palparche.firebaseapp.com",
    projectId: "palparche",
    storageBucket: "palparche.firebasestorage.app",
    messagingSenderId: "381755242861",
    appId: "1:381755242861:web:661b2553147edf2b2f0264"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);