import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { api } from "../utils/api";
import hero2 from "../assets/hero1.png";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory("all");
    }
  }, [searchParams]);

  const loadData = async () => {
    const [productRes, categoryRes] = await Promise.allSettled([
      api.get("/products"),
      api.get("/categories"),
    ]);

    if (productRes.status === "fulfilled") {
      setProducts(productRes.value.data.products || []);
    }

    if (categoryRes.status === "fulfilled") {
      setCategories(categoryRes.value.data.categories || []);
    }
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== "all") {
      list = list.filter((item) => item.category?.name === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.shortDescription?.toLowerCase().includes(q) ||
          item.category?.name?.toLowerCase().includes(q) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    list = list.filter((item) => Number(item.price) <= Number(maxPrice));

    if (sort === "price-low") {
      list.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      list.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (sort === "new") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [products, selectedCategory, search, sort, maxPrice]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearch("");
    setSort("default");
    setMaxPrice(10000);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#24110a]">
      <Navbar />

      <section
        className="relative h-[180px] sm:h-[240px] md:h-[300px] lg:h-[360px] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(21,91,55,.35), rgba(21,91,55,.35)), url(${hero2})`,
        }}
      >
        <div className="text-center px-4 max-w-4xl mx-auto">
          <span className="inline-flex px-3 sm:px-5 py-2 rounded-full bg-white/20 border border-white/30 font-bold tracking-widest text-[11px] sm:text-sm">
            🌿 HERBAL STORE
          </span>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black mt-4 md:mt-6">
            Our Products
          </h1>

          <p className="mt-3 md:mt-5 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto text-white/90">
            Explore organic, pure and healthy herbal products curated directly
            from nature.
          </p>

          <p className="mt-4 md:mt-6 text-sm sm:text-base text-white/80">
            Home › <b>Our Products</b>
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-8 md:py-14">
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}
        <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-8 items-start">
          <aside
  className={`
  ${showFilters ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0
  fixed lg:sticky
  lg:top-[110px]
  top-0 left-0
  w-[85%] sm:w-[380px] lg:w-auto
  h-screen lg:max-h-[calc(100vh-130px)]
  z-50
  bg-white
  border-r lg:border
  border-[#eadccb]
  shadow-xl lg:shadow-sm
  rounded-none lg:rounded-2xl
  p-5 lg:p-6
  overflow-y-auto
  transition-all duration-300
`}
>
            <div className="flex items-center justify-between border-b border-[#eadccb] pb-5">
              <h2 className="text-xl sm:text-2xl font-black">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-[#155b37] font-bold underline"
              >
                Clear All
              </button>
            </div>

            <div className="mt-7">
              <h3 className="font-black mb-4">Categories</h3>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={selectedCategory === "all"}
                    onChange={() => {
                      setSelectedCategory("all");
                      setSearchParams({});
                    }}
                    className="accent-[#a65312]"
                  />
                  <span className="text-[#5f4639] font-medium">All</span>
                </label>

                {categories.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      checked={selectedCategory === cat.name}
                      onChange={() => {
                        setSelectedCategory(cat.name);

                        setSearchParams({
                          category: cat.name,
                        });

                        if (window.innerWidth < 1024) {
                          setShowFilters(false);
                        }
                      }}
                      className="accent-[#a65312]"
                    />
                    <span className="text-[#5f4639] font-medium">
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-black mb-4">Price Range</h3>

              <div className="flex items-center justify-between font-bold mb-3">
                <span>₹0</span>
                <span>₹{maxPrice}</span>
              </div>

              <input
                type="range"
                min="0"
                max="10000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-[#a65312]"
              />
            </div>
          </aside>

          <main>
            <div className="bg-white rounded-2xl border border-[#eadccb] shadow-sm p-4 sm:p-5 mb-6 md:mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[#6d4d3b] text-sm sm:text-base md:text-lg">
                  Showing <b>{filteredProducts.length}</b> results
                </p>

                <button
                  onClick={() => setShowFilters((prev) => !prev)}
                  className="lg:hidden w-10 h-10 rounded-xl border border-[#eadccb] flex items-center justify-center"
                >
                  {showFilters ? (
                    <X size={20} />
                  ) : (
                    <SlidersHorizontal size={20} />
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center h-11 sm:h-12 w-full md:w-[280px] lg:w-[320px] border border-[#eadccb] rounded-xl px-4">
                  <Search size={18} className="text-[#8a6b58]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-transparent outline-none px-3 text-sm sm:text-base"
                  />
                </div>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-11 sm:h-12 w-full md:w-auto border border-[#eadccb] rounded-xl px-4 outline-none bg-white text-sm sm:text-base"
                >
                  <option value="default">Default Sorting</option>
                  <option value="new">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {filteredProducts.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-[#eadccb] rounded-2xl p-6 sm:p-10 md:p-12 text-center">
                <h3 className="text-2xl font-black">No products found</h3>
                <p className="text-[#7a6255] mt-2">
                  Search ya filter change karke try karo.
                </p>
              </div>
            )}
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
