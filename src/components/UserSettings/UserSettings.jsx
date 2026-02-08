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
        // Fetch user info
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

        // Check if a verification request already exists
        const requestsRef = collection(fireDB, "verificationRequests");
        const q = query(
          requestsRef,
          where("userId", "==", loggedUser.uid),
          where("status", "==", "pending"),
        );
        const qSnap = await getDocs(q);

        if (!qSnap.empty) {
          setAlreadyRequested(true);
        }
      } catch (err) {
        console.error("Error fetching user or verification status:", err);
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

      setAlreadyRequested(true); // prevent further requests
    } catch (err) {
      console.error("Error sending verification request:", err);
      toast.error("Failed to send request.");
    } finally {
      setRequesting(false);
    }
  };

  if (loading || !currentUser) {
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

  return (
    <Layout>
      <Toaster />
      <div
        className={`min-h-screen px-4 py-10 ${
          mode === "dark"
            ? "bg-[#181a1b] text-white"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-pink-50 via-purple-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-8 rounded-3xl shadow-2xl space-y-6">
          {/* User Info */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-lg">
                {currentUser.name?.charAt(0)}
              </div>
              <div>
                <p className="text-lg sm:text-xl font-semibold">
                  {currentUser.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* Verified Badge */}
            <div className="flex items-center gap-2">
              <MdVerified
                size={28}
                className={`transition-all duration-500 ${
                  currentUser.verified
                    ? "text-green-500 animate-pulse"
                    : "text-gray-400"
                }`}
              />
              <span
                className={`font-medium text-sm ${
                  currentUser.verified ? "text-green-500" : "text-gray-400"
                }`}
              >
                {currentUser.verified ? "Verified User" : "Unverified"}
              </span>
            </div>
          </div>

          {/* About / Info */}
          <div className="p-4 rounded-xl bg-white dark:bg-gray-700 shadow-inner space-y-2">
            <h2 className="text-lg font-semibold">About You</h2>
            <p className="text-sm text-gray-600 dark:text-gray-200">
              {currentUser.verified ? (
                <>
                  <span className="font-semibold">
                    You are now a verified merchant
                  </span>{" "}
                  on our platform! Buyers can trust your products and enjoy a
                  premium shopping experience.
                </>
              ) : alreadyRequested ? (
                <>
                  <span className="font-semibold">
                    Verification request pending
                  </span>
                  . Please wait for Allmart review.
                </>
              ) : (
                <>
                  You are a merchant on our platform. Request verification to
                  get a<span className="font-semibold"> blue badge</span> and
                  more visibility.
                </>
              )}
            </p>
          </div>

          {/* Request Verification */}
          {!currentUser.verified && !alreadyRequested && (
            <div className="text-center">
              <button
                onClick={handleRequestVerification}
                disabled={requesting}
                className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {requesting ? "Requesting..." : "Request Verification"}
              </button>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Verified merchants get a{" "}
                <span className="font-semibold">blue badge</span> and more
                visibility on our platform.
              </p>
            </div>
          )}

          {alreadyRequested && !currentUser.verified && (
            <p className="text-center text-sm text-yellow-500 mt-2">
              You have already submitted a verification request. Please wait for
              Allmart’s review.
            </p>
          )}

          {/* External Info / Tips */}
          <div className="mt-6 p-4 rounded-xl bg-pink-50 dark:bg-gray-800 shadow-inner space-y-2">
            <h3 className="font-semibold text-purple-600">
              Tips for Verified Merchants
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Maintain high product quality to keep your badge active.</li>
              <li>Respond to buyers quickly to improve your response rate.</li>
              <li>
                Keep your profile updated with new products and descriptions.
              </li>
              <li>Engage with customers to build trust and loyalty.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UserSettings;
