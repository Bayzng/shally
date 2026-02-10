// import React, { useContext, useEffect, useState } from "react";
// import myContext from "../../context/data/myContext";
// import { useDispatch, useSelector } from "react-redux";
// import { addToCart } from "../../redux/cartSlice";
// import { Link } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";
// import { MdVerified } from "react-icons/md";
// import { IoIosPricetag } from "react-icons/io";

// function ProductCard({ onLoaded }) {
//   const currentUser = localStorage.getItem("user")
//     ? JSON.parse(localStorage.getItem("user"))
//     : null;

//   const context = useContext(myContext);
//   const { mode, product, searchkey, filterType, filterPrice, user } = context;

//   const dispatch = useDispatch();
//   const cartItems = useSelector((state) => state.cart.cartItems);

//   const [imagesLoaded, setImagesLoaded] = useState(0);
//   const [productsReady, setProductsReady] = useState(false);

//   // Animation states
//   const [badgeToggle, setBadgeToggle] = useState({});
//   const [adPosition, setAdPosition] = useState({ top: 0, left: 0 });
//   const [showAd, setShowAd] = useState(false);

//   const addCart = (item) => {
//     dispatch(addToCart(item));
//     toast.success("🛒 Added to cart successfully!");
//   };

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   useEffect(() => {
//     if (product && Array.isArray(product)) setProductsReady(true);
//   }, [product]);

//   const filteredProducts =
//     productsReady && product
//       ? product
//           .filter((obj) =>
//             searchkey
//               ? obj.title.toLowerCase().includes(searchkey.toLowerCase())
//               : true
//           )
//           .filter((obj) =>
//             filterType
//               ? obj.category.toLowerCase().includes(filterType.toLowerCase())
//               : true
//           )
//           .filter((obj) =>
//             filterPrice ? obj.price.toString().includes(filterPrice) : true
//           )
//       : [];

//   useEffect(() => {
//     if (!productsReady || !filteredProducts) return;
//     if (
//       filteredProducts.length > 0 &&
//       imagesLoaded === filteredProducts.length
//     ) {
//       onLoaded?.();
//     }
//   }, [imagesLoaded, filteredProducts, productsReady, onLoaded]);

//   // Badge toggle
//   useEffect(() => {
//     const badgeTimer = setInterval(() => {
//       const toggles = {};
//       filteredProducts.forEach((item, idx) => {
//         toggles[item.id || idx] = Math.random() < 0.5;
//       });
//       setBadgeToggle(toggles);
//     }, 5000);
//     return () => clearInterval(badgeTimer);
//   }, [filteredProducts]);

//   // Floating ad
//   useEffect(() => {
//     const containerWidth = window.innerWidth * 0.9;
//     const containerHeight = 600;

//     const adCycle = () => {
//       setShowAd(true);
//       const visibleDuration = 4000;
//       const hiddenDuration = 40000;

//       const hideTimer = setTimeout(() => {
//         setShowAd(false);

//         const showTimer = setTimeout(() => {
//           const top = Math.random() * (containerHeight - 120);
//           const left = Math.random() * (containerWidth - 300);
//           setAdPosition({ top, left });
//           adCycle();
//         }, hiddenDuration);

//         return () => clearTimeout(showTimer);
//       }, visibleDuration);

//       return () => clearTimeout(hideTimer);
//     };

//     setAdPosition({
//       top: Math.random() * (containerHeight - 120),
//       left: Math.random() * (containerWidth - 300),
//     });

//     adCycle();
//   }, []);

//   const getUploader = (userid) => {
//     return (
//       user?.find((u) => u.uid === userid) || {
//         name: "AllMart Store",
//         verified: false,
//       }
//     );
//   };

//   if (!productsReady || !filteredProducts) return null;

//   // Extract unique creators
//   const uniqueCreators = Array.from(
//     new Map(
//       filteredProducts.map((p) => [p.userid, getUploader(p.userid)])
//     ).values()
//   );

//   // Rest of products excluding those in creators
//   const restProducts = filteredProducts;

//   return (
//     <section
//       className={`body-font ${
//         mode === "dark" ? "bg-gray-900 text-white" : "text-gray-900"
//       }`}
//     >
//       <Toaster />
//       <div className="container mx-auto px-4 sm:px-6 py-10 md:py-16 relative">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
//             🛒 MarketPlace Picks
//           </h1>
//           <div className="h-1 w-20 mx-auto bg-pink-500 rounded"></div>
//           <p
//             className={`mt-3 text-sm sm:text-base ${
//               mode === "dark" ? "text-gray-300" : "text-gray-600"
//             }`}
//           >
//             Discover cool finds, hot deals, and trending products 🛍️
//           </p>
//         </div>

//         {/* Scrolling Creators */}
//         <div className="mt-8 overflow-hidden relative">
//           <div className="flex gap-6 animate-scroll whitespace-nowrap">
//             {uniqueCreators.map((creator, idx) => (
//               <div
//                 key={idx}
//                 className="flex flex-col items-center justify-center min-w-[80px]"
//               >
//                 <div
//                   className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-400 to-yellow-300 text-white font-bold text-lg shadow-lg"
//                   title={creator.name}
//                 >
//                   {creator.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")}
//                 </div>
//                 <span className="mt-2 text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">
//                   {creator.name}
//                 </span>
//               </div>
//             ))}
//           </div>
//           <style>{`
//             @keyframes scroll {
//               0% { transform: translateX(100%); }
//               100% { transform: translateX(-100%); }
//             }
//             .animate-scroll { display: flex; animation: scroll 20s linear infinite; }
//           `}</style>
//         </div>

//         {/* Products Grid */}
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8 relative">
//           {restProducts.map((item, index) => {
//             const { title, price, imageUrl, id, userid } = item;
//             const isHotDeal =
//               badgeToggle[item.id || index] ?? Math.random() < 0.5;
//             const badgeText = isHotDeal ? "HOT DEAL 🔥" : "AllMart 🛒";
//             const badgeColor = isHotDeal ? "bg-red-500" : "";

//             return (
//               <div key={id || index} className="flex flex-col gap-4 relative">
//                 {/* Product Card */}
//                 <div
//                   className={`relative rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transform transition-all duration-500 overflow-hidden ${
//                     mode === "dark"
//                       ? "bg-gray-800 border border-gray-700"
//                       : "bg-gradient-to-t from-pink-50 via-yellow-50 to-white border border-gray-200"
//                   }`}
//                 >
//                   <div
//                     onClick={() =>
//                       (window.location.href = `/productinfo/${id}`)
//                     }
//                     className="relative overflow-hidden rounded-t-3xl flex justify-center items-center cursor-pointer"
//                   >
//                     <img
//                       src={imageUrl}
//                       alt={title}
//                       className="w-full h-36 sm:h-44 md:h-48 lg:h-52 object-cover rounded-t-3xl hover:scale-110 transition-transform duration-500"
//                       onLoad={() => setImagesLoaded((prev) => prev + 1)}
//                       onError={(e) => {
//                         e.target.src =
//                           "https://via.placeholder.com/300x300.png?text=Image+Unavailable";
//                         setImagesLoaded((prev) => prev + 1);
//                       }}
//                     />
//                     <div
//                       className={`absolute top-3 left-3 ${badgeColor} text-white text-xs px-2 py-1 rounded-full shadow-md transition-all duration-1000`}
//                     >
//                       {badgeText}
//                     </div>
//                   </div>

//                   <div className="p-3 sm:p-4 flex flex-col justify-between">
//                     <div>
//                       <h2
//                         className={`flex items-center gap-1 text-xs font-semibold tracking-widest ${
//                           mode === "dark" ? "text-green-400" : "text-green-600"
//                         }`}
//                       >
//                         {getUploader(userid).name}
//                         <MdVerified
//                           className={
//                             getUploader(userid).verified
//                               ? "text-blue-500"
//                               : "text-gray-400"
//                           }
//                         />
//                       </h2>

//                       <h1 className="text-sm sm:text-lg font-bold truncate mt-1">
//                         {title}
//                       </h1>
//                       <p className="flex items-center gap-1 text-sm sm:text-base font-semibold mt-2 text-pink-600">
//                         ₦{price.toLocaleString()}{" "}
//                         <IoIosPricetag className="text-base sm:text-lg" />
//                       </p>
//                     </div>

//                     {currentUser && (
//                       <div className="mt-4 flex gap-3 bg-white/30 backdrop-blur-md p-2 rounded-xl transition-all duration-700">
//                         <button
//                           type="button"
//                           onClick={() => addCart(item)}
//                           className="flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold
//                             bg-black-500 hover:bg-black-600 rounded-xl transition-all duration-500 shadow hover:shadow-lg"
//                         >
//                           Add Cart
//                         </button>

//                         <Link to={`/user-profile/${userid}`} className="flex-1">
//                           <button
//                             type="button"
//                             className="text-xs mt-2 sm:text-sm font-medium"
//                           >
//                             👤 Creator
//                           </button>
//                         </Link>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {/* Floating Ad */}
//           <div
//             style={{
//               top: adPosition.top,
//               left: adPosition.left,
//               opacity: showAd ? 1 : 0,
//             }}
//             className={`absolute rounded-xl border-dashed border-2 border-gray-300
//               bg-gradient-to-r from-yellow-50 via-pink-50 to-white
//               flex flex-col sm:flex-row justify-between items-center p-4 h-24 sm:h-28 z-50
//               shadow-lg transition-opacity duration-1000 ease-in-out transform`}
//           >
//             <div className="text-center sm:text-left mb-2 sm:mb-0">
//               <h2 className="text-lg font-bold text-pink-500">
//                 ✨ Sponsored ✨
//               </h2>
//               <p className="text-sm text-gray-700">
//                 Check out amazing deals here!
//               </p>
//             </div>
//             <button
//               className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
//               onClick={() => (window.location.href = "/")}
//             >
//               Shop Now 🛍️
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default ProductCard;
import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import myContext from "../../context/data/myContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { MdVerified } from "react-icons/md";
import { IoIosPricetag } from "react-icons/io";

/* ==============================
   PRODUCT CARD ITEM (STABLE)
============================== */
const ProductCardItem = React.memo(function ProductCardItem({
  item,
  mode,
  onProductClick,
  onCreatorClick,
  onAddCart,
}) {
  const { title, price, imageUrl, id, userid, uploader } = item;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onProductClick(id)}
      className={`relative rounded-3xl shadow-xl overflow-hidden cursor-pointer
        transition-transform duration-200 hover:scale-[1.01]
        ${
          mode === "dark"
            ? "bg-gray-800 border border-gray-700"
            : "bg-gradient-to-t from-pink-50 via-yellow-50 to-white border border-gray-200"
        }`}
    >
      {/* Badge */}
      <div className="absolute top-3 left-3 text-white text-xs px-2 py-1 rounded-full shadow-md z-20">
        AllMart 🛒
      </div>

      {/* Image */}
      <div className="relative overflow-hidden rounded-t-3xl h-44 sm:h-52">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          draggable={false}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col justify-between">
        <div>
          <h2
            className={`flex items-center gap-1 text-xs font-semibold tracking-widest ${
              mode === "dark" ? "text-green-400" : "text-green-600"
            }`}
          >
            {uploader.name}
            <MdVerified
              className={uploader.verified ? "text-blue-500" : "text-gray-400"}
            />
          </h2>

          <h1 className="text-sm sm:text-lg font-bold truncate mt-1">
            {title}
          </h1>

          <p className="flex items-center gap-1 text-sm sm:text-base font-semibold mt-2 text-pink-600">
            ₦{price.toLocaleString()} <IoIosPricetag />
          </p>
        </div>

        {localStorage.getItem("user") && (
          <div
            className="mt-4 flex gap-3 bg-white/30 backdrop-blur-md p-2 rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddCart(item);
              }}
              className="flex-1 py-2 text-xs sm:text-sm font-semibold bg-black text-white rounded-xl"
            >
              Add Cart
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCreatorClick(userid);
              }}
              className="flex-1 text-xs sm:text-sm font-medium"
            >
              👤 Creator
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

/* ==============================
   MAIN COMPONENT
============================== */
function ProductCard({ onLoaded }) {
  const { mode, product, searchkey, filterType, filterPrice, user } =
    useContext(myContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const imagesLoadedRef = useRef(0);
  const [productsReady, setProductsReady] = useState(false);

  /* -------------------- */
  const addCart = useCallback(
    (item) => {
      dispatch(addToCart(item));
      toast.success("🛒 Added to cart successfully!");
    },
    [dispatch],
  );

  // const handleNavigate = useCallback(
  //   (path) => {
  //     navigate(typeof path === "string" ? `/${path}` : `/productinfo/${path}`);
  //   },
  //   [navigate],
  // );

  const goToProduct = useCallback(
    (id) => {
      navigate(`/productinfo/${id}`);
    },
    [navigate],
  );

  const goToCreator = useCallback(
    (userid) => {
      navigate(`/user-profile/${userid}`);
    },
    [navigate],
  );

  /* -------------------- */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (Array.isArray(product)) setProductsReady(true);
  }, [product]);

  const uploaderMap = useMemo(() => {
    const map = new Map();
    user?.forEach((u) => map.set(u.uid, u));
    return map;
  }, [user]);

  const filteredProducts = useMemo(() => {
    if (!productsReady) return [];
    return product
      .filter((p) =>
        searchkey
          ? p.title.toLowerCase().includes(searchkey.toLowerCase())
          : true,
      )
      .filter((p) =>
        filterType
          ? p.category.toLowerCase().includes(filterType.toLowerCase())
          : true,
      )
      .filter((p) =>
        filterPrice ? p.price.toString().includes(filterPrice) : true,
      )
      .map((p) => ({
        ...p,
        uploader: uploaderMap.get(p.userid) || {
          name: "AllMart Store",
          verified: false,
        },
      }));
  }, [product, productsReady, searchkey, filterType, filterPrice, uploaderMap]);

  const firstFour = filteredProducts.slice(0, 4);
  const restProducts = filteredProducts.slice(4);

  const allCreators = useMemo(() => {
    return [
      ...new Map(filteredProducts.map((p) => [p.userid, p.uploader])).values(),
    ];
  }, [filteredProducts]);

  useEffect(() => {
    if (filteredProducts.length) onLoaded?.();
  }, [filteredProducts, onLoaded]);

  if (!productsReady) return null;

  return (
    <section
      className={`body-font ${
        mode === "dark" ? "bg-gray-900 text-white" : "text-gray-900"
      }`}
    >
      <Toaster />

      <div className="container mx-auto px-4 py-12">
        {/* FIRST 4 */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {firstFour.map((item) => (
            <ProductCardItem
              key={`${item.id}-${item.userid}`}
              item={item}
              mode={mode}
              onProductClick={goToProduct}
              onCreatorClick={goToCreator}
              onAddCart={addCart}
            />
          ))}
        </div>

        {/* CREATOR CAROUSEL */}
        <div className="mt-12 overflow-hidden">
          <div className="creator-carousel flex gap-4">
            {allCreators.map((creator, idx) => {
              const initials = creator.name
                .split(" ")
                .map((n) => n[0])
                .join("");

              const isVerified = creator.verified;

              return (
                <div
                  key={idx}
                  className={`creator-card min-w-[110px] flex flex-col items-center
                  rounded-2xl px-3 py-4 transition-all
                  ${
                    mode === "dark"
                      ? "bg-black/80 text-white border border-gray-700"
                      : "bg-gradient-to-t from-pink-50 via-yellow-50 to-white border border-gray-200"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center
                      font-bold text-base
                      ${
                        mode === "dark"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-800"
                      }
                      ${
                        isVerified
                          ? "ring-2 ring-pink-500/50"
                          : "ring-1 ring-gray-300"
                      }`}
                    >
                      {initials}
                    </div>

                    {/* Verification badge */}
                    <div
                      className={`absolute -top-1 -right-1 rounded-full p-[3px] shadow
                      ${
                        isVerified
                          ? "bg-blue-500"
                          : mode === "dark"
                            ? "bg-gray-600"
                            : "bg-gray-400"
                      }`}
                    >
                      <MdVerified className="text-white text-[10px]" />
                    </div>
                  </div>

                  {/* Name */}
                  <div className="mt-2 flex items-center gap-1 max-w-full">
                    <span className="text-xs font-semibold truncate">
                      {creator.name}
                    </span>
                    <MdVerified
                      className={`text-[10px] ${
                        isVerified ? "text-blue-500" : "text-gray-400"
                      }`}
                    />
                  </div>

                  {/* Status */}
                  <span
                    className={`mt-1 text-[9px] uppercase tracking-wider font-medium
                  ${
                    isVerified
                      ? mode === "dark"
                        ? "text-green-400"
                        : "text-green-600"
                      : mode === "dark"
                        ? "text-gray-400"
                        : "text-gray-500"
                  }`}
                  >
                    {isVerified ? "Verified" : "Creator"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* REST */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-10">
          {restProducts.map((item) => (
            <ProductCardItem
              key={`${item.id}-${item.userid}`}
              item={item}
              mode={mode}
              onProductClick={goToProduct}
              onCreatorClick={goToCreator}
              onAddCart={addCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductCard;
