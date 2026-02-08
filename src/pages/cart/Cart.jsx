import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import myContext from "../../context/data/myContext";
import Layout from "../../components/layout/Layout";
import { deleteFromCart, clearCart } from "../../redux/cartSlice";
import toast, { Toaster } from "react-hot-toast";
import { addDoc, collection } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";
import { PaystackButton } from "react-paystack";
import { IoMdClose } from "react-icons/io";

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
    if (cartItems.length === 0) {
      // Close any open modal
      setShowModal(false);
      setPaystackProps(null);

      // Small delay so toast can show
      setTimeout(() => {
        navigate("/");
      }, 800);
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + Number(String(item.price).replace(/,/g, "") || 0),
      0,
    );
    setTotalAmount(total);
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
  const [showAltAddress, setShowAltAddress] = useState(false);
  const [altPickupAddress, setAltPickupAddress] = useState("");

  const pickupPoints = {
    "Abia State": ["Aba Main Park", "Umuahia Central Bus Terminal"],
    "Adamawa State": ["Jimeta Modern Market", "Mubi Roundabout"],
    "Akwa Ibom State": ["Uyo Plaza", "Eket Motor Park"],
    "Anambra State": ["Onitsha Upper Iweka", "Awka Park"],
    "Bauchi State": ["Bauchi Central Market", "Yelwa Park"],
    "Bayelsa State": ["Yenagoa Park", "Amassoma Junction"],
    "Benue State": ["Makurdi Wurukum Market", "Gboko Park"],
    "Borno State": ["Maiduguri Post Office", "Baga Road Market"],
    "Cross River State": ["Calabar Main Park", "University of Calabar Gate"],
    "Delta State": ["Warri Main Garage", "Asaba Park"],
    "Ebonyi State": ["Abakaliki Central Park", "Presco Junction"],
    "Edo State": ["Benin Uselu Market", "Ramat Park Benin"],
    "Ekiti State": ["Ado-Ekiti Fajuyi Park", "Ekiti State University Gate"],
    "Enugu State": ["Enugu Holy Ghost Park", "Nsukka Market"],
    "Gombe State": ["Gombe Main Market", "Bajoga Junction"],
    "Imo State": ["Owerri Control Post", "Douglas Road Park"],
    "Jigawa State": ["Dutse Central Park", "Hadejia Market"],
    "Kaduna State": ["Kaduna Central Market", "Kafanchan Roundabout"],
    "Kano State": ["Sabon Gari Market", "Kano Central Park"],
    "Katsina State": ["Katsina Central Park", "Funtua Junction"],
    "Kebbi State": ["Birnin Kebbi Park", "Argungu Motor Park"],
    "Kogi State": ["Lokoja Ganaja Junction", "Anyigba Park"],
    "Kwara State": ["Post Office Ilorin", "Challenge Park Ilorin"],
    "Lagos State": ["Ikeja Mall", "Yaba Tech Junction"],
    "Nasarawa State": ["Lafia Park", "Keffi Roundabout"],
    "Niger State": ["Minna Central Park", "Bida Main Garage"],
    "Ogun State": ["Abeokuta Central Park", "Sango Garage"],
    "Ondo State": ["Akure Park", "Ondo Town Junction"],
    "Osun State": ["Osogbo Old Garage", "OAU Campus Gate"],
    "Oyo State": ["Dugbe Bus Stop", "UI Main Gate"],
    "Plateau State": ["Jos Terminus Market", "Bukuru Junction"],
    "Rivers State": ["Port Harcourt Garrison", "Mile 1 Park"],
    "Sokoto State": ["Sokoto Central Market", "Usman Danfodiyo Gate"],
    "Taraba State": ["Jalingo Park", "Wukari Junction"],
    "Yobe State": ["Damaturu Central Park", "Potiskum Roundabout"],
    "Zamfara State": ["Gusau Central Park", "Talata Mafara Market"],
    "FCT Abuja": ["Utako Park", "Garki Market"],
  };

  const buyNow = () => {
    if (!name || !pincode || !phoneNumber)
      return toast.error("All fields are required");

    if (deliveryOption === "pickup") {
      if (!selectedState)
        return toast.error("Select your state for pickup delivery");
      if (!pickupLocation && !altPickupAddress)
        return toast.error(
          "Select a pickup point or provide an alternative address",
        );
    }

    if (deliveryOption === "home" && !address)
      return toast.error("Enter delivery address");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.uid || !user?.email) {
      return toast.error("Please login to continue");
    }

    const publicKey = "pk_test_74f3976b0f222f4ca7e91a391c80002d962ddcf1";
    const amountInKobo = grandTotal * 100;
    const email = user?.email;

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
              ? altPickupAddress
                ? `${altPickupAddress}, ${selectedState}`
                : `${pickupLocation}, ${selectedState}`
              : address,
          pincode,
          phoneNumber,
          deliveryType: deliveryOption,
          expectedDelivery: Timestamp.fromDate(
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
          ), // store expected delivery as Firestore timestamp
          date: Timestamp.fromDate(new Date()), // store order date as Firestore timestamp
        };

        try {
          await addDoc(collection(fireDB, "order"), {
            cartItems,
            addressInfo,
            date: Timestamp.fromDate(new Date()), // ✅ correct timestamp
            email,
            userid: user?.uid,
            paymentId: reference.reference,
            status: "success",
          });

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
          console.error(error);
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
        <Toaster />
        <h1 className="mb-6 text-center text-3xl font-bold tracking-wide">
          🛒 Your Shopping Cart
        </h1>
        <div className="mx-auto max-w-6xl px-6 md:flex md:space-x-8">
          {/* Cart Items */}
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
                    <button
                      type="button"
                      onClick={() => deleteCart(item)}
                      className="
                        mt-3 inline-flex items-center gap-2
                        px-4 py-2 text-sm font-medium
                        text-red-600 bg-red-200
                        rounded-xl
                        hover:bg-red-100 hover:text-red-700
                        active:scale-95
                        transition-all duration-200
                        shadow-sm hover:shadow-md
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Your cart is empty 🛍️</p>
            )}
          </div>

          {/* Order Summary */}
          <div
            style={{
              backgroundColor: mode === "dark" ? "#181a1b" : "#f8fafc",
              color: mode === "dark" ? "white" : "",
            }}
            className="mt-6 rounded-2xl border bg-white p-6 shadow-md md:mt-0 md:w-1/3 flex flex-col justify-between md:h-auto"
          >
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

        {/* Delivery Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
            <div
              className={`rounded-2xl p-6 w-[90%] sm:w-[500px] shadow-2xl relative overflow-y-auto max-h-[90vh] ${
                mode === "dark"
                  ? "bg-gray-900 text-white border border-gray-700"
                  : "bg-white text-gray-900"
              }`}
            >
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => {
                  setShowModal(false);
                  setPaystackProps(null);
                }}
                className="
                  absolute top-2 right-4
                  flex items-center justify-center
                  w-7 h-7
                  rounded-full
                  bg-red-600
                  text-white
                  hover:bg-red-700
                  transition-all duration-200
                  active:scale-95
                "
              >
                <IoMdClose className="w-5 h-5" />
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
                  className="w-full p-3 rounded-lg border"
                  style={{
                    backgroundColor: mode === "dark" ? "#181a1b" : "#f8fafc",
                    color: mode === "dark" ? "white" : "",
                  }}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 rounded-lg border"
                  style={{
                    backgroundColor: mode === "dark" ? "#181a1b" : "#f8fafc",
                    color: mode === "dark" ? "white" : "",
                  }}
                />
                <select
                  value={deliveryOption}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                  className="w-full p-3 rounded-lg border"
                  style={{
                    backgroundColor: mode === "dark" ? "#181a1b" : "#f8fafc",
                    color: mode === "dark" ? "white" : "",
                  }}
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
                    className="w-full p-3 rounded-lg border"
                    style={{
                      backgroundColor: mode === "dark" ? "#181a1b" : "#f8fafc",
                      color: mode === "dark" ? "white" : "",
                    }}
                  />
                ) : (
                  <>
                    {/* Pickup State */}
                    <div
                      className={`w-full rounded-xl border p-3 ${
                        mode === "dark"
                          ? "bg-[#181a1b] text-white border-gray-600"
                          : "bg-gray-50 text-gray-900 border-gray-300"
                      }`}
                      style={{ maxHeight: "250px", overflowY: "auto" }}
                    >
                      <p className="font-semibold mb-2">Select State</p>
                      <ul className="space-y-2">
                        {Object.keys(pickupPoints).map((state) => (
                          <li
                            key={state}
                            onClick={() => setSelectedState(state)}
                            className={`p-2 rounded-lg cursor-pointer ${
                              selectedState === state
                                ? "bg-blue-600 text-white"
                                : mode === "dark"
                                  ? "hover:bg-gray-800"
                                  : "hover:bg-gray-200"
                            }`}
                          >
                            {state}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pickup Points */}
                    {selectedState && (
                      <select
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="w-full p-3 rounded-lg border mt-2"
                        style={{
                          backgroundColor:
                            mode === "dark" ? "#181a1b" : "#f8fafc",
                          color: mode === "dark" ? "white" : "",
                        }}
                      >
                        <option value="">Select Pickup Point</option>
                        {pickupPoints[selectedState].map((point) => (
                          <option key={point} value={point}>
                            {point}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Alternative Pickup Address */}
                    <p className="text-sm mt-2">
                      Can’t find your pickup point?{" "}
                      <button
                        className="text-blue-600 underline"
                        onClick={() => setShowAltAddress(!showAltAddress)}
                      >
                        Click here
                      </button>
                    </p>

                    {showAltAddress && (
                      <input
                        type="text"
                        placeholder="Alternative Pickup Address"
                        value={altPickupAddress}
                        onChange={(e) => setAltPickupAddress(e.target.value)}
                        className="w-full p-3 rounded-lg border mt-2"
                        style={{
                          backgroundColor:
                            mode === "dark" ? "#181a1b" : "#f8fafc",
                          color: mode === "dark" ? "white" : "",
                        }}
                      />
                    )}
                  </>
                )}

                <input
                  type="text"
                  placeholder="Postal Code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-3 rounded-lg border mt-2"
                  style={{
                    backgroundColor: mode === "dark" ? "#181a1b" : "#f8fafc",
                    color: mode === "dark" ? "white" : "",
                  }}
                />

                {!paystackProps ? (
                  <button
                    onClick={buyNow}
                    className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-300"
                  >
                    Continue
                  </button>
                ) : (
                  <PaystackButton
                    {...paystackProps}
                    className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all duration-300"
                  />
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
