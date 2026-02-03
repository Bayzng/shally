import { useContext } from "react";
import myContext from "../../context/data/myContext";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import logo from "../../assets/logo.png";

function Footer() {
  const { mode } = useContext(myContext);

  return (
    <footer
      className={`${
        mode === "dark"
          ? "bg-gray-900 text-gray-300"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                // <img style={{backgroundColor: "white"}}
                // src={"https://dummyimage.com/50x50/000/fff&text=A"}
                src={logo}
                alt="AllMart Logo"
                className={`${
                  mode === "dark" ? "bg-white" : "bg-white"
                } w-12 h-12 rounded-lg`}
                // className="w-12 h-12 rounded-lg"
              />
              <h1 className="text-2xl font-bold">AllMart</h1>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              AllMart is an all-in-one marketplace where a single account lets
              you buy and sell seamlessly connecting quality products, trusted
              sellers, and smooth shopping anytime, anywhere.
            </p>

            {/* Socials */}
            <div className="flex gap-4 mt-6">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="p-3 rounded-full bg-pink-600 text-white hover:bg-pink-700 transition"
                  >
                    <Icon />
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Categories</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="#" className="hover:text-pink-600">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-pink-600">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-pink-600">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-pink-600">
                  Beauty
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-pink-600">
                  Gift Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Quick Links</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/shop" className="hover:text-pink-600">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-pink-600">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-pink-600">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-pink-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-pink-600">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Stay Updated</h2>
            <p className="text-sm mb-4">
              Subscribe to get updates on new products and special offers.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800"
              />
              <button
                type="submit"
                className="bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm">
            Secure payments powered by trusted providers
          </p>

          <div className="flex gap-4 flex-wrap bg-black-400 justify-center p-2 rounded-md">
            {["Visa", "Master", "PayPal", "Crypto"].map((item, i) => (
              <div
                key={i}
                className="
                flex items-center justify-center
                w-[72px] h-[44px]
                bg-white text-black
                rounded-md
                text-xs font-semibold
                tracking-wide
              "
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className={`${
          mode === "dark" ? "bg-gray-800" : "bg-gray-900"
        } text-gray-300`}
      >
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p>© {new Date().getFullYear()} AllMart. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-pink-500">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-pink-500">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
