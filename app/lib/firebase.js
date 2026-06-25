import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfRf86XdZ-WFTbDT-OQfNAHStC3WyAW_4",
  authDomain: "blossom-f3b53.firebaseapp.com",
  projectId: "blossom-f3b53",
  storageBucket: "blossom-f3b53.firebasestorage.app",
  messagingSenderId: "100068181298",
  appId: "1:100068181298:web:583ce709bab9de2a83432b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);