import { useContext, useEffect, useState } from "react";
import myContext from "../../context/data/myContext";
import Layout from "../../components/layout/Layout";
// import Modal from "../../components/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { deleteFromCart } from "../../redux/cartSlice";
import { toast } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";

function Cart() {
  const context = useContext(myContext);
  const { mode } = context;

  const dispatch = useDispatch();
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
    const temp = cartItems.reduce(
      (total, item) => total + parseInt(item.price || 0),
      0
    );
    setTotalAmount(temp);
  }, [cartItems]);

  const shipping = 100;
  const grandTotal = shipping + totalAmount;

  // Delivery info states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("home");
  const [selectedState, setSelectedState] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [showModal, setShowModal] = useState(false);

  const pickupPoints = {
    "Kwara State": ["Post Office Ilorin", "Challenge Park Ilorin"],
    "Lagos State": ["Ikeja Mall", "Yaba Tech Junction"],
    "Ogun State": ["Abeokuta Central Park", "Sango Garage"],
    "Osun State": ["Osogbo Old Garage", "OAU Campus Gate"],
    "Oyo State": ["Dugbe Bus Stop", "UI Main Gate"],
  };

  const buyNow = async () => {
    if (!name || !pincode || !phoneNumber) {
      return toast.error("All fields are required");
    }

    if (deliveryOption === "pickup" && (!selectedState || !pickupLocation)) {
      return toast.error("Please select your state and pickup location");
    }

    if (deliveryOption === "home" && !address) {
      return toast.error("Please enter your delivery address");
    }

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
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to continue");
      return;
    }

    try {
      const orderRef = collection(fireDB, "order");
      await addDoc(orderRef, {
        cartItems,
        addressInfo,
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        email: user?.user?.email,
        userid: user?.user?.uid,
        paymentId: "Pending (Offline Payment)",
      });
      toast.success("Order placed successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Error placing order");
    }
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
        <p className="text-center text-sm text-gray-500 mb-10">
          Delivery within <span className="font-semibold">7 days</span> after
          order confirmation. Choose between{" "}
          <span className="font-medium">Home Delivery</span> or{" "}
          <span className="font-medium">Pickup Point Collection</span>.
        </p>

        <div className="mx-auto max-w-6xl px-6 md:flex md:space-x-8">
          {/* 🧺 Cart Items */}
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Remove
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Your cart is empty 🛍️</p>
            )}
          </div>

          {/* 💳 Order Summary */}
          <div
            className="mt-6 rounded-2xl border bg-white p-6 shadow-md md:mt-0 md:w-1/3 flex flex-col justify-between md:h-auto lg:h-[360px] lg:max-h-[380px]"
            style={{
              backgroundColor: mode === "dark" ? "rgb(32 33 34)" : "",
              color: mode === "dark" ? "white" : "",
            }}
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
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg"
            >
              Confirm Delivery Details
            </button>
          </div>
        </div>

        {/* 🪟 Delivery Modal */}
        {/* 🪟 Delivery Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div
              className={`rounded-2xl p-6 w-[90%] sm:w-[500px] shadow-2xl relative transition-all duration-500 ${
                mode === "dark"
                  ? "bg-gray-900 text-white border border-gray-700"
                  : "bg-white text-gray-900"
              }`}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-4 text-center">
                🚚 Delivery Information
              </h2>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-3 rounded-lg border outline-none focus:ring-2 ${
                    mode === "dark"
                      ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  }`}
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`w-full p-3 rounded-lg border outline-none focus:ring-2 ${
                    mode === "dark"
                      ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  }`}
                />

                <select
                  value={deliveryOption}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                  className={`w-full p-3 rounded-lg border outline-none focus:ring-2 ${
                    mode === "dark"
                      ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  }`}
                >
                  <option value="home">Home Delivery</option>
                  <option value="pickup">Pickup Point</option>
                </select>

                {deliveryOption === "home" ? (
                  <input
                    type="text"
                    placeholder="Delivery Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full p-3 rounded-lg border outline-none focus:ring-2 ${
                      mode === "dark"
                        ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                    }`}
                  />
                ) : (
                  <>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className={`w-full p-3 rounded-lg border outline-none focus:ring-2 ${
                        mode === "dark"
                          ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                      }`}
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
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className={`w-full p-3 rounded-lg border outline-none focus:ring-2 ${
                          mode === "dark"
                            ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                        }`}
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
                  type="text"
                  placeholder="Postal Code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className={`w-full p-3 rounded-lg border outline-none focus:ring-2 ${
                    mode === "dark"
                      ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  }`}
                />

                <button
                  onClick={buyNow}
                  className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all duration-300"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🚴 Delivery Riders Section */}
        <div
          className={`
    mt-16 sm:mt-20 
    w-[92%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:max-w-6xl 
    mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 text-center 
    rounded-2xl shadow-xl border 
    transition-all duration-500 
    ${mode === "dark" ? "border-gray-700" : "border-gray-200"}
  `}
          style={{
            background:
              mode === "dark"
                ? "linear-gradient(135deg, #1e1e1e, #2a2a2a)"
                : "linear-gradient(135deg, #f9fafb, #eef2ff)",
            color: mode === "dark" ? "white" : "#1e293b",
          }}
        >
          <h2
            className={`
      text-2xl sm:text-3xl font-bold mb-4 flex justify-center items-center gap-2 
      ${mode === "dark" ? "text-gray-100" : "text-gray-800"}
    `}
          >
            <span role="img" aria-label="rider">
              🚴
            </span>
            Reliable Delivery Riders Everywhere
          </h2>

          <p
            className={`
      max-w-3xl mx-auto text-base sm:text-lg mb-8 leading-relaxed 
      ${mode === "dark" ? "text-gray-300" : "text-gray-600"}
    `}
          >
            We’ve got experienced{" "}
            <span className="font-semibold text-blue-600">delivery riders</span>{" "}
            across all pickup and delivery zones you select. Whether you choose
            <span className="font-medium text-green-600"> Home Delivery </span>
            or prefer{" "}
            <span className="font-medium text-purple-600">Pickup Points</span>,
            your order will always be handled with care and delivered swiftly.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[
              {
                title: "🕒 Fast Delivery",
                text: "Expect delivery within 7 days of confirmation.",
              },
              {
                title: "📍 Wide Coverage",
                text: "Riders are stationed across all major states for pickup & drop.",
              },
              {
                title: "🔒 Safe & Secure",
                text: "Every order is tracked and confirmed upon delivery or pickup.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1
          ${mode === "dark" ? "bg-[#202122]" : "bg-white"}
        `}
              >
                <h3
                  className={`font-semibold text-lg sm:text-xl mb-2 ${
                    mode === "dark" ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-sm sm:text-base ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <p
            className={`mt-10 text-xs sm:text-sm ${
              mode === "dark" ? "text-gray-500" : "text-gray-500"
            }`}
          >
            For special delivery requests or updates, please contact our support
            team anytime.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
