import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Wallet, User, Package } from "lucide-react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import Confetti from "react-confetti";
import myContext from "../../context/data/myContext";
import { fireDB } from "../../fireabase/FirebaseConfig";
import Layout from "../layout/Layout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ---------------- helpers ---------------- */
const normalizeDate = (date) => {
  if (!date) return new Date();
  if (date instanceof Timestamp) return date.toDate();
  if (date?.seconds) return new Date(date.seconds * 1000);
  return new Date(date);
};

const normalizeCartItems = (data) => {
  if (Array.isArray(data.cartItems)) return data.cartItems;
  if (Array.isArray(data.items)) return data.items;
  return [];
};
/* ---------------------------------------- */

function UserDashboard() {
  const { mode } = useContext(myContext);

  const [currentUser, setCurrentUser] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [oldOrders, setOldOrders] = useState([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  /* ---------------- resize ---------------- */
  useEffect(() => {
    const resize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ---------------- fetch data ---------------- */
  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return;

    const loggedUser = JSON.parse(rawUser);

    const fetchDashboardData = async () => {
      try {
        /* -------- current user -------- */
        const userRef = doc(fireDB, "users", loggedUser.uid);
        const userSnap = await getDoc(userRef);

        setCurrentUser({
          uid: loggedUser.uid,
          email: loggedUser.email,
          name: userSnap.exists()
            ? userSnap.data().name
            : loggedUser.name || "User",
        });

        /* -------- fetch orders -------- */
        const ordersSnap = await getDocs(collection(fireDB, "order"));
        const sellerOrders = [];

        for (const docSnap of ordersSnap.docs) {
          const data = docSnap.data();
          const cartItems = normalizeCartItems(data);

          // Filter only items that belong to current seller
          const sellerItems = cartItems.filter(
            (item) => item.userid === loggedUser.uid
          );
          if (!sellerItems.length) continue; // Skip orders with no items by this seller

          sellerOrders.push({
            id: docSnap.id,
            cartItems: sellerItems,
            date: normalizeDate(data.date),
            customerName: data.addressInfo?.name || "N/A",
            customerPhone: data.addressInfo?.phoneNumber || "N/A",
            customerAddress: data.addressInfo?.address || "N/A",
            customerEmail: data.email || "N/A",
          });
        }

        // Split into today and previous orders
        const today = new Date();
        const todayOrders = [];
        const previousOrders = [];

        sellerOrders.sort((a, b) => b.date - a.date);
        sellerOrders.forEach((order) =>
          order.date.toDateString() === today.toDateString()
            ? todayOrders.push(order)
            : previousOrders.push(order)
        );

        setRecentOrders(todayOrders);
        setOldOrders(previousOrders);

        // Calculate total earned
        const earned = sellerOrders.reduce(
          (acc, o) =>
            acc + o.cartItems.reduce((sum, i) => sum + Number(i.price || 0), 0),
          0
        );
        setTotalEarned(earned);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchDashboardData();
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------- PDF download ---------------- */
  const downloadReceipt = async (orderId) => {
    const element = document.getElementById(`order-receipt-${orderId}`);
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`Order_${orderId}.pdf`);
  };

  if (!currentUser) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          mode === "dark" ? "bg-[#181a1b] text-white" : "bg-gray-50 text-gray-800"
        }`}
      >
        Loading dashboard...
      </div>
    );
  }

  return (
    <Layout>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
        />
      )}

      <div
        className={`min-h-screen px-4 py-10 ${
          mode === "dark" ? "bg-[#181a1b] text-white" : "bg-gray-50 text-gray-800"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-10"
        >
          <h1 className="text-3xl font-bold">
            Hi,{" "}
            <span className="text-pink-500">{currentUser.name}</span>
          </h1>
          <p className={`mt-2 ${mode === "dark" ? "text-gray-300" : "text-gray-500"}`}>
            Track products sold and customer orders easily.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3 mb-12">
          <InfoCard icon={<User />} title="Account" mode={mode}>
            <p>{currentUser.email}</p>
            <p>Seller</p>
          </InfoCard>

          <GradientCard icon={<Wallet />} title="Total Earned" mode={mode}>
            ₦{totalEarned.toLocaleString()}
          </GradientCard>

          <InfoCard icon={<Lock />} title="Escrow" mode={mode}>
            ₦0
          </InfoCard>
        </div>

        <OrdersSection
          title="Recent Orders"
          orders={recentOrders}
          downloadReceipt={downloadReceipt}
          mode={mode}
        />
        <OrdersSection
          title="Previous Orders"
          orders={oldOrders}
          downloadReceipt={downloadReceipt}
          mode={mode}
        />
      </div>
    </Layout>
  );
}

/* ---------------- components ---------------- */

const InfoCard = ({ icon, title, children, mode }) => (
  <div
    className={`p-6 rounded-xl shadow ${
      mode === "dark" ? "bg-gray-800 text-white border border-gray-700" : "bg-white"
    }`}
  >
    <div className="flex gap-2 mb-3">
      {icon}
      <h3 className="font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

const GradientCard = ({ icon, title, children, mode }) => (
  <div
    className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow ${
      mode === "dark" ? "border border-gray-700" : ""
    }`}
  >
    <div className="flex gap-2 mb-3">
      {icon}
      <h3 className="font-semibold">{title}</h3>
    </div>
    <p className="text-3xl font-bold">{children}</p>
  </div>
);

const OrdersSection = ({ title, orders, downloadReceipt, mode }) => (
  <div className="max-w-6xl mx-auto mb-12">
    <h2 className="text-2xl font-bold mb-4 flex gap-2">
      <Package /> {title}
    </h2>

    {orders.length === 0 ? (
      <div
        className={`p-4 rounded-md border-l-4 ${
          mode === "dark"
            ? "bg-gray-700 border-yellow-400 text-yellow-200"
            : "bg-yellow-50 border-yellow-400 text-yellow-800"
        }`}
      >
        <p className="text-sm">
          ⚠️ No orders to display. Only orders for products you’ve uploaded will appear here.
        </p>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            downloadReceipt={downloadReceipt}
            mode={mode}
          />
        ))}
      </div>
    )}
  </div>
);

const OrderCard = ({ order, downloadReceipt, mode }) => {
  const total = order.cartItems.reduce(
    (s, i) => s + Number(i.price || 0),
    0
  );

  return (
    <div
      id={`order-receipt-${order.id}`}
      className={`p-6 rounded-xl shadow border ${
        mode === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between mb-3">
        <p className="text-sm">
          <strong>Order Date:</strong> {order.date.toDateString()}
        </p>
        <button
          onClick={() => downloadReceipt(order.id)}
          className="bg-pink-500 text-white px-3 py-1 rounded text-sm"
        >
          Download Receipt
        </button>
      </div>

      {/* Customer Info */}
      <div className="mb-4 border-b pb-3">
        <h4 className="font-semibold text-pink-600 mb-1">Customer Info</h4>
        <p>
          <strong>Name:</strong> {order.customerName}
        </p>
        <p>
          <strong>Email:</strong> {order.customerEmail}
        </p>
        <p>
          <strong>Phone:</strong> {order.customerPhone}
        </p>
        <p>
          <strong>Address:</strong> {order.customerAddress}
        </p>
      </div>

      {/* Items */}
      {order.cartItems.map((item, i) => (
        <div key={i} className="flex gap-3 mb-3">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-14 h-14 rounded object-cover"
          />
          <div>
            <p className="font-semibold">{item.title}</p>
            <p>₦{Number(item.price).toLocaleString()}</p>
          </div>
        </div>
      ))}

      {/* Total */}
      <div className="mt-4 border-t pt-3 text-sm">
        <p>
          <strong>Total:</strong> ₦{total.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
