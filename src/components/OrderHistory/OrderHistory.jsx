import { useEffect, useState, useContext } from "react";
import Layout from "../../components/layout/Layout";
import { collection, getDocs, query, where } from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";
import myContext from "../../context/data/myContext";

function OrderHistory() {
  const { mode } = useContext(myContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.user?.uid) return;
        const q = query(
          collection(fireDB, "order"),
          where("userid", "==", user.user.uid)
        );
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // helper: calculate delivery date (7 days after order)
  const calculateDeliveryDate = (dateString) => {
    const orderDate = new Date(dateString);
    orderDate.setDate(orderDate.getDate() + 7);
    return orderDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg animate-pulse">Loading your orders...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="min-h-screen py-10 px-4 sm:px-10"
        style={{
          backgroundColor: mode === "dark" ? "#181a1b" : "#f8fafc",
          color: mode === "dark" ? "white" : "",
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-8">
          🧾 My Order History
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            You have not placed any orders yet 🛍️
          </p>
        ) : (
          <div className="space-y-8 max-w-5xl mx-auto">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`rounded-2xl shadow-xl border p-6 transition transform hover:scale-[1.01] ${
                  mode === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex justify-between flex-wrap mb-4">
                  <p>
                    <strong>Order Date:</strong> {order.date}
                  </p>
                  <p>
                    <strong>Payment ID:</strong> {order.paymentId}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        order.status === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {order.cartItems.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center border rounded-xl overflow-hidden ${
                        mode === "dark"
                          ? "border-gray-700 bg-gray-900"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="p-3">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-gray-500">
                          Price: #{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t pt-4">
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
                  <p className="mt-2">
                    <strong>Expected Delivery:</strong>{" "}
                    {calculateDeliveryDate(order.date)}
                  </p>
                </div>

                <div className="mt-6 text-right">
                  <p className="text-lg font-bold">
                    Total Paid: #
                    {order.cartItems
                      .reduce(
                        (acc, item) => acc + parseFloat(item.price || 0),
                        0
                      )
                      .toLocaleString()}
                  </p>
                </div>

                <p className="text-center mt-6 text-sm text-gray-400">
                  🏬 Thank you for shopping with <strong>Shally Store</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default OrderHistory;
