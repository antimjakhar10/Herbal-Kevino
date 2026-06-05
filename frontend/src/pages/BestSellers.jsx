import { useEffect, useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { api } from "../utils/api";
import hero2 from "../assets/hero1.png";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await api.get("/products");
    setProducts(data.products || []);
  };

  const filteredProducts = useMemo(() => {
    let list = products.filter((item) => item.isBestSeller);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(

        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.category?.name?.toLowerCase().includes(q) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (sort === "price-low") list.sort((a, b) => a.price - b.price);
    if (sort === "price-high") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === "new") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return list;
  }, [products, search, sort]);

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#24110a]">
      <Navbar />

      <section
              className="relative h-[180px] sm:h-[240px] md:h-[300px] lg:h-[360px] bg-cover bg-center flex items-center justify-center text-white"
              style={{
                backgroundImage: `linear-gradient(rgba(21,91,55,.35), rgba(21,91,55,.35)), url(${hero2})`,
              }}
            >
        <div className="text-center px-4">
          <span className="inline-flex px-3 sm:px-5 py-2 rounded-full bg-white/20 border border-white/30 font-bold tracking-widest text-[11px] sm:text-sm">
            ⭐ TOP RATED HERBALS
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black mt-4 md:mt-6">Best Sellers</h1>
          <p className="mt-3 md:mt-5 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto text-white/90">
            Customer favourite herbal products loved for quality and results.
          </p>
          <p className="mt-4 md:mt-6 text-sm sm:text-base text-white/80">
  Home › <b>Best Sellers</b>
</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-8 md:py-14">
        <div className="bg-white rounded-2xl border border-[#eadccb] shadow-sm p-4 sm:p-5 mb-6 md:mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#fff3d2] text-[#b87500] flex items-center justify-center">
              <Star size={22} fill="currentColor" />
            </div>
            <p className="text-[#6d4d3b] text-sm sm:text-base md:text-lg">
              Showing <b>{filteredProducts.length}</b> best sellers
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
            <div className="flex items-center h-11 sm:h-12 w-full md:w-[280px] lg:w-[320px] border border-[#eadccb] rounded-xl px-4">
              <Search size={18} className="text-[#8a6b58]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search best sellers..."
                className="w-full bg-transparent outline-none px-3 text-sm sm:text-base"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 sm:h-12 w-full md:w-auto border border-[#eadccb] rounded-xl px-4 outline-none bg-white text-sm sm:text-base"
            >
              <option value="rating">Top Rated</option>
              <option value="new">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filteredProducts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-[#eadccb] rounded-2xl p-6 sm:p-10 md:p-12 text-center">
            <h3 className="text-2xl font-black">No best sellers found</h3>
            <p className="text-[#7a6255] mt-2">
              Admin se products me Best Seller enable karo.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default BestSellers;