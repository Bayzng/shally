import { useEffect, useRef, useState } from "react";

export default function PullToRefreshWrapper({ children }) {
  const startY = useRef(0);
  const [isTouching, setIsTouching] = useState(false);

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        setIsTouching(true);
      }
    };

    const handleTouchMove = (e) => {
      if (!isTouching) return;
      const diff = e.touches[0].clientY - startY.current;
      if (diff > 100) {
        window.location.reload(); // refresh page
      }
    };

    const handleTouchEnd = () => setIsTouching(false);

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isTouching]);

  return <>{children}</>;
}