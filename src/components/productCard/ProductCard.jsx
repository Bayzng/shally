import React, { useContext, useEffect, useState } from "react";
import myContext from "../../context/data/myContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { MdVerified } from "react-icons/md";

function ProductCard({ onLoaded }) {
  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const context = useContext(myContext);
  const { mode, product, searchkey, filterType, filterPrice, user } = context;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [productsReady, setProductsReady] = useState(false);

  // Animation states
  const [badgeToggle, setBadgeToggle] = useState({});
  const [adPosition, setAdPosition] = useState({ top: 0, left: 0 });
  const [showAd, setShowAd] = useState(false);

  const addCart = (item) => {
    dispatch(addToCart(item));
    toast.success("🛒 Added to cart successfully!");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (product && Array.isArray(product)) setProductsReady(true);
  }, [product]);

  const filteredProducts =
    productsReady && product
      ? product
          .filter((obj) =>
            searchkey
              ? obj.title.toLowerCase().includes(searchkey.toLowerCase())
              : true,
          )
          .filter((obj) =>
            filterType
              ? obj.category.toLowerCase().includes(filterType.toLowerCase())
              : true,
          )
          .filter((obj) =>
            filterPrice ? obj.price.toString().includes(filterPrice) : true,
          )
      : [];

  useEffect(() => {
    if (!productsReady || !filteredProducts) return;
    if (
      filteredProducts.length > 0 &&
      imagesLoaded === filteredProducts.length
    ) {
      onLoaded?.();
    }
  }, [imagesLoaded, filteredProducts, productsReady, onLoaded]);

  // Badge toggle
  useEffect(() => {
    const badgeTimer = setInterval(() => {
      const toggles = {};
      filteredProducts.forEach((item, idx) => {
        toggles[item.id || idx] = Math.random() < 0.5;
      });
      setBadgeToggle(toggles);
    }, 5000);
    return () => clearInterval(badgeTimer);
  }, [filteredProducts]);

  // Floating ad: move & fade in/out
  // Floating ad: move & fade in/out with long hidden duration (1 minute)
  useEffect(() => {
    const containerWidth = window.innerWidth * 0.9; // approximate container width
    const containerHeight = 600; // approximate height of grid container

    const adCycle = () => {
      // Show ad
      setShowAd(true);

      const visibleDuration = 4000; // visible for 4s
      const hiddenDuration = 40000; // hidden for 40s

      // Hide ad after visibleDuration
      const hideTimer = setTimeout(() => {
        setShowAd(false);

        // Move ad & show again after hiddenDuration
        const showTimer = setTimeout(() => {
          const top = Math.random() * (containerHeight - 120);
          const left = Math.random() * (containerWidth - 300);
          setAdPosition({ top, left });
          adCycle(); // repeat the cycle
        }, hiddenDuration);

        return () => clearTimeout(showTimer);
      }, visibleDuration);

      return () => clearTimeout(hideTimer);
    };

    // Set initial random position
    setAdPosition({
      top: Math.random() * (containerHeight - 120),
      left: Math.random() * (containerWidth - 300),
    });

    adCycle(); // start the cycle
  }, []);

  // const getUploaderName = (userid) => {
  //   const uploader = user?.find((u) => u.uid === userid);
  //   return uploader ? uploader.name : "AllMart Store";
  // };

  const getUploader = (userid) => {
    return (
      user?.find((u) => u.uid === userid) || {
        name: "AllMart Store",
        verified: false,
      }
    );
  };

  if (!productsReady || !filteredProducts) return null;

  return (
    <section
      className={`body-font ${
        mode === "dark" ? "bg-gray-900 text-white" : "text-gray-900"
      }`}
    >
      <Toaster />
      <div className="container mx-auto px-4 sm:px-6 py-10 md:py-16 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            🛒 MarketPlace Picks
          </h1>
          <div className="h-1 w-20 mx-auto bg-pink-500 rounded"></div>
          <p
            className={`mt-3 text-sm sm:text-base ${
              mode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Discover cool finds, hot deals, and trending products 🛍️
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 relative">
          {filteredProducts.map((item, index) => {
            const { title, price, imageUrl, id, userid } = item;
            const isHotDeal =
              badgeToggle[item.id || index] ?? Math.random() < 0.5;
            const badgeText = isHotDeal ? "HOT DEAL 🔥" : "AllMart 🛒";
            const badgeColor = isHotDeal ? "bg-red-500" : "";
            // const badgeColor = isHotDeal ? "bg-red-500" : "bg-green-600";

            return (
              <div key={id || index} className="flex flex-col gap-4 relative">
                {/* Product Card */}
                <div
                  className={`relative rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transform transition-all duration-500 overflow-hidden ${
                    mode === "dark"
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-gradient-to-t from-pink-50 via-yellow-50 to-white border border-gray-200"
                  }`}
                >
                  <div
                    onClick={() =>
                      (window.location.href = `/productinfo/${id}`)
                    }
                    className="relative overflow-hidden rounded-t-3xl flex justify-center items-center cursor-pointer"
                  >
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-36 sm:h-44 md:h-48 lg:h-52 object-cover rounded-t-3xl hover:scale-110 transition-transform duration-500"
                      onLoad={() => setImagesLoaded((prev) => prev + 1)}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x300.png?text=Image+Unavailable";
                        setImagesLoaded((prev) => prev + 1);
                      }}
                    />
                    <div
                      className={`absolute top-3 left-3 ${badgeColor} text-white text-xs px-2 py-1 rounded-full shadow-md transition-all duration-1000`}
                    >
                      {badgeText}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col justify-between">
                    <div>
                      <h2
                        className={`flex items-center gap-1 text-xs font-semibold tracking-widest ${
                          mode === "dark" ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        {getUploader(userid).name}
                        <MdVerified
                          className={
                            getUploader(userid).verified
                              ? "text-blue-500" // ✅ Green if verified
                              : "text-gray-400" // ⚪ Gray if not verified
                          }
                        />
                      </h2>

                      <h1 className="text-sm sm:text-lg font-bold truncate mt-1">
                        {title}
                      </h1>
                      <p className="text-sm sm:text-base font-semibold mt-2 text-pink-600">
                        ₦{price.toLocaleString()} 💰
                      </p>
                    </div>

                    {currentUser && (
                      <div className="mt-4 flex gap-3 bg-white/30 backdrop-blur-md p-2 rounded-xl transition-all duration-700">
                        <button
                          type="button"
                          onClick={() => addCart(item)}
                          className="flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white 
                            bg-pink-500 hover:bg-pink-600 rounded-xl transition-all duration-500 shadow hover:shadow-lg"
                        >
                          Add Cart
                        </button>

                        <Link to={`/user-profile/${userid}`} className="flex-1">
                          <button
                            type="button"
                            className="text-xs sm:text-sm font-medium"
                          >
                            👤 Creator
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Floating Ad */}
          <div
            style={{
              top: adPosition.top,
              left: adPosition.left,
              opacity: showAd ? 1 : 0,
            }}
            className={`absolute rounded-xl border-dashed border-2 border-gray-300
              bg-gradient-to-r from-yellow-50 via-pink-50 to-white
              flex flex-col sm:flex-row justify-between items-center p-4 h-24 sm:h-28 z-50
              shadow-lg transition-opacity duration-1000 ease-in-out transform`}
          >
            <div className="text-center sm:text-left mb-2 sm:mb-0">
              <h2 className="text-lg font-bold text-pink-500">
                ✨ Sponsored ✨
              </h2>
              <p className="text-sm text-gray-700">
                Check out amazing deals here!
              </p>
            </div>
            <button
              className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
              onClick={() => (window.location.href = "/")}
            >
              Shop Now 🛍️
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductCard;
