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
// import { doc, updateDoc } from "firebase/firestore";

function OrderHistory() {
  const { mode } = useContext(myContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const user = JSON.parse(localStorage.getItem("user"));

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
  const calculateDeliveryDate = (orderDateValue, deliveredDateValue) => {
    let deliveryDate;

    if (deliveredDateValue) {
      // deliveredDate can be Timestamp or JS Date
      if (deliveredDateValue.seconds !== undefined) {
        deliveryDate = new Date(deliveredDateValue.seconds * 1000);
      } else {
        deliveryDate = new Date(deliveredDateValue);
      }
    } else if (orderDateValue) {
      // expected delivery = order date + 7 days
      const orderDate =
        orderDateValue.seconds !== undefined
          ? new Date(orderDateValue.seconds * 1000)
          : new Date(orderDateValue);
      deliveryDate = new Date(orderDate);
      deliveryDate.setDate(orderDate.getDate() + 7);
    } else {
      return "N/A";
    }

    return deliveryDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isToday = (dateValue) => {
    const date = parseDate(dateValue);
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  const isDelivered = (dateValue) => {
    const orderDate = parseDate(dateValue);
    if (!orderDate) return false;
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 7);
    return deliveryDate <= today;
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
              const expectedDeliveryDate = calculateDeliveryDate(order.date);

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
                  {orderIsToday && !delivered && (
                    <span className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      🆕 New Order
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(order.cartItems || []).map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center border rounded-xl ..."
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-24 h-24 object-cover border-r"
                        />
                        <div className="p-3 flex-1">
                          <p className="font-semibold truncate">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            Price: ₦{Number(item.price).toLocaleString()}
                          </p>

                          {!item.delivered && (
                            <button
                              onClick={() =>
                                confirmProductReceived(order.id, i)
                              }
                              className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                            >
                              ✅ Product Received
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
                      {calculateDeliveryDate(
                        order.date,
                        order.cartItems.find((item) => item.delivered)
                          ?.deliveredDate,
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
      </div>
    </Layout>
  );
}

export default OrderHistory;