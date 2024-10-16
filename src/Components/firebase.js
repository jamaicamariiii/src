import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCA8gcg9s0ZGH5wzjzVsdyXeto-kCDKzU8",
  authDomain: "itd112---lab2.firebaseapp.com",
  projectId: "itd112---lab2",
  storageBucket: "itd112---lab2.appspot.com",
  messagingSenderId: "203174091109",
  appId: "1:203174091109:web:5ce70ac50f58ffaa3a698c",
  measurementId: "G-NNJ0S2DBPT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

export { db };