import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import myContext from "../../context/data/myContext";
import Layout from "../../components/layout/Layout";
import { deleteFromCart, clearCart } from "../../redux/cartSlice";
import { toast } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";
import { PaystackButton } from "react-paystack";

function Cart() {
  const { mode } = useContext(myContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart);

  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Item removed from cart");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    setTotalAmount(
      cartItems.reduce((total, item) => total + parseInt(item.price || 0), 0)
    );
  }, [cartItems]);

  const shipping = 100;
  const grandTotal = totalAmount + shipping;

  // Delivery info states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("home");
  const [selectedState, setSelectedState] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [paystackProps, setPaystackProps] = useState(null);

  const pickupPoints = {
    "Kwara State": ["Post Office Ilorin", "Challenge Park Ilorin"],
    "Lagos State": ["Ikeja Mall", "Yaba Tech Junction"],
    "Ogun State": ["Abeokuta Central Park", "Sango Garage"],
    "Osun State": ["Osogbo Old Garage", "OAU Campus Gate"],
    "Oyo State": ["Dugbe Bus Stop", "UI Main Gate"],
  };

  const buyNow = () => {
    if (!name || !pincode || !phoneNumber)
      return toast.error("All fields are required");
    if (deliveryOption === "pickup" && (!selectedState || !pickupLocation))
      return toast.error("Select your state & pickup point");
    if (deliveryOption === "home" && !address)
      return toast.error("Enter delivery address");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return toast.error("Please login to continue");

    const publicKey = "pk_test_74f3976b0f222f4ca7e91a391c80002d962ddcf1"; // Paystack test key
    const amountInKobo = grandTotal * 100;
    const email = user?.user?.email;

    const componentProps = {
      email,
      amount: amountInKobo,
      publicKey,
      text: "Pay Now",
      onSuccess: async (reference) => {
        const addressInfo = {
          name,
          address:
            deliveryOption === "pickup"
              ? `${pickupLocation}, ${selectedState}`
              : address,
          pincode,
          phoneNumber,
          deliveryType: deliveryOption,
          expectedDelivery: "Within 7 days",
          date: new Date().toLocaleString(),
        };

        try {
          const orderRef = collection(fireDB, "order");
          await addDoc(orderRef, {
            cartItems,
            addressInfo,
            date: new Date().toLocaleString(),
            email,
            userid: user?.user?.uid,
            paymentId: reference.reference,
            status: "success",
          });

          // ✅ Clear cart from Redux and localStorage after successful payment
          dispatch(clearCart());
          localStorage.removeItem("cart");

          navigate("/transaction-status", {
            state: {
              status: "success",
              reference: reference.reference,
              total: grandTotal,
              cartItems,
              addressInfo,
            },
          });
        } catch (error) {
          console.error("Error saving order:", error);
          navigate("/transaction-status", {
            state: { status: "failed", reference: reference.reference },
          });
        }
      },
      onClose: () => {
        navigate("/transaction-status", { state: { status: "cancelled" } });
      },
    };

    setPaystackProps(componentProps);
  };

  return (
    <Layout>
      <div
        className="min-h-screen pt-5 pb-20"
        style={{
          backgroundColor: mode === "dark" ? "#181a1b" : "#f8fafc",
          color: mode === "dark" ? "white" : "",
        }}
      >
        <h1 className="mb-6 text-center text-3xl font-bold tracking-wide">
          🛒 Your Shopping Cart
        </h1>
        <div className="mx-auto max-w-6xl px-6 md:flex md:space-x-8">
          <div className="rounded-lg md:w-2/3">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row justify-between mb-6 rounded-2xl border drop-shadow-xl bg-white p-5 hover:shadow-xl transition duration-300"
                  style={{
                    backgroundColor: mode === "dark" ? "rgb(32 33 34)" : "",
                    color: mode === "dark" ? "white" : "",
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="rounded-lg w-full sm:w-40 h-40 object-cover"
                  />
                  <div className="sm:ml-4 flex flex-col justify-between flex-1 mt-4 sm:mt-0">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">
                        {item.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Price:{" "}
                        <span className="font-medium">#{item.price}</span>
                      </p>
                    </div>
                    <div
                      onClick={() => deleteCart(item)}
                      className="text-red-500 hover:text-red-600 flex items-center cursor-pointer mt-3"
                    >
                      Remove
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Your cart is empty 🛍️</p>
            )}
          </div>

          <div
            style={{
              backgroundColor: mode === "dark" ? "#181a1b" : "#f8fafc",
              color: mode === "dark" ? "white" : "",
            }}
            className="mt-6 rounded-2xl border bg-white p-6 shadow-md md:mt-0 md:w-1/3 flex flex-col justify-between md:h-auto"
          >
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">
                🧾 Order Summary
              </h2>
              <div className="flex justify-between mb-3">
                <p>Subtotal</p>
                <p className="font-medium">#{totalAmount}</p>
              </div>
              <div className="flex justify-between mb-3">
                <p>Shipping</p>
                <p className="font-medium">#{shipping}</p>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <p>Total</p>
                <p>#{grandTotal}</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg"
              >
                Confirm Delivery Details
              </button>
            </div>
          </div>
        </div>

        {/* Delivery Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div
              className={`rounded-2xl p-6 w-[90%] sm:w-[500px] shadow-2xl relative ${
                mode === "dark"
                  ? "bg-gray-900 text-white border border-gray-700"
                  : "bg-white text-gray-900"
              }`}
            >
              <button
                onClick={() => {
                  setShowModal(false);
                  setPaystackProps(null);
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center">
                🚚 Delivery Information
              </h2>

              <div className="space-y-3">
                <input
                  style={{
                    backgroundColor: mode === "dark" ? "#181a1b" : "#f8fafc",
                    color: mode === "dark" ? "white" : "",
                  }}
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg border"
                />
                <input
                  style={{
                    backgroundColor: mode === "dark" ? "#181a1b" : "#f8fafc",
                    color: mode === "dark" ? "white" : "",
                  }}
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 rounded-lg border"
                />
                <select
                  style={{
                    backgroundColor: mode === "dark" ? "#181a1b" : "#f8fafc",
                    color: mode === "dark" ? "white" : "",
                  }}
                  value={deliveryOption}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                  className="w-full p-3 rounded-lg border"
                >
                  <option value="home">Home Delivery</option>
                  <option value="pickup">Pickup Point</option>
                </select>

                {deliveryOption === "home" ? (
                  <input
                    style={{
                      backgroundColor: mode === "dark" ? "#181a1b" : "#f8fafc",
                      color: mode === "dark" ? "white" : "",
                    }}
                    type="text"
                    placeholder="Delivery Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 rounded-lg border"
                  />
                ) : (
                  <>
                    <select
                      style={{
                        backgroundColor:
                          mode === "dark" ? "#181a1b" : "#f8fafc",
                        color: mode === "dark" ? "white" : "",
                      }}
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full p-3 rounded-lg border"
                    >
                      <option value="">Select State</option>
                      {Object.keys(pickupPoints).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {selectedState && (
                      <select
                        style={{
                          backgroundColor:
                            mode === "dark" ? "#181a1b" : "#f8fafc",
                          color: mode === "dark" ? "white" : "",
                        }}
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="w-full p-3 rounded-lg border"
                      >
                        <option value="">Select Pickup Point</option>
                        {pickupPoints[selectedState].map((point) => (
                          <option key={point} value={point}>
                            {point}
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                )}

                <input
                  style={{
                    backgroundColor: mode === "dark" ? "#181a1b" : "#f8fafc",
                    color: mode === "dark" ? "white" : "",
                  }}
                  type="text"
                  placeholder="Postal Code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-3 rounded-lg border"
                />

                {!paystackProps && (
                  <button
                    onClick={buyNow}
                    className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-300"
                  >
                    Continue
                  </button>
                )}

                {paystackProps && (
                  <div className="w-full mt-4">
                    <PaystackButton
                      {...paystackProps}
                      className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all duration-300"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Cart;
