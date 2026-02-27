import { useContext, useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { MdVerified } from "react-icons/md";
import myContext from "../../context/data/myContext";
import { fireDB } from "../../fireabase/FirebaseConfig";
import Layout from "../layout/Layout";
import toast, { Toaster } from "react-hot-toast";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";

function UserSettings() {
  const { mode } = useContext(myContext);
  const isDark = mode === "dark";

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [alreadyRequested, setAlreadyRequested] = useState(false);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return;

    const loggedUser = JSON.parse(rawUser);

    const fetchUser = async () => {
      try {
        const userRef = doc(fireDB, "users", loggedUser.uid);
        const userSnap = await getDoc(userRef);

        setCurrentUser({
          uid: loggedUser.uid,
          email: loggedUser.email,
          name: userSnap.exists()
            ? userSnap.data().name
            : loggedUser.name || "User",
          verified: userSnap.exists()
            ? userSnap.data().verified || false
            : false,
        });

        const requestsRef = collection(fireDB, "verificationRequests");
        const q = query(
          requestsRef,
          where("userId", "==", loggedUser.uid),
          where("status", "==", "pending"),
        );
        const qSnap = await getDocs(q);

        if (!qSnap.empty) setAlreadyRequested(true);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleRequestVerification = async () => {
    if (!currentUser || alreadyRequested) return;
    setRequesting(true);

    try {
      await addDoc(collection(fireDB, "verificationRequests"), {
        userId: currentUser.uid,
        name: currentUser.name,
        email: currentUser.email,
        status: "pending",
        timestamp: Timestamp.now(),
      });

      toast.success("Verification request sent for Allmart review.", {
        style: { background: "green", color: "#fff" },
      });

      setAlreadyRequested(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send request.");
    } finally {
      setRequesting(false);
    }
  };

  if (loading || !currentUser) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
        }`}
      >
        <LoadingOverlay />
      </div>
    );
  }

  return (
    <Layout>
      <Toaster />

      <div
        className={`min-h-screen px-4 py-12 transition-all duration-500 ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white"
            : "bg-gradient-to-br from-gray-50 via-white to-purple-50 text-gray-800"
        }`}
      >
        <div className="max-w-5xl mx-auto space-y-10">
          {/* ================= HEADER SECTION ================= */}
          <div
            className={`p-8 rounded-3xl shadow-2xl backdrop-blur-xl border ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white/70 border-gray-200"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Profile Info */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                    {currentUser.name?.charAt(0)}
                  </div>

                  {currentUser.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2 shadow-lg">
                      <MdVerified size={18} className="text-white" />
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-bold">{currentUser.name}</h1>
                  <p className="text-sm opacity-70">{currentUser.email}</p>

                  <div className="mt-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        currentUser.verified
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {currentUser.verified
                        ? "Verified Merchant"
                        : "Standard Account"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Summary */}
              <div className="text-sm space-y-2 opacity-80">
                <p>🛍 Sell products to thousands of buyers</p>
                <p>⚡ Get faster visibility with verification</p>
                <p>🔒 Secure and trusted marketplace system</p>
              </div>
            </div>
          </div>

          {/* ================= VERIFICATION SECTION ================= */}
          <div
            className={`p-8 rounded-3xl shadow-xl border ${
              isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Account Verification</h2>

                <p className="text-sm opacity-70 max-w-xl">
                  Verified merchants receive priority placement, increased buyer
                  trust, and a blue verification badge displayed across the
                  marketplace.
                </p>
              </div>

              {/* Status Indicator */}
              <div>
                {currentUser.verified ? (
                  <div className="flex items-center gap-2 text-blue-500 font-semibold">
                    <MdVerified size={22} />
                    Verified
                  </div>
                ) : alreadyRequested ? (
                  <div className="text-yellow-500 font-medium">
                    ⏳ Request Pending Review
                  </div>
                ) : (
                  <div className="text-red-500 font-medium">⚠ Not Verified</div>
                )}
              </div>
            </div>

            {/* Action Area */}
            {!currentUser.verified && !alreadyRequested && (
              <div className="mt-6">
                <button
                  onClick={handleRequestVerification}
                  disabled={requesting}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.03] transform transition-all text-white font-semibold shadow-lg"
                >
                  {requesting
                    ? "Submitting Request..."
                    : "Request Verification"}
                </button>

                <p className="text-xs mt-2 opacity-60">
                  Our team will review your account within 24–48 hours.
                </p>
              </div>
            )}

            {alreadyRequested && !currentUser.verified && (
              <p className="mt-6 text-yellow-500 text-sm">
                You have already submitted a verification request.
              </p>
            )}
          </div>

          {/* ================= BENEFITS GRID ================= */}
          <div className="grid md:grid-cols-3 gap-6">
            <div
              className={`p-6 rounded-2xl shadow-lg ${
                isDark ? "bg-white/5" : "bg-white"
              }`}
            >
              <h3 className="font-semibold mb-2 text-purple-500">
                🔥 Higher Visibility
              </h3>
              <p className="text-sm opacity-70">
                Verified merchants appear higher in search results and product
                listings.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl shadow-lg ${
                isDark ? "bg-white/5" : "bg-white"
              }`}
            >
              <h3 className="font-semibold mb-2 text-blue-500">
                🛡 Increased Trust
              </h3>
              <p className="text-sm opacity-70">
                Buyers are more confident purchasing from verified accounts.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl shadow-lg ${
                isDark ? "bg-white/5" : "bg-white"
              }`}
            >
              <h3 className="font-semibold mb-2 text-pink-500">
                📈 Better Conversions
              </h3>
              <p className="text-sm opacity-70">
                Verified sellers experience improved engagement and sales rates.
              </p>
            </div>
          </div>

          {/* ================= PERFORMANCE TIPS ================= */}
          <div
            className={`p-8 rounded-3xl shadow-xl ${
              isDark ? "bg-white/5" : "bg-purple-50"
            }`}
          >
            <h3 className="font-bold text-lg mb-4">Merchant Growth Tips</h3>

            <ul className="space-y-2 text-sm opacity-80 list-disc list-inside">
              <li>Upload high-quality product images</li>
              <li>Respond quickly to customer messages</li>
              <li>Keep pricing competitive and transparent</li>
              <li>Maintain excellent delivery records</li>
              <li>Update your listings regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UserSettings;
