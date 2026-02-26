import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { fireDB } from "../../../fireabase/FirebaseConfig";

/* ===========================
   Countdown Utilities
=========================== */

function getTimeLeft(targetDate) {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) return null;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

/* ===========================
   Stunning Card Component
=========================== */

function ItemCard({ item, mode, releaseFund, confirmLoading }) {
  const expectedDeliveryDate = new Date(
    (item.orderDate?.seconds || item.orderDate) * 1000 +
      7 * 24 * 60 * 60 * 1000,
  );

  const countdown = useCountdown(expectedDeliveryDate);
  const isExpired = !countdown;

  const countdownColor = isExpired
    ? "text-red-500"
    : countdown.days === 0
      ? "text-orange-500"
      : "text-emerald-500";

  return (
    <div
      className={`relative rounded-2xl p-6 shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl border ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Payment ID Badge */}
      <div className="absolute top-4 right-4 text-xs font-semibold bg-indigo-600 text-white px-3 py-1 rounded-full shadow">
        {item.paymentId}
      </div>

      <h2 className="text-xl font-bold mb-2 tracking-tight">{item.title}</h2>

      <div className="space-y-2 text-sm opacity-90">
        <p>
          👤 <strong>Buyer:</strong> {item.buyerName}
        </p>

        <p>
          📅 <strong>Ordered:</strong>{" "}
          {new Date(
            item.orderDate?.seconds * 1000 || item.orderDate,
          ).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>

        <p>
          🚚 <strong>Expected:</strong>{" "}
          {expectedDeliveryDate.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Countdown Section */}
      <div className={`mt-4 font-semibold ${countdownColor}`}>
        {!isExpired ? (
          <div className="bg-black/5 dark:bg-white/10 rounded-lg p-3 text-center">
            ⏳ {countdown.days}d {countdown.hours}h {countdown.minutes}m{" "}
            {countdown.seconds}s remaining
          </div>
        ) : (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg p-3 text-center">
            ❌ Delivery Time Has Passed
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mt-4">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
      ${
        mode === "dark"
          ? "bg-yellow-900/30 text-yellow-400"
          : "bg-yellow-100 text-yellow-700"
      }`}
        >
          Pending Release
        </span>
      </div>

      {/* Action Button */}
      <button
        onClick={() => releaseFund(item.orderId, item.id)}
        disabled={confirmLoading === `${item.orderId}_${item.id}`}
        className={`mt-6 w-full py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
    ${
      confirmLoading === `${item.orderId}_${item.id}`
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 text-white"
    }`}
      >
        {confirmLoading === `${item.orderId}_${item.id}` ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Releasing...
          </>
        ) : (
          "✅ Release Fund"
        )}
      </button>
    </div>
  );
}

/* ===========================
   Main Component
=========================== */

export default function UnreleasedItemsTab({ mode }) {
  const [orders, setOrders] = useState([]);
  const [itemsToRelease, setItemsToRelease] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(fireDB, "order"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (!orders.length) {
      setItemsToRelease([]);
      return;
    }

    const unreleasedItems = [];

    orders.forEach((order) => {
      order.cartItems?.forEach((item) => {
        if (!item.released) {
          unreleasedItems.push({
            ...item,
            orderId: order.id,
            buyerName: order.addressInfo?.name,
            paymentId: order.paymentId,
            orderDate: order.date,
          });
        }
      });
    });

    setItemsToRelease(unreleasedItems);
    setFilteredItems(unreleasedItems);
  }, [orders]);

  useEffect(() => {
    if (!search) {
      setFilteredItems(itemsToRelease);
    } else {
      setFilteredItems(
        itemsToRelease.filter((item) =>
          item.paymentId?.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search, itemsToRelease]);

  const releaseFund = async (orderId, productId) => {
    const loadingKey = `${orderId}_${productId}`;
    setConfirmLoading(loadingKey);

    try {
      const orderRef = doc(fireDB, "order", orderId);
      const orderSnap = await getDocs(collection(fireDB, "order"));
      const matchingOrder = orderSnap.docs.find((o) => o.id === orderId);
      if (!matchingOrder) return;

      const orderData = matchingOrder.data();

      const updatedItems = orderData.cartItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              delivered: true,
              released: true,
              escrowLocked: false,
              deliveredDate: Timestamp.now(),
              autoReleased: true,
            }
          : item,
      );

      await updateDoc(orderRef, { cartItems: updatedItems });

      setItemsToRelease((prev) =>
        prev.filter((i) => !(i.orderId === orderId && i.id === productId)),
      );
    } catch (error) {
      console.error(error);
      alert("❌ Failed to release fund");
    } finally {
      setConfirmLoading(null);
    }
  };

  return (
    <div className="px-6 py-10 min-h-screen">
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className={`text-3xl font-bold ${
            mode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Release Dashboard
        </h1>
        <p className="text-gray-500 mt-2">Monitor delivery</p>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search Payment ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-3 rounded-xl w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          🎉 No items pending release
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              mode={mode}
              releaseFund={releaseFund}
              confirmLoading={confirmLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
