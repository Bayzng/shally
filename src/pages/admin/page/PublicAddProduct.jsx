import { useContext, useState, useMemo } from "react";
import Layout from "../../../components/layout/Layout";
import myContext from "../../../context/data/myContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function PublicAddProduct() {
  const { addProduct, mode, product } = useContext(myContext); // include product
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    imageUrl: "",
    category: "",
    description: "",
  });

  const [preview, setPreview] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Calculate today's products and remaining slots
  const { todayCount, remainingSlots } = useMemo(() => {
    if (!user?.uid) return { todayCount: 0, remainingSlots: 3 };

    const now = new Date();
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    const last24hProducts = product
      ?.filter((p) => p.userid === user.uid)
      .filter((item) => {
        if (!item.date) return false;

        let productDate;

        // Firestore timestamp
        if (item.date?.seconds) {
          productDate = new Date(item.date.seconds * 1000);
        } else {
          productDate = new Date(item.date);
          if (isNaN(productDate.getTime())) return false;
        }

        return productDate > cutoff; // only include products in last 24 hours
      });

    return {
      todayCount: last24hProducts?.length || 0,
      remainingSlots: Math.max(0, 3 - (last24hProducts?.length || 0)),
    };
  }, [product, user?.uid]);

  // Image upload + compression
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
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

        const compressedImage = canvas.toDataURL("image/jpeg", 0.7);

        setForm((prev) => ({ ...prev, imageUrl: compressedImage }));
        setPreview(compressedImage);
      };
    };

    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, price, imageUrl, category, description } = form;

    if (!title || !price || !imageUrl || !category || !description) {
      toast.error("All fields are required");
      return;
    }

    if (!user?.uid) {
      toast.error("Please login to upload products");
      return;
    }

    // Check daily limit
    if (remainingSlots <= 0) {
      toast.error("You have reached your daily limit of 3 products");
      return;
    }

    const newProduct = {
      ...form,
      price: Number(price),
      date: new Date().toISOString(),
      id: Date.now(),
      userid: user.uid,
    };

    try {
      setLoading(true);
      await addProduct(newProduct);

      // Reset form
      setForm({
        title: "",
        price: "",
        imageUrl: "",
        category: "",
        description: "",
      });
      setPreview(null);

      toast.success("✅ Product added to marketplace");
      navigate("/my-products");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div
        className={`min-h-screen flex justify-center items-center p-6 transition-colors duration-300 ${
          mode === "dark"
            ? "bg-gray-800 text-white"
            // ? "bg-[#181a1b] text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        <Toaster />
        <form
          onSubmit={handleSubmit}
          className={`w-full max-w-lg rounded-2xl p-8 shadow-2xl border ${
            mode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h1 className="text-center text-3xl font-extrabold text-pink-600 mb-4">
            Add Product
          </h1>

          {/* Daily limit info */}
          <p className="text-center text-sm text-gray-500 mb-6">
            Products added today: <strong>{todayCount}</strong> / 3. Remaining:{" "}
            <strong>{remainingSlots}</strong>
          </p>

          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Product Name"
            value={form.title}
            onChange={handleChange}
            className={`w-full mb-4 px-4 py-3 rounded-lg outline-none ${
              mode === "dark"
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-gray-50 border"
            }`}
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Product Price"
            value={form.price}
            onChange={handleChange}
            className={`w-full mb-4 px-4 py-3 rounded-lg outline-none ${
              mode === "dark"
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-gray-50 border"
            }`}
          />

          {/* Image Upload */}
          <div className="mb-5">
            <label className="text-sm font-semibold mb-2 block">
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

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-40 h-40 object-cover rounded-xl border shadow-md"
              />
            )}
          </div>

          {/* Category */}
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className={`w-full mb-4 px-4 py-3 rounded-lg outline-none ${
              mode === "dark"
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-gray-50 border"
            }`}
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Product Description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            className={`w-full mb-6 px-4 py-3 rounded-lg outline-none resize-none ${
              mode === "dark"
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-gray-50 border"
            }`}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || remainingSlots <= 0}
            className={`w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition flex justify-center items-center ${
              loading || remainingSlots <= 0
                ? "opacity-70 cursor-not-allowed"
                : ""
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : null}
            {loading
              ? "Adding Product..."
              : remainingSlots <= 0
                ? "Daily limit reached"
                : "Add Product to Marketplace"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default PublicAddProduct;
