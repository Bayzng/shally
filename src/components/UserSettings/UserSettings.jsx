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
        className={`min-h-screen px-4 py-10 ${
          isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
        }`}
      >
        <div
          className={`max-w-3xl mx-auto p-8 rounded-3xl shadow-2xl space-y-6 ${
            isDark
              ? "bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800"
              : "bg-gradient-to-r from-pink-50 via-purple-50 to-white"
          }`}
        >
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
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* Verified Badge */}
            {/* Verified Badge */}
            <div className="flex items-center gap-3 justify-end sm:justify-start">
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full shadow-lg transition-all duration-300 ${
                  currentUser.verified
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                <MdVerified
                  size={24}
                  className={`transition-transform duration-500 ${
                    currentUser.verified
                      ? "text-blue-500 animate-bounce"
                      : "text-gray-400 dark:text-gray-300"
                  }`}
                />
                <span className="font-medium text-sm">
                  {currentUser.verified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
          </div>

          {/* About */}
          <div
            className={`p-4 rounded-xl shadow-inner ${
              isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"
            }`}
          >
            <h2 className="text-lg font-semibold mb-1">About You</h2>
            <p className="text-sm">
              {currentUser.verified ? (
                <>
                  <span className="font-semibold">
                    You are now a verified merchant
                  </span>{" "}
                  on our platform.
                </>
              ) : alreadyRequested ? (
                <>
                  <span className="font-semibold">
                    Verification request pending
                  </span>
                  . Please wait for review.
                </>
              ) : (
                <>
                  Request verification to get a{" "}
                  <span className="font-semibold">blue badge</span>.
                </>
              )}
            </p>
          </div>

          {/* Request Button */}
          {!currentUser.verified && !alreadyRequested && (
            <div className="text-center">
              <button
                onClick={handleRequestVerification}
                disabled={requesting}
                className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg transition"
              >
                {requesting ? "Requesting..." : "Request Verification"}
              </button>
              <p
                className={`mt-2 text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Verified merchants get more visibility.
              </p>
            </div>
          )}

          {alreadyRequested && !currentUser.verified && (
            <p className="text-center text-sm text-yellow-500">
              Verification request already submitted.
            </p>
          )}

          {/* Tips */}
          <div
            className={`mt-6 p-4 rounded-xl shadow-inner ${
              isDark ? "bg-gray-800" : "bg-pink-50"
            }`}
          >
            <h3
              className={`font-semibold ${
                isDark ? "text-purple-400" : "text-purple-600"
              }`}
            >
              Tips for Verified Merchants
            </h3>
            <ul
              className={`list-disc list-inside text-sm space-y-1 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <li>Maintain high product quality</li>
              <li>Respond quickly to buyers</li>
              <li>Keep your products updated</li>
              <li>Engage customers consistently</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UserSettings;
