// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import {getFirestore} from 'firebase/firestore';
// import {getAuth} from 'firebase/auth';
// import { getStorage } from "firebase/storage";


// // Your web app's Firebase configuration
// const firebaseConfig = {

//   apiKey: "AIzaSyB67ywl5WBTRLpWTkv-vWPNQShqhgXBcL8",
//   authDomain: "store-2425b.firebaseapp.com",
//   projectId: "store-2425b",
//   storageBucket: "store-2425b.appspot.com",
//   messagingSenderId: "547968121207",
//   appId: "1:547968121207:web:b6a845cf972c6c20294972"
//   // measurementId: "G-84WK5CY12W"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// const fireDB = getFirestore(app);
// const auth = getAuth(app);
// export const storage = getStorage(app);


// export {fireDB, auth}








// // // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// // import { getFirestore } from "firebase/firestore";
// // import { getAuth } from "firebase/auth";
// // import { getStorage } from "firebase/storage";

// // // Your web app's Firebase configuration
// // const firebaseConfig = {
// //   apiKey: "AIzaSyB67ywl5WBTRLpWTkv-vWPNQShqhgXBcL8",
// //   authDomain: "store-2425b.firebaseapp.com",
// //   projectId: "store-2425b",
// //   storageBucket: "store-2425b.appspot.com",
// //   messagingSenderId: "547968121207",
// //   appId: "1:547968121207:web:b6a845cf972c6c20294972"
// // };

// // // Initialize Firebase
// // const app = initializeApp(firebaseConfig);

// // const fireDB = getFirestore(app);
// // const auth = getAuth(app);
// // const storage = getStorage(app);

// // // ✅ Export everything you might need
// // export { app, fireDB, auth, storage };


// FirebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB67ywl5WBTRLpWTkv-vWPNQShqhgXBcL8",
  authDomain: "store-2425b.firebaseapp.com",
  projectId: "store-2425b",
  storageBucket: "store-2425b.appspot.com",
  messagingSenderId: "547968121207",
  appId: "1:547968121207:web:b6a845cf972c6c20294972"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const fireDB = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // ✅ export this correctly

// Export
export { fireDB, auth, storage };