import Layout from "../../components/layout/Layout";
import { useEffect, useState, useContext } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";
import myContext from "../../context/data/myContext";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import { IoClose } from "react-icons/io5";
import { MdNotificationAdd } from "react-icons/md";

function Disputes() {
  const { mode } = useContext(myContext);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const localUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        if (!localUser?.uid) return;

        const q = query(
          collection(fireDB, "disputes"),
          where("sellerId", "==", localUser.uid),
        );

        const snapshot = await getDocs(q);
        const sellerDisputes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDisputes(sellerDisputes);
      } catch (error) {
        console.error("Error fetching disputes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  const handleCheckClick = (dispute) => {
    if (dispute.status === "resolved") return;

    const latestDispute = disputes.find((d) => d.id === dispute.id);
    setSelectedDispute(latestDispute);
    setModalOpen(true);
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file!");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;

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

        // 🔥 Strong compression (0.5 quality)
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.5);

        // 🚨 Check size before saving
        const sizeInBytes = new Blob([compressedDataUrl]).size;

        if (sizeInBytes > 900000) {
          alert("Image is still too large. Please upload a smaller image.");
          return;
        }

        setImageFile(file);
        setPreviewUrl(compressedDataUrl);
      };

      img.onerror = () => {
        alert("Error processing image.");
      };
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!imageFile || !selectedDispute) {
      alert("Please select an image before submitting.");
      return;
    }

    try {
      setSubmitLoading(true); // start loading

      await updateDoc(doc(fireDB, "disputes", selectedDispute.id), {
        receiptUrl: previewUrl,
        receiptUploadedAt: Timestamp.now(),
        status: "reviewing", // ✅ NEW STATE
      });

      setDisputes((prev) =>
        prev.map((d) =>
          d.id === selectedDispute.id
            ? {
                ...d,
                receiptUrl: previewUrl,
                status: "reviewing", // ✅ reflect immediately in UI
              }
            : d,
        ),
      );

      alert("Receipt uploaded successfully!");
      setModalOpen(false);
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error saving receipt:", error);
      alert("Failed to save receipt. Try again.");
    } finally {
      setSubmitLoading(false); // stop loading
    }
  };

  const filteredDisputes =
    filter === "all" ? disputes : disputes.filter((d) => d.status === filter);

  if (loading)
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <LoadingOverlay />
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div
        className={`min-h-screen py-10 px-4 sm:px-8 ${mode === "dark" ? "bg-[#181a1b] text-white" : "bg-gray-50 text-gray-800"}`}
      >
        <div className="mb-10 flex items-center bg-white rounded-xl shadow-md overflow-hidden py-2 px-4">
          {/* Fixed note */}
          <div className="flex-shrink-0 font-semibold mr-4">
            <MdNotificationAdd size={20} className="text-red-500" />
          </div>

          {/* Scrolling text */}
          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="inline-block animate-scroll text-black  font-medium">
              To resolve a dispute, please check your dashboard and upload a
              screenshot of the reported product.
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-6">Disputes</h1>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {["all", "open", "resolved"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === type ? "bg-purple-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Disputes List */}
        {filteredDisputes.length === 0 ? (
          <p className="text-center text-gray-500">No disputes found.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDisputes.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border shadow-sm p-4 text-sm transition ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      className="w-14 h-14 rounded-md object-cover"
                    />
                    <div>
                      <h2 className="font-semibold text-sm truncate max-w-[160px]">
                        {item.productTitle}
                      </h2>
                      <p className="text-xs text-gray-500">
                        ₦{Number(item.productPrice).toLocaleString()} •{" "}
                        {item.productCategory}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      item.status === "open"
                        ? "bg-red-100 text-red-600"
                        : item.status === "reviewing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-600"
                    }`}
                  >
                    {item.status?.toUpperCase()}
                  </span>
                </div>

                {/* Alert */}
                <div
                  className={`mt-3 px-3 py-2 rounded-md text-xs ${item.status === "open" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                >
                  {item.status === "open"
                    ? "⚠️ Buyer reported an issue. Action required."
                    : item.status === "reviewing"
                      ? "🕒 Receipt submitted. Dispute under review."
                      : "✅ Dispute resolved. No action needed."}
                </div>

                {/* Basic Info */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <p>
                    <strong>Buyer:</strong> {item.buyerName}
                  </p>
                  <p>
                    <strong>Order:</strong> {item.orderId} <br />
                    <strong>Payment:</strong> {item.paymentId}
                  </p>
                </div>

                {item.receiptUrl && (
                  <div className="mt-2 text-xs">
                    <strong>Order Receipt:</strong>
                    <img
                      src={item.receiptUrl}
                      alt="Receipt"
                      className="w-14 h-14 object-cover mt-3 rounded-lg border"
                    />
                  </div>
                )}
                {/* Manage button */}
                <button
                  onClick={() => handleCheckClick(item)}
                  disabled={
                    item.status === "resolved" || item.status === "reviewing"
                  }
                  className={`mt-3 w-full px-4 py-2 text-sm font-semibold rounded-lg shadow transition duration-200 flex items-center justify-center gap-2
                    ${
                      item.status === "resolved"
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : item.status === "reviewing"
                          ? "bg-yellow-200 text-yellow-700 cursor-not-allowed"
                          : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md"
                    }
                  `}
                >
                  {item.status === "resolved"
                    ? "Dispute Completed"
                    : item.status === "reviewing"
                      ? "Dispute Reviewing"
                      : "Manage Dispute"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Image Modal */}
        {modalOpen && selectedDispute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-11/12 max-w-md relative shadow-lg">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
              >
                <IoClose size={24} />
              </button>

              <div className="flex flex-col items-center gap-4">
                <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">
                  ⚠️ Dispute Action Required
                </h2>
                <p className="text-center text-sm text-yellow-600 dark:text-yellow-300">
                  Provide the transaction receipt for this order.
                </p>

                {/* Show existing receipt or upload */}
                {selectedDispute.receiptUrl ? (
                  <div className="w-full">
                    <strong>Uploaded Receipt:</strong>
                    <img
                      src={selectedDispute.receiptUrl}
                      alt="Receipt"
                      className="mt-1 max-h-48 w-full object-contain rounded-md border"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Receipt already uploaded. Re-upload disabled.
                    </p>
                  </div>
                ) : (
                  <>
                    <label className="w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="cursor-pointer w-full text-center px-4 py-2 border-2 border-dashed border-purple-400 rounded-lg text-purple-600 hover:bg-purple-50 transition">
                        {imageFile
                          ? imageFile.name
                          : "Click to upload receipt image"}
                      </div>
                    </label>

                    {/* Preview */}
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mt-2 max-h-48 w-full object-contain rounded-md border"
                      />
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={submitLoading}
                      className={`mt-3 w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-lg shadow hover:bg-purple-700 transition flex items-center justify-center gap-2 ${submitLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {submitLoading ? "Submitting..." : "Submit Receipt"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Disputes;
