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
import toast, { Toaster } from "react-hot-toast";
import { fireDB } from "../../fireabase/FirebaseConfig";

function MyState({ children }) {
  // Theme mode
  const [mode, setMode] = useState(
    localStorage.getItem("themeMode") || "light",
  );

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
    document.body.style.backgroundColor =
      newMode === "dark" ? "rgb(17 24 39)" : "white";
  };

  useEffect(() => {
    document.body.style.backgroundColor =
      mode === "dark" ? "rgb(17 24 39)" : "white";
  }, [mode]);

  const [loading, setLoading] = useState(false);

  // Product form data (used for admin dashboard)
  const [products, setProducts] = useState({
    title: "",
    price: "",
    imageUrl: "",
    category: "",
    description: "",
    time: Timestamp.now(),
    date: new Date().toLocaleDateString(),
  });

  // Product list
  const [product, setProduct] = useState([]);

  // 🔹 Add product (works with passed product or context state)
  const addProduct = async (newProduct = null) => {
    const productToAdd = newProduct || products;
    const { title, price, imageUrl, category } = productToAdd; // description optional

    if (!title || !price || !imageUrl || !category) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const productRef = collection(fireDB, "products");
      await addDoc(productRef, {
        ...productToAdd,
        price: Number(price),
        time: Timestamp.now(),
        date: new Date().toLocaleDateString(),
      });
      toast.success("✅ Product added successfully!");
      getProductData(); // refresh list

      // Reset context state only if adding via admin form
      if (!newProduct) {
        setProducts({
          title: "",
          price: "",
          imageUrl: "",
          category: "",
          description: "",
          time: Timestamp.now(),
          date: new Date().toLocaleDateString(),
        });
        setTimeout(() => (window.location.href = "/dashboard"), 800);
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Get product data
  const getProductData = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "products"), orderBy("time", "desc"));
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

  // 🔹 Edit product (admin)
  const editHandle = (item) => {
    setProducts(item);
  };

  // 🔹 Update product (admin)
  const updateProduct = async () => {
    if (!products.id) {
      toast.error("No product selected for update");
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(fireDB, "products", products.id), products);
      toast.success("✅ Product updated successfully");
      getProductData();
      setTimeout(() => (window.location.href = "/dashboard"), 800);
    } catch (error) {
      console.error(error);
      toast.error("❌ Error updating product");
    } finally {
      setLoading(false);
    }
  };

  // PublicUpdateProduct
  const PublicUpdateProduct = async () => {
    if (!products.id) {
      toast.error("No product selected for update");
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(fireDB, "products", products.id), products);
      toast.success("✅ Product updated successfully");
      getProductData();
    } catch (error) {
      console.error(error);
      toast.error("❌ Error updating product");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete product (admin)
  const deleteProduct = async (item) => {
    if (!item.id) return;
    setLoading(true);
    try {
      await deleteDoc(doc(fireDB, "products", item.id));
      toast.success("✅ Product deleted successfully");
      getProductData();
    } catch (error) {
      console.error(error);
      toast.error("❌ Error deleting product");
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
        PublicUpdateProduct,
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
      <Toaster />
      {children}
    </MyContext.Provider>
  );
}

export default MyState;
