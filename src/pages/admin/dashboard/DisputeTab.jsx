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
    const orderSnap = await getDocs(
      collection(fireDB, "order")
    );

    // Find matching order document
    const matchingOrder = orderSnap.docs.find(
      (o) => o.id === dispute.orderId
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
        d.id === dispute.id ? { ...d, status: "resolved" } : d
      )
    );

  } catch (error) {
    console.error("Error resolving dispute:", error);
  }
};


  return (
    <div className="px-4 mb-16">
      <h1 className="text-3xl font-semibold text-center underline mb-6">
        Disputes
      </h1>

      {disputes.length === 0 ? (
        <p>No disputes yet 🚀</p>
      ) : (
        disputes.map((d) => (
          <div key={d.id} className="border rounded-xl p-6 mb-6 shadow-lg">
            <h2 className="text-lg font-bold text-red-500">{d.productTitle}</h2>

            <p>
              <strong>Buyer:</strong> {d.buyerName}
            </p>
            <p>
              <strong>Seller:</strong> {d.sellerName}
            </p>
            <p>
              <strong>Phone:</strong> {d.buyerPhone}
            </p>
            <p>
              <strong>Payment ID:</strong> {d.paymentId}
            </p>
            <p>
              <strong>Expected Delivery:</strong> {d.expectedDelivery}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  d.status === "open" ? "text-red-500" : "text-green-600"
                }
              >
                {d.status}
              </span>
            </p>

            {d.status === "open" && (
              <button
                onClick={() => resolveDispute(d)}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
              >
                Mark Resolved
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default DisputeTab;
