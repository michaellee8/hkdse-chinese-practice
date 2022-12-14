import { initializeApp } from "firebase/app";
import React from "react";

export const firebaseConfig = {
  apiKey: "AIzaSyDr278g93XI-dISby-q38-I1FAIbRJv-OE",
  authDomain: "hkdse-chinese-practice.firebaseapp.com",
  projectId: "hkdse-chinese-practice",
  storageBucket: "hkdse-chinese-practice.appspot.com",
  messagingSenderId: "1067316869958",
  appId: "1:1067316869958:web:68bb23060d686b2bde8347",
  measurementId: "G-EXYFCJL9RV",
};

const firebaseApp = initializeApp(firebaseConfig);

export const FirebaseContext = React.createContext(firebaseApp);

export const ESSAY_COLLECTION = "chinese12Essays";
