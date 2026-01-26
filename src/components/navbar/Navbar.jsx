import { Fragment, useContext, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiSun } from "react-icons/fi";
import { BsFillCloudSunFill } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { MdShoppingCartCheckout } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { IoMdLogOut } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { SiCoinmarketcap } from "react-icons/si";
import { FaPlusCircle } from "react-icons/fa";


import logo from "../../assets/logo.png";
import myContext from "../../context/data/myContext";

function Navbar() {
  const { mode, toggleMode } = useContext(myContext);
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const cartItems = useSelector((state) => state.cart);


  const isDark = mode === "dark";

  const logout = () => {
  localStorage.removeItem("user");          // remove user info
  sessionStorage.removeItem("welcomeModalShown"); // reset modal flag
  window.location.href = "/";
};


  const handleCartClick = (e) => {
    if (cartItems.length === 0) {
      e.preventDefault();
      toast.error("🛒 Your cart is empty!", {
        position: "top-center",
        autoClose: 2000,
        theme: isDark ? "dark" : "light",
      });
    }
  };

  const isAdmin = user?.email === "admin@allmart.com"; // ✅ correct


  return (
    <div
      className={`sticky top-0 z-50 ${
        isDark ? "bg-gray-900" : "bg-white"
      } shadow-md`}
    >
     <Toaster />

      {/* ================= MOBILE MENU ================= */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
                className={`relative flex w-full max-w-xs flex-col overflow-y-auto pb-10 shadow-2xl ${
                  isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200/20">
                  <h2 className="text-lg font-bold">👋 Menu</h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-200/20 transition"
                  >
                    <RxCross2 size={22} />
                  </button>
                </div>

                {/* Navigation */}
                <div className="px-4 py-6 space-y-5 text-sm mt-10">
                  <h1  className="flex items-center gap-2 font-medium hover:text-pink-500 transition">
                    AllMart
                  </h1>
                  <hr className="border-gray-200/30" />
                  {user && !isAdmin ? (
                    <Link
                      to="/allproducts"
                      className="flex items-center gap-2 font-medium hover:text-pink-500 transition"
                    >
                      🛍️ All Products
                    </Link>
                  ) : (
                    <div className="rounded-xl bg-pink-50 dark:bg-gray-800 p-4 text-center space-y-2">
                      <h3 className="text-lg font-semibold">
                        👋 Welcome to Allmart Marketplace
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Discover amazing products, deals & creators 💖
                      </p>
                      <p className="text-xs text-gray-500">
                        🔐 Login or Signup to start shopping
                      </p>
                    </div>
                  )}
                  <hr className="border-gray-200/30" />
                  {user && !isAdmin && (
                    <Link
                      to="/user-dashboard"
                      className="flex items-center gap-2 font-medium hover:text-pink-500 transition"
                    >
                      <RiAdminFill size={22} /> My DashBoard
                    </Link>
                  )}

                  {/* <hr className="border-gray-200/30" /> */}

                  {user && !isAdmin && (
                    <>
                      <Link
                        to="/order-history"
                        className="flex items-center gap-2 font-medium hover:text-pink-500 transition"
                      >
                        <MdShoppingCartCheckout size={22}/> My Orders
                      </Link>

                      <Link
                        to="/creator"
                        className="flex items-center gap-2 font-medium hover:text-pink-500 transition"
                      >
                        <FaPlusCircle size={22}/> Add Product
                      </Link>

                      <Link
                        to="/my-products"
                        className="flex items-center gap-2 font-medium hover:text-pink-500 transition"
                      >
                        <SiCoinmarketcap size={22}/> My Products
                      </Link>

                      <hr className="border-gray-200/30" />
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 font-medium text-indigo-500 hover:text-indigo-600 transition"
                      >
                        🛠️ Admin Dashboard
                      </Link>
                      <hr className="border-gray-200/30" />
                    </>
                  )}

                  {/* Auth Action */}
                  {user ? (
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 font-semibold text-red-500 hover:text-red-600 transition w-full text-left"
                    >
                      <IoMdLogOut size={25}/> Logout
                    </button>
                  ) : (
                    <Link
                      to="/signup"
                      className="flex items-center gap-2 font-semibold text-green-500 hover:text-green-600 transition"
                    >
                      ✨ Signup
                    </Link>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* ================= NAVBAR ================= */}
      <header className={`${isDark ? "bg-gray-900 text-white" : "bg-white"}`}>
        <div
          className={`relative overflow-hidden h-10 ${
            isDark ? "bg-gray-700 text-white" : "bg-green-600 text-white"
          }`}
        >
          <p className="absolute whitespace-nowrap flex items-center h-10 text-sm font-medium animate-marquee px-4">
            🚧 AllMart is currently in development & test mode. Some features are not available yet 🚀
          </p>
        </div>

        <nav
          className={`px-4 sm:px-6 lg:px-8 shadow-md ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <div className="flex h-16 items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center space-x-2">
              <button
                className={`lg:hidden p-2 rounded-md ${
                  isDark ? "bg-gray-700 text-white" : "bg-white text-gray-600"
                }`}
                onClick={() => setOpen(true)}
              >
                <IoMenu size={20} />
              </button>

              <img src={logo} alt="Allmart Logo" className="w-10 h-10" />
              <Link to="/" className="text-xl font-bold">
                AllMart
              </Link>
            </div>

            {/* RIGHT — MOBILE ICONS */}
            <div className="flex items-center space-x-4 lg:hidden">
              {user && !isAdmin && (
                <Link to="/order-history">
                  <FaClipboardList size={20} />
                </Link>
              )}

              <button onClick={toggleMode}>
                {isDark ? (
                  <BsFillCloudSunFill size={20} />
                ) : (
                  <FiSun size={20} />
                )}
              </button>

              {user && (
                <Link
                  to={cartItems.length > 0 ? "/cart" : "#"}
                  onClick={handleCartClick}
                  className="relative"
                >
                  <FaShoppingCart size={20}/>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              )}
            </div>

            {/* DESKTOP LINKS */}
            <div className="hidden lg:flex items-center space-x-6">
              {user && !isAdmin && (
                <>
                  <Link to="/order-history" className="font-medium">
                    Orders
                  </Link>
                  <Link to="/creator" className="font-medium">
                    Add Product
                  </Link>
                  <Link to="/my-products" className="font-medium">
                    My Product
                  </Link>
                  <Link to="/user-dashboard" className="font-medium">
                    My Dashboard
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link to="/dashboard" className="font-medium">
                  Admin
                </Link>
              )}

              {user ? (
                <button onClick={logout} className="font-medium">
                  Logout
                </button>
              ) : (
                <Link to="/signup" className="font-medium">
                  Signup
                </Link>
              )}

              <button onClick={toggleMode}>
                {isDark ? (
                  <BsFillCloudSunFill size={22} />
                ) : (
                  <FiSun size={22} />
                )}
              </button>

              {user && (
                <Link
                  to={cartItems.length > 0 ? "/cart" : "#"}
                  onClick={handleCartClick}
                  className="flex items-center space-x-1"
                >
                  <FaShoppingCart /> <span>{cartItems.length}</span>
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
