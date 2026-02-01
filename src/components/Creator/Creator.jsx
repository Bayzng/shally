import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext } from "react";
import myContext from "../../context/data/myContext";
import Layout from "../layout/Layout";

function Creator() {
  const { mode } = useContext(myContext);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    },
  };

  return (
    <Layout>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          mode === "dark"
            ? "bg-[#181a1b] text-white"
            : "bg-gradient-to-br from-pink-50 via-white to-purple-50 text-gray-900"
        }`}
      >
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              variants={fadeInUp}
              className={`text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight ${
                mode === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Create. Upload. Sell.
              <motion.span
                className="block text-pink-600 mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6 } }}
              >
                Your Marketplace, Open to Everyone
              </motion.span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className={`mt-6 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed ${
                mode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Empowering anyone to upload products directly to the marketplace
              no barriers, no gatekeepers. Showcase your creations and reach buyers instantly.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/public-add-product"
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg text-sm sm:text-base md:text-lg transition-transform hover:-translate-y-1"
              >
                ➕ Add Product to Marketplace
              </Link>

              <Link
                to="/"
                className={`px-8 py-3 rounded-xl font-semibold border transition text-sm sm:text-base md:text-lg ${
                  mode === "dark"
                    ? "border-gray-600 text-gray-200 hover:bg-gray-800"
                    : "border-pink-600 text-pink-600 hover:bg-pink-50"
                } hover:-translate-y-1`}
              >
                Explore Marketplace
              </Link>
            </motion.div>
          </motion.div>

          {/* HERO IMAGE */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInScale}
          >
            <img
              src="https://images.unsplash.com/photo-1557821552-17105176677c"
              alt="Marketplace"
              className="rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </section>

        {/* FEATURES SECTION */}
        <section className={`${mode === "dark" ? "bg-[#1f2223]" : "bg-white"} py-20`}>
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4"
            >
              Why Creators Love This Marketplace
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-center mt-4 max-w-2xl mx-auto ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              } text-base sm:text-lg md:text-xl`}
            >
              Simple, powerful, and open — giving everyone equal opportunity to sell.
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mt-14 grid sm:grid-cols-2 md:grid-cols-3 gap-8"
            >
              {[
                { icon: "🌍", title: "Open for Everyone" },
                { icon: "⚡", title: "Fast Uploads" },
                { icon: "🎨", title: "Beautiful Listings" },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className={`p-6 rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-2 ${
                    mode === "dark" ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2">{feature.icon} {feature.title}</h3>
                  <p className={`mt-2 text-sm sm:text-base md:text-lg ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Anyone can upload products, get listed instantly, and attract buyers with image-rich cards.
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section className={`py-20 ${mode === "dark" ? "bg-[#181a1b]" : "bg-gradient-to-r from-purple-50 to-pink-50"}`}>
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12"
            >
              Marketplace Preview
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
                "https://images.unsplash.com/photo-1503602642458-232111445657",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
                "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
              ].map((img, i) => (
                <motion.img
                  key={i}
                  src={img}
                  alt="Product"
                  className="rounded-xl shadow-md hover:scale-105 transition-transform duration-500"
                  variants={fadeInUp}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-pink-600 text-white text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
          >
            Ready to Upload Your Product?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-lg sm:text-xl md:text-2xl opacity-90"
          >
            Join creators already selling on the marketplace today.
          </motion.p>

          <Link
            to="/public-add-product"
            className="inline-block mt-8 bg-white text-pink-600 px-10 py-4 rounded-2xl font-semibold shadow-lg hover:bg-gray-100 text-lg sm:text-xl md:text-2xl transition-transform hover:-translate-y-1"
          >
            Start Uploading Now 🚀
          </Link>
        </section>
      </div>
    </Layout>
  );
}

export default Creator;
