import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Wallet, User, Clock, Package, BarChart2, CreditCard } from "lucide-react";
import myContext from "../../context/data/myContext";
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";
import Layout from "../layout/Layout";
import Confetti from "react-confetti";

function UserDashboard() {
  const { mode } = useContext(myContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return;

    const fetchUserData = async () => {
      try {
        const userRef = doc(fireDB, "users", storedUser.uid);
        const userSnap = await getDoc(userRef);

        setCurrentUser({
          uid: storedUser.uid,
          email: storedUser.email,
          name: userSnap.exists() ? userSnap.data().name : storedUser.name || "User",
        });

        // Fetch recent orders
        const ordersRef = collection(fireDB, "order");
        const q = query(
          ordersRef,
          where("userid", "==", storedUser.uid),
          orderBy("date", "desc"),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecentOrders(userOrders);

        // Calculate total spent
        const total = userOrders.reduce((acc, order) => {
          const orderTotal = order.cartItems?.reduce((sum, item) => sum + parseFloat(item.price || 0), 0) || 0;
          return acc + orderTotal;
        }, 0);
        setTotalSpent(total);

      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();

    // Hide confetti after 5s
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);

  }, []);

  if (!currentUser) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const accountBalance = 125000;
  const escrowBalance = 45000;

  return (
    <Layout>
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      <div className={`min-h-screen px-4 sm:px-6 py-10 transition-colors ${mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Welcome back, <span className="text-pink-500">{currentUser.name}</span>!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Manage your wallet, escrow payments, orders & more — all in one place.
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-10">
          
          {/* User Info */}
          <motion.div whileHover={{ scale: 1.03 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-pink-600" />
              <h2 className="text-lg font-semibold">My Information</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {currentUser.name}</p>
              <p><span className="font-medium">Email:</span> {currentUser.email}</p>
              <p><span className="font-medium">Account Type:</span> Buyer</p>
            </div>
          </motion.div>

          {/* Available Balance */}
          <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Wallet />
              <h2 className="text-lg font-semibold">Available Balance</h2>
            </div>
            <p className="text-3xl font-bold mb-2">₦{accountBalance.toLocaleString()}</p>
            <p className="text-sm opacity-90">Funds you can withdraw immediately</p>
          </motion.div>

          {/* Escrow / Pending */}
          <motion.div whileHover={{ scale: 1.03 }} className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="absolute inset-0 bg-black/10 rounded-2xl flex items-center justify-center">
              <Lock className="text-gray-700 dark:text-gray-300" size={40} />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <Clock className="text-yellow-500" />
              <h2 className="text-lg font-semibold">Escrow Payments</h2>
            </div>
            <p className="text-3xl font-bold mb-2 relative z-10">₦{escrowBalance.toLocaleString()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">Pending product delivery</p>
            <p className="mt-3 text-xs text-red-500 font-medium relative z-10">Funds locked until buyer confirms delivery</p>
          </motion.div>

        </div>

        {/* Recent Orders */}
        <div className="max-w-6xl mx-auto mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Package /> Recent Orders
          </h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">You have no recent orders.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentOrders.map((order) => (
                <motion.div key={order.id} whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
                  <p><span className="font-medium">Order ID:</span> {order.id}</p>
                  <p><span className="font-medium">Payment ID:</span> {order.paymentId || "N/A"}</p>
                  <p><span className="font-medium">Total:</span> ₦{order.cartItems?.reduce((a, i) => a + parseFloat(i.price || 0), 0).toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-3">
          <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center">
            <BarChart2 size={28} />
            <h3 className="font-bold text-xl mt-2">Total Spent</h3>
            <p className="mt-1 text-2xl font-semibold">₦{totalSpent.toLocaleString()}</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center">
            <CreditCard size={28} />
            <h3 className="font-bold text-xl mt-2">Transactions</h3>
            <p className="mt-1 text-2xl font-semibold">{recentOrders.length}</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center">
            <User size={28} />
            <h3 className="font-bold text-xl mt-2">Account Type</h3>
            <p className="mt-1 text-2xl font-semibold">Buyer</p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export default UserDashboard;
