import { useEffect, useState } from "react";
import MyContext from "./myContext";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { fireDB } from "../../fireabase/FirebaseConfig";

function MyState({ children }) {
  // ✅ Load saved theme from localStorage or default to light
  const [mode, setMode] = useState(localStorage.getItem("themeMode") || "light");

  // ✅ Toggle theme and persist in localStorage
  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);

    document.body.style.backgroundColor =
      newMode === "dark" ? "rgb(17, 24, 39)" : "white";
  };

  // ✅ Apply saved theme on first load
  useEffect(() => {
    document.body.style.backgroundColor =
      mode === "dark" ? "rgb(17, 24, 39)" : "white";
  }, [mode]);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Product form data
  const [products, setProducts] = useState({
    title: "",
    price: "",
    imageUrl: "",
    category: "",
    description: "",
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });

  // Product list
  const [product, setProduct] = useState([]);

  // 🔹 Add product
  const addProduct = async () => {
    const { title, price, imageUrl, category, description } = products;

    if (!title || !price || !imageUrl || !category || !description) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const productRef = collection(fireDB, "products");
      await addDoc(productRef, products);
      toast.success("Product added successfully!");
      setTimeout(() => (window.location.href = "/dashboard"), 800);
      setProducts({
        title: "",
        price: "",
        imageUrl: "",
        category: "",
        description: "",
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      });
      getProductData();
    } catch (error) {
      console.error(error);
      toast.error("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Get product data
  const getProductData = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "products"), orderBy("time"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const productArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProduct(productArray);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  // 🔹 Edit product
  const editHandle = (item) => {
    setProducts(item);
  };

  // 🔹 Update product
  const updateProduct = async () => {
    if (!products.id) {
      toast.error("No product selected for update");
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(fireDB, "products", products.id), products);
      toast.success("Product updated successfully");
      setTimeout(() => (window.location.href = "/dashboard"), 800);
      getProductData();
    } catch (error) {
      console.error(error);
      toast.error("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete product
  const deleteProduct = async (item) => {
    if (!item.id) return;
    setLoading(true);
    try {
      await deleteDoc(doc(fireDB, "products", item.id));
      toast.success("Product deleted successfully");
      getProductData();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting product");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Order data
  const [order, setOrder] = useState([]);

  const getOrderData = async () => {
    setLoading(true);
    try {
      const result = await getDocs(collection(fireDB, "order"));
      const ordersArray = result.docs.map((doc) => doc.data());
      setOrder(ordersArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 User data
  const [user, setUser] = useState([]);

  const getUserData = async () => {
    setLoading(true);
    try {
      const result = await getDocs(collection(fireDB, "users"));
      const usersArray = result.docs.map((doc) => doc.data());
      setUser(usersArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderData();
    getUserData();
  }, []);

  // 🔹 Filters
  const [searchkey, setSearchkey] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  return (
    <MyContext.Provider
      value={{
        mode,
        toggleMode,
        loading,
        setLoading,
        products,
        setProducts,
        addProduct,
        product,
        editHandle,
        updateProduct,
        deleteProduct,
        order,
        user,
        searchkey,
        setSearchkey,
        filterType,
        setFilterType,
        filterPrice,
        setFilterPrice,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export default MyState;







// import { useEffect, useState } from "react";
// import MyContext from "./myContext";
// import {
//   Timestamp,
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   getDocs,
//   onSnapshot,
//   orderBy,
//   query,
//   setDoc,
// } from "firebase/firestore";
// import { toast } from "react-toastify";
// import { fireDB } from '../../fireabase/FirebaseConfig';

// function MyState({ children }) {
//   // Theme Mode
//   const [mode, setMode] = useState("light");

//   const toggleMode = () => {
//     if (mode === "light") {
//       setMode("dark");
//       document.body.style.backgroundColor = "rgb(17, 24, 39)";
//     } else {
//       setMode("light");
//       document.body.style.backgroundColor = "white";
//     }
//   };

//   // Loading state
//   const [loading, setLoading] = useState(false);

//   // Product form data
//   const [products, setProducts] = useState({
//     title: "",
//     price: "",
//     imageUrl: "",
//     category: "",
//     description: "",
//     time: Timestamp.now(),
//     date: new Date().toLocaleString("en-US", {
//       month: "short",
//       day: "2-digit",
//       year: "numeric",
//     }),
//   });

//   // Product list
//   const [product, setProduct] = useState([]);

//   // 🔹 Add product
//   const addProduct = async () => {
//     const { title, price, imageUrl, category, description } = products;

//     if (!title || !price || !imageUrl || !category || !description) {
//       toast.error("All fields are required");
//       return;
//     }

//     setLoading(true);
//     try {
//       const productRef = collection(fireDB, "products");
//       await addDoc(productRef, products);
//       toast.success("Product added successfully!");
//       setTimeout(() => (window.location.href = "/dashboard"), 800);
//       setProducts({
//         title: "",
//         price: "",
//         imageUrl: "",
//         category: "",
//         description: "",
//         time: Timestamp.now(),
//         date: new Date().toLocaleString("en-US", {
//           month: "short",
//           day: "2-digit",
//           year: "numeric",
//         }),
//       });
//       getProductData();
//     } catch (error) {
//       console.error(error);
//       toast.error("Error adding product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Get product data
//   const getProductData = async () => {
//     setLoading(true);
//     try {
//       const q = query(collection(fireDB, "products"), orderBy("time"));
//       const unsubscribe = onSnapshot(q, (querySnapshot) => {
//         const productArray = querySnapshot.docs.map((doc) => ({
//           ...doc.data(),
//           id: doc.id,
//         }));
//         setProduct(productArray);
//         setLoading(false);
//       });
//       return () => unsubscribe();
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getProductData();
//   }, []);

//   // 🔹 Edit product
//   const editHandle = (item) => {
//     setProducts(item);
//   };

//   // 🔹 Update product
//   const updateProduct = async () => {
//     if (!products.id) {
//       toast.error("No product selected for update");
//       return;
//     }

//     setLoading(true);
//     try {
//       await setDoc(doc(fireDB, "products", products.id), products);
//       toast.success("Product updated successfully");
//       setTimeout(() => (window.location.href = "/dashboard"), 800);
//       getProductData();
//     } catch (error) {
//       console.error(error);
//       toast.error("Error updating product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Delete product
//   const deleteProduct = async (item) => {
//     if (!item.id) return;
//     setLoading(true);
//     try {
//       await deleteDoc(doc(fireDB, "products", item.id));
//       toast.success("Product deleted successfully");
//       getProductData();
//     } catch (error) {
//       console.error(error);
//       toast.error("Error deleting product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Order data
//   const [order, setOrder] = useState([]);

//   const getOrderData = async () => {
//     setLoading(true);
//     try {
//       const result = await getDocs(collection(fireDB, "order"));
//       const ordersArray = result.docs.map((doc) => doc.data());
//       setOrder(ordersArray);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 User data
//   const [user, setUser] = useState([]);

//   const getUserData = async () => {
//     setLoading(true);
//     try {
//       const result = await getDocs(collection(fireDB, "users"));
//       const usersArray = result.docs.map((doc) => doc.data());
//       setUser(usersArray);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getOrderData();
//     getUserData();
//   }, []);

//   // 🔹 Filters
//   const [searchkey, setSearchkey] = useState("");
//   const [filterType, setFilterType] = useState("");
//   const [filterPrice, setFilterPrice] = useState("");

//   return (
//     <MyContext.Provider
//       value={{
//         mode,
//         toggleMode,
//         loading,
//         setLoading,
//         products,
//         setProducts,
//         addProduct,
//         product,
//         editHandle,
//         updateProduct,
//         deleteProduct,
//         order,
//         user,
//         searchkey,
//         setSearchkey,
//         filterType,
//         setFilterType,
//         filterPrice,
//         setFilterPrice,
//       }}
//     >
//       {children}
//     </MyContext.Provider>
//   );
// }

// export default MyState;