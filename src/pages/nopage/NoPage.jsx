import { motion } from "framer-motion";

function NoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white text-center p-6 relative">
      {/* Animated 404 */}
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-9xl font-extrabold drop-shadow-lg"
      >
        404
      </motion.h1>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl mt-4 font-semibold"
      >
        Oops! The page you’re looking for doesn’t exist.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-2 text-lg text-pink-100"
      >
        It might have been moved or deleted.
      </motion.p>

      {/* Button */}
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="https://www.allmart.com.ng"
        className="mt-8 px-8 py-3 bg-white text-purple-700 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
      >
        Go Back Home
      </motion.a>

      {/* Decorative glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.8 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)]"
      />
    </div>
  );
}

export default NoPage;
