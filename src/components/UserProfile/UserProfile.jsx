// src/components/UserProfile/UserProfile.jsx
import { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Package,
  Store,
  Mail,
  ShieldCheck,
  User,
  MessageSquare,
  X,
} from "lucide-react";
import myContext from "../../context/data/myContext";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
import { MdVerified } from "react-icons/md";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { fireDB } from "../../fireabase/FirebaseConfig";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Layout from "../layout/Layout";

function UserProfile() {
  const { mode, product, user } = useContext(myContext);
  const { uid } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Chat states
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatRef = useRef(null);

  const buyerData = JSON.parse(localStorage.getItem("user"));
  const buyerId = buyerData?.uid;

  // Compute chat ID
  const chatId =
    buyerId && currentUser ? [buyerId, currentUser.uid].sort().join("_") : null;

  // Fetch seller info by UID
  useEffect(() => {
    if (!uid || !user) return;
    const seller = user.find((u) => u.uid === uid);
    setCurrentUser(seller || null);
  }, [uid, user]);

  // Listen for real-time chat messages
  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(fireDB, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !currentUser) return;

    // Ensure chat document exists
    const chatDocRef = doc(fireDB, "chats", chatId);
    await setDoc(chatDocRef, { chatId }, { merge: true });

    // Add message
    const messagesRef = collection(fireDB, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      senderId: buyerId,
      receiverId: currentUser.uid,
      text: newMessage.trim(),
      timestamp: Date.now(),
    });

    setNewMessage("");
  };

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
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-lg">
              {currentUser.name?.charAt(0) || <User />}
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <h1 className="flex items-center justify-center sm:justify-start gap-2 text-3xl sm:text-4xl font-extrabold text-center sm:text-left">
                <span>{currentUser.name}</span>
                <MdVerified
                  className={
                    currentUser.verified
                      ? "text-blue-500 text-2xl sm:text-3xl"
                      : "text-gray-400 text-2xl sm:text-3xl"
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

        {/* ================= CHAT BUTTON ================= */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="chat-button fixed bottom-8 right-8 w-16 h-16 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center shadow-lg transition-all z-50"
        >
          {chatOpen ? (
            <X className="text-white w-8 h-8" />
          ) : (
            <MessageSquare className="text-white w-8 h-8" />
          )}
        </button>

        {/* ================= CHAT PANEL ================= */}
        {/* ================= CHAT PANEL ================= */}
        {/* ================= CHAT PANEL ================= */}
        {chatOpen && (
          <div
            className={`fixed right-4 bottom-4 w-80 max-w-sm h-[500px] flex flex-col rounded-xl shadow-lg z-[999]
      ${mode === "dark" ? "bg-gray-800 border border-gray-700 text-gray-200" : "bg-white border border-gray-300 text-gray-800"}
    `}
          >
            {/* ================= CHAT HEADER ================= */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              {/* Seller Info */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg sm:text-xl leading-none select-none">
                    {currentUser.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm sm:text-base">
                      {currentUser.name}
                    </span>
                    <MdVerified
                      className={
                        currentUser.verified
                          ? "text-blue-500 text-xs sm:text-sm"
                          : "text-gray-400 text-xs sm:text-sm"
                      }
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {currentUser.verified
                      ? "Verified Seller"
                      : "Emerging Seller"}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setChatOpen(false)}
                className="sm:hidden flex items-center justify-center p-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 bg-white dark:bg-gray-800"
              >
                <IoArrowBackCircleSharp className="text-red-500" size={22} />
              </button>
            </div>

            {/* ================= MESSAGES ================= */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.length === 0 ? (
                <div
                  className={`text-center text-sm italic ${
                    mode === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No messages yet. Say hello to {currentUser.name}!
                </div>
              ) : (
                messages.map((msg) => {
                  const isBuyer = msg.senderId === buyerId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isBuyer ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`px-3 py-2 rounded-lg max-w-[75%] break-words ${
                          isBuyer
                            ? "bg-pink-500 text-white rounded-tr-none"
                            : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              {/* dummy div for scrollIntoView */}
              <div ref={chatRef} />
            </div>

            {/* ================= INPUT ================= */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2 flex-shrink-0">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className={`flex-1 text-base px-3 py-2 rounded-xl text-sm outline-none
          ${mode === "dark" ? "bg-gray-700 text-gray-300 placeholder-gray-400" : "bg-gray-100 text-gray-800 placeholder-gray-500"}
        `}
                style={{ fontSize: "16px" }}
              />
              <button
                onClick={handleSend}
                className="px-3 py-2 rounded-lg font-bold text-white bg-pink-500 hover:bg-pink-600 transition-all"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default UserProfile;
