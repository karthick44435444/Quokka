// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native"; // Correct import for React Native
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAPGbcuw2OtFGwmT8TBSNUULa342MSRzk",
  authDomain: "quokka-79add.firebaseapp.com",
  projectId: "quokka-79add",
  storageBucket: "quokka-79add.firebasestorage.app",
  messagingSenderId: "824801050869",
  appId: "1:824801050869:web:41a79154bac71044d905bc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const usersRef = collection(db, "users");
export const roomRef = collection(db, "rooms");
