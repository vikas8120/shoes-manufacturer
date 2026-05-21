import { AnimatePresence, motion } from "framer-motion";

export default function Toast({ message, open }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed right-4 top-24 z-[95] rounded-xl border border-sand/50 bg-black/80 px-4 py-3 text-sm text-ivory shadow-luxe"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

