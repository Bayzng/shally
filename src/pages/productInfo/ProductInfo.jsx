import { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/data/myContext";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { addToCart } from "../../redux/cartSlice";
import { fireDB } from "../../fireabase/FirebaseConfig";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import { MdVerified } from "react-icons/md";

function ProductInfo() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const context = useContext(myContext);
  const { setLoading, loading, mode, user } = context;

  const [products, setProducts] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  const params = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  const getUploader = (userid) => {
    return (
      user?.find((u) => u.uid === userid) || {
        name: "AllMart Store",
        verified: false,
      }
    );
  };

  const getProductData = async () => {
    setLoading(true);
    try {
      const productSnap = await getDoc(doc(fireDB, "products", params.id));
      if (productSnap.exists()) {
        setProducts(productSnap.data());
      }
    } catch (error) {
      toast.error("Failed to load product.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getRatings = async () => {
    try {
      const ratingsRef = collection(fireDB, "products", params.id, "ratings");
      const snapshot = await getDocs(ratingsRef);

      if (snapshot.empty) {
        setAverageRating(0);
        setTotalReviews(0);
        return;
      }

      let total = 0;
      snapshot.forEach((doc) => {
        total += doc.data().rating;
      });

      setTotalReviews(snapshot.size);
      setAverageRating((total / snapshot.size).toFixed(1));
    } catch (error) {
      console.log("Rating fetch error:", error);
    }
  };

  const submitRating = async () => {
    if (!currentUser) {
      toast.error("Login to rate this product");
      return;
    }
    if (userRating === 0) {
      toast.error("Select a rating");
      return;
    }

    setRatingLoading(true);
    try {
      await setDoc(
        doc(fireDB, "products", params.id, "ratings", currentUser.uid),
        {
          rating: userRating,
          userId: currentUser.uid,
          createdAt: serverTimestamp(),
        },
      );
      toast.success("Rating submitted!");
      setUserRating(0);
      getRatings();
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit rating");
    } finally {
      setRatingLoading(false);
    }
  };

  const addCart = (product) => {
    dispatch(addToCart(product));
    toast.success("🛍️ Product added to cart!");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    getProductData();
    getRatings();
  }, [params.id]);

  return (
    <Layout>
      {loading && <LoadingOverlay />}
      <Toaster />

      <section
        className={`body-font overflow-hidden transition-colors duration-500 ${
          mode === "dark"
            ? "bg-gray-900 text-gray-100"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-12">
          {products && (
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              {/* Product Image */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  <img
                    alt={products.title}
                    src={products.imageUrl}
                    className="rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
                    style={{
                      width: "400px",
                      height: "400px",
                      objectFit: "cover",
                      backgroundColor: mode === "dark" ? "#1f2937" : "#fdfdfd",
                    }}
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/400x400.png?text=No+Image")
                    }
                  />
                  <div className="absolute top-4 left-4 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                    Hot Deal 🔥
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="w-full lg:w-1/2 flex flex-col gap-5">
                {/* Uploader */}
                {(() => {
  const uploader = getUploader(products.userid);
  const firstLetter = uploader.name.charAt(0).toUpperCase();
  const profilePhoto = uploader.photoURL; // assuming your user object may have a photoURL

  return (
    <div className="flex items-center gap-2 text-xs font-semibold tracking-widest">
      {/* Profile photo or fallback */}
      {profilePhoto ? (
        <img
          src={profilePhoto}
          alt={uploader.name}
          className="w-7 h-7 rounded-full object-cover shadow-sm"
          onError={(e) =>
            (e.target.src = `https://via.placeholder.com/32?text=${firstLetter}`)
          }
        />
      ) : (
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full bg-green-400 text-white font-bold`}
        >
          {firstLetter}
        </div>
      )}

      {/* Uploader Name */}
      <span className={mode === "dark" ? "text-green-400 text-sm" : "text-green-600 text-sm"}>
        {uploader.name}
      </span>

      {/* Verified Icon */}
      <MdVerified
        className={
          uploader.verified
            ? "text-blue-500 w-4 h-4"
            : "text-gray-400 w-4 h-4"
        }
      />
    </div>
  );
})()}


                <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                  {products.title}
                </h1>

                {/* Ratings */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      fill={
                        star <= Math.round(averageRating)
                          ? "currentColor"
                          : "none"
                      }
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className={`w-5 h-5 ${
                        star <= Math.round(averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-500 text-sm">
                    {averageRating} ({totalReviews} reviews)
                  </span>
                </div>

                {/* Description */}
                <p
                  className={`leading-relaxed border-b pb-4 mb-4 italic transform -skew-x-3 ${
                    mode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {products.description}
                </p>

                {/* Price & Buttons */}
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-extrabold text-pink-600">
                    ₦{products.price?.toLocaleString()}
                  </span>
                  {currentUser && (
                    <button
                      onClick={() => addCart(products)}
                      className="ml-auto bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 transition-transform duration-300"
                    >
                      Add To Cart
                    </button>
                  )}
                </div>

                {/* Rating Card */}
                {currentUser && (
                  <div
                    className={`mt-6 p-5 rounded-xl shadow-md border transition-colors duration-300 ${
                      mode === "dark"
                        ? "bg-gray-800 border-gray-700 text-gray-100"
                        : "bg-white border-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
                      {/* Info */}
                      <div>
                        <p className="text-sm font-semibold mb-1">
                          Product Info
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Average Rating:{" "}
                          <span className="font-medium">{averageRating}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Total Reviews:{" "}
                          <span className="font-medium">{totalReviews}</span>
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Your feedback helps other buyers make better
                          decisions.
                        </p>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex flex-col items-start sm:items-end gap-2">
                        <p className="text-sm font-semibold mb-1">
                          Rate this product
                        </p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              onClick={() => setUserRating(star)}
                              className={`w-7 h-7 cursor-pointer transform transition-transform duration-150 hover:scale-110 ${
                                star <= userRating
                                  ? "text-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <button
                          onClick={submitRating}
                          disabled={ratingLoading || userRating === 0}
                          className="mt-2 px-5 py-2 bg-pink-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-pink-700 transition-colors duration-300"
                        >
                          {ratingLoading
                            ? "Submitting..."
                            : userRating > 0
                              ? "Update Rating"
                              : "Submit Rating"}
                        </button>
                        {userRating > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            You rated this product {userRating} star
                            {userRating > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Features & Availability */}
          {products && (
            <div
              className={`mt-12 mb-10 mx-auto px-6 py-10 w-[100%] sm:w-[85%] md:w-[75%] lg:w-[100%] rounded-xl shadow-lg border transition-colors duration-300 ${
                mode === "dark"
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            >
              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-pink-600">
                  Available & Ready to Ship 🚚
                </h3>
                <p className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto px-2 sm:px-4">
                  The product{" "}
                  <span className="font-semibold text-pink-600">
                    {products.title}
                  </span>{" "}
                  is <span className="font-semibold">in stock</span> and will be
                  delivered immediately once your order is placed. Enjoy{" "}
                  <span className="text-pink-500 font-medium">
                    fast delivery
                  </span>
                  , trusted packaging, and premium quality — right to your
                  doorstep!
                </p>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-8 mt-10">
                {[
                  { icon: "✔️", text: "Quality" },
                  { icon: "🚚", text: "Nationwide" },
                  { icon: "💳", text: "Secure" },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 text-xl">
                      {feature.icon}
                    </div>
                    <p className="text-sm font-medium">{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default ProductInfo;
