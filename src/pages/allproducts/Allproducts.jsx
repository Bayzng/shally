import { useContext, useEffect } from "react";
import Filter from "../../components/filter/Filter";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/data/myContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Allproducts() {
  const context = useContext(myContext);
  const {
    mode,
    product,
    searchkey,
    filterType,
    filterPrice,
    user, // ✅ get users from context
  } = context;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const addCart = (product) => {
    dispatch(addToCart(product));
    toast.success("🛒 Added to cart");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ Resolve uploader name from userid
  const getUploaderName = (userid) => {
    const uploader = user?.find((u) => u.uid === userid);
    return uploader ? uploader.name : "Marketplace Seller";
  };

  // Filtered products
  const filteredProducts = product
    ?.filter((obj) =>
      obj.title.toLowerCase().includes(searchkey.toLowerCase())
    )
    .filter((obj) =>
      filterType ? obj.category.toLowerCase().includes(filterType) : true
    )
    .filter((obj) =>
      filterPrice ? obj.price <= parseInt(filterPrice) : true
    );

  return (
    <Layout>
      <Filter />

      <section
        className={`body-font min-h-screen transition-all duration-500 ${
          mode === "dark" ? "bg-gray-900 text-white" : "text-gray-900"
        }`}
      >
        <div className="container px-4 sm:px-6 lg:px-10 py-12 mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Our Latest Collection
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Discover luxury, comfort, and style — all in one place.
            </p>
            <div className="h-1 w-24 bg-pink-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Empty State */}
          {filteredProducts?.length === 0 ? (
            <div className="text-center mt-20">
              <p
                className={`text-lg font-medium ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                🚫 No products available in the marketplace yet.
                <br />
                Please check back later.
              </p>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((item, index) => {
                const { title, price, imageUrl, id, userid } = item;

                return (
                  <div
                    key={id || index}
                    onClick={() => navigate(`/productinfo/${id}`)}
                    className={`relative rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 overflow-hidden cursor-pointer ${
                      mode === "dark"
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    {/* Image */}
                    <div className="overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover rounded-t-2xl transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x300.png?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4 sm:p-5 border-t border-gray-200/40 flex flex-col justify-between">
                      <div>
                        <h2
                          className={`text-xs uppercase tracking-widest font-semibold mb-1 ${
                            mode === "dark"
                              ? "text-pink-400"
                              : "text-pink-600"
                          }`}
                        >
                          {getUploaderName(userid)}
                        </h2>

                        <h1 className="text-sm sm:text-lg font-bold truncate mb-1">
                          {title}
                        </h1>

                        <p className="text-sm sm:text-base font-medium mb-2">
                          ₦{price.toLocaleString()}
                        </p>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addCart(item);
                        }}
                        className="w-full py-2 text-sm sm:text-base text-white bg-pink-600 hover:bg-pink-700 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default Allproducts;
