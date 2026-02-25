import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { fireDB } from "../../../fireabase/FirebaseConfig";

export default function UnreleasedItemsTab({ mode }) {
  const [orders, setOrders] = useState([]);
  const [itemsToRelease, setItemsToRelease] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch orders from Firestore
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

  // Extract unreleased items
  useEffect(() => {
    if (!orders || orders.length === 0) return setItemsToRelease([]);

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

  // Filter items by exact payment ID match
  useEffect(() => {
    if (!search) {
      setFilteredItems(itemsToRelease); // show all if search is empty
    } else {
      const filtered = itemsToRelease.filter(
        (item) => item.paymentId === search
      );
      setFilteredItems(filtered);
    }
  }, [search, itemsToRelease]);

  // Release a single fund
  const releaseFund = async (orderId, productId) => {
    setConfirmLoading(true);
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
          : item
      );

      await updateDoc(orderRef, { cartItems: updatedItems });

      setItemsToRelease((prev) =>
        prev.filter((i) => !(i.orderId === orderId && i.id === productId))
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, cartItems: updatedItems } : o
        )
      );

      alert("✅ Fund released successfully");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to release fund");
    } finally {
      setConfirmLoading(false);
    }
  };

  // Release all funds for visible filtered items
  const releaseAll = async () => {
    if (!filteredItems.length) return;
    setConfirmLoading(true);
    try {
      for (const item of filteredItems) {
        await releaseFund(item.orderId, item.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="px-4 mb-16">
      <h1
        className="text-3xl font-semibold text-center underline mb-6"
        style={{ color: mode === "dark" ? "white" : "" }}
      >
        Items Ready for Fund Release
      </h1>

      {/* Search Input */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by exact Payment ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={releaseAll}
          disabled={confirmLoading || filteredItems.length === 0}
          className="ml-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          🚀 Release All Funds
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">
          {search
            ? `🎯 No items match Payment ID "${search}"!`
            : "🎉 No items pending release!"}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`border rounded-xl p-5 shadow-lg transform transition hover:scale-105 hover:shadow-2xl ${
                mode === "dark"
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white"
              }`}
            >
              <h2 className="font-bold text-lg text-red-500 mb-2">
                {item.title}
              </h2>
              <p className="text-sm">
                <strong>Buyer:</strong> {item.buyerName}
              </p>

              {/* Show Payment ID only if searching */}
              {search && (
                <p className="text-sm">
                  <strong>Payment ID:</strong>{" "}
                  <span className="bg-yellow-200 text-yellow-800 px-1 rounded">
                    {item.paymentId}
                  </span>
                </p>
              )}

              <p className="text-sm">
                <strong>Order Date:</strong>{" "}
                {new Date(
                  item.orderDate?.seconds * 1000 || item.orderDate
                ).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <p className="text-red-500 font-semibold mt-2">Pending Release</p>

              <button
                onClick={() => releaseFund(item.orderId, item.id)}
                disabled={confirmLoading}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ✅ Release Fund
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}