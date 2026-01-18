import { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/data/myContext";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast';
import { addToCart } from "../../redux/cartSlice";
import { fireDB } from "../../fireabase/FirebaseConfig";


function ProductInfo() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const context = useContext(myContext);
  const { setLoading, mode, user } = context; // ✅ Added user from context

  const [products, setProducts] = useState("");
  const params = useParams();

  // ✅ Get uploader's name
  const getUploaderName = (userid) => {
    const uploader = user?.find((u) => u.uid === userid);
    return uploader ? uploader.name : "AllMart Store";
  };

  const getProductData = async () => {
    setLoading(true);
    try {
      const productTemp = await getDoc(doc(fireDB, "products", params.id));
      setProducts(productTemp.data());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  const addCart = (products) => {
    dispatch(addToCart(products));
    toast.success("🛍️ Product added to cart!");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      <section
        className={`body-font overflow-hidden ${
          mode === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        <Toaster />
        <div className="container mx-auto px-4 sm:px-6 py-10">
          {products && (
            <div className="flex flex-col lg:flex-row items-center gap-10">
              {/* 🖼️ Product Image */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out bg-white/5">
                  <img
                    alt={products.title}
                    src={products.imageUrl}
                    className="rounded-2xl object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                    style={{
                      width: "400px",
                      height: "400px",
                      objectFit: "cover",
                      borderRadius: "1rem",
                      backgroundColor: mode === "dark" ? "#1f2937" : "#f9f9f9",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x400.png?text=No+Image";
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    Hot Deal 🔥
                  </div>
                </div>
              </div>

              {/* 🛍️ Product Info */}
              <div className="w-full lg:w-1/2">
                {/* ✅ Replaced AllMart with uploader's name */}
                <h2
                  className={`text-xs uppercase tracking-widest font-semibold ${
                    mode === "dark" ? "text-pink-400" : "text-pink-600"
                  }`}
                >
                  {getUploaderName(products.userid)}
                </h2>
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
                  {products.title}
                </h1>

                {/* ⭐ Ratings */}
                <div className="flex items-center mb-4">
                  {[...Array(4)].map((_, i) => (
                    <svg
                      key={i}
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="w-5 h-5 text-yellow-400"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    className="w-5 h-5 text-yellow-400"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="ml-3 text-gray-500 text-sm">
                    4.8 (120 reviews)
                  </span>
                </div>

                {/* 📝 Description */}
                <p
                  className={`leading-relaxed border-b pb-5 mb-5 ${
                    mode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {products.description}
                </p>

                {/* 💰 Price and Buttons */}
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-pink-600">
                    ₦{products.price?.toLocaleString()}
                  </span>
                  {currentUser && (
                    <button
                      onClick={() => addCart(products)}
                      className="ml-auto text-white bg-pink-600 hover:bg-pink-700 border-0 py-2 px-6 rounded-lg transition-all font-medium"
                    >
                      Add To Cart
                    </button>
                  )}
                  <button className="ml-4 rounded-full w-10 h-10 bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-all">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="w-5 h-5 text-pink-600"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </button>
                </div>
                  <hr style={{marginTop: "30px" }} />
              </div>
            </div>
          )}
        </div>

        {/* 🚚 Product Availability Note */}
        {products && (
          <div
            className={`mt-12 mb-10 mx-auto px-4 sm:px-6 md:px-8 py-8 w-[92%] sm:w-[85%] md:w-[75%] lg:w-[74%] rounded-2xl shadow-xl border
      ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-gray-100"
          : "bg-gradient-to-br from-white to-pink-50 border-gray-200 text-gray-700"
      } transition-all duration-500`}
          >
            <div className="text-center">
              <h3
                className={`text-xl sm:text-2xl font-bold mb-3 ${
                  mode === "dark" ? "text-pink-400" : "text-pink-600"
                }`}
              >
                Available & Ready to Ship 🚚
              </h3>

              <p className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto px-2 sm:px-4">
                The product{" "}
                <span className="font-semibold text-pink-600">
                  {products.title}
                </span>{" "}
                is <span className="font-semibold">in stock</span> and will be
                delivered immediately once your order is placed. Enjoy{" "}
                <span className="text-pink-500 font-medium">fast delivery</span>
                , trusted packaging, and premium quality — right to your
                doorstep!
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 mt-8">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium">Quality Assured</p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h18M9 3v18m6-18v18M3 9h18M3 15h18"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium">Nationwide Delivery</p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M12 8v8"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium">Secure Payment</p>
              </div>
            </div>

            {/* Features Section */}
            {/* ...same as before... */}
          </div>
        )}
      </section>
    </Layout>
  );
}

export default ProductInfo;
