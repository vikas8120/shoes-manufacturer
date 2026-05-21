import { FaRegStar } from "react-icons/fa";

export default function ProductCard({ product, onView }) {
  return (
    <article className="card group p-6 transition duration-300 hover:-translate-y-2">
      <div className="h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-leather/70 to-black">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : null}
      </div>
      <h4 className="mt-4 text-xl font-semibold">{product.name} Shoes</h4>
      <p className="mt-1 text-sm text-ivory/70">{product.category}</p>
      <p className="mt-2 text-lg font-semibold text-ivory">INR {product.price.toLocaleString("en-IN")}</p>
      <p className="mt-2 flex items-center gap-1 text-sand">
        <FaRegStar /> {product.rating.toFixed(1)}
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => onView(product)}
          className="luxury-btn-secondary !px-4 !py-2 hover:scale-[1.02] active:scale-[0.98]"
        >
          View
        </button>
      </div>
    </article>
  );
}

