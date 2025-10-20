import { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import myContext from "../../../context/data/myContext";

function AddProduct() {
  const context = useContext(myContext);
  const { products, setProducts, addProduct } = context;
  const [preview, setPreview] = useState(null);

  // ✅ Image Upload Handler with Compression
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
        // Resize/compress image
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

        // Convert to Base64 JPEG (quality 0.7)
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);

        setProducts({ ...products, imageUrl: compressedDataUrl });
        setPreview(compressedDataUrl);
      };

      img.onerror = () => {
        toast.error("Error processing image. Please try another file.");
      };
    };

    reader.onerror = () => {
      toast.error("Error reading image file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  // ✅ Add Product Handler
  const handleAddProduct = () => {
    if (
      !products.title ||
      !products.price ||
      !products.imageUrl ||
      !products.category ||
      !products.description
    ) {
      toast.error("Please fill all fields before submitting!");
      return;
    }

    addProduct();
    toast.success("Product added successfully!");
    setPreview(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="bg-gray-800 shadow-2xl px-8 py-10 rounded-2xl w-full max-w-lg border border-gray-700">
        <h1 className="text-center text-yellow-400 text-3xl mb-6 font-extrabold tracking-wide">
          Add Product
        </h1>

        <div className="space-y-5">
          {/* Product Title */}
          <input
            type="text"
            value={products.title || ""}
            onChange={(e) => setProducts({ ...products, title: e.target.value })}
            placeholder="Product Title"
            className="bg-gray-700 px-4 py-3 w-full rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Product Price */}
          <input
            type="number"
            value={products.price || ""}
            onChange={(e) => setProducts({ ...products, price: e.target.value })}
            placeholder="Product Price"
            className="bg-gray-700 px-4 py-3 w-full rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Image Upload */}
          <div className="flex flex-col items-center">
            <label className="text-gray-300 mb-2 text-sm font-semibold">
              Upload Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="bg-gray-700 text-white rounded-lg px-3 py-2 w-full cursor-pointer 
              file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
              file:text-sm file:font-semibold file:bg-yellow-500 file:text-black 
              hover:file:bg-yellow-400 transition-all"
            />

            {preview && (
              <img
                src={preview}
                alt="Product Preview"
                className="mt-4 w-48 h-48 object-cover rounded-xl border border-gray-600 shadow-md"
              />
            )}
          </div>

          {/* Product Category */}
          <input
            type="text"
            value={products.category || ""}
            onChange={(e) =>
              setProducts({ ...products, category: e.target.value })
            }
            placeholder="Product Category"
            className="bg-gray-700 px-4 py-3 w-full rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Product Description */}
          <textarea
            value={products.description || ""}
            onChange={(e) =>
              setProducts({ ...products, description: e.target.value })
            }
            placeholder="Product Description"
            rows="4"
            className="bg-gray-700 px-4 py-3 w-full rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400"
          ></textarea>

          {/* Add Product Button */}
          <button
            onClick={handleAddProduct}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg shadow-lg transition-all duration-300"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;








// import { useContext, useState } from "react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import myContext from "../../../context/data/myContext";
// import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { app } from "../../../fireabase/FirebaseConfig"; // ✅ make sure this points to your Firebase config

// function AddProduct() {
//   const context = useContext(myContext);
//   const { products, setProducts, addProduct } = context;
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const storage = getStorage(app);

//   // ✅ Image Upload to Firebase Storage
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select a valid image file!");
//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       toast.error("Image too large! Max size is 2MB.");
//       return;
//     }

//     setPreview(URL.createObjectURL(file));
//     setLoading(true);

//     try {
//       const storageRef = ref(storage, `product_images/${file.name}`);
//       const uploadTask = uploadBytesResumable(storageRef, file);

//       uploadTask.on(
//         "state_changed",
//         null,
//         (error) => {
//           console.error(error);
//           toast.error("Error uploading image.");
//           setLoading(false);
//         },
//         async () => {
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           setProducts({ ...products, imageUrl: downloadURL });
//           toast.success("Image uploaded successfully!");
//           setLoading(false);
//         }
//       );
//     } catch (error) {
//       console.error("Upload error:", error);
//       toast.error("Something went wrong while uploading.");
//       setLoading(false);
//     }
//   };

//   // ✅ Add Product Handler
//   const handleAddProduct = async () => {
//     if (
//       !products.title ||
//       !products.price ||
//       !products.imageUrl ||
//       !products.category ||
//       !products.description
//     ) {
//       toast.error("Please fill all fields before submitting!");
//       return;
//     }

//     try {
//       setLoading(true);
//       await addProduct();
//       toast.success("Product added successfully!");
//       setPreview(null);
//     } catch (error) {
//       toast.error("Failed to add product. Check your internet or Firebase rules.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
//       <div className="bg-gray-800 shadow-2xl px-8 py-10 rounded-2xl w-full max-w-lg border border-gray-700">
//         <h1 className="text-center text-yellow-400 text-3xl mb-6 font-extrabold tracking-wide">
//           Add Product
//         </h1>

//         <div className="space-y-5">
//           <input
//             type="text"
//             value={products.title || ""}
//             onChange={(e) => setProducts({ ...products, title: e.target.value })}
//             placeholder="Product Title"
//             className="bg-gray-700 px-4 py-3 w-full rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400"
//           />

//           <input
//             type="number"
//             value={products.price || ""}
//             onChange={(e) => setProducts({ ...products, price: e.target.value })}
//             placeholder="Product Price"
//             className="bg-gray-700 px-4 py-3 w-full rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400"
//           />

//           <div className="flex flex-col items-center">
//             <label className="text-gray-300 mb-2 text-sm font-semibold">
//               Upload Product Image
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="bg-gray-700 text-white rounded-lg px-3 py-2 w-full cursor-pointer 
//               file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
//               file:text-sm file:font-semibold file:bg-yellow-500 file:text-black 
//               hover:file:bg-yellow-400 transition-all"
//             />

//             {preview && (
//               <img
//                 src={preview}
//                 alt="Product Preview"
//                 className="mt-4 w-48 h-48 object-cover rounded-xl border border-gray-600 shadow-md"
//               />
//             )}
//           </div>

//           <input
//             type="text"
//             value={products.category || ""}
//             onChange={(e) => setProducts({ ...products, category: e.target.value })}
//             placeholder="Product Category"
//             className="bg-gray-700 px-4 py-3 w-full rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400"
//           />

//           <textarea
//             value={products.description || ""}
//             onChange={(e) =>
//               setProducts({ ...products, description: e.target.value })
//             }
//             placeholder="Product Description"
//             rows="4"
//             className="bg-gray-700 px-4 py-3 w-full rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400"
//           ></textarea>

//           <button
//             onClick={handleAddProduct}
//             disabled={loading}
//             className={`w-full ${
//               loading
//                 ? "bg-gray-500 cursor-not-allowed"
//                 : "bg-yellow-500 hover:bg-yellow-400"
//             } text-black font-bold py-3 rounded-lg shadow-lg transition-all duration-300`}
//           >
//             {loading ? "Uploading..." : "Add Product"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddProduct;
