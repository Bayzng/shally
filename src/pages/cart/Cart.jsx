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
  console.log(cartItems);

  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Deleted from cart");
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

  // Address and payment state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const buyNow = async () => {
    if (!name || !address || !pincode || !phoneNumber) {
      return toast.error("All fields are required", {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
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
      toast.error("You must be logged in to continue");
      return;
    }

    const options = {
      key: "rzp_test_key_here", // Replace with your Razorpay key
      key_secret: "rzp_test_secret_here",
      amount: parseInt(grandTotal * 100),
      currency: "INR",
      order_receipt: "order_rcptid_" + name,
      name: "Tera_Bayz",
      description: "Payment for your order",
      handler: async (response) => {
        toast.success("Payment Successful");
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
          console.error("Error adding order: ", error);
        }
      },
      theme: { color: "#3399cc" },
    };

    const pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    <Layout>
      <div
        className="min-h-screen bg-gray-100 pt-5 pb-20"
        style={{
          backgroundColor: mode === "dark" ? "#282c34" : "",
          color: mode === "dark" ? "white" : "",
        }}
      >
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
          {/* Cart Items */}
          <div className="rounded-lg md:w-2/3">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => {
                const { title, price, description, imageUrl } = item;
                return (
                  <div
                    key={index}
                    className="justify-between mb-6 rounded-lg border drop-shadow-xl bg-white p-6 sm:flex sm:justify-start"
                    style={{
                      backgroundColor: mode === "dark" ? "rgb(32 33 34)" : "",
                      color: mode === "dark" ? "white" : "",
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full rounded-lg sm:w-40"
                    />
                    <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                      <div className="mt-5 sm:mt-0">
                        <h2
                          className="text-lg font-bold"
                          style={{ color: mode === "dark" ? "white" : "" }}
                        >
                          {title}
                        </h2>
                        <p
                          className="text-sm text-gray-500"
                          style={{ color: mode === "dark" ? "white" : "" }}
                        >
                          {description}
                        </p>
                        <p
                          className="mt-1 text-xs font-semibold"
                          style={{ color: mode === "dark" ? "white" : "" }}
                        >
                          #{price}
                        </p>
                      </div>
                      <div
                        onClick={() => deleteCart(item)}
                        className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6 cursor-pointer text-red-500 hover:text-red-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21
                            c.342.052.682.107 1.022.166m-1.022-.165L18.16
                            19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25
                            2.25 0 01-2.244-2.077L4.772
                            5.79m14.456 0a48.108 48.108 0
                            00-3.478-.397m-12 .562c.34-.059.68-.114
                            1.022-.165m0 0a48.11 48.11 0
                            013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964
                            51.964 0 00-3.32 0c-1.18.037-2.09
                            1.022-2.09 2.201v.916m7.5 0a48.667
                            48.667 0 00-7.5 0"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            )}
          </div>

          {/* Summary Section */}
          <div
            className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3"
            style={{
              backgroundColor: mode === "dark" ? "rgb(32 33 34)" : "",
              color: mode === "dark" ? "white" : "",
            }}
          >
            <div className="mb-2 flex justify-between">
              <p>Subtotal</p>
              <p>#{totalAmount}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>#{shipping}</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between mb-3">
              <p className="text-lg font-bold">Total</p>
              <p className="text-lg font-bold">#{grandTotal}</p>
            </div>

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
    </Layout>
  );
}

export default Cart;
