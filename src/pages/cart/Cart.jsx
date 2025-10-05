import { useContext, useEffect, useState } from "react";
import myContext from "../../context/data/myContext";
import Layout from "../../components/layout/Layout";
import Modal from "../../components/modal/Modal";
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

  // Address states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const buyNow = async () => {
    if (!name || !address || !pincode || !phoneNumber) {
      return toast.error("All fields are required");
    }

    const addressInfo = {
      name,
      address,
      pincode,
      phoneNumber,
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

    const options = {
      key: "rzp_test_key_here", // Replace with your Razorpay key
      amount: parseInt(grandTotal * 100),
      currency: "INR",
      name: "Tera_Bayz",
      description: "Secure Checkout",
      handler: async (response) => {
        toast.success("Payment Successful!");
        const paymentId = response.razorpay_payment_id;

        const orderInfo = {
          cartItems,
          addressInfo,
          date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          email: user?.user?.email,
          userid: user?.user?.uid,
          paymentId,
        };

        try {
          const orderRef = collection(fireDB, "order");
          await addDoc(orderRef, orderInfo);
          toast.success("Order placed successfully!");
        } catch (error) {
          console.error("Error placing order:", error);
        }
      },
      theme: { color: "#ff4b81" },
    };

    const pay = new window.Razorpay(options);
    pay.open();
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
        <h1 className="mb-10 text-center text-3xl font-bold tracking-wide">
          🛒 Your Shopping Cart
        </h1>

        <div className="mx-auto max-w-6xl px-6 md:flex md:space-x-8">
          {/* 🧺 Cart Items */}
          <div className="rounded-lg md:w-2/3">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => {
                const { title, price, imageUrl } = item;
                return (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row justify-between mb-6 rounded-2xl border drop-shadow-xl bg-white p-5 hover:shadow-xl transition duration-300"
                    style={{
                      backgroundColor: mode === "dark" ? "rgb(32 33 34)" : "",
                      color: mode === "dark" ? "white" : "",
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={title}
                      className="rounded-lg w-full sm:w-40 h-40 object-cover"
                    />
                    <div className="sm:ml-4 flex flex-col justify-between flex-1 mt-4 sm:mt-0">
                      <div>
                        <h2 className="text-lg font-semibold mb-1">{title}</h2>
                        <p className="text-sm text-gray-500">
                          Price: <span className="font-medium">#{price}</span>
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
                );
              })
            ) : (
              <p className="text-center text-gray-500">Your cart is empty 🛍️</p>
            )}
          </div>

          {/* 💳 Order Summary */}
          <div
            className="mt-6 h-[420px] rounded-2xl border bg-white p-6 shadow-md md:mt-0 md:w-1/3 flex flex-col justify-between"
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

            <div className="mt-5">
              <Modal
                name={name}
                address={address}
                pincode={pincode}
                phoneNumber={phoneNumber}
                setName={setName}
                setAddress={setAddress}
                setPincode={setPincode}
                setPhoneNumber={setPhoneNumber}
                buyNow={buyNow}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
