import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

import { useUserAuth } from "../context/UserAuthContext";

const Wishlist = ({ embedded = false }) => {
  const { wishlist } = useUserAuth();

  return (
    <div className={`${embedded ? "" : "min-h-screen"} bg-[#fffaf5]`}>
      {!embedded && <Navbar />}

      <section className={`${embedded ? "" : "max-w-7xl mx-auto"} px-4 py-8`}>
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1f120c]">My Wishlist</h1>

          <p className="text-[#7b5b46] mt-3">
            Your saved herbal wellness products
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white border border-[#eadccb] rounded-[30px] py-24 text-center">
            <div className="text-7xl">💚</div>

            <h2 className="text-3xl font-black mt-6">Wishlist is empty</h2>

            <p className="text-[#7b5b46] mt-4">Save products you love</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {!embedded && <Footer />}
    </div>
  );
};

export default Wishlist;
