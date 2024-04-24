import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; // Import Firebase Storage


const firebaseConfig = {
    apiKey: "AIzaSyAfDmLOUzupQsPi5POvHJYkzbXuzUDEFec",
    authDomain: "magpie-roommixer.firebaseapp.com",
    projectId: "magpie-roommixer",
    storageBucket: "magpie-roommixer.appspot.com",
    messagingSenderId: "888242829657",
    appId: "1:888242829657:web:440a2bb3386f0def09b448",
    measurementId: "G-G29DSRBHMT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Export Firestore
export const storage = getStorage(app); // Initialize and export Firebase Storage
