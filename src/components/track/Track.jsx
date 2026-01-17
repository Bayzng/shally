import { useContext } from "react";
import myContext from "../../context/data/myContext";

function Track() {
  const context = useContext(myContext);
  const { mode } = context;
  return (
    <div>
      <section>
        <div className="container mx-auto px-5 md:py-5">
          <div className="flex flex-wrap -m-4 text-center">
            <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
              <div
                className="border-2 hover:shadow-xl border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg"
                style={{
                  backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                  color: mode === "dark" ? "white" : "",
                }}
              >
                <svg
                  className="text-pink-600 w-12 h-12 mb-3 inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h18l-1.68 12.42A3 3 0 0116.34 18H7.66a3 3 0 01-2.98-2.58L3 3z"
                  />
                </svg>

                <h2
                  className="title-font font-medium text-lg text-gray-900"
                  style={{ color: mode === "dark" ? "white" : "" }}
                >
                  Quality Products
                </h2>
                <p className="leading-relaxed">
                  Discover top-notch products across fashion, beauty, and
                  lifestyle — all at unbeatable prices.
                </p>
              </div>
            </div>

            <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
              <div
                className="border-2 hover:shadow-xl border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg"
                style={{
                  backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                  color: mode === "dark" ? "white" : "",
                }}
              >
                <svg
                  className="text-pink-600 w-12 h-12 mb-3 inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 17V9a3 3 0 013-3h0a3 3 0 013 3v8m-4-5v3m-3-3h6m-3 0h0M5 13h.01M19 13h.01"
                  />
                </svg>

                <h2
                  className="title-font font-medium text-lg text-gray-900"
                  style={{ color: mode === "dark" ? "white" : "" }}
                >
                  Secure Shopping
                </h2>
                <p className="leading-relaxed">
                  Shop with confidence — all transactions are encrypted and 100%
                  secure at AllMart Store.
                </p>
              </div>
            </div>

            <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
              <div
                className="border-2 hover:shadow-xl border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg"
                style={{
                  backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                  color: mode === "dark" ? "white" : "",
                }}
              >
                <svg
                  className="text-pink-600 w-12 h-12 mb-3 inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v8m0 0H8m4 0h4m-4-8V4m0 4h4m-4 0H8"
                  />
                </svg>

                <h2
                  className="title-font font-medium text-lg text-gray-900"
                  style={{ color: mode === "dark" ? "white" : "" }}
                >
                  Fast Delivery
                </h2>
                <p className="leading-relaxed">
                  Enjoy quick and reliable delivery right to your doorstep —
                  wherever you are.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Track;
