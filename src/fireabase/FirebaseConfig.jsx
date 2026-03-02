import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB67ywl5WBTRLpWTkv-vWPNQShqhgXBcL8",
  authDomain: "store-2425b.firebaseapp.com",
  projectId: "store-2425b",
  storageBucket: "store-2425b.appspot.com",
  messagingSenderId: "547968121207",
  appId: "1:547968121207:web:b6a845cf972c6c20294972"
};

const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); 

export { fireDB, auth, storage };