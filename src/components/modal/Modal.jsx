import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 🛍 Trigger Button (Centered & Shorter) */}
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 px-8 rounded-xl 
            text-white font-semibold tracking-wide hover:from-indigo-700 hover:to-purple-700 
            transition-all duration-300 shadow-md hover:shadow-xl 
            focus:outline-none focus:ring-4 focus:ring-indigo-400"
        >
          Buy Now
        </button>
      </div>

      {/* 💬 Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-400"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          {/* 🧱 Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-400"
              enterFrom="opacity-0 translate-y-10 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-10 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-sm sm:max-w-md rounded-3xl 
                  bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                  text-white p-6 sm:p-8 border border-gray-700 shadow-2xl 
                  transform transition-all"
              >
                {/* 🧭 Header */}
                <Dialog.Title className="text-2xl sm:text-3xl font-bold mb-2 text-center">
                  Payment Notice 💳
                </Dialog.Title>
                <p className="text-gray-300 text-sm sm:text-base text-center mb-6">
                  Our online payment system is temporarily unavailable. Please
                  continue your purchase securely via WhatsApp checkout.
                </p>

                {/* ✅ WhatsApp Checkout */}
                <div className="flex flex-col items-center gap-4">
                  <a
                    href="https://wa.me/8111634621"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto 
                      bg-green-500 hover:bg-green-600 text-white font-medium 
                      py-3 px-6 rounded-xl transition duration-300 shadow-lg 
                      hover:shadow-green-400/40"
                  >
                    <FaWhatsapp className="text-2xl" />
                    Proceed to WhatsApp Checkout
                  </a>
                </div>

                {/* ❌ Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-6 w-full sm:w-auto mx-auto block 
                  text-gray-400 hover:text-white text-sm sm:text-base 
                  font-medium transition duration-300"
                >
                  Cancel
                </button>

                {/* 🕒 Delivery Info */}
                <div className="mt-6 border-t border-gray-700 pt-4 text-center">
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    🚚 Delivery will be made within{" "}
                    <span className="font-semibold text-white">
                      7 business days
                    </span>
                    . You can choose delivery to your provided address or one of
                    our collection points in{" "}
                    <span className="font-semibold text-white">
                      Kwara, Lagos, Ogun, Osun, or Oyo
                    </span>
                    .
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
