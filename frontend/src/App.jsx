import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FaLeaf, FaPhoneAlt, FaShippingFast } from "react-icons/fa";
import { HiOutlineMenuAlt3, HiShoppingBag, HiX } from "react-icons/hi";
import { nav, process, products, reasons, stats, testimonials } from "./data/content";
import heroImage from "./assets/shoesimage.jpg";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";

gsap.registerPlugin(ScrollTrigger);

const NAV_TARGETS = {
  Home: "home",
  About: "about",
  Products: "products",
  Manufacturing: "manufacturing",
  "Custom Orders": "custom-orders",
  Wholesale: "wholesale",
  Sustainability: "sustainability",
  Contact: "contact",
};

const CART_STORAGE_KEY = "veloura_cart";

const Counter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 40);
    const id = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(id);
      } else {
        setCount(start);
      }
    }, 30);

    return () => clearInterval(id);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    gsap.utils.toArray(".reveal").forEach((section) => {
      gsap.from(section, {
        y: 40,
        duration: 0.85,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 86%",
          once: true,
        },
      });
    });
  }, []);

  useEffect(() => {
    const sectionIds = Object.values(NAV_TARGETS);
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { root: null, rootMargin: "-35% 0px -45% 0px", threshold: [0.2, 0.45, 0.7] }
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setCartItems(parsed);
    } catch {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => setToastMessage(""), 1800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    document.body.style.overflow = isCartOpen || selectedProduct ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, selectedProduct]);

  const totalCartItems = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const handleNavClick = (item) => {
    const targetId = NAV_TARGETS[item];
    const el = targetId ? document.getElementById(targetId) : null;
    if (!el) return;

    const headerOffset = 88;
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
    setMenuOpen(false);
  };

  const isActiveLink = (item) => activeSection === NAV_TARGETS[item];

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    setToastMessage("Product added to cart");
  };

  const changeQuantity = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="relative overflow-hidden">
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/35 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="flex items-center gap-2 font-display text-2xl">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-sand/70 bg-white/5 text-sm text-sand">
              KF
            </span>
            <span>Kriscel Footwear</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open cart"
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full border border-white/20 bg-white/5 p-2 transition hover:border-sand/70 hover:text-sand"
            >
              <HiShoppingBag size={22} />
              {totalCartItems > 0 ? (
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-sand px-1.5 text-center text-xs font-semibold text-obsidian">
                  {totalCartItems}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              className="rounded-full border border-white/20 bg-white/5 p-2 transition hover:border-sand/70 hover:text-sand md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <HiX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
            </button>
          </div>
          <ul className="hidden gap-6 text-sm md:flex">
            {nav.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`rounded-full px-3 py-1.5 transition ${
                    isActiveLink(item)
                      ? "bg-white/10 text-sand shadow-[0_0_0_1px_rgba(215,196,164,0.45)]"
                      : "text-ivory/85 hover:text-sand"
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <AnimatePresence>
          {menuOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="grid gap-2 border-t border-white/10 bg-black/85 p-4 backdrop-blur-xl md:hidden"
            >
              {nav.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className={`w-full rounded-xl px-3 py-2 text-left transition ${
                      isActiveLink(item)
                        ? "bg-white/10 text-sand shadow-[0_0_0_1px_rgba(215,196,164,0.45)]"
                        : "text-ivory/90 hover:bg-white/5 hover:text-sand"
                    }`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </header>

      <section
        id="home"
        className="site-section hero relative flex min-h-screen items-center px-6 pt-[96px] text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1 }}>
            <p className="section-subtitle">Luxury Shoe Manufacturing</p>
            <h2 className="font-display text-5xl leading-tight md:text-7xl">Crafting Premium Footwear for the World</h2>
            <p className="mt-5 max-w-xl text-lg text-ivory/95">
              Luxury Shoe Manufacturing with Innovation, Comfort and Precision.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => handleNavClick("Products")}
                className="luxury-btn-primary hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore Collection
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("Wholesale")}
                className="luxury-btn-secondary hover:scale-[1.02] active:scale-[0.98]"
              >
                Become a Partner
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="relative z-[2] mx-auto max-w-7xl space-y-24 px-6 py-20">
        <section id="about" className="site-section reveal grid gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div className="card p-6" key={s.label}>
              <p className="text-3xl font-bold text-sand">
                <Counter value={s.value} />
              </p>
              <p className="mt-1 text-ivory/75">{s.label}</p>
            </div>
          ))}
        </section>

        <section id="products" className="site-section reveal">
          <p className="section-subtitle">Featured Products</p>
          <h3 className="section-title">Luxury Collections</h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={setSelectedProduct}
              />
            ))}
          </div>
        </section>

        <section id="manufacturing" className="site-section reveal">
          <p className="section-subtitle">Manufacturing Process</p>
          <h3 className="section-title">Precision at Every Step</h3>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <div key={step} className="card p-5">
                <p className="text-sand">0{i + 1}</p>
                <h4 className="mt-2 font-semibold">{step}</h4>
              </div>
            ))}
          </div>
        </section>

        <section id="wholesale" className="site-section reveal grid gap-5 md:grid-cols-3">
          {reasons.map((item) => (
            <div className="card p-6" key={item}>
              <h4 className="text-xl font-semibold">{item}</h4>
              <p className="mt-2 text-ivory/70">
                Built for premium quality and global consistency across every production batch.
              </p>
            </div>
          ))}
        </section>

        <section id="custom-orders" className="site-section reveal grid gap-8 lg:grid-cols-2">
          <div>
            <p className="section-subtitle">Custom Shoe Manufacturing</p>
            <h3 className="section-title">OEM and ODM for Global Brands</h3>
            <p className="mt-4 text-ivory/80">
              MOQ starts from 500 pairs per design. Bulk production, private labeling, material customization, and
              packaging personalization available.
            </p>
          </div>
          <form className="card grid gap-4 p-6">
            <input className="rounded-xl bg-white/10 p-3" placeholder="Company Name" />
            <input className="rounded-xl bg-white/10 p-3" placeholder="Email" />
            <input className="rounded-xl bg-white/10 p-3" placeholder="MOQ Required" />
            <textarea className="rounded-xl bg-white/10 p-3" rows="4" placeholder="Project Details" />
            <button className="luxury-btn-primary">Request Manufacturing Quote</button>
          </form>
        </section>

        <section className="site-section reveal">
          <p className="section-subtitle">Testimonials</p>
          <h3 className="section-title">Trusted by Premium Clients</h3>
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 3500 }} pagination={{ clickable: true }} className="mt-7">
            {testimonials.map((t) => (
              <SwiperSlide key={t.name}>
                <div className="card p-8">
                  <p className="text-xl">"{t.quote}"</p>
                  <p className="mt-4 text-sand">{t.name}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section
          id="sustainability"
          className="site-section reveal section-surface rounded-3xl grid gap-6 p-8 lg:grid-cols-2"
        >
          <div>
            <p className="section-subtitle">Sustainability</p>
            <h3 className="section-title">Greener Footwear Future</h3>
            <p className="mt-4 text-ivory/80">
              Eco-friendly tanning, low-emission machinery, reduced water usage, and responsible sourcing power our
              sustainability roadmap.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="glass rounded-2xl p-5">
              <FaLeaf className="text-sand" size={28} />
              <p className="mt-3">Sustainable Leather</p>
            </div>
            <div className="glass rounded-2xl p-5">
              <FaShippingFast className="text-sand" size={28} />
              <p className="mt-3">Carbon Reduction Logistics</p>
            </div>
            <div className="glass rounded-2xl p-5">
              <FaPhoneAlt className="text-sand" size={28} />
              <p className="mt-3">Transparent Partnerships</p>
            </div>
            <div className="glass rounded-2xl p-5">
              <FaLeaf className="text-sand" size={28} />
              <p className="mt-3">Waste Reuse Program</p>
            </div>
          </div>
        </section>

        <section id="contact" className="site-section reveal grid gap-8 lg:grid-cols-2">
          <div className="card p-6">
            <h4 className="text-2xl font-semibold">Contact</h4>
            <p className="mt-3 text-ivory/80">hello@kriscelfootwear.com</p>
            <p className="text-ivory/80">+1 (212) 555-0188</p>
            <p className="text-ivory/80">89 Leather District, Milan Trade Hub</p>
            <div className="mt-4 h-56 rounded-2xl bg-white/10 p-4 text-ivory/70">Google Map Integration Area</div>
          </div>
          <form className="card grid gap-4 p-6">
            <input className="rounded-xl bg-white/10 p-3" placeholder="Name" />
            <input className="rounded-xl bg-white/10 p-3" placeholder="Email" />
            <textarea className="rounded-xl bg-white/10 p-3" rows="6" placeholder="Message" />
            <button className="luxury-btn-primary">Send Message</button>
          </form>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/40 px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
          <div>
            <h5 className="flex items-center gap-2 font-display text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-sand/70 bg-white/5 text-sm text-sand">
                KF
              </span>
              <span>Kriscel Footwear</span>
            </h5>
            <p className="mt-2 text-sm text-ivory/70">Premium footwear manufacturing for B2B and B2C global markets.</p>
          </div>
          <div>
            <p className="font-semibold">Quick Links</p>
            <ul className="mt-2 space-y-1 text-sm text-ivory/75">
              {nav.slice(0, 5).map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold">Newsletter</p>
            <input className="mt-3 w-full rounded-xl bg-white/10 p-2" placeholder="Your email" />
          </div>
          <div className="text-sm text-ivory/70">© 2026 Kriscel Footwear. All rights reserved.</div>
        </div>
      </footer>

      <CartDrawer
        open={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onIncrease={(productId) => changeQuantity(productId, 1)}
        onDecrease={(productId) => changeQuantity(productId, -1)}
        onRemove={removeFromCart}
        onClear={clearCart}
      />

      <ProductModal
        product={selectedProduct}
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />

      <Toast message={toastMessage} open={Boolean(toastMessage)} />
    </div>
  );
}

