import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, Timestamp } from "firebase/firestore";
import { fireDB } from "../../../fireabase/FirebaseConfig";
// import LoadingOverlay from "../../../components/LoadingOverlay/LoadingOverlay";

export default function UnreleasedItemsTab({ mode }) {
  const [orders, setOrders] = useState([]);
  const [itemsToRelease, setItemsToRelease] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
  }, [orders]);

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
          ? { ...item, delivered: true, released: true, escrowLocked: false, deliveredDate: Timestamp.now(), autoReleased: true }
          : item
      );

      await updateDoc(orderRef, { cartItems: updatedItems });

      setItemsToRelease((prev) => prev.filter((i) => !(i.orderId === orderId && i.id === productId)));
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, cartItems: updatedItems } : o)));

      alert("✅ Fund released successfully");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to release fund");
    } finally {
      setConfirmLoading(false);
    }
  };

  const releaseAll = async () => {
    if (!itemsToRelease.length) return;
    setConfirmLoading(true);
    try {
      for (const item of itemsToRelease) {
        await releaseFund(item.orderId, item.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmLoading(false);
    }
  };

  // if (loading) return <div className="flex justify-center items-center h-40"><LoadingOverlay /></div>;
  if (!itemsToRelease.length) return <p className="text-center mt-10 text-gray-500">🎉 No items pending release!</p>;

  return (
    <div className="px-4 mb-16">
      <h1 className="text-3xl font-semibold text-center underline mb-6" style={{ color: mode === "dark" ? "white" : "" }}>
        Items Ready for Fund Release
      </h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={releaseAll}
          disabled={confirmLoading}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          🚀 Release All Funds
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {itemsToRelease.map((item) => (
          <div
            key={item.id}
            className={`border rounded-xl p-5 shadow-lg transform transition hover:scale-105 hover:shadow-2xl ${
              mode === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white"
            }`}
          >
            <h2 className="font-bold text-lg text-red-500 mb-2">{item.title}</h2>
            <p className="text-sm"><strong>Buyer:</strong> {item.buyerName}</p>
            <p className="text-sm"><strong>Payment ID:</strong> {item.paymentId}</p>
            <p className="text-sm"><strong>Order Date:</strong> {new Date(item.orderDate?.seconds * 1000 || item.orderDate).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>
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
    </div>
  );
}