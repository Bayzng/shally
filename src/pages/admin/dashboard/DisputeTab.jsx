import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { fireDB } from "../../../fireabase/FirebaseConfig";

function DisputeTab({ mode }) {
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    const fetchDisputes = async () => {
      const querySnapshot = await getDocs(collection(fireDB, "disputes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDisputes(data);
    };

    fetchDisputes();
  }, []);

  const resolveDispute = async (dispute) => {
    try {
      // 1️⃣ Update dispute status
      await updateDoc(doc(fireDB, "disputes", dispute.id), {
        status: "resolved",
        resolvedAt: Timestamp.now(),
      });

      // 2️⃣ Find the related order
      const orderRef = doc(fireDB, "order", dispute.orderId);
      const orderSnap = await getDocs(collection(fireDB, "order"));

      // Find matching order document
      const matchingOrder = orderSnap.docs.find(
        (o) => o.id === dispute.orderId,
      );

      if (!matchingOrder) return;

      const orderData = matchingOrder.data();

      // 3️⃣ Update correct cart item
      const updatedItems = orderData.cartItems.map((item) => {
        if (item.id === dispute.productId) {
          return {
            ...item,
            delivered: true,
            released: true,
            escrowLocked: false,
            deliveredDate: Timestamp.now(),
          };
        }
        return item;
      });

      // 4️⃣ Save updated order
      await updateDoc(orderRef, {
        cartItems: updatedItems,
      });

      // 5️⃣ Update UI instantly
      setDisputes((prev) =>
        prev.map((d) =>
          d.id === dispute.id ? { ...d, status: "resolved" } : d,
        ),
      );
    } catch (error) {
      console.error("Error resolving dispute:", error);
    }
  };

  return (
    <div className="px-4 mb-16">
      <h1
        className={`text-3xl font-semibold text-center underline mb-10 ${
          mode === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Disputes
      </h1>

      {disputes.length === 0 ? (
        <p
          className={`text-center text-lg ${
            mode === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          No disputes yet 🚀
        </p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {disputes.map((d) => (
            <div
              key={d.id}
              className={`rounded-2xl p-6 shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                mode === "dark"
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white"
              }`}
            >
              {/* Product Title */}
              <h2 className="text-lg font-bold text-red-500 mb-3 truncate">
                {d.productTitle}
              </h2>

              {/* Info */}
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold">Buyer:</span> {d.buyerName}
                </p>
                <p>
                  <span className="font-semibold">Seller:</span> {d.sellerName}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {d.buyerPhone}
                </p>
                <p>
                  <span className="font-semibold">Payment ID:</span>{" "}
                  {d.paymentId}
                </p>
                <p>
                  <span className="font-semibold">Expected Delivery:</span>{" "}
                  {d.expectedDelivery}
                </p>
              </div>

              {/* Status */}
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    d.status === "open"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {d.status.toUpperCase()}
                </span>

                {d.status === "open" && (
                  <button
                    onClick={() => resolveDispute(d)}
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DisputeTab;
