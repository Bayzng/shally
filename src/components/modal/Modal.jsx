import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-500 py-3 rounded-xl text-white font-semibold tracking-wide hover:opacity-90 transition duration-300 shadow-md hover:shadow-lg"
      >
        Buy Now
      </button>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
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
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center px-4 sm:px-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-400"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 text-center shadow-2xl transform transition-all">
                {/* Header */}
                <Dialog.Title className="text-2xl font-bold text-white mb-2">
                  Payment Notice 💳
                </Dialog.Title>

                {/* Content */}
                <p className="text-sm text-gray-200 mb-2">
                  Our online payment system is temporarily unavailable.
                </p>
                <p className="text-sm text-gray-300 mb-6">
                  Please continue your purchase securely via WhatsApp checkout.
                </p>

                {/* Checkout Button */}
                <a
                  href="https://wa.me/8111634621"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-xl transition duration-300"
                >
                  <FaWhatsapp className="text-xl" />
                  Proceed to WhatsApp Checkout
                </a>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-5 text-sm text-gray-300 hover:text-white transition duration-300"
                >
                  Cancel
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
