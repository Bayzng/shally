import { useState, useEffect, useContext } from "react";
import myContext from "../../context/data/myContext";

function LoadingOverlay() {
  const { mode } = useContext(myContext); // ✅ get mode from context
  const fullText = "AllMart Store"; // text to display
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 150; // ms per letter

    const typeInterval = setInterval(() => {
      setDisplayedText(fullText.slice(0, currentIndex + 1));
      currentIndex++;

      if (currentIndex === fullText.length) {
        clearInterval(typeInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-[9999] transition-colors duration-500 ${
        mode === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <p
        className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider transition-colors duration-500 ${
          mode === "dark" ? "text-gray-200" : "text-gray-700"
        }`}
      >
        {displayedText}
        <span className="animate-blink">🛒</span>
      </p>

      <style jsx>{`
        .animate-blink {
          display: inline-block;
          margin-left: 2px;
          width: 1ch;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default LoadingOverlay;
