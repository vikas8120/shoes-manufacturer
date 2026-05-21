import { AnimatePresence, motion } from "framer-motion";
import { HiX } from "react-icons/hi";

export default function CartDrawer({ open, items, onClose, onIncrease, onDecrease, onRemove, onClear }) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed right-0 top-0 z-[85] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#151110] p-5 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h4 className="text-xl font-semibold">Your Cart</h4>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/20 bg-white/5 p-2 transition hover:border-sand/70 hover:text-sand"
              >
                <HiX size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {items.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-ivory/75">Your cart is empty.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-medium">{item.name} Shoes</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button type="button" className="luxury-btn-secondary !px-3 !py-1.5" onClick={() => onDecrease(item.id)}>
                        -
                      </button>
                      <span className="min-w-8 text-center">{item.quantity}</span>
                      <button type="button" className="luxury-btn-secondary !px-3 !py-1.5" onClick={() => onIncrease(item.id)}>
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-sm text-ivory/70 underline decoration-sand/60 underline-offset-4 transition hover:text-sand"
                        onClick={() => onRemove(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="mb-3 text-sm text-ivory/80">Total items: {totalItems}</p>
              <button type="button" onClick={onClear} className="luxury-btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-50" disabled={!items.length}>
                Clear Cart
              </button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

