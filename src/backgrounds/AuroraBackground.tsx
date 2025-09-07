// AuroraBackground.tsx
import { motion } from "framer-motion";

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-slate-900">
      <motion.div
        className="absolute w-[60vw] h-[60vw] bg-purple-500/40 rounded-full blur-3xl"
        animate={{ x: [0, 200, -200, 0], y: [0, -200, 200, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[50vw] h-[50vw] bg-blue-500/40 rounded-full blur-3xl"
        animate={{ x: [0, -150, 150, 0], y: [0, 150, -150, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
