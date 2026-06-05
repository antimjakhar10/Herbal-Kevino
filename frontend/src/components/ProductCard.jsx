import { Heart, ShoppingCart, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/api";
import { useUserAuth } from "../context/UserAuthContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const image = getImageUrl(product?.images?.[0]);

  const navigate = useNavigate();

  const { wishlist, toggleWishlist, addToCart } = useUserAuth();

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const handleWishlist = async (e) => {
    e.stopPropagation();

    const response = await toggleWishlist(product._id);

    if (response?.authRequired) {
      toast.error("Please login first");
      return;
    }

    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (product?.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    const response = await addToCart(product._id, 1);

    if (response?.authRequired) {
      toast.error("Please login first");
      return;
    }

    toast.success("Added to cart");
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();

    if (product?.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    const response = await addToCart(product._id, 1);

    if (response?.authRequired) {
      toast.error("Please login first");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.slug}`)}
      className="group cursor-pointer bg-white rounded-[28px] overflow-hidden border border-[#efe5d8] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500"
    >
      {/* IMAGE */}
      <div className="relative h-[170px] sm:h-[200px] md:h-[220px] bg-[#f8f4ed] overflow-hidden">
        {product?.badge && (
          <span className="absolute top-3 left-3 z-10 bg-[#a65312] text-white text-[11px] md:text-xs font-bold px-3 py-1.5 rounded-full">
            {product.badge}
          </span>
        )}

        {/* WISHLIST */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center backdrop-blur-md transition ${
  isWishlisted
    ? "bg-red-500"
    : "bg-white/90"
}`}
        >
          <Heart
  size={16}
  className={
    isWishlisted
      ? "text-white"
      : "text-[#3b1608]"
  }
  fill={
    isWishlisted
      ? "#ffffff"
      : "none"
  }
/>
        </button>

        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🌿
          </div>
        )}

        {/* HOVER ACTION */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product?.stock === 0}
              className={`h-9 rounded-lg text-white text-sm font-bold flex items-center justify-center gap-2 ${
                product?.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#155b37] hover:bg-[#11472c]"
              }`}
            >
              <ShoppingCart size={15} />
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product?.stock === 0}
              className={`h-9 rounded-lg text-white text-sm font-bold flex items-center justify-center gap-2 ${
                product?.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#c67a2c] hover:bg-[#aa6420]"
              }`}
            >
              <Zap size={15} />
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 md:p-5">
        <p className="text-[11px] uppercase tracking-[2px] text-[#6b8a4b] font-semibold mb-3">
          {product?.category?.name || "Herbal Care"}
        </p>

        <h3 className="text-[15px] md:text-[17px] font-extrabold text-[#1f120c] line-clamp-2 min-h-[44px] leading-7">
          {product?.name}
        </h3>

        {/* RATING */}
        <div className="flex items-center gap-1 text-[#f6a623]">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={12} fill="currentColor" />
          ))}

          <span className="text-[#8a6b58] text-sm ml-1">
            ({product?.reviewsCount || 0})
          </span>
        </div>

        {/* TAGS */}
        {/* <div className="flex flex-wrap gap-2 mt-3">
          {(product?.tags || []).slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[11px] md:text-xs border border-[#eadccb] rounded-full px-2.5 md:px-3 py-1 text-[#7b5b46] bg-[#fffaf5]"
            >
              {tag}
            </span>
          ))}
        </div> */}

        {/* STOCK */}
        <div className="mt-1">
          {product?.stock === 0 ? (
            <span className="  bg-[#fde8e8] text-[#d22f27] px-2.5 py-1 rounded-full text-[11px] font-semibold">
              Out Of Stock
            </span>
          ) : product?.stock <= 5 ? (
            <span className="bg-[#fff4d6] text-[#c58b00] px-2.5 py-1 rounded-full text-[11px] font-semibold">
              Only {product.stock} Left
            </span>
          ) : (
            <span className="bg-[#eef7f2] text-[#155b37] px-2.5 py-1 rounded-full text-[11px] font-semibold">
              In Stock
            </span>
          )}
        </div>


        {/* PRICE */}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[24px] md:text-[28px] font-extrabold text-[#155b37]">
            ₹{product?.price}
          </span>

          {product?.mrp > product?.price && (
            <span className="text-sm text-[#9b8c80] line-through mb-1">
              ₹{product.mrp}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
