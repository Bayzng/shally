import { useContext, useEffect } from "react";
import myContext from "../../context/data/myContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { toast } from "react-toastify";

function ProductCard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const context = useContext(myContext);
  const { mode, product, searchkey, filterType, filterPrice } = context;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  const addCart = (product) => {
    dispatch(addToCart(product));
    toast.success("🛒 Added to cart successfully!");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <section
      className={`body-font ${
        mode === "dark" ? "bg-gray-900 text-white" : "text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Our Latest Collection
          </h1>
          <div className="h-1 w-20 mx-auto bg-pink-600 rounded"></div>
          <p
            className={`mt-3 text-sm sm:text-base ${
              mode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Discover the newest arrivals and best-selling styles made just for
            you.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {product
            .filter((obj) =>
              obj.title.toLowerCase().includes(searchkey.toLowerCase())
            )
            .filter((obj) =>
              obj.category.toLowerCase().includes(filterType.toLowerCase())
            )
            .filter((obj) =>
              filterPrice ? obj.price.toString().includes(filterPrice) : true
            )
            .slice(0, 8)
            .map((item, index) => {
              const { title, price, imageUrl, id } = item;
              return (
                <div
                  key={index}
                  className={`rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${
                    mode === "dark"
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  {/* Image Section */}
                  <div
                    onClick={() =>
                      (window.location.href = `/productinfo/${id}`)
                    }
                    className="relative cursor-pointer overflow-hidden rounded-t-2xl flex justify-center items-center"
                  >
                    <img
                      src={imageUrl}
                      alt={title}
                      className="object-cover rounded-t-2xl transform hover:scale-110 transition-transform duration-500 ease-in-out"
                      style={{
                        width: "100%",
                        height: "270px",
                        maxWidth: "100%",
                      }}
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
                  <div className="p-5 sm:p-6 flex flex-col justify-between h-44">
                    <div>
                      <h2
                        className={`text-xs uppercase font-semibold tracking-widest ${
                          mode === "dark" ? "text-pink-400" : "text-pink-600"
                        }`}
                      >
                        Shally_Store
                      </h2>
                      <h1 className="text-lg font-semibold mt-1 truncate">
                        {title}
                      </h1>
                      <p className="text-base font-bold mt-2">
                        ₦{price.toLocaleString()}
                      </p>
                    </div>

                    {user && (
                      <button
                        type="button"
                        onClick={() => addCart(item)}
                        className="w-full mt-3 py-2 text-sm sm:text-base font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-all"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

export default ProductCard;
