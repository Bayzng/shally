import { useEffect, useState, useContext } from "react";
import Layout from "../../components/layout/Layout";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";
import myContext from "../../context/data/myContext";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import { Timestamp } from "firebase/firestore";

function OrderHistory() {
  const { mode } = useContext(myContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.uid) return; // ✅ fixed
        const q = query(
          collection(fireDB, "order"),
          where("userid", "==", user.uid), // ✅ fixed
        );
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            cartItems: Array.isArray(data.cartItems) ? data.cartItems : [], // normalize
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
  }, [user]);

  // Helper: parse Firestore timestamp or string into Date
  const parseDate = (dateValue) => {
    try {
      if (dateValue?.seconds) {
        return new Date(dateValue.seconds * 1000);
      } else if (typeof dateValue === "string") {
        const parts = dateValue.split(/[\s,/:\-]+/);
        if (parts.length >= 3) {
          const [day, month, year] = parts.map(Number);
          return new Date(year, month - 1, day);
        } else {
          return new Date(dateValue);
        }
      } else if (typeof dateValue === "number") {
        return new Date(dateValue);
      }
      return null;
    } catch {
      return null;
    }
  };

  // Calculate expected delivery (+7 days)
  const calculateExpectedDeliveryDate = (orderDateValue) => {
    if (!orderDateValue) return "N/A";

    const orderDate = orderDateValue.seconds
      ? new Date(orderDateValue.seconds * 1000)
      : new Date(orderDateValue);

    if (isNaN(orderDate.getTime())) return "N/A";

    const expectedDate = new Date(
      orderDate.getTime() + 7 * 24 * 60 * 60 * 1000,
    );

    return expectedDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Africa/Lagos",
    });
  };

  const isToday = (dateValue) => {
    const date = parseDate(dateValue);
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  const isDelivered = (orderDateValue) => {
    const orderDate = parseDate(orderDateValue);
    if (!orderDate) return false;

    const deliveryTime = orderDate.getTime() + 7 * 24 * 60 * 60 * 1000;

    return Date.now() >= deliveryTime;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          {<LoadingOverlay />}
        </div>
      </Layout>
    );
  }

  const confirmProductReceived = async (orderId, itemIndex) => {
    try {
      const orderRef = doc(fireDB, "order", orderId);

      const order = orders.find((o) => o.id === orderId);
      const updatedItems = [...order.cartItems];

      // Set delivered and deliveredDate to today (Firestore Timestamp)
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        delivered: true,
        deliveredDate: Timestamp.fromDate(new Date()), // <-- use Firestore Timestamp
        escrowLocked: false,
        released: true,
      };

      await updateDoc(orderRef, {
        cartItems: updatedItems,
      });

      // Update UI instantly
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, cartItems: updatedItems } : o,
        ),
      );
    } catch (err) {
      console.error("Failed to release escrow:", err);
    }
  };

  return (
    <Layout>
      <div
        className={`min-h-screen py-10 px-4 sm:px-8 md:px-12 transition-colors duration-300 ${
          mode === "dark"
            ? "bg-[#181a1b] text-white"
            : "bg-gray-50 text-gray-800"
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
              const orderIsToday = isToday(order.date);
              const delivered = isDelivered(order.date);
              const expectedDeliveryDate = calculateExpectedDeliveryDate(
                order.date,
              );

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl shadow-lg border p-6 sm:p-8 relative hover:shadow-2xl transition-transform transform hover:scale-[1.01] ${
                    mode === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {/* Status Badges */}

                  {!order.cartItems.some((item) => item.delivered) && (
                    <span className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      New Order
                    </span>
                  )}

                  {order.cartItems.some((item) => item.delivered) && (
                    <span className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      ✅ Delivered
                    </span>
                  )}

                  {/* Order Info */}
                  <div className="flex mt-5 flex-wrap justify-between gap-y-2 mb-5 text-sm sm:text-base">
                    <p>
                      <strong>Order Date:</strong>{" "}
                      {order.date?.seconds
                        ? new Date(order.date.seconds * 1000).toLocaleString()
                        : order.date || "N/A"}
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
                  <div className="">
                    {(order.cartItems || []).map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center border rounded-xl ..."
                      >
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

                          {!item.delivered && (
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

                          {item.delivered && (
                            <p className="mt-2 text-green-500 text-xs font-semibold">
                              ✔ Fund Released
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info */}
                  <div className="mt-6 border-t pt-4 text-sm sm:text-base space-y-1">
                    <p>
                      <strong>Customer:</strong> {order.addressInfo?.name}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.addressInfo?.phoneNumber}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.addressInfo?.address}
                    </p>
                    <p>
                      <strong>Postal Code:</strong> {order.addressInfo?.pincode}
                    </p>
                    <p>
                      <strong>Delivery Type:</strong>{" "}
                      {order.addressInfo?.deliveryType === "home"
                        ? "Home Delivery"
                        : "Pickup Point"}
                    </p>

                    <p
                      className={`mt-2 font-medium ${
                        order.cartItems.some((item) => item.delivered)
                          ? "text-green-600"
                          : "text-blue-500"
                      }`}
                    >
                      <strong>
                        {order.cartItems.some((item) => item.delivered)
                          ? "Delivered:"
                          : "Expected Delivery:"}
                      </strong>{" "}
                      {order.cartItems.some((item) => item.delivered)
                        ? new Date(
                            order.cartItems.find((item) => item.delivered)
                              .deliveredDate.seconds * 1000,
                          ).toLocaleDateString("en-GB", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            timeZone: "Africa/Lagos",
                          })
                        : calculateExpectedDeliveryDate(order.date)}
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

                  {/* Footer */}
                  <p className="text-center mt-6 text-xs sm:text-sm text-gray-400 italic">
                    🏬 Thank you for shopping with{" "}
                    <strong>AllMart Store</strong>
                  </p>
                </div>
              );
            })}
          </div>
        )}
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 sm:mx-6 text-center transform scale-100 animate-fadeIn">
              {/* Icon */}
              <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600 dark:text-green-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold mb-3 text-gray-800 dark:text-white">
                Confirm Fund Release
              </h2>
              <p className="mb-6 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                By releasing the fund, you confirm the product has been
                received. This action is irreversible{" "}
                <strong className="text-red-600 dark:text-red-400">
                  cannot be undone
                </strong>
                .
              </p>

              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 sm:px-6 sm:py-3 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium transition-all shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (selectedOrder !== null && selectedItemIndex !== null) {
                      await confirmProductReceived(
                        selectedOrder.id,
                        selectedItemIndex,
                      );
                      setShowModal(false); // close modal after success
                      setSelectedOrder(null);
                      setSelectedItemIndex(null);
                    }
                  }}
                  className="px-5 py-2 sm:px-6 sm:py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Confirm
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
