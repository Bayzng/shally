import { useContext, useState, useRef, useEffect } from "react";
import myContext from "../../context/data/myContext";
import { FiSearch, FiX } from "react-icons/fi";

// import ProductCard from "../productCard/ProductCard";
// // import ProductCard from "../ProductCard"; // replace with your product card component

function Filter() {
  const {
    mode,
    searchkey,
    setSearchkey,
    filterType,
    setFilterType,
    filterPrice,
    setFilterPrice,
    product,
  } = useContext(myContext);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);

  const categoryRef = useRef(null);
  const priceRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setOpenCategory(false);
      }
      if (priceRef.current && !priceRef.current.contains(e.target)) {
        setOpenPrice(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Unique categories & prices
  const categories = [...new Set(product.map((p) => p.category))];
  const uniquePrices = [...new Set(product.map((p) => p.price))].sort(
    (a, b) => a - b,
  );

  // Price ranges for dropdown
  const priceRanges = [
    // { label: "Under ₦5,000", value: "0-5000" },
    // { label: "₦5,000 – ₦20,000", value: "5000-20000" },
    // { label: "₦20,000 – ₦50,000", value: "20000-50000" },
    // { label: "₦50,000+", value: "50000+" },
  ];

  const hasActiveFilters = searchkey || filterType || filterPrice;

  const resetFilters = () => {
    setSearchkey("");
    setFilterType("");
    setFilterPrice("");
  };

  // ======= FILTER LOGIC =======
  const filteredProducts = (product || []).filter((p) => {
    const price = Number(p.price || 0);
    const fp = filterPrice?.toString() || "";

    const matchesSearch =
      p?.name?.toLowerCase().includes(searchkey.toLowerCase()) || false;

    const matchesCategory = filterType ? p?.category === filterType : true;

    let matchesPrice = true;
    if (fp) {
      if (fp.includes("-")) {
        const [min, max] = fp.split("-").map(Number);
        matchesPrice = price >= min && price <= max;
      } else if (fp.endsWith("+")) {
        const min = Number(fp.replace("+", ""));
        matchesPrice = price >= min;
      } else {
        matchesPrice = price === Number(fp);
      }
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <section className="container mx-auto px-4 mt-6">
      <div
        className={`rounded-xl border shadow-sm ${
          mode === "dark"
            ? "bg-gray-900 border border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        {/* SEARCH */}
        <div
          className="p-5 border-b"
          style={{ borderColor: mode === "dark" ? "#4B5563" : "#D1D5DB" }}
        >
          <div className="relative w-full">
            <input
              type="text"
              value={searchkey}
              onChange={(e) => setSearchkey(e.target.value)}
              placeholder="Search products, brands or categories"
              className={`w-full pl-12 pr-12 py-3 rounded-lg text-base outline-none transition
        ${
          mode === "dark"
            ? "bg-gray-900 border border-gray-700 text-white placeholder-gray-400"
            : "bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500"
        }`}
            />

            {/* Left Search Icon */}
            <FiSearch
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                mode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
              size={20}
            />

            {/* Right Clear Icon - only ONE */}
            {searchkey.length > 0 && (
              <FiX
                onClick={() => setSearchkey("")}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer transition
                ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}
                size={17}
              />
            )}
          </div>
        </div>

        {/* BASIC FILTERS */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* CATEGORY DROPDOWN */}
          <div ref={categoryRef} className="relative">
            <button
              onClick={() => {
                setOpenCategory(!openCategory);
                setOpenPrice(false);
              }}
              className={`w-full px-4 py-3 rounded-lg text-sm border flex justify-between items-center ${
                mode === "dark"
                  ? "bg-gray-900 border border-gray-700 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-300 placeholder-gray-500"
              }`}
            >
              {filterType || "All Categories"}
              <span className="text-xs">▾</span>
            </button>

            {openCategory && (
              <div
                className={`absolute z-20 mt-2 w-full max-h-60 overflow-y-auto rounded-lg shadow-lg border ${
                  mode === "dark"
                    ? "bg-gray-900 border border-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 placeholder-gray-500"
                }`}
              >
                <button
                  onClick={() => {
                    setFilterType("");
                    setOpenCategory(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex justify-between items-center transition
                    ${
                      mode === "dark"
                        ? "text-white bg-gray-800 hover:bg-gray-700"
                        : "text-gray-800 bg-white hover:bg-gray-100"
                    }`}
                >
                  All Categories
                </button>

                {categories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setFilterType(cat);
                      setOpenCategory(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      filterType === cat ? "font-semibold text-pink-600" : ""
                    } ${mode === "dark" ? "hover:bg-gray-500" : "hover:bg-gray-300"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRICE RANGE DROPDOWN */}
          <div ref={priceRef} className="relative">
            <button
              onClick={() => {
                setOpenPrice(!openPrice);
                setOpenCategory(false);
              }}
              className={`w-full px-4 py-3 rounded-lg text-sm border flex justify-between items-center ${
                mode === "dark"
                  ? "bg-gray-900 border border-gray-700 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-300 placeholder-gray-500"
              }`}
            >
              {priceRanges.find((p) => p.value === filterPrice)?.label ||
                "Any Price"}
              <span className="text-xs">▾</span>
            </button>

            {openPrice && (
              <div
                className={`absolute z-20 mt-2 w-full max-h-60 overflow-y-auto rounded-lg shadow-lg border ${
                  mode === "dark"
                    ? "bg-gray-900 border border-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 placeholder-gray-500"
                }`}
              >
                <button
                  onClick={() => {
                    setFilterPrice("");
                    setOpenPrice(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex justify-between items-center transition
                    ${
                      mode === "dark"
                        ? "text-white bg-gray-800 hover:bg-gray-700"
                        : "text-gray-800 bg-white hover:bg-gray-100"
                    }`}
                >
                  All Prices
                </button>

                {priceRanges.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setFilterPrice(p.value);
                      setOpenPrice(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      filterPrice === p.value
                        ? "font-semibold text-pink-600"
                        : ""
                    } ${mode === "dark" ? "hover:bg-gray-500" : "hover:bg-gray-300"}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm font-medium text-pink-600 hover:underline"
            >
              {showAdvanced ? "Hide filters" : "More filters"}
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-sm text-red-500 hover:text-red-500"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ADVANCED FILTERS */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            showAdvanced ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-5 pb-6 grid md:grid-cols-2 gap-6">
            {/* CATEGORY CHIPS */}
            <div>
              <h4
                className={`text-sm font-semibold mb-3 ${
                  mode === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Categories
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setFilterType(filterType === cat ? "" : cat)}
                    className={`px-3 py-2 text-sm rounded-lg border transition ${
                      filterType === cat
                        ? "bg-pink-600 text-white border-pink-600"
                        : mode === "dark"
                          ? "bg-gray-900 border border-gray-700 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 placeholder-gray-500"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* PRICE BUTTONS - DYNAMIC EXACT PRICES */}
            <div>
              <h4
                className={`text-sm font-semibold mb-3 ${
                  mode === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Exact Prices
              </h4>

              <div className="flex flex-wrap gap-2">
                {uniquePrices.map((price, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setFilterPrice(
                        filterPrice === price.toString()
                          ? ""
                          : price.toString(),
                      )
                    }
                    className={`px-3 py-2 text-sm rounded-lg border transition ${
                      filterPrice === price.toString()
                        ? "bg-green-600 text-white border-green-600"
                        : mode === "dark"
                          ? "bg-gray-900 border border-gray-700 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 placeholder-gray-500"
                    }`}
                  >
                    ₦{price.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======= RENDER FILTERED PRODUCTS ======= */}
      {/* <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products found.
          </p>
        )}
      </div> */}
    </section>
  );
}

export default Filter;
