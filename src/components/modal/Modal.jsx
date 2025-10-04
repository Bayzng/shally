import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full bg-violet-600 py-2 rounded-lg text-white font-bold"
      >
        Buy Now
      </button>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
                <Dialog.Title className="text-lg font-bold text-gray-800">
                  Notice
                </Dialog.Title>
                <p className="mt-4 text-sm text-gray-700">
                  Dear valued customer, our online payment integration is
                  currently unavailable.
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  Kindly complete your purchase through our WhatsApp checkout.
                </p>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-6 w-full bg-violet-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-violet-700"
                >
                  <a href="https://wa.me/8111634621" target="_blank" rel="noopener noreferrer">
                    Payment Checkout
                  </a>
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
