// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBs9hj0gXH2Bvyjq5zV2l6_QZg6UDfLWEM",
  authDomain: "terabayz.firebaseapp.com",
  projectId: "terabayz",
  storageBucket: "terabayz.appspot.com",
  messagingSenderId: "1046033561051",
  appId: "1:1046033561051:web:9ddecf70d878cc229ca3fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app);
export const storage = getStorage(app);


export {fireDB, auth}