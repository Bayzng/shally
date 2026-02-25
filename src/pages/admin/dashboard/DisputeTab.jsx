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

  const openImageSafely = (base64) => {
    if (!base64.startsWith("data:")) {
      // normal https URL → open directly
      window.open(base64, "_blank");
      return;
    }

    // convert base64 to blob (browser-safe)
    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");
  };

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
    <div className="px-6 mb-20">
      <h1
        className={`text-3xl font-bold text-center mb-12 ${
          mode === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Dispute Resolution Center
      </h1>

      {disputes.length === 0 ? (
        <div className="text-center text-gray-400 text-lg">
          🎉 No active disputes
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {disputes.map((d) => (
            <div
              key={d.id}
              className={`rounded-3xl overflow-hidden shadow-lg transition hover:shadow-2xl ${
                mode === "dark" ? "bg-gray-800 text-white" : "bg-white"
              }`}
            >
              {/* IMAGE */}
              <div className="relative h-48">
                <img
                  src={d.productImage}
                  alt={d.productTitle}
                  className="w-full h-full object-cover"
                />

                <span
                  className={`absolute top-4 right-4 text-xs font-bold px-4 py-1 rounded-full backdrop-blur ${
                    d.status === "open"
                      ? "bg-red-500/90 text-white"
                      : "bg-green-500/90 text-white"
                  }`}
                >
                  {d.status.toUpperCase()}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-6 space-y-4">
                <h2 className="font-semibold text-lg truncate">
                  {d.productTitle}
                </h2>

                {/* PEOPLE */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Buyer</p>
                    <p className="font-medium">{d.buyerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Seller</p>
                    <p className="font-medium">{d.sellerName}</p>
                  </div>
                </div>

                {/* META */}
                <div className="text-xs text-gray-400 space-y-1">
                  <p>📞 {d.buyerPhone}</p>
                  <p>🧾 Payment: {d.paymentId}</p>
                  <p>🚚 Expected: {d.expectedDelivery}</p>
                </div>

                {/* RECEIPT */}
                {/* {d.receiptUrl && (
                  <div
                    onClick={() => openImageSafely(d.receiptUrl)}
                    className="cursor-pointer border rounded-xl p-3 text-center text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    📄 View Receipt Evidence
                  </div>
                )} */}

                {d.receiptUrl && (
                  <div className="flex items-center gap-3 mt-4">
                    <img
                      src={d.receiptUrl}
                      alt="Receipt"
                      className="w-14 h-14 object-cover rounded-lg border"
                    />

                    <button
                      onClick={() => openImageSafely(d.receiptUrl)}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      View Receipt
                    </button>
                  </div>
                )}

                {/* ACTION */}
                <div className="pt-2 flex justify-end">
                  {d.status === "open" ? (
                    <button
                      onClick={() => resolveDispute(d)}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-6 py-2 rounded-xl transition"
                    >
                      Resolve Dispute
                    </button>
                  ) : (
                    <span className="text-green-500 text-sm font-semibold">
                      ✔ Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DisputeTab;
