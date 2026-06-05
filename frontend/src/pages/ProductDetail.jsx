import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  CreditCard,
  Heart,
  RefreshCcw,
  ShoppingCart,
  Star,
  Truck,
  Wallet,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { api, getImageUrl } from "../utils/api";
import toast from "react-hot-toast";

import { useUserAuth } from "../context/UserAuthContext";

const ProductDetail = () => {
  const { slug } = useParams();
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [activeFaq, setActiveFaq] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { wishlist, toggleWishlist, addToCart } = useUserAuth();

  const [reviewRating, setReviewRating] = useState(5);

  const [reviewMessage, setReviewMessage] = useState("");

  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${slug}`);

      setProduct(data.product);
      setRelatedProducts(data.relatedProducts || []);

      const firstImage = data.product?.images?.[0]
        ? getImageUrl(data.product.images[0])
        : "";

      setActiveImage(firstImage);

      if (data.product?.variantOptions?.length) {
        setSelectedVariant(data.product.variantOptions[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const discount = useMemo(() => {
    if (!product?.mrp || product.mrp <= product.price) return 0;
    return Math.round(((product.mrp - product.price) / product.mrp) * 100);
  }, [product]);

  const currentPrice = selectedVariant?.price || product?.price || 0;

  const currentMrp = selectedVariant?.mrp || product?.mrp || 0;

  const currentStock = selectedVariant?.stock ?? product?.stock ?? 0;

  const currentDiscount =
    currentMrp > currentPrice
      ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf5]">
        <Navbar />
        <div className="py-24 text-center font-bold">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fffaf5]">
        <Navbar />
        <div className="py-24 text-center font-bold">Product not found</div>
      </div>
    );
  }

  const images = product.images || [];
  const heroImage = images[0] ? getImageUrl(images[0]) : "";
  const reviews = product.reviews || [];

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const shippingInfo = product.shippingInfo?.length
    ? product.shippingInfo
    : ["Cash on Delivery", "Online Payment", "Free Shipping", "Easy Returns"];

  const handleWishlist = async () => {
    const response = await toggleWishlist(product._id);

    if (response?.authRequired) {
      toast.error("Please login first");
      return;
    }

    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleAddToCart = async () => {
    const response = await addToCart(
      product._id,

      qty,

      selectedVariant?.name || "",

      currentPrice,

      currentMrp,
    );

    if (response?.authRequired) {
      toast.error("Please login first");
      return;
    }

    toast.success("Added to cart");
  };

  const handleSubmitReview = async () => {
    try {
      if (!user) {
        toast.error("Please login first");
        return;
      }

      if (!reviewMessage.trim()) {
        toast.error("Please write review");
        return;
      }

      setReviewLoading(true);

      const token = localStorage.getItem("userToken");

      const { data } = await api.post(
        `/products/${product._id}/review`,
        {
          rating: reviewRating,

          message: reviewMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProduct((prev) => ({
        ...prev,

        reviews: data.reviews,

        rating: data.rating,

        reviewsCount: data.reviewsCount,
      }));

      setReviewMessage("");

      setReviewRating(5);

      toast.success("Review added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="bg-[#fffaf5] min-h-screen text-[#24110a]">
      <Navbar />

      {/* <section
        className="relative h-[360px] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,55,28,.72),rgba(0,55,28,.72)), url(${heroImage})`,
        }}
      >
        <div className="text-center px-4">
          <span className="inline-flex px-5 py-2 rounded-full bg-white/20 border border-white/30 font-bold tracking-widest text-sm">
            🌿 HERBAL STORE
          </span>

          <h1 className="text-4xl md:text-6xl font-black mt-6">
            {product.name}
          </h1>

          <p className="mt-4 text-xl">{product.category?.name}</p>

          <p className="mt-6 text-white/80">
            Home › <b>{product.name}</b>
          </p>
        </div>
      </section> */}

      <section className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <div className="bg-white rounded-[24px] border border-[#eadccb] p-6 shadow-sm">
            <div className="h-[520px] bg-[#f7efe6] rounded-xl overflow-hidden flex items-center justify-center">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-8xl">🌿</div>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-5 overflow-x-auto no-scrollbar">
            {images.map((img, index) => {
              const url = getImageUrl(img);

              return (
                <button
                  key={index}
                  onClick={() => setActiveImage(url)}
                  className={`w-24 h-24 rounded-xl border-2 overflow-hidden bg-white shrink-0 ${
                    activeImage === url
                      ? "border-[#15724a]"
                      : "border-[#eadccb]"
                  }`}
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="inline-flex bg-[#edf3ee] text-[#15724a] px-5 py-3 rounded-full font-black uppercase text-sm">
            {product.category?.name || "Herbal Product"}
          </span>

          <div className="flex items-center justify-between gap-4 mt-8">
            <h2 className="text-4xl font-black">{product.name}</h2>

            <div className="border border-[#f3c86b] bg-[#fff8e8] rounded-full px-4 py-2 flex items-center gap-2">
              <Star size={16} fill="#ff9800" className="text-[#ff9800]" />
              <b>{product.rating || 5}</b>
              <span className="text-[#765d4c]">
                ({product.reviewsCount || reviews.length || 0} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <h3 className="text-4xl font-black">₹{currentPrice}</h3>

            {currentMrp > currentPrice && (
              <span className="text-xl line-through text-[#9b8a7e]">
                ₹{currentMrp}
              </span>
            )}

            {currentDiscount > 0 && (
              <span className="bg-[#2c875f] text-white px-4 py-2 rounded-full font-black">
                {currentDiscount}% OFF
              </span>
            )}
          </div>

          <p className="mt-8 border-l-4 border-[#15724a] pl-5 text-lg leading-relaxed text-[#6f4f3f]">
            {product.shortDescription || product.description}
          </p>

          <div className="mt-5">
            {currentStock === 0 ? (
              <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold">
                Out Of Stock
              </span>
            ) : currentStock <= 5 ? (
              <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-bold">
                Only {currentStock} Left
              </span>
            ) : (
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                In Stock
              </span>
            )}
          </div>

          {product.variantOptions?.length > 0 && (
            <div className="mt-8">
              <h4 className="font-black uppercase mb-3">Size / Variant</h4>
              <div className="flex flex-wrap gap-3">
                {product.variantOptions.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-6 py-3 rounded-xl border font-bold ${
                      selectedVariant?.name === variant.name
                        ? "border-[#15724a] bg-[#eef7f2] text-[#15724a]"
                        : "border-[#eadccb] bg-white"
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7">
            <h4 className="font-black uppercase mb-3">Quantity</h4>

            <div className="inline-flex border border-[#eadccb] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-14 h-12 text-xl"
              >
                -
              </button>

              <span className="w-14 h-12 flex items-center justify-center font-black">
                {qty}
              </span>

              <button
                onClick={() => setQty(Math.min(currentStock, qty + 1))}
                className="w-14 h-12 text-xl"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <button
              onClick={handleAddToCart}
              disabled={currentStock === 0}
              className={`h-16 rounded-xl text-white font-black text-lg flex items-center justify-center gap-3 shadow-lg transition ${
                currentStock === 0
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-[#155b37] hover:scale-[1.02]"
              }`}
            >
              <ShoppingCart size={20} />

              {currentStock === 0 ? "Out Of Stock" : "Add to Cart"}
            </button>

            <button
              onClick={handleWishlist}
              className={`h-16 rounded-xl border-2 font-black text-lg flex items-center justify-center gap-3 transition ${
                isWishlisted
                  ? "bg-red-500 border-red-500 text-white"
                  : "border-[#155b37] text-[#155b37] bg-white"
              }`}
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />

              {isWishlisted ? "Wishlisted" : "Wishlist"}
            </button>

            <button
              disabled={currentStock === 0}
              onClick={() => {
                if (!user) {
                  navigate("/login");
                  return;
                }

                const buyNowItem = {
                  productId: product._id,

                  name: product.name,

                  image: activeImage,

                  price: currentPrice,

                  quantity: qty,

                  variant: selectedVariant?.name || "",
                };

                localStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));

                navigate("/checkout?type=buyNow");
              }}
              className={`h-16 rounded-xl border-2 font-black text-lg flex items-center justify-center gap-3 transition ${
                currentStock === 0
                  ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "border-[#155b37] text-[#155b37] bg-white"
              }`}
            >
              <Zap size={20} />

              {currentStock === 0 ? "Unavailable" : "Buy Now"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-8 bg-[#fff8ee] border border-[#eadccb] rounded-2xl p-6">
            {shippingInfo.map((item, index) => {
              const icons = [Wallet, CreditCard, Truck, RefreshCcw];
              const Icon = icons[index % icons.length];

              return (
                <div
                  key={index}
                  className="flex items-center gap-3 font-semibold"
                >
                  <Icon className="text-[#15724a]" />
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-[24px] border border-[#eadccb] shadow-sm overflow-hidden grid lg:grid-cols-[250px_1fr]">
          <div className="bg-[#fff7ee] border-r border-[#eadccb]">
            {[
  ["description", "Description"],
  ["howToUse", "How To Use"],
  ["details", "Product Details"],
  ["faq", "FAQ"],
  ["reviews", "Reviews"],
].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full text-left px-7 py-5 text-lg font-bold border-l-4 ${
                  activeTab === key
                    ? "border-[#15724a] bg-[#f1ede3] text-[#15724a]"
                    : "border-transparent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-8 md:p-10 min-h-[420px]">
            {activeTab === "description" && (
              <div>
                <h3 className="text-2xl font-black mb-6">About This Product</h3>

                <div
                  className="prose max-w-none text-[#684c3e]"
                  dangerouslySetInnerHTML={{
                    __html: product.description || product.shortDescription,
                  }}
                />

                {product.extraFeatures?.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-black mb-4">
                      Why Choose Kevino Herbals?
                    </h4>

                    <div className="space-y-4">
                      {product.extraFeatures.map((item) => (
                        <p key={item} className="text-[#684c3e] text-lg">
                          ✓ {item}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "howToUse" && (
  <div>
    <h3 className="text-2xl font-black mb-6">
      How To Use
    </h3>

    <div
      className="prose max-w-none text-[#684c3e]"
      dangerouslySetInnerHTML={{
        __html:
          product.howToUse ||
          "<p>No usage instructions available.</p>",
      }}
    />
  </div>
)}

            {activeTab === "details" && (
              <div>
                <h3 className="text-2xl font-black mb-6">
                  Product Specifications
                </h3>

                {(product.productDetails || []).map((item, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-[40%_60%] border-b border-[#eadccb]"
                  >
                    <div className="bg-[#f7f8f6] p-4 font-black">
                      {item.title}
                    </div>

                    <div className="p-4 text-[#684c3e]">{item.value}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "faq" && (
              <div>
                <h3 className="text-2xl font-black mb-6">
                  Frequently Asked Questions
                </h3>

                <div className="space-y-4">
                  {(product.faq || []).map((item, index) => (
                    <div
                      key={index}
                      className="border border-[#eadccb] rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setActiveFaq(activeFaq === index ? -1 : index)
                        }
                        className="w-full px-5 py-4 flex items-center justify-between font-black bg-[#fff8ee]"
                      >
                        {item.question}
                        <ChevronDown size={18} />
                      </button>

                      {activeFaq === index && (
                        <p className="px-5 py-4 text-[#684c3e] leading-relaxed bg-white">
                          {item.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3 className="text-2xl font-black mb-6">Customer Reviews</h3>

                {user && (
                  <div className="border border-[#eadccb] rounded-3xl p-6 bg-[#fffaf5] mb-8">
                    <h4 className="text-xl font-black mb-5">Write A Review</h4>

                    <div className="flex gap-2 mb-5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`text-3xl ${
                            star <= reviewRating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={reviewMessage}
                      onChange={(e) => setReviewMessage(e.target.value)}
                      placeholder="Write your experience..."
                      className="w-full h-32 rounded-2xl border border-[#eadccb] px-4 py-4 outline-none"
                    />

                    <button
                      onClick={handleSubmitReview}
                      disabled={reviewLoading}
                      className="mt-5 h-14 px-8 rounded-2xl bg-[#155b37] text-white font-black"
                    >
                      {reviewLoading ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                )}

                <div className="bg-[#fff8ee] rounded-2xl p-8 mb-8">
                  <h4 className="text-5xl font-black">{product.rating || 5}</h4>
                  <p className="text-[#ff9800] text-xl mt-3">★★★★★</p>
                  <p className="mt-4 text-[#684c3e]">
                    Based on {product.reviewsCount || reviews.length || 0}{" "}
                    reviews
                  </p>
                </div>

                <div className="space-y-5">
                  {reviews.length ? (
                    reviews.map((review, index) => (
                      <ReviewCard key={index} review={review} />
                    ))
                  ) : (
                    <p className="text-[#684c3e]">No reviews added yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="border-t border-[#eadccb] pt-16 text-center">
            <h2 className="text-4xl font-black">You May Also Like</h2>
            <p className="text-[#8a6b58] mt-3 text-lg">
              Explore more herbal products curated just for you
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7 mt-12 text-left">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

const ReviewCard = ({ review }) => (
  <div className="border border-[#eadccb] rounded-2xl p-6 bg-white">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#2c875f] text-white flex items-center justify-center font-black">
          {review.name?.charAt(0) || "U"}
        </div>

        <div>
          <h4 className="font-black">{review.name}</h4>
          <p className="text-[#8a6b58] text-sm">
            {review.date || review.role || "Verified Buyer"}
          </p>
        </div>
      </div>

      <p className="text-[#ff9800]">{"★".repeat(review.rating || 5)}</p>
    </div>

    <p className="mt-5 text-[#684c3e] text-lg">{review.message}</p>
  </div>
);

export default ProductDetail;
