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
  const { mode, product, searchkey, filterType, filterPrice } = context;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const addCart = (product) => {
    dispatch(addToCart(product));
    toast.success("Added to cart");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {product
              .filter((obj) =>
                obj.title.toLowerCase().includes(searchkey.toLowerCase())
              )
              .filter((obj) =>
                filterType ? obj.category.toLowerCase().includes(filterType) : true
              )
              .filter((obj) =>
                filterPrice ? obj.price <= parseInt(filterPrice) : true
              )
              .map((item, index) => {
                const { title, price, imageUrl, id } = item;

                return (
                  <div
                    key={index}
                    onClick={() => navigate(`/productinfo/${id}`)}
                    className={`relative rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 overflow-hidden cursor-pointer ${
                      mode === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    {/* Image */}
                    <div className="overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-t-2xl group-hover:scale-110 transition-transform duration-500 ease-in-out"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-5 border-t border-gray-200/40 flex flex-col justify-between">
                      <div>
                        <h2
                          className={`text-xs uppercase tracking-widest font-semibold mb-2 ${
                            mode === "dark" ? "text-pink-400" : "text-pink-600"
                          }`}
                        >
                          Leemah_Hair
                        </h2>
                        <h1 className="text-lg font-bold truncate mb-1">
                          {title}
                        </h1>
                        <p className="text-base font-medium mb-3">
                          ₦{price}
                        </p>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addCart(item);
                        }}
                        className="w-full py-2 text-white bg-pink-600 hover:bg-pink-700 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                      >
                        Add To Cart
                      </button>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-all duration-500 bg-pink-500 blur-2xl"></div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Allproducts;
