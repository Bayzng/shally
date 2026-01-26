import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/heroSection/HeroSection";
import Filter from "../../components/filter/Filter";
import ProductCard from "../../components/productCard/ProductCard";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import Confetti from "react-confetti";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [confetti, setConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [loading, setLoading] = useState(true);

  // Welcome modal
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const modalShown = sessionStorage.getItem("welcomeModalShown");

    if (user?.name && !modalShown) {
      setUserName(user.name);
      setShowModal(true);
      setConfetti(true);

      setTimeout(() => {
        setConfetti(false);
        setShowModal(false);
      }, 5000);

      sessionStorage.setItem("welcomeModalShown", "true");
    }
  }, []);

  // Window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setConfetti(false);
  };

  return (
    <Layout>
      {/* ================== WELCOME MODAL ================== */}
      <Transition.Root show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
          {confetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              numberOfPieces={200}
              gravity={0.3}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 40,
                pointerEvents: "none",
              }}
            />
          )}

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700 relative z-60">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Welcome, {userName}!
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Welcome to{" "}
                    <span className="font-semibold text-pink-500">AllMart</span>
                    , the marketplace for everyone. Explore amazing products and
                    deals!
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-2 inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-lg transition"
                  >
                    Let's Go
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* ================== HOME CONTENT ================== */}
      <div>
        <HeroSection />
        <Filter />

        {/* FULLSCREEN LOADING OVERLAY */}
        {loading && <LoadingOverlay />}

        {/* ProductCard signals loading complete when all products/images loaded */}
        <ProductCard onLoaded={() => setLoading(false)} />
      </div>
    </Layout>
  );
}

export default Home;
