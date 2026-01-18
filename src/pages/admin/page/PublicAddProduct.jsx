import { useContext, useState } from "react";
import Layout from "../../../components/layout/Layout";
import myContext from "../../../context/data/myContext";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

function PublicAddProduct() {
  const { addProduct, mode } = useContext(myContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    imageUrl: "",
    category: "",
    description: "", // ✅ Added description
  });

  const [preview, setPreview] = useState(null);

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

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.uid) {
      toast.error("Please login to upload products");
      return;
    }

    const newProduct = {
      ...form,
      price: Number(price),
      date: new Date().toISOString(),
      id: Date.now(),
      userid: user.uid, // ✅ fixed
    };

    try {
      await addProduct(newProduct);
      // toast.success("✅ Product added to marketplace");

      // Reset form
      setForm({
        title: "",
        price: "",
        imageUrl: "",
        category: "",
        description: "",
      });
      setPreview(null);

      // Redirect to user's products
      navigate("/my-products");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to add product");
    }
  };

  return (
    <Layout>
      <div
        className={`min-h-screen flex justify-center items-center p-6 transition-colors duration-300 ${
          mode === "dark"
            ? "bg-[#181a1b] text-white"
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
          <h1 className="text-center text-3xl font-extrabold text-pink-600 mb-6">
            Add Product
          </h1>

          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Product Title"
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
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition"
          >
            Add Product to Marketplace
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default PublicAddProduct;
