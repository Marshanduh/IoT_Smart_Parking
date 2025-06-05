// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAhLpCDSEOIRFU9H2n7p4vScwSNppl3BNc",
  authDomain: "smart-parking-iot-afb6f.firebaseapp.com",
  databaseURL: "https://smart-parking-iot-afb6f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-parking-iot-afb6f",
  storageBucket: "smart-parking-iot-afb6f.firebasestorage.app",
  messagingSenderId: "385887519020",
  appId: "1:385887519020:web:655b56aa7176facc0dec89",
  measurementId: "G-HJL7F5HYFF"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };
