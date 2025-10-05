import { Fragment, useContext, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiSun } from "react-icons/fi";
import { BsFillCloudSunFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logo.png";
import myContext from "../../context/data/myContext";

function Navbar() {
  const { mode, toggleMode } = useContext(myContext);
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const cartItems = useSelector((state) => state.cart);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const isDark = mode === "dark";

  // ✅ Handle cart click (prevent if empty)
  const handleCartClick = (e) => {
    if (cartItems.length === 0) {
      e.preventDefault();
      toast.info("🛒 Your cart is empty!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: isDark ? "dark" : "light",
      });
      return;
    }
  };

  return (
    <div className="bg-white sticky top-0 z-50">
      <ToastContainer />
      {/* Mobile Menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel
                className={`relative flex w-full max-w-xs flex-col overflow-y-auto pb-12 shadow-xl ${
                  isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                }`}
              >
                <div className="flex px-4 pb-2 pt-28">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <RxCross2 size={24} />
                  </button>
                </div>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  <Link to="/allproducts" className="block font-medium">
                    All Products
                  </Link>

                  {user && (
                    <Link to="/order" className="block font-medium">
                      Order
                    </Link>
                  )}

                  {user?.user?.email === "leetsmeets@gmail.com" && (
                    <Link to="/dashboard" className="block font-medium">
                      Admin
                    </Link>
                  )}

                  {user ? (
                    <button
                      onClick={logout}
                      className="block font-medium text-left cursor-pointer"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link to="/signup" className="block font-medium">
                      Signup
                    </Link>
                  )}
                </div>

                <div className="border-t border-gray-200 px-4 py-6">
                  <div className="flex items-center space-x-2">
                    <img
                      src="https://symbl-cdn.com/i/webp/0b/e342fb927a24503ca913445ad97323.webp"
                      alt="Nigeria flag"
                      className="w-5"
                    />
                    <span className="font-medium">NIGERIA</span>
                  </div>
                </div>

                <div className="px-4 py-4">
                  {user ? (
                    <h2 className="text-green-600 font-semibold text-lg">
                      👋 Welcome back, smart shopper!
                      <span className="block text-gray-600 text-sm">
                        Great to see you again — amazing deals are waiting for
                        you!
                      </span>
                    </h2>
                  ) : (
                    <h3 className="text-red-500 text-sm font-medium">
                      🚀 Create your account today and start exploring our
                      exclusive collections.
                      <span className="block text-gray-600">
                        Discover trending products, unbeatable discounts, and a
                        shopping experience you’ll love.
                      </span>
                    </h3>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop Navbar */}
      <header className={`${isDark ? "bg-gray-900 text-white" : "bg-white"}`}>
        <p
          className={`flex h-10 items-center justify-center text-sm font-medium ${
            isDark ? "bg-gray-700 text-white" : "bg-green-600 text-white"
          }`}
        >
          Get free delivery on orders over ₦50,000
        </p>

        <nav
          className={`px-4 sm:px-6 lg:px-8 shadow-md ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <div className="flex h-16 items-center justify-between">
            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center">
              <button
                className={`lg:hidden p-2 rounded-md ${
                  isDark ? "bg-gray-700 text-white" : "bg-white text-gray-600"
                }`}
                onClick={() => setOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>

              <div className="flex items-center space-x-1">
                <img
                  src={logo}
                  alt="Shally Logo"
                  className="w-12 h-12 object-contain"
                />
                <Link to="/" className="text-2xl font-bold">
                  Shally
                </Link>
              </div>
            </div>

            {/* Right: Links, Theme, Cart */}
            <div className="flex items-center space-x-6">
              {user?.user?.email === "leetsmeets@gmail.com" && (
                <Link to="/dashboard">Admin</Link>
              )}

              {user ? (
                <button
                  onClick={logout}
                  className="hidden md:block font-medium text-left cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <Link to="/signup" className="hidden md:block font-medium">
                  Signup
                </Link>
              )}

              {/* Theme Toggle */}
              <button onClick={toggleMode}>
                {isDark ? (
                  <BsFillCloudSunFill size={24} />
                ) : (
                  <FiSun size={24} />
                )}
              </button>

              {/* ✅ Cart: Only opens when not empty */}
              {user && (
                <Link
                  to={cartItems.length > 0 ? "/cart" : "#"}
                  onClick={handleCartClick}
                  className="flex items-center space-x-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                  <span>{cartItems.length}</span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;
