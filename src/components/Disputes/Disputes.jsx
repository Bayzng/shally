import { useEffect, useState, useContext } from "react";
import Layout from "../../components/layout/Layout";
import { collection, query, where, getDocs } from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";
import myContext from "../../context/data/myContext";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";

function Disputes() {
  const { mode } = useContext(myContext);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  const localUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        if (!localUser?.uid) return;

        const q = query(
          collection(fireDB, "disputes"),
          where("sellerId", "==", localUser.uid)
        );

        const snapshot = await getDocs(q);

        const sellerDisputes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDisputes(sellerDisputes);
      } catch (error) {
        console.error("Error fetching disputes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
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
        className={`min-h-screen py-10 px-4 sm:px-8 ${
          mode === "dark"
            ? "bg-[#181a1b] text-white"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        <h1 className="text-3xl font-bold text-center mb-10">
          ⚠️ Seller Disputes
        </h1>

        {disputes.length === 0 ? (
          <p className="text-center text-gray-500">
            No disputes raised against your products.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {disputes.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl shadow-lg border p-6 ${
                  mode === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Status Badge */}
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    item.status === "open"
                      ? "bg-red-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {item.status?.toUpperCase()}
                </span>

                {/* Product Info */}
                <div className="mt-4">
                  <img
                    src={item.productImage}
                    alt={item.productTitle}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />

                  <h2 className="font-semibold text-lg truncate">
                    {item.productTitle}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Category: {item.productCategory}
                  </p>

                  <p className="text-sm mt-1">
                    Price: ₦{Number(item.productPrice).toLocaleString()}
                  </p>
                </div>

                {/* Buyer Info */}
                <div className="mt-5 border-t pt-4 text-sm space-y-1">
                  <p>
                    <strong>Buyer:</strong> {item.buyerName}
                  </p>
                  <p>
                    <strong>Email:</strong> {item.buyerEmail}
                  </p>
                  <p>
                    <strong>Phone:</strong> {item.buyerPhone}
                  </p>
                  <p>
                    <strong>Address:</strong> {item.buyerAddress}
                  </p>
                </div>

                {/* Order Info */}
                <div className="mt-5 border-t pt-4 text-sm">
                  <p>
                    <strong>Order ID:</strong> {item.orderId}
                  </p>
                  <p>
                    <strong>Payment ID:</strong> {item.paymentId}
                  </p>
                  <p>
                    <strong>Expected Delivery:</strong> {item.expectedDelivery}
                  </p>
                </div>

                {/* Alert Message */}
                <div className="mt-5 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  ⚠️ A buyer has raised an issue regarding this product.
                  Please review this order and respond accordingly.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Disputes;