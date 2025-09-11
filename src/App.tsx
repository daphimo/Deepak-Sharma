import { motion } from "framer-motion";

function App() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-white px-6 overflow-hidden">
      {/* Background */}

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-2xl text-left"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold">
          Hi, I'm <span className="text-blue-400">Deepak Sharma</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-300">
          🚀 Frontend Developer | Shopify Expert | UI/UX Enthusiast
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <motion.a
            href="#projects"
            className="px-6 py-3 rounded-full bg-blue-500 text-white font-semibold shadow-lg hover:bg-blue-600 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.a>
          <motion.a
            href="#contact"
            className="px-6 py-3 rounded-full border-2 border-blue-400 text-blue-400 font-semibold hover:bg-blue-500 hover:text-white transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Me
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}

export default App;
