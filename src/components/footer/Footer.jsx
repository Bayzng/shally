import { useContext } from "react";
import myContext from "../../context/data/myContext";
import { Link } from "react-router-dom";

function Footer() {
  const context = useContext(myContext);
  const { mode } = context;

  return (
    <footer
      className={`body-font ${
        mode === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {/* Top Section */}
      <hr/>
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 text-center sm:text-left">
          
          {/* Categories */}
          <div>
            <h2 className="text-lg font-semibold mb-4 uppercase tracking-wide">
              Categories
            </h2>
            <ul className="flex flex-row flex-wrap justify-center lg:flex-col lg:justify-start gap-4 text-sm sm:text-base">
              <li>
                <Link to="/" className="hover:text-pink-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-pink-600 transition-colors">
                  Order
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-pink-600 transition-colors">
                  Local for Vocal
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-pink-600 transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h2 className="text-lg font-semibold mb-4 uppercase tracking-wide">
              Customer Service
            </h2>
            <ul className="flex flex-row flex-wrap justify-center lg:flex-col lg:justify-start gap-4 text-sm sm:text-base">
              <li>
                <Link to="/" className="hover:text-pink-600 transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-pink-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-pink-600 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-lg font-semibold mb-4 uppercase tracking-wide">
              Services
            </h2>
            <ul className="flex flex-row flex-wrap justify-center lg:flex-col lg:justify-start gap-4 text-sm sm:text-base">
              <li>
                <Link to="/" className="hover:text-pink-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Section */}
          <div className="flex justify-center lg:justify-end items-center">
            <img
              src="https://ecommerce-sk.vercel.app/pay.png"
              alt="Payment Options"
              className="w-52 sm:w-64 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className={`w-full h-[1px] ${
          mode === "dark" ? "bg-gray-700" : "bg-gray-300"
        }`}
      ></div>

      {/* Bottom Section */}
      <div
        className={`${
          mode === "dark" ? "bg-gray-800" : "bg-gray-200"
        } border-t border-gray-300`}
      >
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left space-y-4 sm:space-y-0">
          {/* Brand + Email */}
          <div>
            <h1 className="text-xl font-bold tracking-wide mb-1 sm:mb-0">
              Shally
            </h1>
            <a
              href="mailto:shally@gmail.com"
              className="text-sm hover:text-pink-600 transition-colors block sm:inline"
            >
              shally@gmail.com
            </a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center sm:justify-end flex-wrap gap-5">
            <a href="#" className="hover:text-pink-600 transition-colors">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a href="#" className="hover:text-pink-600 transition-colors">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 8v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.48 4.48 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a href="#" className="hover:text-pink-600 transition-colors">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              </svg>
            </a>
            <a href="#" className="hover:text-pink-600 transition-colors">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx={4} cy={4} r={2} />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
