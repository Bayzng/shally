import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import myContext from "../../../context/data/myContext";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../../../components/layout/Layout";

function PublicUpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { product, products, setProducts, PublicUpdateProduct, mode } =
    useContext(myContext);

  const [preview, setPreview] = useState(products?.imageUrl || null);

  // Load the selected product safely
  useEffect(() => {
    if (!Array.isArray(product) || product.length === 0) return;

    const selectedProduct = product.find((p) => p.id === id);
    if (!selectedProduct) {
      toast.error("Product not found");
      return;
    }

    // ✅ Merge product without touching user/auth info
    setProducts((prev) => ({
      ...prev, // keep existing state (important if user info is here)
      ...selectedProduct,
    }));
    setPreview(selectedProduct.imageUrl);
  }, [id, product, setProducts]);

  // Handle image upload + compression
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = (MAX_WIDTH / width) * height;
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width = (MAX_HEIGHT / height) * width;
          height = MAX_HEIGHT;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);

        // Merge safely
        setProducts((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
        setPreview(compressedDataUrl);
      };

      img.onerror = () =>
        toast.error("Error processing image. Try another file.");
    };

    reader.onerror = () => toast.error("Error reading image. Try again.");
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    if (
      !products.title ||
      !products.price ||
      !products.imageUrl ||
      !products.category ||
      !products.description
    ) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      setLoading(true);
      await PublicUpdateProduct(); // Update product in DB

      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/70 dark:bg-black/70 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="loader mb-2"></div>
            {/* <span className="text-lg font-semibold">Updating Product...</span> */}
          </div>
        </div>
      )}

      {/* Spinner CSS */}
      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #ff007f; /* pink color to match gradient */
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div
        className={`min-h-screen p-6 transition-colors duration-300 ${
          mode === "dark"
            ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white"
            : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900"
        }`}
      >
        <Toaster />

        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8 p-2">
          <h1 className="text-4xl font-extrabold mb-3">Edit Studio</h1>
          <p
            className={`mt-2 text-sm sm:text-base ${
              mode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Update your product details, improve your listing visibility, and
            make your items more appealing to buyers.
          </p>
        </div>

        {/* Main Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT - FORM */}
          <div
            className={`rounded-3xl p-8 shadow-xl ${
              mode === "dark"
                ? "bg-white/5 border border-white/10"
                : "bg-white border border-gray-200"
            }`}
          >
            <h2 className="text-xl font-bold mb-6 text-yellow-500">
              Live Preview
            </h2>

            <div
              className={`rounded-2xl p-6 ${
                mode === "dark" ? "bg-gray-900" : "bg-gray-100"
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl mb-4"
                />
              ) : (
                <div
                  className={`w-full h-64 flex items-center justify-center rounded-xl mb-4 ${
                    mode === "dark"
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  No Image Selected
                </div>
              )}

              <h3 className="text-xl font-bold">
                {products.title || "Product Title"}
              </h3>

              <p className="text-yellow-500 font-semibold mt-2">
                ₦{products.price || "0.00"}
              </p>

              <p className="text-sm mt-2 opacity-70">
                Category: {products.category || "Not specified"}
              </p>

              <p className="text-sm mt-4 opacity-80">
                {products.description ||
                  "Your product description will appear here..."}
              </p>
            </div>
          </div>

          <div
            className={`rounded-3xl p-8 shadow-xl space-y-6 ${
              mode === "dark"
                ? "bg-white/5 border border-white/10"
                : "bg-white border border-gray-200"
            }`}
          >
            {/* Title */}
            <div>
              <label className="text-sm font-semibold block mb-2">
                Product Title
              </label>
              <input
                type="text"
                value={products.title || ""}
                onChange={(e) =>
                  setProducts((prev) => ({ ...prev, title: e.target.value }))
                }
                className={`w-full rounded-xl px-4 py-3 text-base outline-none transition ${
                  mode === "dark"
                    ? "bg-gray-800 border border-gray-700 text-white"
                    : "bg-white border border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-yellow-400`}
              />
            </div>

            {/* Price + Category */}
            <label className="text-sm font-semibold block mb-2">
              Price (₦)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                value={products.price || ""}
                onChange={(e) =>
                  setProducts((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="Price"
                className={`rounded-xl px-4 py-3 text-base outline-none transition ${
                  mode === "dark"
                    ? "bg-gray-800 border border-gray-700 text-white"
                    : "bg-white border border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-yellow-400`}
              />

              <label className="text-sm font-semibold block mb-2">
                Category
              </label>
              <input
                type="text"
                value={products.category || ""}
                onChange={(e) =>
                  setProducts((prev) => ({ ...prev, category: e.target.value }))
                }
                placeholder="Category"
                className={`rounded-xl px-4 py-3 text-base outline-none transition ${
                  mode === "dark"
                    ? "bg-gray-800 border border-gray-700 text-white"
                    : "bg-white border border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-yellow-400`}
              />
            </div>

            {/* Description */}
            <label className="text-sm font-semibold block mb-2">
              Description
            </label>
            <textarea
              rows="5"
              value={products.description || ""}
              onChange={(e) =>
                setProducts((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Product description..."
              className={`w-full rounded-xl px-4 py-3 text-base outline-none transition ${
                mode === "dark"
                  ? "bg-gray-800 border border-gray-700 text-white"
                  : "bg-white border border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-yellow-400`}
            />

            {/* Image Upload */}
            <label className="text-sm font-semibold block mb-2">
              Upload Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full cursor-pointer
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:bg-pink-600 file:text-white
                hover:file:bg-pink-700"
            />

            {/* Button */}
            <button
              onClick={handleUpdate}
              disabled={loading}
              className={`w-full mt-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-[1.02] transform transition-all text-white font-bold py-3 rounded-xl flex justify-center items-center`}
            >
              {loading ? "Updating Product..." : "💾 Save Changes"}
            </button>
          </div>

          {/* RIGHT - PREVIEW */}
        </div>
      </div>
    </Layout>
  );
}

export default PublicUpdateProduct;
