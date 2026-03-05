import { useContext } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/data/myContext";
import { useNavigate } from "react-router-dom";

function MyUploadedProducts() {
  const { mode, product, deleteProduct } = useContext(myContext);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const myProducts = product.filter((item) => item.userid === user?.uid);

  const handleEdit = (item) => {
    navigate(`/public-update-product/${item.id}`);
  };

  return (
    <Layout>
      <div
        className={`min-h-screen py-10 px-3 sm:px-8 md:px-12 ${
          mode === "dark"
            ? "bg-gray-800 text-white"
            : // ? "bg-[#181a1b] text-white"
              "bg-gray-50 text-gray-800"
        }`}
      >
        <h1 className="text-3xl md:text-4xl font-extrabold  mb-10">
          My Products
        </h1>

        {myProducts.length === 0 ? (
          <p className={`p-4 rounded-md border-l-4 w-10/12 max-w-[14rem]  ${
              mode === "dark"
                ? "bg-gray-700 border-yellow-400 text-yellow-200"
                : "bg-yellow-50 border-yellow-400 text-yellow-800"
            }`}
          >
            You haven’t uploaded any products yet 🛒
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mx-auto">
            {myProducts.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl shadow-lg border overflow-hidden transition hover:scale-[1.02] ${
                  mode === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Image */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 sm:h-48 md:h-56 object-cover"
                />

                {/* Info */}
                <div className="p-4 space-y-1">
                  <h2 className="text-sm sm:text-lg font-bold truncate">
                    {item.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                    🗂 {item.category}
                  </p>

                  <p className="text-lg sm:text-xl font-extrabold text-pink-600">
                    ₦{Number(item.price).toLocaleString()}
                  </p>

                  {/* <p className="text-[10px] sm:text-xs text-gray-400">
                    📅{" "}
                    {item.date?.seconds
                      ? new Date(item.date.seconds * 1000).toLocaleDateString()
                      : new Date(item.date).toLocaleDateString()}
                  </p> */}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center border-t px-4 py-3">
                  <button
                    onClick={() => deleteProduct(item)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold text-sm"
                  >
                    🗑 Delete
                  </button>

                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700 font-semibold text-sm"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MyUploadedProducts;
