import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { fireDB } from "../../../fireabase/FirebaseConfig";

function DisputeCard({ dispute, mode, resolveDispute, resolvingId }) {
  const statusColor =
    dispute.status === "resolved"
      ? "bg-green-500 text-white"
      : dispute.status === "reviewing"
        ? "bg-orange-500 text-white"
        : "bg-red-500 text-white";

  const openImageSafely = (base64) => {
    // Remove metadata if exists
    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    const blob = new Blob([ab], { type: mimeString });
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "_blank"); // ✅ safe
  };

  return (
    <div
      className={`relative rounded-2xl p-6 shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl border ${
        mode === "dark"
          ? "bg-gray-800 border-gray-700 text-white"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Status Badge */}
      <div
        className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}
      >
        {dispute.status.toUpperCase()}
      </div>

      {/* Product Image & Title */}
      <div className="flex items-center gap-4 mb-3">
        <img
          src={dispute.productImage}
          alt={dispute.productTitle}
          className="w-16 h-16 object-cover rounded"
        />
        <h2 className="text-lg font-bold truncate">{dispute.productTitle}</h2>
      </div>

      {/* Buyer / Seller Info */}
      <div className="space-y-1 text-sm opacity-90 mb-3">
        <p>
          👤 <strong>Buyer:</strong> {dispute.buyerName}
        </p>
        <p>
          👤 <strong>Seller:</strong> {dispute.sellerName}
        </p>
        {dispute.buyerPhone && <p>📞 {dispute.buyerPhone}</p>}
        {dispute.paymentId && <p>🧾 Payment: {dispute.paymentId}</p>}
        {dispute.expectedDelivery && (
          <p>🚚 Expected: {dispute.expectedDelivery}</p>
        )}
      </div>

      {/* Receipt */}
      {dispute.receiptUrl && (
        <div className="flex items-center gap-3 mb-3">
          <img
            src={dispute.receiptUrl}
            alt="Receipt"
            className="w-14 h-14 object-cover rounded-lg border"
          />
          <button
            onClick={() => openImageSafely(dispute.receiptUrl)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View Receipt
          </button>
        </div>
      )}

      {/* Action Button */}
      <div>
        {dispute.status === "resolved" ? (
          <span className="text-green-500 font-semibold">✔ Resolved</span>
        ) : dispute.receiptUrl ? (
          <button
            onClick={() => resolveDispute(dispute)}
            disabled={resolvingId === dispute.id}
            className={`mt-3 w-full py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              resolvingId === dispute.id
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {resolvingId === dispute.id ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Resolving...
              </>
            ) : (
              "Resolve Dispute"
            )}
          </button>
        ) : (
          <span className="text-yellow-500 font-medium">
            Waiting for seller receipt
          </span>
        )}
      </div>
    </div>
  );
}

export default function DisputeTab({ mode }) {
  const [disputes, setDisputes] = useState([]);
  const [resolvingId, setResolvingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchDisputes = async () => {
    try {
      const q = query(
        collection(fireDB, "disputes"),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      setDisputes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching disputes:", err);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const resolveDispute = async (dispute) => {
    try {
      setResolvingId(dispute.id);
      await updateDoc(doc(fireDB, "disputes", dispute.id), {
        status: "resolved",
        resolvedAt: Timestamp.now(),
      });

      const orderRef = doc(fireDB, "order", dispute.orderId);
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) return;

      const updatedItems = (orderSnap.data().cartItems || []).map((item) =>
        item.id === dispute.productId
          ? {
              ...item,
              delivered: true,
              released: true,
              escrowLocked: false,
              deliveredDate: Timestamp.now(),
            }
          : item,
      );

      await updateDoc(orderRef, { cartItems: updatedItems });

      setDisputes((prev) =>
        prev.map((d) =>
          d.id === dispute.id ? { ...d, status: "resolved" } : d,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setResolvingId(null);
    }
  };

  const filteredDisputes =
    filter === "all"
      ? disputes
      : disputes.filter((d) => d.status.toLowerCase() === filter);

  const buttons = ["all", "open", "reviewing", "resolved"];

  return (
    <div className="px-6 py-10 min-h-screen">
      <h1
        className={`text-3xl font-bold mb-6 text-center ${mode === "dark" ? "text-white" : "text-gray-900"}`}
      >
        Dispute Center
      </h1>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        {buttons.map((b) => (
          <button
            key={b}
            onClick={() => setFilter(b)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              filter === b
                ? "bg-indigo-600 text-white"
                : mode === "dark"
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {b.charAt(0).toUpperCase() + b.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredDisputes.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          🎉 No disputes found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDisputes.map((dispute) => (
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              mode={mode}
              resolveDispute={resolveDispute}
              resolvingId={resolvingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   doc,
//   updateDoc,
//   getDoc,
//   Timestamp,
//   query,
//   orderBy,
// } from "firebase/firestore";
// import { fireDB } from "../../../fireabase/FirebaseConfig";

// function DisputeTab({ mode }) {
//   const [disputes, setDisputes] = useState([]);
//   const [resolvingId, setResolvingId] = useState(null);

//   const openImageSafely = (base64) => {
//     if (!base64.startsWith("data:")) {
//       window.open(base64, "_blank");
//       return;
//     }

//     const byteString = atob(base64.split(",")[1]);
//     const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];

//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);

//     for (let i = 0; i < byteString.length; i++)
//       ia[i] = byteString.charCodeAt(i);

//     const blob = new Blob([ab], { type: mimeString });
//     const blobUrl = URL.createObjectURL(blob);
//     window.open(blobUrl, "_blank");
//   };

//   useEffect(() => {
//     const fetchDisputes = async () => {
//       try {
//         const q = query(
//           collection(fireDB, "disputes"),
//           orderBy("createdAt", "desc"),
//         ); // recent first
//         const querySnapshot = await getDocs(q);

//         const data = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setDisputes(data);
//       } catch (err) {
//         console.error("Error fetching disputes:", err);
//       }
//     };

//     fetchDisputes();
//   }, []);

//   const resolveDispute = async (dispute) => {
//     try {
//       setResolvingId(dispute.id);

//       // 1️⃣ Update dispute status
//       await updateDoc(doc(fireDB, "disputes", dispute.id), {
//         status: "resolved",
//         resolvedAt: Timestamp.now(),
//       });

//       // 2️⃣ Fetch the related order directly
//       const orderRef = doc(fireDB, "order", dispute.orderId);
//       const orderSnap = await getDoc(orderRef);

//       if (!orderSnap.exists()) {
//         console.warn("Order not found for dispute", dispute.id);
//         return;
//       }

//       const orderData = orderSnap.data();

//       // 3️⃣ Update the correct cart item
//       const updatedItems = (orderData.cartItems || []).map((item) => {
//         if (item.id === dispute.productId) {
//           return {
//             ...item,
//             delivered: true,
//             released: true,
//             escrowLocked: false,
//             deliveredDate: Timestamp.now(),
//           };
//         }
//         return item;
//       });

//       // 4️⃣ Save updated order
//       await updateDoc(orderRef, { cartItems: updatedItems });

//       // 5️⃣ Update UI instantly
//       setDisputes((prev) =>
//         prev.map((d) =>
//           d.id === dispute.id ? { ...d, status: "resolved" } : d,
//         ),
//       );
//     } catch (err) {
//       console.error("Error resolving dispute:", err);
//     } finally {
//       setResolvingId(null);
//     }
//   };

//   return (
//     <div className="px-6 mb-20">
//       <h1
//         className={`text-3xl font-bold text-center mb-12 ${mode === "dark" ? "text-white" : "text-gray-900"}`}
//       >
//         Dispute Center
//       </h1>

//       {disputes.length === 0 ? (
//         <div className="text-center text-gray-400 text-lg">
//           🎉 No active disputes
//         </div>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {disputes.map((d) => (
//             <div
//               key={d.id}
//               className={`rounded-3xl overflow-hidden shadow-lg transition hover:shadow-2xl ${mode === "dark" ? "bg-gray-800 text-white" : "bg-white"}`}
//             >
//               <div className="relative h-48">
//                 <img
//                   src={d.productImage}
//                   alt={d.productTitle}
//                   className="w-full h-full object-cover"
//                 />
//                 <span
//                   className={`absolute top-4 right-4 text-xs font-bold px-4 py-1 rounded-full backdrop-blur ${d.status === "open" ? "bg-red-500/90 text-white" : "bg-green-500/90 text-white"}`}
//                 >
//                   {d.status.toUpperCase()}
//                 </span>
//               </div>

//               <div className="p-6 flex flex-col gap-4">
//                 <h2 className="font-semibold text-lg truncate">
//                   {d.productTitle}
//                 </h2>

//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <p className="text-gray-400 text-xs">Buyer</p>
//                     <p className="font-medium">{d.buyerName}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-400 text-xs">Seller</p>
//                     <p className="font-medium">{d.sellerName}</p>
//                   </div>
//                 </div>

//                 <div className="text-xs text-gray-400 space-y-1">
//                   {d.buyerPhone && <p>📞 {d.buyerPhone}</p>}
//                   {d.paymentId && <p>🧾 Payment: {d.paymentId}</p>}
//                   {d.expectedDelivery && (
//                     <p>🚚 Expected: {d.expectedDelivery}</p>
//                   )}
//                 </div>

//                 {d.receiptUrl && (
//                   <div className="flex flex-col gap-2">
//                     <p className="font-medium text-sm">Receipt Information</p>
//                     <p className="text-xs text-gray-400">Seller Receipt</p>
//                     <div className="flex items-center gap-3">
//                       <img
//                         src={d.receiptUrl}
//                         alt="Receipt"
//                         className="w-14 h-14 object-cover rounded-lg border"
//                       />
//                       <button
//                         onClick={() => openImageSafely(d.receiptUrl)}
//                         className="text-sm font-medium text-blue-600 hover:underline"
//                       >
//                         View Receipt
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 <div className="mt-auto pt-2 flex justify-end items-center min-h-[40px]">
//                   {d.status === "resolved" ? (
//                     <span className="text-green-500 text-sm font-semibold">
//                       ✔ Resolved
//                     </span>
//                   ) : d.receiptUrl ? (
//                     <button
//                       onClick={() => resolveDispute(d)}
//                       disabled={resolvingId === d.id}
//                       className={`text-white text-sm px-6 py-2 rounded-xl transition flex items-center gap-2 ${resolvingId === d.id ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
//                     >
//                       {resolvingId === d.id ? (
//                         <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
//                       ) : (
//                         "Resolve Dispute"
//                       )}{" "}
//                       {resolvingId === d.id && " Resolving..."}
//                     </button>
//                   ) : (
//                     <span className="text-yellow-500 text-sm font-medium">
//                       Waiting for seller receipt
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default DisputeTab;
