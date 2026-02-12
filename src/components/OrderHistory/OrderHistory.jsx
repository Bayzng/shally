// import { useEffect, useState, useContext } from "react";
// import Layout from "../../components/layout/Layout";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   doc,
//   updateDoc,
//   Timestamp,
// } from "firebase/firestore";
// import { fireDB } from "../../fireabase/FirebaseConfig";
// import myContext from "../../context/data/myContext";
// import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";

// // ...imports stay the same

// function OrderHistory() {
//   const { mode } = useContext(myContext);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const [showModal, setShowModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [selectedItemIndex, setSelectedItemIndex] = useState(null);
//   const [confirmLoading, setConfirmLoading] = useState(false);

//   const handleConfirmRelease = async () => {
//     try {
//       setConfirmLoading(true);

//       await confirmProductReceived(selectedOrder.id, selectedItemIndex);

//       setShowModal(false);
//       setSelectedOrder(null);
//       setSelectedItemIndex(null);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setConfirmLoading(false);
//     }
//   };

//   const getDeliveryCountdown = (orderDate) => {
//     const date = parseDate(orderDate);
//     if (!date) return null;

//     const deliveryTime = date.getTime() + 7 * 24 * 60 * 60 * 1000;
//     const diff = deliveryTime - Date.now();

//     if (diff <= 0) return null;

//     const days = Math.floor(diff / (24 * 60 * 60 * 1000));
//     const hours = Math.floor((diff / (60 * 60 * 1000)) % 24);
//     const minutes = Math.floor((diff / (60 * 1000)) % 60);
//     const seconds = Math.floor((diff / 1000) % 60);

//     return { days, hours, minutes, seconds };
//   };

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setOrders((prev) => [...prev]); // trigger re-render
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         if (!user?.uid) return;
//         const q = query(
//           collection(fireDB, "order"),
//           where("userid", "==", user.uid),
//         );
//         const querySnapshot = await getDocs(q);

//         const userOrders = querySnapshot.docs.map((doc) => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             ...data,
//             cartItems: Array.isArray(data.cartItems) ? data.cartItems : [],
//           };
//         });

//         setOrders(userOrders);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [user]);

//   const parseDate = (value) => {
//     if (!value) return null;
//     if (value instanceof Timestamp) return value.toDate();
//     if (value?.seconds) return new Date(value.seconds * 1000);
//     return new Date(value);
//   };

//   // Check if an individual item is delivered
//   const isItemDelivered = (item) => item.delivered;

//   const calculateExpectedDeliveryDate = (orderDate, item) => {
//     if (item?.deliveredDate) {
//       // Use delivered date if fund released
//       return parseDate(item.deliveredDate).toLocaleDateString("en-GB", {
//         weekday: "long",
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//         timeZone: "Africa/Lagos",
//       });
//     }
//     const date = parseDate(orderDate);
//     if (!date) return "N/A";
//     const expected = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
//     return expected.toLocaleDateString("en-GB", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//       timeZone: "Africa/Lagos",
//     });
//   };

//   const confirmProductReceived = async (orderId, itemIndex) => {
//     try {
//       const orderRef = doc(fireDB, "order", orderId);
//       const order = orders.find((o) => o.id === orderId);
//       if (!order) return;

//       const updatedItems = [...order.cartItems];
//       updatedItems[itemIndex] = {
//         ...updatedItems[itemIndex],
//         delivered: true,
//         deliveredDate: Timestamp.fromDate(new Date()),
//         escrowLocked: false,
//         released: true,
//       };

//       await updateDoc(orderRef, { cartItems: updatedItems });

//       // Update UI instantly
//       setOrders((prev) =>
//         prev.map((o) =>
//           o.id === orderId ? { ...o, cartItems: updatedItems } : o,
//         ),
//       );
//     } catch (err) {
//       console.error("Failed to release escrow:", err);
//     }
//   };

//   if (loading)
//     return (
//       <Layout>
//         <div className="flex justify-center items-center h-screen">
//           <LoadingOverlay />
//         </div>
//       </Layout>
//     );

//   return (
//     <Layout>
//       <div
//         className={`min-h-screen py-10 px-4 sm:px-8 md:px-12 transition-colors duration-300 ${
//           mode === "dark"
//             ? "bg-[#181a1b] text-white"
//             : "bg-gray-50 text-gray-800"
//         }`}
//       >
//         <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 tracking-wide">
//           🧾 My Order History
//         </h1>

//         {orders.length === 0 ? (
//           <p className="text-center text-gray-500 text-lg">
//             You haven’t placed any orders yet 🛍️
//           </p>
//         ) : (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {orders.map((order) => {
//               const anyDelivered = order.cartItems.some((item) =>
//                 isItemDelivered(item),
//               );

//               return (
//                 <div
//                   key={order.id}
//                   className={`rounded-2xl shadow-lg border p-6 sm:p-8 relative hover:shadow-2xl transition-transform transform hover:scale-[1.01] ${
//                     mode === "dark"
//                       ? "bg-gray-800 border-gray-700"
//                       : "bg-white border-gray-200"
//                   }`}
//                 >
//                   {/* Status Badge */}
//                   <span
//                     className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
//                       anyDelivered
//                         ? "bg-green-600 text-white"
//                         : "bg-blue-600 text-white"
//                     }`}
//                   >
//                     {anyDelivered ? "✅ Delivered" : "New Order"}
//                   </span>

//                   {/* Order Info */}
//                   <div className="flex mt-5 flex-wrap justify-between gap-y-2 mb-5 text-sm sm:text-base">
//                     <p>
//                       <strong>Order Date:</strong>{" "}
//                       {parseDate(order.date)?.toLocaleString() || "N/A"}
//                     </p>
//                     <p>
//                       <strong>Payment ID:</strong> {order.paymentId || "N/A"}
//                     </p>
//                     <p>
//                       <strong>Status:</strong>{" "}
//                       <span
//                         className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold ${
//                           order.status === "success"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {order.status?.toUpperCase() || "UNKNOWN"}
//                       </span>
//                     </p>
//                   </div>

//                   {/* Ordered Items */}
//                   <div>
//                     {order.cartItems.map((item, i) => {
//                       const delivered = isItemDelivered(item);
//                       return (
//                         <div
//                           key={i}
//                           className="flex items-center border rounded-xl mb-3"
//                         >
//                           <img
//                             src={item.imageUrl}
//                             alt={item.title}
//                             className="ml-[1px] w-24 h-24 object-cover border-r rounded-lg"
//                           />
//                           <div className="p-3 flex-1">
//                             <p className="font-semibold truncate">
//                               {item.title}
//                             </p>
//                             <p className="text-sm text-gray-500">
//                               Price: ₦{Number(item.price).toLocaleString()}
//                             </p>

//                             {!delivered && (
//                               <button
//                                 onClick={() => {
//                                   setSelectedOrder(order);
//                                   setSelectedItemIndex(i);
//                                   setShowModal(true);
//                                 }}
//                                 className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
//                               >
//                                 ✅ Release Fund
//                               </button>
//                             )}

//                             {delivered && (
//                               <p className="mt-2 text-green-500 text-xs font-semibold">
//                                 ✔ Fund Released
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* Delivery Info */}
//                   <div className="mt-6 border-t pt-4 text-sm sm:text-base space-y-1">
//                     <p>
//                       <strong>Customer:</strong> {order.addressInfo?.name}
//                     </p>
//                     <p>
//                       <strong>Phone:</strong> {order.addressInfo?.phoneNumber}
//                     </p>
//                     <p>
//                       <strong>Address:</strong> {order.addressInfo?.address}
//                     </p>
//                     <p>
//                       <strong>Delivery Type:</strong>{" "}
//                       {order.addressInfo?.deliveryType === "home"
//                         ? "Home Delivery"
//                         : "Pickup Point"}
//                     </p>
//                     <p
//                       className={`mt-2 font-medium ${
//                         anyDelivered ? "text-green-600" : "text-blue-500"
//                       }`}
//                     >
//                       <strong>
//                         {anyDelivered ? "Delivered:" : "Expected Delivery:"}
//                       </strong>{" "}
//                       {anyDelivered ? (
//                         parseDate(
//                           order.cartItems.find((i) => i.delivered)
//                             ?.deliveredDate,
//                         )?.toLocaleDateString("en-GB", {
//                           weekday: "long",
//                           day: "numeric",
//                           month: "long",
//                           year: "numeric",
//                           timeZone: "Africa/Lagos",
//                         })
//                       ) : (
//                         <>
//                           {calculateExpectedDeliveryDate(order.date)}
//                           {(() => {
//                             const countdown = getDeliveryCountdown(order.date);
//                             return countdown ? (
//                               <span className="block text-sm text-orange-500 mt-1">
//                                 ⏳ {countdown.days}d {countdown.hours}h{" "}
//                                 {countdown.minutes}m {countdown.seconds}s
//                               </span>
//                             ) : (
//                               <span className="block text-sm text-green-600 mt-1">
//                                 ✅ Delivery window reached
//                               </span>
//                             );
//                           })()}
//                         </>
//                       )}
//                     </p>
//                   </div>

//                   {/* Total Section */}
//                   <div className="mt-6 text-right">
//                     <p className="text-lg sm:text-xl font-bold">
//                       Total Paid: #
//                       {order.cartItems
//                         ?.reduce(
//                           (acc, item) => acc + parseFloat(item.price || 0),
//                           0,
//                         )
//                         .toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Modal */}
//         {showModal && selectedOrder !== null && selectedItemIndex !== null && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm transition-opacity">
//             <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 sm:mx-6 text-center">
//               <h2 className="text-xl sm:text-2xl font-extrabold mb-3 text-gray-800 dark:text-white">
//                 Confirm Fund Release
//               </h2>
//               <p className="mb-6 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
//                 By releasing the fund, you confirm the product has been
//                 received. This action{" "}
//                 <strong className="text-red-600 dark:text-red-400">
//                   cannot be undone
//                 </strong>
//                 .
//               </p>

//               <div className="flex justify-center gap-4 flex-wrap">
//                 <button
//                   disabled={confirmLoading}
//                   onClick={() => setShowModal(false)}
//                   className="px-5 py-2 sm:px-6 sm:py-3 rounded-lg bg-gray-200 hover:bg-gray-300
//                   disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={handleConfirmRelease}
//                   disabled={confirmLoading}
//                   className={`px-5 py-2 sm:px-6 sm:py-3 rounded-lg 
//                     text-white font-medium transition-all flex items-center justify-center gap-2
//                       ${
//                         confirmLoading
//                           ? "bg-green-400 cursor-not-allowed"
//                           : "bg-green-600 hover:bg-green-700"
//                       }
//                     `}
//                 >
//                   {confirmLoading ? (
//                     <>
//                       <svg
//                         className="animate-spin h-4 w-4 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                         />
//                       </svg>
//                       Processing...
//                     </>
//                   ) : (
//                     "Confirm"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// }

// export default OrderHistory;





import { useEffect, useState, useContext, useMemo } from "react";
import Layout from "../../components/layout/Layout";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";
import myContext from "../../context/data/myContext";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import { MdVerified } from "react-icons/md";

function OrderHistory() {
  const { mode, user } = useContext(myContext); // Assuming user context is available
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const localUser = JSON.parse(localStorage.getItem("user"));

  /** -------------------------
   * Step 1: Prepare user map
   * ------------------------- */
  const userMap = useMemo(() => {
    const map = new Map();
    user?.forEach((u) => map.set(u.uid, u));
    return map;
  }, [user]);

  /** -------------------------
   * Step 2: Fetch orders and attach seller info
   * ------------------------- */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!localUser?.uid) return;
        const q = query(
          collection(fireDB, "order"),
          where("userid", "==", localUser.uid)
        );
        const querySnapshot = await getDocs(q);

        const userOrders = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            cartItems: (Array.isArray(data.cartItems) ? data.cartItems : []).map(
              (item) => ({
                ...item,
                uploader: userMap.get(item.userid) || {
                  name: "AllMart Store",
                  verified: false,
                },
              })
            ),
          };
        });

        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [localUser, userMap]);

  /** -------------------------
   * Helper: parse Firestore date
   * ------------------------- */
  const parseDate = (value) => {
    if (!value) return null;
    if (value instanceof Timestamp) return value.toDate();
    if (value?.seconds) return new Date(value.seconds * 1000);
    return new Date(value);
  };

  /** -------------------------
   * Helper: check item delivered
   * ------------------------- */
  const isItemDelivered = (item) => item.delivered;

  /** -------------------------
   * Confirm product received
   * ------------------------- */
  const confirmProductReceived = async (orderId, itemIndex) => {
    try {
      const orderRef = doc(fireDB, "order", orderId);
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      const updatedItems = [...order.cartItems];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        delivered: true,
        deliveredDate: Timestamp.fromDate(new Date()),
        escrowLocked: false,
        released: true,
      };

      await updateDoc(orderRef, { cartItems: updatedItems });

      // Update UI instantly
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, cartItems: updatedItems } : o))
      );
    } catch (err) {
      console.error("Failed to release escrow:", err);
    }
  };

  const handleConfirmRelease = async () => {
    try {
      setConfirmLoading(true);
      await confirmProductReceived(selectedOrder.id, selectedItemIndex);
      setShowModal(false);
      setSelectedOrder(null);
      setSelectedItemIndex(null);
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmLoading(false);
    }
  };

  /** -------------------------
   * Delivery countdown
   * ------------------------- */
  const getDeliveryCountdown = (orderDate) => {
    const date = parseDate(orderDate);
    if (!date) return null;
    const deliveryTime = date.getTime() + 7 * 24 * 60 * 60 * 1000;
    const diff = deliveryTime - Date.now();
    if (diff <= 0) return null;

    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff / (60 * 60 * 1000)) % 24);
    const minutes = Math.floor((diff / (60 * 1000)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const calculateExpectedDeliveryDate = (orderDate, item) => {
    if (item?.deliveredDate) {
      return parseDate(item.deliveredDate).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Africa/Lagos",
      });
    }
    const date = parseDate(orderDate);
    if (!date) return "N/A";
    const expected = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    return expected.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Africa/Lagos",
    });
  };

  /** -------------------------
   * Auto re-render countdown every second
   * ------------------------- */
  useEffect(() => {
    const timer = setInterval(() => setOrders((prev) => [...prev]), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading)
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <LoadingOverlay />
        </div>
      </Layout>
    );

  /** -------------------------
   * Render
   * ------------------------- */
  return (
    <Layout>
      <div
        className={`min-h-screen py-10 px-4 sm:px-8 md:px-12 transition-colors duration-300 ${
          mode === "dark" ? "bg-[#181a1b] text-white" : "bg-gray-50 text-gray-800"
        }`}
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 tracking-wide">
          🧾 My Order History
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            You haven’t placed any orders yet 🛍️
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => {
              const anyDelivered = order.cartItems.some(isItemDelivered);

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl shadow-lg border p-6 sm:p-8 relative hover:shadow-2xl transition-transform transform hover:scale-[1.01] ${
                    mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  {/* Status Badge */}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                      anyDelivered ? "bg-green-600 text-white" : "bg-blue-600 text-white"
                    }`}
                  >
                    {anyDelivered ? "✅ Delivered" : "New Order"}
                  </span>

                  {/* Order Info */}
                  <div className="flex mt-5 flex-wrap justify-between gap-y-2 mb-5 text-sm sm:text-base">
                    <p>
                      <strong>Order Date:</strong>{" "}
                      {parseDate(order.date)?.toLocaleString() || "N/A"}
                    </p>
                    <p>
                      <strong>Payment ID:</strong> {order.paymentId || "N/A"}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold ${
                          order.status === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </p>
                  </div>

                  {/* Ordered Items */}
                  <div>
                    {order.cartItems.map((item, i) => {
                      const delivered = isItemDelivered(item);
                      return (
                        <div key={i} className="flex items-center border rounded-xl mb-3">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="ml-[1px] w-24 h-24 object-cover border-r rounded-lg"
                          />
                          <div className="p-3 flex-1">
                            <p className="font-semibold truncate">{item.title}</p>
                            <p className="text-sm text-gray-500">
                              Price: ₦{Number(item.price).toLocaleString()}
                            </p>

                            {/* Seller Info */}
                            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                              Seller: {item.uploader?.name}{" "}
                              {item.uploader?.verified && (
                                <MdVerified className="text-blue-500 text-[12px]" />
                              )}
                            </p>

                            {!delivered && (
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setSelectedItemIndex(i);
                                  setShowModal(true);
                                }}
                                className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                              >
                                ✅ Release Fund
                              </button>
                            )}

                            {delivered && (
                              <p className="mt-2 text-green-500 text-xs font-semibold">
                                ✔ Fund Released
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Delivery Info */}
                  <div className="mt-6 border-t pt-4 text-sm sm:text-base space-y-1">
                    <p>
                      <strong>Buyer:</strong> {order.addressInfo?.name}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.addressInfo?.phoneNumber}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.addressInfo?.address}
                    </p>
                    <p>
                      <strong>Delivery Type:</strong>{" "}
                      {order.addressInfo?.deliveryType === "home"
                        ? "Home Delivery"
                        : "Pickup Point"}
                    </p>
                  </div>

                  {/* Total Section */}
                  <div className="mt-6 text-right">
                    <p className="text-lg sm:text-xl font-bold">
                      Total Paid: #
                      {order.cartItems
                        ?.reduce((acc, item) => acc + parseFloat(item.price || 0), 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {showModal && selectedOrder !== null && selectedItemIndex !== null && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 sm:mx-6 text-center">
              <h2 className="text-xl sm:text-2xl font-extrabold mb-3 text-gray-800 dark:text-white">
                Confirm Fund Release
              </h2>
              <p className="mb-6 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                By releasing the fund, you confirm the product has been
                received. This action{" "}
                <strong className="text-red-600 dark:text-red-400">
                  cannot be undone
                </strong>
                .
              </p>

              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  disabled={confirmLoading}
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 sm:px-6 sm:py-3 rounded-lg bg-gray-200 hover:bg-gray-300
                  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmRelease}
                  disabled={confirmLoading}
                  className={`px-5 py-2 sm:px-6 sm:py-3 rounded-lg 
                    text-white font-medium transition-all flex items-center justify-center gap-2
                      ${
                        confirmLoading
                          ? "bg-green-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }
                    `}
                >
                  {confirmLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default OrderHistory;
