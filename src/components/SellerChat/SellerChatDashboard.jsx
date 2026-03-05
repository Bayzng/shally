// import { useState, useEffect, useRef, useContext } from "react";
// import {
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   addDoc,
//   doc,
//   setDoc,
// } from "firebase/firestore";
// import { MdVerified } from "react-icons/md";
// import { fireDB } from "../../fireabase/FirebaseConfig";
// import myContext from "../../context/data/myContext";

// function SellerChatDashboard() {
//   const sellerData = JSON.parse(localStorage.getItem("user"));
//   const sellerId = sellerData?.uid;

//   const { user, mode } = useContext(myContext); // all users + mode
//   const [chats, setChats] = useState([]);
//   const [activeChat, setActiveChat] = useState(null);
//   const [activeBuyer, setActiveBuyer] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const chatRef = useRef(null);

//   // Sample seller info (can be dynamic from your user object)
//   const currentUser = {
//     name: sellerData?.name || "Seller Name",
//     verified: true,
//   };

//   // Fetch all chats where seller is involved
//   useEffect(() => {
//     if (!sellerId) return;

//     const chatsCollection = collection(fireDB, "chats");
//     const q = query(chatsCollection, orderBy("chatId"));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const allChats = snapshot.docs
//         .map((doc) => ({ id: doc.id, ...doc.data() }))
//         .filter((chat) => chat.id.includes(sellerId)); // only seller chats
//       setChats(allChats);
//     });

//     return () => unsubscribe();
//   }, [sellerId]);

//   // Open chat and fetch messages
//   useEffect(() => {
//     if (!activeChat) return;

//     const messagesCollection = collection(
//       fireDB,
//       "chats",
//       activeChat,
//       "messages",
//     );
//     const q = query(messagesCollection, orderBy("timestamp"));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setMessages(msgs);
//       chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
//     });

//     return () => unsubscribe();
//   }, [activeChat]);

//   // Send message
//   const handleSend = async () => {
//     if (!newMessage.trim() || !activeChat || !activeBuyer) return;

//     const chatDocRef = doc(fireDB, "chats", activeChat);
//     await setDoc(chatDocRef, { chatId: activeChat }, { merge: true });

//     const messagesCollection = collection(
//       fireDB,
//       "chats",
//       activeChat,
//       "messages",
//     );
//     await addDoc(messagesCollection, {
//       senderId: sellerId,
//       receiverId: activeBuyer.uid,
//       text: newMessage.trim(),
//       timestamp: Date.now(),
//     });

//     setNewMessage("");
//   };

//   // Helper to get buyer object
//   const getBuyer = (uid) => user?.find((u) => u.uid === uid);

//   return (
//     <div>
//       <div
//         className={`flex transition-colors duration-500 max-h-[80vh] ${mode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
//       >
//         {/* ================= BUYER LIST ================= */}
//         <div
//           className={`w-60 border-r overflow-y-auto transition-colors duration-500 ${mode === "dark" ? "border-gray-700" : "border-gray-300"}`}
//         >
//           <h2
//             className={`p-4 font-bold text-lg border-b transition-colors duration-500 ${mode === "dark" ? "border-gray-700 text-gray-200" : "border-gray-300 text-gray-700"}`}
//           >
//             Buyers
//           </h2>

//           {chats.length === 0 && (
//             <p
//               className={`p-4 text-sm transition-colors duration-500 ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}
//             >
//               No chats yet
//             </p>
//           )}

//           {chats.map((chat) => {
//             const buyerUid = chat.id.replace(`_${sellerId}`, "");
//             const buyer = getBuyer(buyerUid);
//             const buyerName = buyer?.name || "Unknown";
//             const lastMessage =
//               chat.messages?.slice(-1)[0]?.text || "Sellect to chat";

//             // Check if this chat is active
//             const isActive = activeChat === chat.id;

//             return (
//               <div
//                 key={chat.id}
//                 onClick={() => {
//                   setActiveChat(chat.id);
//                   setActiveBuyer({ uid: buyerUid, name: buyerName });
//                 }}
//                 className={`p-3 border-b cursor-pointer flex items-center gap-3 transition-colors duration-300
//                 ${
//                   isActive
//                     ? mode === "dark"
//                       ? "bg-pink-600 text-white"
//                       : "bg-pink-100 text-pink-800"
//                     : mode === "dark"
//                       ? "border-gray-700 hover:bg-gray-800 text-gray-200"
//                       : "border-gray-200 hover:bg-gray-100 text-gray-800"
//                 }
//             `}
//               >
//                 {/* Avatar */}
//                 <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
//                   <span className="text-white font-bold text-lg sm:text-xl leading-none select-none">
//                     {buyerName.charAt(0).toUpperCase() || "U"}
//                   </span>
//                 </div>

//                 {/* Name and last message */}
//                 <div className="flex flex-col flex-1">
//                   <span className="font-bold text-sm sm:text-base">
//                     {buyerName}
//                   </span>
//                   <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
//                     {lastMessage}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* ================= CHAT PANEL ================= */}
//         {/* ================= CHAT PANEL ================= */}
//         <div className="flex-[3.5] flex flex-col">
//           {activeChat && activeBuyer ? (
//             <>
//               {/* Buyer Info Card */}
//               {/* Buyer Info Card */}
//               <div className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700">
//                 {/* Avatar */}
//                 <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
//                   <span className="text-white font-bold text-lg sm:text-xl leading-none select-none">
//                     {activeBuyer.name?.charAt(0).toUpperCase() || "U"}
//                   </span>
//                 </div>

//                 {/* Name and Status */}
//                 <div className="flex flex-col flex-1">
//                   <div className="flex items-center gap-1">
//                     <span
//                       className={`font-bold text-sm ${
//                         mode === "dark" ? "text-gray-200" : "text-gray-800"
//                       }`}
//                     >
//                       {activeBuyer.name}
//                     </span>
//                     <MdVerified
//                       className={
//                         activeBuyer.verified
//                           ? "text-blue-500 text-xs"
//                           : "text-gray-400 text-xs"
//                       }
//                     />
//                   </div>
//                   <span className="text-xs text-gray-500 dark:text-gray-400">
//                     {activeBuyer.verified ? "Verified Buyer" : "New Buyer"}
//                   </span>
//                 </div>
//               </div>

//               {/* Messages */}
//               {/* Messages */}
//               <div
//                 ref={chatRef}
//                 className={`flex-1 overflow-y-auto p-4 space-y-2 transition-colors duration-500 ${
//                   mode === "dark" ? "bg-gray-900" : "bg-gray-50"
//                 }`}
//               >
//                 {messages.map((msg) => {
//                   const isSeller = msg.senderId === sellerId;

//                   return (
//                     <div
//                       key={msg.id}
//                       className={`flex ${isSeller ? "justify-end" : "justify-start"}`}
//                     >
//                       <div
//                         className={`px-4 py-2 rounded-lg max-w-[70%] break-words ${
//                           isSeller
//                             ? "bg-pink-500 text-white rounded-tr-none" // seller on right
//                             : `bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-tl-none` // buyer on left
//                         }`}
//                       >
//                         {msg.text}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Input */}
//               <div
//                 className={`p-4 flex gap-2 border-t transition-colors duration-500 ${mode === "dark" ? "border-gray-700" : "border-gray-300"}`}
//               >
//                 <input
//                   type="text"
//                   className={`flex-1 px-3 text-base py-2 rounded-xl outline-none transition-colors duration-500 ${
//                     mode === "dark"
//                       ? "bg-gray-800 text-gray-200 placeholder-gray-400"
//                       : "bg-gray-100 text-gray-800 placeholder-gray-500"
//                   }`}
//                   placeholder={`Message ${activeBuyer.name}`}
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                 />
//                 <button
//                   className="px-4 py-2 rounded-lg bg-pink-500 text-white font-bold"
//                   onClick={handleSend}
//                 >
//                   Send
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div
//               className={`flex flex-col justify-center p-4 transition-colors duration-500 ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}
//               style={{ minHeight: "200px", maxHeight: "fit-content" }}
//             >
//               Select a buyer to start chatting
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SellerChatDashboard;
import { useState, useEffect, useRef, useContext } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { MdVerified } from "react-icons/md";
import { fireDB } from "../../fireabase/FirebaseConfig";
import myContext from "../../context/data/myContext";
import { IoArrowBackCircleSharp } from "react-icons/io5";

function SellerChatDashboard() {
  const sellerData = JSON.parse(localStorage.getItem("user"));
  const sellerId = sellerData?.uid;

  const { user, mode } = useContext(myContext);

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeBuyer, setActiveBuyer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const chatRef = useRef(null);

  // Fetch chats
  useEffect(() => {
    if (!sellerId) return;

    const chatsCollection = collection(fireDB, "chats");
    const q = query(chatsCollection, orderBy("chatId"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allChats = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((chat) => chat.id.includes(sellerId));

      setChats(allChats);
    });

    return () => unsubscribe();
  }, [sellerId]);

  // Fetch messages
  useEffect(() => {
    if (!activeChat) return;

    const messagesCollection = collection(
      fireDB,
      "chats",
      activeChat,
      "messages",
    );

    const q = query(messagesCollection, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(msgs);

      setTimeout(() => {
        chatRef.current?.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    });

    return () => unsubscribe();
  }, [activeChat]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat || !activeBuyer) return;

    const chatDocRef = doc(fireDB, "chats", activeChat);

    await setDoc(chatDocRef, { chatId: activeChat }, { merge: true });

    const messagesCollection = collection(
      fireDB,
      "chats",
      activeChat,
      "messages",
    );

    await addDoc(messagesCollection, {
      senderId: sellerId,
      receiverId: activeBuyer.uid,
      text: newMessage.trim(),
      timestamp: Date.now(),
    });

    setNewMessage("");
  };

  const getBuyer = (uid) => user?.find((u) => u.uid === uid);

  // Filtered chats based on search
  const filteredChats = chats.filter((chat) => {
    const buyerUid = chat.id.replace(`_${sellerId}`, "");
    const buyer = getBuyer(buyerUid);
    const buyerName = buyer?.name || "";
    return buyerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div
      className={`flex h-screen w-full transition-colors duration-500 ${mode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* ================= BUYER LIST ================= */}
      <div
        className={` ${activeChat ? "hidden sm:block" : "block"} w-full sm:w-64 border-r overflow-y-auto ${mode === "dark" ? "border-gray-700" : "border-gray-300"}`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex flex-col gap-3 ${mode === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {sellerData?.name?.charAt(0).toUpperCase() || "S"}
              </span>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-1">
                <span
                  className={`font-bold text-base ${mode === "dark" ? "text-gray-200" : "text-gray-800"}`}
                >
                  {sellerData?.name || "Seller"} Chats
                </span>
                <MdVerified
                  className={
                    sellerData?.verified
                      ? "text-blue-500 text-xs sm:text-sm"
                      : "text-gray-400 text-xs sm:text-sm"
                  }
                />
              </div>
              <span className="text-xs text-gray-500">
                Manage your buyer conversations
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div
            className={`flex items-center px-3 py-2 rounded-lg ${mode === "dark" ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-700"}`}
          >
            <input
              type="text"
              placeholder="Search buyers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 bg-transparent outline-none text-base ${mode === "dark" ? "placeholder-gray-400" : "placeholder-gray-500"}`}
              style={{ fontSize: "16px" }}
            />
          </div>
        </div>

        {filteredChats.length === 0 && (
          <p
            className={`p-4 text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            No chats found
          </p>
        )}

        {filteredChats.map((chat) => {
          const buyerUid = chat.id.replace(`_${sellerId}`, "");
          const buyer = getBuyer(buyerUid);
          const buyerName = buyer?.name || "Unknown";
          const isActive = activeChat === chat.id;

          return (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChat(chat.id);
                setActiveBuyer({
                  uid: buyerUid,
                  name: buyerName,
                  verified: true,
                });
              }}
              className={`p-3 border-b cursor-pointer flex items-center gap-3 transition ${isActive ? "bg-pink-500 text-white" : mode === "dark" ? "border-gray-700 hover:bg-gray-800 text-gray-200" : "border-gray-200 hover:bg-gray-100 text-gray-800"}`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {buyerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-sm">{buyerName}</span>
                <span className="text-xs opacity-70 line-clamp-1">
                  Start conversation with {buyerName}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= CHAT PANEL ================= */}
      <div
        className={`flex flex-col h-full ${activeChat ? "flex-1 w-full" : "hidden sm:flex flex-[3.5]"}`}
      >
        {activeChat && activeBuyer ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700">
              <button
                className="sm:hidden flex items-center justify-center p-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 bg-white dark:bg-gray-800"
                onClick={() => {
                  setActiveChat(null);
                  setActiveBuyer(null);
                }}
              >
                <IoArrowBackCircleSharp size={35} className="text-green-500" />
              </button>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {activeBuyer.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span
                    className={`font-bold text-sm ${mode === "dark" ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {activeBuyer.name}
                  </span>
                  <MdVerified className="text-blue-500 text-xs" />
                </div>
                <span className="text-xs text-gray-500">
                  {activeBuyer.verified ? "Verified Buyer" : "Buyer"}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatRef}
              className={`flex-1 overflow-y-auto p-4 space-y-2 ${mode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
            >
              {messages.length === 0 && (
                <p className="text-center text-gray-400 text-sm">
                  No messages yet
                </p>
              )}
              {messages.map((msg) => {
                const isSeller = msg.senderId === sellerId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isSeller ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-[85%] sm:max-w-[70%] break-words ${isSeller ? "bg-pink-500 text-white rounded-tr-none" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none"}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div
              className={`p-3 flex gap-2 border-t sticky bottom-0 ${mode === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-300 bg-white"}`}
            >
              <input
                type="text"
                placeholder={`Message ${activeBuyer.name}`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className={`flex-1 px-3 py-3 text-base rounded-xl outline-none ${mode === "dark" ? "bg-gray-800 text-gray-200 placeholder-gray-400" : "bg-gray-100 text-gray-800 placeholder-gray-500"}`}
                style={{ fontSize: "16px" }}
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 rounded-lg bg-pink-500 text-white font-bold"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div
            className={`flex flex-col justify-center items-center flex-1 w-full h-screen text-center px-4 ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            <h2 className="text-xl font-semibold mb-2">
              👋 Hello {sellerData?.name || "Seller"}
            </h2>
            <p className="text-sm sm:text-base">
              Select a buyer to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerChatDashboard;
