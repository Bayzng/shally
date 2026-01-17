import { useContext } from "react";
import myContext from "../../context/data/myContext";
import { Link } from "react-router-dom";
import { MdEmail, MdPhone, MdChat } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

function Footer() {
  const context = useContext(myContext);
  const { mode } = context;

  return (
    <footer

    
    
      className={`body-font ${
  mode === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-200"
      }`}
    >
      <hr/>
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left">

          {/* Customer Support */}
          <div>
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider text-pink-600">
              Customer Support
            </h2>
            <ul className="flex flex-col gap-4">
              {/* Email */}
              <li className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer">
                <MdEmail className="text-pink-600 text-2xl" />
                <a
                  href="mailto:support@allmart.com"
                  className="font-medium hover:text-pink-700 transition-colors"
                >
                  support@allmart.com
                </a>
              </li>

              {/* Phone */}
              <li className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer">
                <MdPhone className="text-pink-600 text-2xl" />
                <a
                  href="tel:+2348012345678"
                  className="font-medium hover:text-pink-700 transition-colors"
                >
                  +234 81-4479-6373
                </a>
              </li>

              {/* WhatsApp */}
              <li className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer">
                <FaWhatsapp className="text-green-500 text-2xl" />
                <a
                  href="https://wa.me/08144796373"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-green-600 transition-colors"
                >
                  WhatsApp Chat
                </a>
              </li>

              {/* Live Chat */}
              <li className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer">
                <MdChat className="text-pink-600 text-2xl" />
                <span className="font-medium">Live Chat: 9am - 6pm</span>
              </li>
            </ul>
          </div>

          {/* Payment Options */}
          {/* <div className="flex justify-center lg:justify-end items-center col-span-1 sm:col-span-2 lg:col-span-1">
            <img
              src="https://ecommerce-sk.vercel.app/pay.png"
              alt="Payment Options"
              className="w-52 sm:w-64 object-contain"
            />
          </div> */}

          {/* Optional extra sections if needed */}
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
          mode === "dark" ? "bg-gray-800" : "bg-gray-700"
        } border-t border-gray-300`}
      >
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left space-y-4 sm:space-y-0">

          {/* Brand + Email */}
          <div>
            <h1 className="text-xl font-bold tracking-wide mb-1 sm:mb-0">Allmart</h1>
            <a
              href="mailto:allmart@gmail.com"
              className="text-sm hover:text-pink-600 transition-colors block sm:inline"
            >
              allmart@gmail.com
            </a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center sm:justify-end flex-wrap gap-5 mt-4 sm:mt-0">
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
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
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
