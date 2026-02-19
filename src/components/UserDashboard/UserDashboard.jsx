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
import toast, { Toaster } from "react-hot-toast";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";

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
  const [escrowAmount, setEscrowAmount] = useState(0);
  const [showEscrowModal, setShowEscrowModal] = useState(false);

  const maskedUid = currentUser?.uid
    ? `${currentUser.uid.slice(0, 4)}****${currentUser.uid.slice(-4)}`
    : "----****----";

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleWithdraw = (e) => {
    toast.success("Withdrawal is currently not available.", {
      style: {
        background: "#16a34a", // Tailwind green-600
        color: "#fff", // white text
        fontWeight: "500",
        borderRadius: "0.75rem", // optional rounded corners
        padding: "12px 16px",
      },
      icon: "💰", // optional fun icon
    });
  };

  /* ---------------- resize ---------------- */
  useEffect(() => {
    const resize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    // Show escrow info modal when page loads
    setShowEscrowModal(true);

    const timer = setTimeout(() => {
      setShowEscrowModal(false);
    }, 5000); // closes after 5 seconds

    return () => clearTimeout(timer);
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
            (item) => item.userid === loggedUser.uid,
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
            : previousOrders.push(order),
        );

        setRecentOrders(todayOrders);
        setOldOrders(previousOrders);

        // Calculate total earned
        let earned = 0;
        let escrow = 0;

        sellerOrders.forEach((order) => {
          order.cartItems.forEach((item) => {
            if (item.released) {
              earned += Number(item.price || 0);
            } else {
              escrow += Number(item.price || 0);
            }
          });
        });

        setTotalEarned(earned);
        setEscrowAmount(escrow);

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
          mode === "dark"
            ? "bg-[#181a1b] text-white"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        {<LoadingOverlay />}
      </div>
    );
  }

  return (
    <Layout>
      <Toaster />
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
        />
      )}

      <div
        className={`min-h-screen px-4 py-10 ${
          mode === "dark"
            ? "bg-[#181a1b] text-white"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-10 pl-2"
        >
          <h1 className="text-3xl font-bold">
            Hi, <span className="text-pink-500">{currentUser.name}</span>
          </h1>
          <p
            className={`mt-5 ${mode === "dark" ? "text-gray-300" : "text-gray-500"}`}
          >
            Welcome back to your dashboard! Here you can manage your account,
            view earnings, and track your orders.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3 mb-12">
          <InfoCard icon={<User size={22} />} title="Account" mode={mode}>
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 
                flex items-center justify-center text-white font-bold text-lg shadow"
              >
                {currentUser.email?.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-semibold truncate">
                  {currentUser.email}
                </p>

                <span
                  className="inline-block mt-1 px-2 py-[2px] text-xs font-medium rounded-full 
                  bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                >
                  Creator
                </span>
              </div>
            </div>
          </InfoCard>

          <div className="max-w-4xl ">
            <div
              className="
                relative max-w-6xl
                h-[210px]
                rounded-2xl
                overflow-hidden
                shadow-lg
              "
            >
              {/* Background Image */}
              <img
                // src="https://img.freepik.com/free-photo/cartoon-man-wearing-glasses_23-2151136880.jpg?semt=ais_user_personalization&w=740&q=80"
                // src="https://img.freepik.com/free-photo/cartoon-woman-wearing-glasses_23-2151136862.jpg?semt=ais_user_personalization&w=740&q=80"
                // src="https://img.freepik.com/premium-photo/five-happy-children-running-through-field-sunny-day_7556-9141.jpg"
                // src="https://img.freepik.com/premium-photo/youth-group-with-popinspired-background_1208997-747.jpg"
                // src="https://assets.change.org/photos/7/lr/dz/aPlRDZIvSIIdmXw-800x450-noPad.jpg?1761121329"
                // src="https://images.theconversation.com/files/509005/original/file-20230208-27-3jttof.jpg?ixlib=rb-4.1.0&rect=0%2C0%2C5463%2C3645&q=50&auto=format&w=768&h=512&fit=crop&dpr=2"
                // src="https://www.ipsos.com/sites/default/files/styles/max_1300x1300/public/ct/news_and_polls/2022-08/happy%20people%201.jpeg?itok=aE_N840D"
                // src="https://cdn.punchng.com/wp-content/uploads/2017/05/03133845/Happy.jpg"
                src="https://img.freepik.com/free-photo/medium-shot-happy-friends-city_23-2149003088.jpg?semt=ais_hybrid&w=740&q=80"
                alt="Virtual Card"
                className="absolute inset-0 w-full h-full object-cover scale-105"
              />
              {/* Dark/Blackish Overlay */}
              {/* Dynamic Overlay for Light & Dark Mode */}
              <div
                className={`absolute inset-0 ${
                  mode === "dark" ? "bg-black/70" : "bg-black/20"
                }`}
              ></div>

              {/* increased opacity to 65% */}
              {/* Soft Highlight Gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
              {/* Card Content */}
              <div
                className={`relative z-10 h-full p-5 flex flex-col justify-between ${
                  mode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {/* Top */}
                <div className="flex justify-between items-center">
                  <h3
                    className={`text-lg font-bold tracking-tight drop-shadow-md ${
                      mode === "dark" ? "text-white" : "text-white"
                    }`}
                  >
                    AllMart
                  </h3>

                  <span
                    className={`
        text-xs uppercase tracking-wide
        px-3 py-1 rounded-lg font-bold drop-shadow
        ${mode === "dark" ? "bg-black/50 text-white" : "bg-black/50 text-white"}
      `}
                  >
                    Virtual Card
                  </span>
                </div>

                {/* Balance */}
                <div className="mt-2">
                  <p
                    className={`text-xs font-bold drop-shadow-sm ${
                      mode === "dark" ? "text-white" : "text-white"
                    }`}
                  >
                    Available Balance
                  </p>
                  <p
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 drop-shadow-md ${
                      mode === "dark" ? "text-white" : "text-white"
                    }`}
                  >
                    ₦{totalEarned.toLocaleString()}
                  </p>
                </div>

                {/* Bottom */}
                <div className="flex justify-between items-end mt-3">
                  {/* Card Number */}
                  <span
                    className={`text-sm tracking-widest font-bold drop-shadow-sm ${
                      mode === "dark" ? "text-white" : "text-white"
                    }`}
                  >
                    {maskedUid}
                  </span>

                  {/* Withdraw Button */}
                  <button
                    onClick={handleWithdraw}
                    className={`
        px-4 py-1.5 text-xs font-bold rounded-lg
        border border-white/20 shadow-md transition-all
        ${
          mode === "dark"
            ? "bg-green-800/60 text-white hover:bg-green-800"
            : "bg-green-500/70 text-white hover:bg-green-600"
        }
      `}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>

          <InfoCard icon={<Lock size={22} />} title="Escrow" mode={mode}>
            <div className="flex flex-col gap-3">
              {/* Amount (Dimmed) */}
              <p className="text-2xl font-bold tracking-tight text-gray-400 dark:text-gray-500">
                ₦{escrowAmount.toLocaleString()}
              </p>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                    text-xs font-semibold
                    bg-yellow-100 text-yellow-700
                    dark:bg-yellow-900/40 dark:text-yellow-300"
                >
                  <Lock size={12} />
                  Locked in Escrow
                </span>
              </div>

              {/* Hint Text */}
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                Funds will remain locked until the buyer confirms product
                delivery or manually releases the funds.
              </p>
            </div>
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
      {/* Escrow Info Modal */}
      {showEscrowModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 sm:mx-6 text-center transform transition-transform animate-fadeIn scale-95">
            {/* Icon Circle with Gradient */}
            <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-gray-900 dark:text-white">
              Escrow Information
            </h2>

            {/* Description */}
            <p className="mb-6 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>Note:</strong> Escrow funds cannot be received until the
              product is delivered or the buyer manually releases the fund.
            </p>

            {/* Optional: Close Button */}
            <button
              onClick={() => setShowEscrowModal(false)}
              className="mt-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-md transition-all duration-200"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

/* ---------------- components ---------------- */

const InfoCard = ({ icon, title, children, mode }) => (
  <div
    className={`p-6 rounded-xl shadow ${
      mode === "dark"
        ? "bg-gray-800 text-white border border-gray-700"
        : "bg-white"
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

const OrdersSection = ({ title, orders, downloadReceipt, mode }) => {
  const emptyMessage =
    title === "Recent Orders"
      ? "📦 No recent orders today. New orders will appear here once customers place them."
      : "🕘 No previous orders yet. Your completed orders history will show here.";

  return (
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
          <p className="text-sm">{emptyMessage}</p>
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
};

const OrderCard = ({ order, downloadReceipt, mode }) => {
  const total = order.cartItems.reduce((s, i) => s + Number(i.price || 0), 0);

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
          <strong>Order Date:</strong>{" "}
          {order.date
            ? order.date.seconds
              ? new Date(order.date.seconds * 1000).toLocaleString()
              : new Date(order.date).toLocaleString()
            : "N/A"}
        </p>

        <button
          onClick={() => downloadReceipt(order.id)}
          className="bg-pink-500 text-white px-3 py-1 rounded text-sm"
        >
          Download Receipts
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
      {/* Items */}
      {order.cartItems.map((item, i) => (
        <div
          key={i}
          className={`flex items-start gap-4 mb-4 p-3 rounded-lg border ${
            mode === "dark"
              ? "border-gray-700 bg-gray-900"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          {/* Product Image */}
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-14 h-14 rounded-md object-cover flex-shrink-0"
          />

          {/* Product Info */}
          <div className="flex-1">
            <p className="font-semibold text-sm leading-tight mb-1">
              {item.title}
            </p>

            <div className="flex items-center justify-between">
              {/* Price */}
              <p
                className={`text-sm font-medium ${
                  mode === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                ₦{Number(item.price).toLocaleString()}
              </p>

              {/* Fund Status Badge */}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                  item.released
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.released ? "Fund Released" : "In Escrow"}
              </span>
            </div>
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
