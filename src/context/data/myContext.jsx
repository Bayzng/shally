import { createContext } from "react";

const myContext = createContext();

export default myContext;




// import { createContext, useState, useEffect } from "react";
// import { auth, fireDB } from "../../fireabase/FirebaseConfig";
// import { doc, getDoc, collection, getDocs } from "firebase/firestore";

// const myContext = createContext();

// export const MyContextProvider = ({ children }) => {
//   const [currentUserData, setCurrentUserData] = useState(
//     JSON.parse(localStorage.getItem("currentUser")) || null
//   );
//   const [user, setUser] = useState([]);
//   const [product, setProduct] = useState([]);
//   const [mode, setMode] = useState("light");
//   const [loading, setLoading] = useState(false);

//   // ---------------- Current user listener ----------------
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
//       if (firebaseUser) {
//         try {
//           const userRef = doc(fireDB, "users", firebaseUser.uid);
//           const userSnap = await getDoc(userRef);

//           if (userSnap.exists()) {
//             const userData = { uid: firebaseUser.uid, ...userSnap.data() };
//             setCurrentUserData(userData);
//             localStorage.setItem("currentUser", JSON.stringify(userData));
//           } else {
//             const fallback = {
//               uid: firebaseUser.uid,
//               email: firebaseUser.email,
//               name: firebaseUser.displayName || "User",
//             };
//             setCurrentUserData(fallback);
//             localStorage.setItem("currentUser", JSON.stringify(fallback));
//           }
//         } catch (err) {
//           console.error("Error fetching current user:", err);
//           // offline fallback: read from localStorage
//           setCurrentUserData(JSON.parse(localStorage.getItem("currentUser")) || null);
//         }
//       } else {
//         setCurrentUserData(null);
//         localStorage.removeItem("currentUser");
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // ---------------- Fetch all users ----------------
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const querySnap = await getDocs(collection(fireDB, "users"));
//         const usersList = querySnap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
//         setUser(usersList);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // ---------------- Fetch all products ----------------
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const querySnap = await getDocs(collection(fireDB, "products"));
//         const productsList = querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setProduct(productsList);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const contextValue = {
//     currentUserData,
//     setCurrentUserData,
//     user,
//     setUser,
//     product,
//     setProduct,
//     mode,
//     setMode,
//     loading,
//     setLoading,
//   };

//   return <myContext.Provider value={contextValue}>{children}</myContext.Provider>;
// };

// export default myContext;