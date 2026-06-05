import { useEffect, useMemo, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { api, getImageUrl } from "../utils/api";
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeHero, setActiveHero] = useState(0);
  const categoryRef = useRef(null);

  const scrollCategories = (direction) => {
    if (!categoryRef.current) return;

    categoryRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  const heroSlides = [
    {
      image: hero1,
      eyebrow: "100% AYURVEDIC & NATURAL",
      titleLine1: "Nature’s Healing",
      titleLine2: "Better You",
      text: "Pure Ayurvedic products crafted with ancient wisdom for modern wellness.",
      button: "Shop Now",
    },
    {
      image: hero2,
      eyebrow: "HERBAL WELLNESS, NATURAL GOODNESS",
      titleLine1: "Pure Ingredients",
      titleLine2: "Powerful Results",
      text: "Handpicked herbs. Pure formulations. Visible results for a healthier you.",
      button: "Explore Now",
    },
    {
      image: hero3,
      eyebrow: "LIVE NATURALLY, LIVE BETTER",
      titleLine1: "Daily Care",
      titleLine2: "Naturally",
      text: "Natural supplements to support your immunity, energy and overall well-being.",
      button: "Shop Collection",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % heroSlides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    const [catRes, productRes, testiRes] = await Promise.allSettled([
      api.get("/categories"),
      api.get("/products"),
      api.get("/testimonials"),
    ]);

    if (catRes.status === "fulfilled") {
      setCategories(catRes.value.data.categories || []);
    }

    if (productRes.status === "fulfilled") {
      setProducts(productRes.value.data.products || []);
    }

    if (testiRes.status === "fulfilled") {
      setTestimonials(testiRes.value.data.testimonials || []);
    }
  };

  const bestSellers = useMemo(() => {
    const filtered = products.filter((item) => item.isBestSeller);
    return filtered.length ? filtered.slice(0, 4) : products.slice(0, 4);
  }, [products]);

  const newArrivals = useMemo(() => {
    const filtered = products.filter((item) => item.isNewArrival);
    return filtered.length ? filtered.slice(0, 4) : products.slice(0, 4);
  }, [products]);

  const categoryList = categories.length ? categories : [];

  return (
    <div className="min-h-screen bg-[#fffaf4] text-[#24110a] overflow-hidden">
      <Navbar />
      {/* <div className="h-[115px] md:h-[120px]" /> */}

      {/* HERO */}
      <section className="relative h-[300px] sm:h-[380px] md:h-[430px] lg:h-[460px] overflow-hidden bg-[#f8f5ef]">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              activeHero === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover object-right"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f3]/82 via-[#faf8f3]/45 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto h-full px-6 lg:px-8 flex items-center">
             <div className="max-w-[500px] md:ml-6">
                <p className="text-[#103b22] font-black tracking-widest text-xs md:text-sm uppercase flex items-center gap-2 mb-4">
                  <span className="text-[#5f7f32]">🌿</span>
                  {slide.eyebrow}
                </p>

                <h1 className="text-[32px] sm:text-[42px] md:text-[52px] lg:text-[60px] leading-[1.05] font-extrabold">
                  <span className="block text-[#0b3d22]">
                    {slide.titleLine1}
                  </span>

                  <span className="block text-[#6f8135]">
                    {slide.titleLine2}
                  </span>
                </h1>

                <div className="w-16 h-[2px] bg-[#6f8135] my-5" />

                <p className="text-[#4f5f55] text-sm md:text-base leading-7 max-w-[430px]">
                  {slide.text}
                </p>

                <Link
                  to="/products"
                  className="mt-6 inline-flex items-center gap-3 bg-[#155b37] text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:scale-105 transition duration-300"
                >
                  {slide.button}
                  <span className="text-xl leading-none">→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveHero(index)}
              className={`h-3 rounded-full transition-all ${
                activeHero === index ? "w-8 bg-[#155b37]" : "w-3 bg-white/80"
              }`}
            />
          ))}
        </div>
      </section>

      {/* CATEGORY */}
      <section
        id="categories"
        className="bg-gradient-to-b from-[#fffaf4] to-[#f8f4ed] py-10 md:py-14"
      >
        <h2 className="text-center text-4xl md:text-6xl font-extrabold text-[#1f120c] mb-4">
          Shop by Category
        </h2>

        <p className="text-center text-[#7b5b46] max-w-2xl mx-auto mb-12">
          Explore our carefully curated herbal wellness categories.
        </p>

        {categoryList.length ? (
          <div className="relative px-4 md:px-8">
            {/* LEFT BUTTON */}
            <button
              onClick={() =>
                categoryRef.current?.scrollBy({
                  left: -300,
                  behavior: "smooth",
                })
              }
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-[#eadccb] items-center justify-center hover:bg-[#f8f5ef]"
            >
              <ChevronLeft size={22} />
            </button>

            {/* RIGHT BUTTON */}
            <button
              onClick={() =>
                categoryRef.current?.scrollBy({
                  left: 300,
                  behavior: "smooth",
                })
              }
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-[#eadccb] items-center justify-center hover:bg-[#f8f5ef]"
            >
              <ChevronRight size={22} />
            </button>

            <div ref={categoryRef} className="overflow-x-hidden scrollbar-hide">
              <div className="flex gap-5 md:gap-10 w-max animate-[categoryScroll_55s_linear_infinite] hover:[animation-play-state:paused]">
                {[...categoryList, ...categoryList].map((cat, index) => (
                  <Link
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    key={`${cat._id}-${index}`}
                    className="min-w-[120px] md:min-w-[170px] text-center block group"
                  >
                    <div className="w-[75px] h-[75px] md:w-[135px] md:h-[135px] mx-auto rounded-full overflow-hidden bg-white shadow-sm border border-[#eadccb] group-hover:scale-105 transition duration-300">
                      {cat.image ? (
                        <img
                          src={getImageUrl(cat.image)}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          🌿
                        </div>
                      )}
                    </div>

                    <h3 className="mt-3 md:mt-5 text-sm md:text-lg font-bold text-[#2b1a13] whitespace-nowrap">
                      {cat.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmptyBox text="Admin se categories add karne ke baad yaha circular category row show hogi." />
        )}
      </section>

      {/* BEST SELLERS */}
      <ProductSection
        id="best"
        title="Our Best Sellers"
        linkText="View All Products →"
        products={bestSellers}
        emptyText="Admin se best seller products add karne ke baad yaha show honge."
      />

      {/* NEW ARRIVALS */}
      <section id="new" className="bg-[#fff7ee]">
        <ProductSection
          title="New Arrivals"
          linkText="Shop Collection →"
          products={newArrivals}
          emptyText="Admin se new arrival products add karne ke baad yaha show honge."
        />
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#f8f5ef] py-10 md:py-14 overflow-hidden">
        <h2 className="text-center text-3xl md:text-4xl font-black mb-8 md:mb-14 px-4">
          Customer stories that feel real
        </h2>

        {testimonials.length ? (
          <div className="space-y-8">
            <TestimonialRow testimonials={testimonials} />
            <TestimonialRow testimonials={testimonials} reverse />
          </div>
        ) : (
          <EmptyBox text="Admin se testimonials add karne ke baad yaha moving testimonial cards show honge." />
        )}
      </section>

      <Footer />
    </div>
  );
};

const ProductSection = ({ id, title, linkText, products, emptyText }) => {
  return (
    <section
      id={id}
      className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-14"
    >
      <div className="flex justify-between items-end border-b border-[#eadccb] pb-5 mb-8">
        <h2 className="text-3xl md:text-5xl font-extrabold leading-none">
          {title}
        </h2>
        <a className="text-[#0d6b42] text-sm md:text-base font-bold">
          {linkText}
        </a>
      </div>

      {products.length ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyBox text={emptyText} />
      )}
    </section>
  );
};

const TestimonialRow = ({ testimonials, reverse }) => {
  const list = [...testimonials, ...testimonials];

  return (
    <div className="overflow-hidden">
      <div
        className={`flex gap-6 w-max ${
          reverse
            ? "animate-[marqueeReverse_35s_linear_infinite]"
            : "animate-[marquee_35s_linear_infinite]"
        }`}
      >
        {list.map((item, index) => (
          <div
            key={`${item._id}-${index}`}
            className="w-[280px] md:w-[380px] bg-white rounded-3xl p-7 shadow-lg border border-[#efe7de]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-[#e6ead6] flex items-center justify-center font-black text-[#1f5b3a]">
                {item.image ? (
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  item.name?.charAt(0)
                )}
              </div>

              <div>
                <h4 className="font-black">{item.name}</h4>
                <p className="text-[#7a6255]">
                  {item.role || "Verified Buyer"}
                </p>
              </div>
            </div>

            <p className="text-[#7a6255] mt-5 leading-relaxed">
              “{item.message}”
            </p>

            <p className="text-[#ffc400] mt-4">
              {"★".repeat(item.rating || 5)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmptyBox = ({ text }) => (
  <div className="max-w-5xl mx-auto bg-white border border-dashed border-[#d8c8b8] rounded-2xl p-12 text-center text-[#6f5b4d]">
    {text}
  </div>
);

export default Home;
