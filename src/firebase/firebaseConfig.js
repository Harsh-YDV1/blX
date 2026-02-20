import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";




const firebaseConfig = {
  apiKey: "AIzaSyByTlIwaV-tGgy6Kz9D61CUj2mYnr3QZFo",
  authDomain: "bharat-legacy-explorer.firebaseapp.com",
  projectId: "bharat-legacy-explorer",
  storageBucket: "bharat-legacy-explorer.firebasestorage.app",
  messagingSenderId: "86772503307",
  appId: "1:86772503307:web:b21ccea6a071b9a2f5480e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
