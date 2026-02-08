import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Package, Store, Mail, ShieldCheck, User } from "lucide-react";
import Layout from "../layout/Layout";
import myContext from "../../context/data/myContext";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
import { MdVerified } from "react-icons/md";

function UserProfile() {
  const { mode, product, user } = useContext(myContext);
  const { uid } = useParams();
  const [currentUser, setCurrentUser] = useState(null);

  /* -------- fetch seller by URL param -------- */
  useEffect(() => {
    if (!uid || !user) return;

    const seller = user.find((u) => u.uid === uid);
    setCurrentUser(seller || null);
  }, [uid, user]);

  if (!currentUser) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          mode === "dark"
            ? "bg-[#181a1b] text-white"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        <LoadingOverlay />
      </div>
    );
  }

  /* -------- seller products -------- */
  const sellerProducts = product.filter(
    (item) => item.userid === currentUser.uid,
  );

  return (
    <Layout>
      <div
        className={`min-h-screen px-3 sm:px-6 lg:px-8 py-10 ${
          mode === "dark"
            ? "bg-[#181a1b] text-white"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        {/* ================= SELLER HEADER ================= */}
        <div
          className={`max-w-6xl mx-auto mb-10 p-6 sm:p-8 rounded-3xl shadow-lg ${
            mode === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-lg">
              {currentUser.name?.charAt(0) || <User />}
            </div>

            {/* Seller Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <h1 className="flex items-center justify-center sm:justify-start gap-2 text-3xl sm:text-4xl font-extrabold text-center sm:text-left">
                <span>{currentUser.name}</span>
                <MdVerified
                  className={
                    currentUser.verified
                      ? "text-blue-500 text-2xl sm:text-3xl" // ✅ green if verified
                      : "text-gray-400 text-2xl sm:text-3xl" // ⚪ gray if not verified
                  }
                />
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Store size={14} />
                  {currentUser.verified ? "Verified Seller" : "Emerging Seller"}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} /> Trusted Account
                </span>
              </div>

              {/* Email */}
              <div className="flex justify-center md:justify-start">
                <span
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium break-all ${
                    mode === "dark"
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Mail size={14} />
                  {currentUser.email}
                </span>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-8 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{sellerProducts.length}</p>
                  <p className="text-xs text-gray-500">Products</p>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-xs text-gray-500">Response Rate</p>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold">Fast</p>
                  <p className="text-xs text-gray-500">Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ABOUT SELLER ================= */}
        <div
          className={`max-w-6xl mx-auto mb-12 p-6 rounded-2xl ${
            mode === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <h2 className="text-xl font-bold mb-3">About Seller</h2>
          <p className="text-sm leading-relaxed text-gray-500">
            {currentUser.name} is a{" "}
            {currentUser.verified ? "Verified Merchant" : "merchant"} on our
            platform, focused on delivering quality products, fast responses,
            and secure transactions. Every product is reviewed to ensure a
            trusted shopping experience for buyers.
          </p>
        </div>

        {/* ================= PRODUCTS ================= */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Package className="text-pink-500" />
            Products by {currentUser.name}
          </h2>

          {sellerProducts.length === 0 ? (
            <div
              className={`p-4 rounded-lg border-l-4 ${
                mode === "dark"
                  ? "bg-gray-700 border-yellow-400 text-yellow-200"
                  : "bg-yellow-50 border-yellow-400 text-yellow-800"
              }`}
            >
              <p className="text-sm">
                This seller hasn’t uploaded any products yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {sellerProducts.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all ${
                    mode === "dark"
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border"
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-44 object-cover"
                  />

                  <div className="p-4 space-y-1">
                    <h3 className="font-bold text-sm truncate">{item.title}</h3>

                    <p className="text-[11px] text-gray-500 truncate">
                      {item.category}
                    </p>

                    <p className="text-pink-600 font-extrabold text-lg">
                      ₦{Number(item.price).toLocaleString()}
                    </p>

                    {item.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default UserProfile;
