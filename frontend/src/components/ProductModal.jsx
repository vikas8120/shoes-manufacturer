import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegStar } from "react-icons/fa";
import { HiX } from "react-icons/hi";

export default function ProductModal({ product, open, onClose }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && product ? (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-black/65 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="card max-h-[90vh] w-full max-w-3xl overflow-auto p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="section-subtitle !mb-1">{product.category}</p>
                <h4 className="text-2xl font-semibold">{product.name} Shoes</h4>
                <p className="mt-2 flex items-center gap-1 text-sand">
                  <FaRegStar /> {product.rating.toFixed(1)}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close product details"
                className="rounded-full border border-white/20 bg-white/5 p-2 transition hover:border-sand/70 hover:text-sand"
              >
                <HiX size={22} />
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-leather/70 to-black">
                {product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" /> : null}
              </div>
              <div>
                <p className="text-ivory/80">{product.description}</p>
                <div className="mt-4 space-y-2 text-sm text-ivory/80">
                  <p><span className="text-sand">Material:</span> {product.material}</p>
                  <p><span className="text-sand">Price:</span> INR {product.price.toLocaleString("en-IN")}</p>
                  <p><span className="text-sand">MOQ:</span> {product.moq} pairs</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" className="luxury-btn-secondary hover:scale-[1.02] active:scale-[0.98]">
                    Request Quote
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

