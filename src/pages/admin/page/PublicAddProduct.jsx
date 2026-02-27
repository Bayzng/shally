import { useContext, useState, useMemo, useEffect } from "react";
import Layout from "../../../components/layout/Layout";
import myContext from "../../../context/data/myContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function PublicAddProduct() {
  const { addProduct, mode, product } = useContext(myContext); // include product
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
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
  const { todayCount, remainingSlots, nextAvailableTime } = useMemo(() => {
    if (!user?.uid) {
      return { todayCount: 0, remainingSlots: 3, nextAvailableTime: null };
    }

    const now = new Date();
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const last24hProducts = product
      ?.filter((p) => p.userid === user.uid)
      .map((item) => {
        if (!item.date) return null;

        if (item.date?.seconds) {
          return new Date(item.date.seconds * 1000);
        }

        const parsed = new Date(item.date);
        return isNaN(parsed.getTime()) ? null : parsed;
      })
      .filter(Boolean)
      .filter((date) => date > cutoff)
      .sort((a, b) => b - a); // newest first

    const count = last24hProducts?.length || 0;

    let nextTime = null;

    if (count >= 3 && last24hProducts.length > 0) {
      // 24 hours after latest upload
      nextTime = new Date(last24hProducts[0].getTime() + 24 * 60 * 60 * 1000);
    }

    return {
      todayCount: count,
      remainingSlots: Math.max(0, 3 - count),
      nextAvailableTime: nextTime,
    };
  }, [product, user?.uid]);

  useEffect(() => {
    if (!nextAvailableTime) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = nextAvailableTime - now;

      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        hours,
        minutes,
        seconds,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [nextAvailableTime]);

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

      // toast.success("✅ Product added to marketplace");
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
        className={`min-h-screen py-10 px-4 transition-colors duration-300 ${
          mode === "dark"
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800"
        }`}
      >
        <Toaster />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          {/* LEFT SIDE – INFORMATION PANEL */}
          <div className="space-y-8">
            <div className="p-2">
              <h1 className="text-4xl font-extrabold mb-3">Launch Product</h1>
              <p className="text-sm opacity-80 leading-relaxed">
                Add your product to the marketplace and reach buyers instantly.
                Make sure your details are clear, pricing is accurate, and your
                image is high quality to improve visibility.
              </p>
            </div>

            {/* Daily Limit Card */}
            <div
              className={`p-6 rounded-2xl shadow-xl border ${
                mode === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="font-semibold mb-3 text-lg">
                📊 Daily Upload Limit
              </h3>

              <p className="text-sm mb-3">
                You can upload up to <strong>3 products</strong> every 24 hours.
              </p>

              <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-pink-600 h-3 transition-all duration-500"
                  style={{ width: `${(todayCount / 3) * 100}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs mt-2 opacity-70">
                <span>{todayCount} used</span>
                <span>{remainingSlots} remaining</span>
              </div>

              {remainingSlots <= 0 && timeLeft && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-400 text-red-500 text-sm">
                  ⏳ You can upload again in{" "}
                  <strong>
                    {String(timeLeft.hours).padStart(2, "0")}:
                    {String(timeLeft.minutes).padStart(2, "0")}:
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </strong>
                </div>
              )}
            </div>

            {/* Image Preview Card */}
            {preview && (
              <div
                className={`p-6 rounded-2xl shadow-xl border ${
                  mode === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3 className="font-semibold mb-4">🖼 Product Preview</h3>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
              </div>
            )}

            {/* Marketplace Tips */}
            <div className="text-sm opacity-80 space-y-2 p-2">
              <p>💡 Use a clear product title</p>
              <p>💡 Add detailed descriptions to build trust</p>
              <p>💡 Competitive pricing increases visibility</p>
            </div>
          </div>

          {/* RIGHT SIDE – FORM */}
          <div
            className={`p-8 rounded-3xl shadow-2xl border backdrop-blur-xl ${
              mode === "dark"
                ? "bg-gray-800/80 border-gray-700"
                : "bg-white/80 border-gray-200"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="text-sm font-semibold block mb-2">
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Premium Wireless Headset"
                  className={`w-full px-4 py-3 text-base rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition ${
                    mode === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-50 border"
                  }`}
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-sm font-semibold block mb-2">
                  Price (₦)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className={`w-full px-4 py-3 text-base rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition ${
                    mode === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-50 border"
                  }`}
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-semibold block mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Electronics, Fashion, Gadgets..."
                  className={`w-full px-4 py-3 text-base rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition ${
                    mode === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-50 border"
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold block mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe features, condition, and key details..."
                  className={`w-full px-4 py-3 text-base rounded-xl outline-none focus:ring-2 focus:ring-pink-500 resize-none transition ${
                    mode === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-50 border"
                  }`}
                />
              </div>

              {/* Image Upload */}
              <div>
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
              </div>

              {/* Submit */}
              <button
                type="submit"
                // disabled={loading || remainingSlots <= 0}
                disabled={loading || (remainingSlots <= 0 && timeLeft)}
                className={`w-full mt-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-[1.02] transform transition-all text-white font-bold py-3 rounded-xl flex justify-center items-center ${
                  loading || remainingSlots <= 0
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {loading
                  ? "Adding Product..."
                  : remainingSlots <= 0
                    ? "Daily Limit Reached"
                    : "Publish Product 🚀"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PublicAddProduct;
