import { useContext, useEffect } from "react";
import myContext from "../../context/data/myContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import toast, { Toaster } from 'react-hot-toast';

function ProductCard() {
  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const context = useContext(myContext);
  const { mode, product, searchkey, filterType, filterPrice, user } = context;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const addCart = (item) => {
    dispatch(addToCart(item));
    toast.success("🛒 Added to cart successfully!");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Filter products based on search and category
  const filteredProducts = product
    ?.filter((obj) =>
      obj.title.toLowerCase().includes(searchkey.toLowerCase())
    )
    .filter((obj) =>
      obj.category.toLowerCase().includes(filterType.toLowerCase())
    )
    .filter((obj) =>
      filterPrice ? obj.price.toString().includes(filterPrice) : true
    )
    .slice(0, 8);

  // Helper to get uploader's name
  const getUploaderName = (userid) => {
    const uploader = user?.find((u) => u.uid === userid);
    return uploader ? uploader.name : "AllMart Store";
  };

  return (
    <section
      className={`body-font ${
        mode === "dark" ? "bg-gray-900 text-white" : "text-gray-900"
      }`}
    >
      <Toaster />
      <div className="container mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            MarketPlace Collection
          </h1>
          <div className="h-1 w-20 mx-auto bg-pink-600 rounded"></div>
          <p
            className={`mt-3 text-sm sm:text-base ${
              mode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Discover the newest arrivals and best-selling products made just for
            you.
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts?.length === 0 ? (
          <div className="text-center py-20">
            <p
              className={`text-lg sm:text-xl font-medium ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              🚫 No products available on the marketplace yet. <br /> Check back
              soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts?.map((item, index) => {
              const { title, price, imageUrl, id, userid } = item;

              return (
                <div
                  key={id || index}
                  className={`relative rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 overflow-hidden ${
                    mode === "dark"
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  {/* Image */}
                  <div
                    onClick={() =>
                      (window.location.href = `/productinfo/${id}`)
                    }
                    className="relative overflow-hidden rounded-t-2xl flex justify-center items-center cursor-pointer"
                  >
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-32 sm:h-40 md:h-44 lg:h-48 object-cover rounded-t-2xl hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x300.png?text=Image+Unavailable";
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded-full shadow-md">
                      New
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4 flex flex-col justify-between">
                    <div>
                      <h2
                        className={`text-xs uppercase font-semibold tracking-widest ${
                          mode === "dark"
                            ? "text-pink-400"
                            : "text-pink-600"
                        }`}
                      >
                        {getUploaderName(userid)}
                      </h2>
                      <h1 className="text-sm sm:text-lg font-bold truncate mt-1">
                        {title}
                      </h1>
                      <p className="text-sm sm:text-base font-medium mt-2">
                        ₦{price.toLocaleString()}
                      </p>
                    </div>

                    {currentUser && (
                      <button
                        type="button"
                        onClick={() => addCart(item)}
                        className="w-full mt-3 py-2 text-sm sm:text-base font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-all duration-300"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductCard;
