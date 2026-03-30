import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4FoIzSip4z43P-coeBkh_QlNWsqlagEU",
  authDomain: "my-live-440119.firebaseapp.com",
  projectId: "my-live-440119",
  storageBucket: "my-live-440119.firebasestorage.app",
  messagingSenderId: "893090469170",
  appId: "1:893090469170:web:495d45cac83579c99e332b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
