import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FaLeaf, FaPhoneAlt, FaShippingFast } from "react-icons/fa";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { nav, process, products, reasons, stats, testimonials } from "./data/content";
import heroImage from "./assets/hero-final.png";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  const [quoteForm, setQuoteForm] = useState({
    companyName: "",
    email: "",
    moq: "",
    projectDetails: "",
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");

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
    const tiltNodes = Array.from(document.querySelectorAll(".tilt3d"));
    const cleanupFns = tiltNodes.map((node) => {
      const handleMove = (event) => {
        const rect = node.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 12;
        const rotateX = (0.5 - py) * 12;
        node.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      };

      const handleLeave = () => {
        node.style.transform = "";
      };

      node.addEventListener("mousemove", handleMove);
      node.addEventListener("mouseleave", handleLeave);
      return () => {
        node.removeEventListener("mousemove", handleMove);
        node.removeEventListener("mouseleave", handleLeave);
      };
    });

    return () => cleanupFns.forEach((fn) => fn());
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
    document.body.style.overflow = selectedProduct ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProduct]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  useEffect(() => {
    if (!toastOpen) return undefined;
    const timeoutId = setTimeout(() => setToastOpen(false), 2800);
    return () => clearTimeout(timeoutId);
  }, [toastOpen]);

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

  const showToast = (message) => {
    setToastMessage(message);
    setToastOpen(false);
    requestAnimationFrame(() => setToastOpen(true));
  };

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleQuoteSubmit = (event) => {
    event.preventDefault();
    const { companyName, email, moq, projectDetails } = quoteForm;
    if (!companyName.trim() || !email.trim() || !moq.trim() || !projectDetails.trim()) {
      showToast("Please fill all quote request fields.");
      return;
    }
    if (!isValidEmail(email)) {
      showToast("Please enter a valid business email address.");
      return;
    }
    showToast("Quote request sent. Our team will contact you soon.");
    setQuoteForm({ companyName: "", email: "", moq: "", projectDetails: "" });
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    const { name, email, message } = contactForm;
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast("Please complete all contact fields.");
      return;
    }
    if (!isValidEmail(email)) {
      showToast("Please enter a valid email address.");
      return;
    }
    showToast("Message sent successfully. We will reply shortly.");
    setContactForm({ name: "", email: "", message: "" });
  };

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    if (!newsletterEmail.trim() || !isValidEmail(newsletterEmail)) {
      showToast("Please enter a valid email for newsletter signup.");
      return;
    }
    showToast("Thanks for subscribing to Kriscel Footwear updates.");
    setNewsletterEmail("");
  };

  return (
    <div className="premium-shell relative overflow-hidden">
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/25 backdrop-blur-2xl">
        <nav className="mx-auto flex w-full max-w-[90rem] items-center justify-between px-4 py-4 md:px-6">
          <h1 className="flex items-center gap-2 font-display text-xl sm:text-2xl">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-sand/70 bg-white/5 text-sm text-sand">
              KF
            </span>
            <span>Kriscel Footwear</span>
          </h1>
          <div className="flex items-center gap-2">
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

      <section id="home" className="site-section hero relative pt-[81px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="hero-stage tilt3d h-full w-full overflow-hidden border-y border-white/15 bg-[#ece5d8]"
        >
          <img
            src={heroImage}
            alt="Premium shoes manufacturer hero banner"
            className="hero-image block h-auto w-full object-contain"
          />
        </motion.div>
      </section>

      <main className="relative z-[2] mx-auto w-full max-w-[90rem] space-y-16 px-4 py-14 sm:space-y-20 sm:py-16 md:space-y-24 md:py-20 md:px-6">
        <section id="about" className="site-section reveal grid gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div className="card tilt3d p-6" key={s.label}>
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
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <div key={step} className="card tilt3d p-5">
                <p className="text-sand">0{i + 1}</p>
                <h4 className="mt-2 font-semibold">{step}</h4>
              </div>
            ))}
          </div>
        </section>

        <section id="wholesale" className="site-section reveal grid gap-5 md:grid-cols-3">
          {reasons.map((item) => (
            <div className="card tilt3d p-6" key={item}>
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
          <form className="card grid gap-4 p-6" onSubmit={handleQuoteSubmit}>
            <input
              className="rounded-xl bg-white/10 p-3"
              placeholder="Company Name"
              value={quoteForm.companyName}
              onChange={(event) => setQuoteForm((prev) => ({ ...prev, companyName: event.target.value }))}
            />
            <input
              className="rounded-xl bg-white/10 p-3"
              placeholder="Email"
              value={quoteForm.email}
              onChange={(event) => setQuoteForm((prev) => ({ ...prev, email: event.target.value }))}
            />
            <input
              className="rounded-xl bg-white/10 p-3"
              placeholder="MOQ Required"
              value={quoteForm.moq}
              onChange={(event) => setQuoteForm((prev) => ({ ...prev, moq: event.target.value }))}
            />
            <textarea
              className="rounded-xl bg-white/10 p-3"
              rows="4"
              placeholder="Project Details"
              value={quoteForm.projectDetails}
              onChange={(event) => setQuoteForm((prev) => ({ ...prev, projectDetails: event.target.value }))}
            />
            <button type="submit" className="luxury-btn-primary">Request Manufacturing Quote</button>
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
          <form className="card grid gap-4 p-6" onSubmit={handleContactSubmit}>
            <input
              className="rounded-xl bg-white/10 p-3"
              placeholder="Name"
              value={contactForm.name}
              onChange={(event) => setContactForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <input
              className="rounded-xl bg-white/10 p-3"
              placeholder="Email"
              value={contactForm.email}
              onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))}
            />
            <textarea
              className="rounded-xl bg-white/10 p-3"
              rows="6"
              placeholder="Message"
              value={contactForm.message}
              onChange={(event) => setContactForm((prev) => ({ ...prev, message: event.target.value }))}
            />
            <button type="submit" className="luxury-btn-primary">Send Message</button>
          </form>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/40 px-6 py-12">
        <div className="mx-auto grid w-full max-w-[90rem] gap-8 px-4 md:grid-cols-4 md:px-6">
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
            <form onSubmit={handleNewsletterSubmit}>
              <input
                className="mt-3 w-full rounded-xl bg-white/10 p-2"
                placeholder="Your email"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
              />
            </form>
          </div>
          <div className="text-sm text-ivory/70">© 2026 Kriscel Footwear. All rights reserved.</div>
        </div>
      </footer>

      <ProductModal
        product={selectedProduct}
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
      <Toast message={toastMessage} open={toastOpen} />
    </div>
  );
}








