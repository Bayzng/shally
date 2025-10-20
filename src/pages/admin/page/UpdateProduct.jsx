import { useContext, useState } from "react";
import myContext from "../../../context/data/myContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdateProduct() {
  const context = useContext(myContext);
  const { products, setProducts, updateProduct } = context;
  const [preview, setPreview] = useState(products?.imageUrl || null);

  // ✅ Handle image upload with resizing/compression
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

        setProducts({ ...products, imageUrl: compressedDataUrl });
        setPreview(compressedDataUrl);
      };

      img.onerror = () => {
        toast.error("Error processing image. Try another file.");
      };
    };

    reader.onerror = () => toast.error("Error reading image. Try again.");
    reader.readAsDataURL(file);
  };

  // ✅ Handle product update
  const handleUpdate = () => {
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

    updateProduct();
    toast.success("Product updated successfully!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="bg-gray-900 text-white shadow-2xl px-8 py-8 rounded-2xl w-full max-w-lg">
        <h1 className="text-center text-yellow-400 text-2xl mb-6 font-extrabold tracking-wide">
          Update Product
        </h1>

        <div className="space-y-4">
          {/* Product Title */}
          <input
            type="text"
            value={products.title || ""}
            onChange={(e) => setProducts({ ...products, title: e.target.value })}
            placeholder="Product Title"
            className="bg-gray-700 px-3 py-3 w-full rounded-lg text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Product Price */}
          <input
            type="number"
            value={products.price || ""}
            onChange={(e) => setProducts({ ...products, price: e.target.value })}
            placeholder="Product Price"
            className="bg-gray-700 px-3 py-3 w-full rounded-lg text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Image Upload */}
          <div className="flex flex-col items-center">
            <label className="text-gray-300 mb-2 text-sm font-semibold">
              Update Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="bg-gray-700 text-white rounded-lg px-3 py-2 w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 transition-all"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-40 h-40 object-cover rounded-lg shadow-md"
              />
            )}
          </div>

          {/* Category */}
          <input
            type="text"
            value={products.category || ""}
            onChange={(e) =>
              setProducts({ ...products, category: e.target.value })
            }
            placeholder="Product Category"
            className="bg-gray-700 px-3 py-3 w-full rounded-lg text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Description */}
          <textarea
            rows="4"
            value={products.description || ""}
            onChange={(e) =>
              setProducts({ ...products, description: e.target.value })
            }
            placeholder="Product Description"
            className="bg-gray-700 px-3 py-3 w-full rounded-lg text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-yellow-400"
          ></textarea>

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg shadow-lg transition-all duration-200"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
