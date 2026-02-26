import { useEffect, useState, useContext, useMemo } from "react";
import Layout from "../../components/layout/Layout";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";
import myContext from "../../context/data/myContext";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import { MdVerified } from "react-icons/md";
import { MdNotificationAdd } from "react-icons/md";

function OrderHistory() {
  const { mode, user } = useContext(myContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(null);
  const [reportedItems, setReportedItems] = useState(new Set());

  const [infoModal, setInfoModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });

  const localUser = JSON.parse(localStorage.getItem("user"));

  const handleReport = async (order, item) => {
    const key = `${order.id}-${item.id}`;
    setReportLoading(key);

    try {
      const q = query(
        collection(fireDB, "disputes"),
        where("orderId", "==", order.id),
        where("productId", "==", item.id),
      );

      const existing = await getDocs(q);

      if (!existing.empty) {
        setReportedItems((prev) => new Set(prev).add(key));

        setInfoModal({
          open: true,
          type: "warning",
          title: "Already Reported",
          message: "This item has already been reported.",
        });
        return;
      }

      await addDoc(collection(fireDB, "disputes"), {
        orderId: order.id,
        productId: item.id,
        productTitle: item.title,
        productImage: item.imageUrl,
        productPrice: item.price,
        productCategory: item.category,
        buyerId: localUser?.uid,
        buyerName: order.addressInfo?.name,
        buyerPhone: order.addressInfo?.phoneNumber,
        buyerAddress: order.addressInfo?.address,
        buyerEmail: order.email,
        sellerId: item.userid,
        sellerName: item.uploader?.name,
        sellerVerified: item.uploader?.verified || false,
        orderDate: order.date,
        expectedDelivery: calculateExpectedDeliveryDate(order.date, item),
        delivered: item.delivered || false,
        paymentId: order.paymentId,
        status: "open",
        createdAt: Timestamp.now(),
      });

      setReportedItems((prev) => new Set(prev).add(key));

      setInfoModal({
        open: true,
        type: "success",
        title: "Report Submitted",
        message: "Your report has been sent successfully.",
      });
    } catch (err) {
      console.error(err);
      setInfoModal({
        open: true,
        type: "warning",
        title: "Error",
        message: "Could not submit report. Try again.",
      });
    } finally {
      setReportLoading(null);
    }
  };

  const userMap = useMemo(() => {
    const map = new Map();
    user?.forEach((u) => map.set(u.uid, u));
    return map;
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!localUser?.uid) return;

        const q = query(
          collection(fireDB, "order"),
          where("userid", "==", localUser.uid),
        );

        const querySnapshot = await getDocs(q);

        const userOrders = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            cartItems: (Array.isArray(data.cartItems)
              ? data.cartItems
              : []
            ).map((item) => ({
              ...item,
              uploader: userMap.get(item.userid) || {
                name: "AllMart Store",
                verified: false,
              },
            })),
          };
        });

        setOrders(userOrders);

        const disputeQuery = query(
          collection(fireDB, "disputes"),
          where("buyerId", "==", localUser.uid),
        );

        const disputeSnapshot = await getDocs(disputeQuery);

        const reportedSet = new Set();

        disputeSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.orderId && data.productId) {
            reportedSet.add(`${data.orderId}-${data.productId}`);
          }
        });

        setReportedItems(reportedSet);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [localUser, userMap]);

  const parseDate = (value) => {
    if (!value) return null;
    if (value instanceof Timestamp) return value.toDate();
    if (value?.seconds) return new Date(value.seconds * 1000);
    return new Date(value);
  };

  const isItemDelivered = (item) => item.delivered;

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

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, cartItems: updatedItems } : o,
        ),
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
  return (
    <Layout>
      <div
        className={`min-h-screen py-10 px-4 sm:px-8 md:px-12 transition-colors duration-300 ${
          mode === "dark"
            ? "bg-[#181a1b] text-white"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        <div className="mb-5 flex items-center bg-white rounded-xl shadow-md overflow-hidden py-2 px-4">
          <div className="flex-shrink-0 font-semibold mr-4">
            <MdNotificationAdd size={20} className="text-red-500" />
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="inline-block animate-scroll text-black  font-medium">
              As a buyer, receipts of all products you have purchased will be
              listed here.
            </div>
          </div>
        </div>

        <h1 className="text-2xl ml-2 md:text-2xl font-extrabold  mb-5 tracking-wide">
          Order History
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
                    mode === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {/* Status Badge */}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                      anyDelivered
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 text-white"
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
                        <div
                          key={i}
                          className="flex items-center border rounded-xl mb-3"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="ml-[1px] w-24 h-24 object-cover border-r rounded-lg"
                          />
                          <div className="p-3 flex-1">
                            <p className="font-semibold truncate">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              Price: ₦{Number(item.price).toLocaleString()}
                            </p>

                            {/* Seller Info */}
                            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                              <span className="text-yellow-400">Seller:</span>{" "}
                              {item.uploader?.name}{" "}
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

                            {!delivered && (
                              <button
                                disabled={
                                  reportLoading === `${order.id}-${item.id}` ||
                                  reportedItems.has(`${order.id}-${item.id}`)
                                }
                                onClick={() => handleReport(order, item)}
                                className={`mt-2 ml-2 px-3 py-1 rounded text-xs
                                ${
                                  reportLoading === `${order.id}-${item.id}`
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : reportedItems.has(
                                          `${order.id}-${item.id}`,
                                        )
                                      ? "bg-yellow-500 text-white cursor-not-allowed"
                                      : "bg-red-600 hover:bg-red-700 text-white"
                                }`}
                              >
                                {reportLoading === `${order.id}-${item.id}`
                                  ? "Reporting..."
                                  : reportedItems.has(`${order.id}-${item.id}`)
                                    ? "Reported"
                                    : "Report"}
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
                    <p
                      className={`mt-2 font-medium ${
                        anyDelivered ? "text-green-600" : "text-blue-500"
                      }`}
                    >
                      <strong>
                        {anyDelivered ? "Delivered:" : "Expected Delivery:"}
                      </strong>{" "}
                      {anyDelivered ? (
                        parseDate(
                          order.cartItems.find((i) => i.delivered)
                            ?.deliveredDate,
                        )?.toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          timeZone: "Africa/Lagos",
                        })
                      ) : (
                        <>
                          {calculateExpectedDeliveryDate(order.date)}
                          {(() => {
                            const countdown = getDeliveryCountdown(order.date);
                            return countdown ? (
                              <span className="block text-sm text-orange-500 mt-1">
                                ⏳ {countdown.days}d {countdown.hours}h{" "}
                                {countdown.minutes}m {countdown.seconds}s
                              </span>
                            ) : (
                              <span className="block text-sm text-green-600 mt-1">
                                ✅ Delivery window reached
                              </span>
                            );
                          })()}
                        </>
                      )}
                    </p>
                  </div>

                  {/* Total Section */}
                  <div className="mt-6 text-right">
                    <p className="text-lg sm:text-xl font-bold">
                      Total Paid: #
                      {order.cartItems
                        ?.reduce(
                          (acc, item) => acc + parseFloat(item.price || 0),
                          0,
                        )
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
      {infoModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl text-center">
            <div
              className={`text-3xl mb-3 ${
                infoModal.type === "success"
                  ? "text-green-600"
                  : infoModal.type === "warning"
                    ? "text-orange-500"
                    : "text-blue-500"
              }`}
            >
              {infoModal.type === "success" && "✅"}
              {infoModal.type === "warning" && "⚠️"}
              {infoModal.type === "info" && "ℹ️"}
            </div>

            <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
              {infoModal.title}
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {infoModal.message}
            </p>

            <button
              onClick={() => setInfoModal({ ...infoModal, open: false })}
              className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default OrderHistory;
