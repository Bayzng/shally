import React, { useContext, useEffect, useState } from "react";
import myContext from "../../context/data/myContext";
import { useNavigate } from "react-router-dom";
import { FaStar, FaUserCircle } from "react-icons/fa";

function Ads() {
  const { mode } = useContext(myContext);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  // Auto show / hide every 7s
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50
        w-[70%] sm:w-[320px] md:w-[360px]
        rounded-3xl p-6 shadow-2xl border
        backdrop-blur-md bg-opacity-80
        transition-transform duration-700 transform
        hover:scale-105 hover:shadow-3xl
        animate-fadeIn
        ${
          mode === "dark"
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-950 text-white border-gray-700"
            : "bg-gradient-to-r from-white via-gray-100 to-gray-50 text-gray-900 border-gray-200"
        }`}
    >
      {/* Close Button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-3 right-3 text-xl text-red-500 hover:text-red-400 transition-all duration-300"
      ></button>

      {/* Header */}
      <div className="flex items-center mb-3">
        <FaStar className="text-yellow-400 mr-2 text-xl animate-pulse" />
        <h3 className="text-2xl font-extrabold tracking-wide">Top Creators</h3>
      </div>

      {/* Description */}
      <p className="text-sm opacity-90 mb-5">
        Join top creators and showcase your products in{" "}
        <span className="font-semibold">Marketplace Picks!</span>
      </p>

      {/* Avatars (optional visual flair) */}
      <div className="flex -space-x-3 mb-5">
        <FaUserCircle className="text-3xl text-purple-500 border-2 border-white rounded-full" />
        <FaUserCircle className="text-3xl text-pink-500 border-2 border-white rounded-full" />
        <FaUserCircle className="text-3xl text-red-500 border-2 border-white rounded-full" />
        <FaUserCircle className="text-3xl text-red-500 border-2 border-white rounded-full" />
        <FaUserCircle className="text-3xl text-red-500 border-2 border-white rounded-full" />
      </div>

      {/* Call to action */}
      <button
        onClick={() => navigate("/creator")}
        className="w-full py-3 rounded-full font-bold
            border-2 border-pink-500 text-pink-500
            hover:bg-pink-500 hover:text-white
            hover:shadow-lg hover:shadow-pink-500/40
            transition-all duration-300"
            >
        Launch Now
      </button>
    </div>
  );
}

export default Ads;
