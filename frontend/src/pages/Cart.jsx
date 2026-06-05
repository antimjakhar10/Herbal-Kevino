import { Minus, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useUserAuth } from "../context/UserAuthContext";

import { getImageUrl } from "../utils/api";

const Cart = ({ embedded = false }) => {
  const navigate = useNavigate();

  const { cart, removeFromCart, updateCartQuantity } = useUserAuth();

  const subtotal = cart.reduce((acc, item) => {
    return acc + (item.price || item.product.price) * item.quantity;
  }, 0);

  const shipping = subtotal > 999 ? 0 : 99;

  const total = subtotal + shipping;

  return (
    <div className={`${embedded ? "" : "min-h-screen"} bg-[#fffaf5]`}>
      {!embedded && <Navbar />}

      <section className={`${embedded ? "" : "max-w-7xl mx-auto"} px-4 py-8`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1f120c]">
              Shopping Cart
            </h1>

            <p className="text-[#7b5b46] mt-2">
              {cart.length} items in your cart
            </p>
          </div>

          <Link
            to="/products"
            className="w-full sm:w-auto h-12 px-6 rounded-xl border border-[#155b37] text-[#155b37] font-bold flex items-center justify-center"
          >
            Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white border border-[#eadccb] rounded-[30px] mt-10 py-24 text-center">
            <div className="text-7xl">🛒</div>

            <h2 className="text-3xl font-black mt-6">Your cart is empty</h2>

            <p className="text-[#7b5b46] mt-4">
              Add some herbal wellness products
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-8 h-14 px-8 rounded-xl bg-[#155b37] text-white font-bold"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid xl:grid-cols-[1fr_380px] gap-6 lg:gap-8 mt-8">
            {/* LEFT */}
            <div className="space-y-5">
              {cart.map((item) => (
                <div
                  key={`${item.product._id}-${item.variant}`}
                  className="bg-white border border-[#eadccb] rounded-3xl p-4 sm:p-5 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                    {/* IMAGE */}
                    <div className="w-full sm:w-[140px] md:w-[180px] h-[180px] sm:h-[140px] md:h-[180px] rounded-2xl overflow-hidden bg-[#f7efe6] shrink-0">
                      <img
                        src={getImageUrl(item.product.images?.[0])}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-black leading-tight">
                            {item.product.name}
                          </h3>

                          {item.variant && (
                            <p className="mt-2 text-sm font-semibold text-[#155b37]">
                              {item.variant}
                            </p>
                          )}

                          <p className="text-[#7b5b46] mt-2">
                            {item.product.category?.name}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(item.product._id, item.variant)
                          }
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                        {/* QTY */}
                        <div className="flex items-center border border-[#eadccb] rounded-xl overflow-hidden w-fit">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product._id,
                                Math.max(1, item.quantity - 1),
                                item.variant,
                              )
                            }
                            className="w-12 h-12 flex items-center justify-center"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="w-14 h-12 flex items-center justify-center font-black">
                            {item.quantity}
                          </span>

                          <button
                            disabled={item.quantity >= item.product.stock}
                            onClick={() => {
                              if (item.quantity >= item.product.stock) {
                                return;
                              }

                              updateCartQuantity(
                                item.product._id,
                                item.quantity + 1,
                                item.variant,
                              );
                            }}
                            className={`w-12 h-12 flex items-center justify-center ${
                              item.quantity >= item.product.stock
                                ? "opacity-40 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="mt-3">
                          {item.product.stock === 0 ? (
                            <p className="text-red-600 text-sm font-bold">
                              Out Of Stock
                            </p>
                          ) : item.product.stock <= 5 ? (
                            <p className="text-yellow-600 text-sm font-bold">
                              Only {item.product.stock} left
                            </p>
                          ) : (
                            <p className="text-green-600 text-sm font-bold">
                              In Stock
                            </p>
                          )}
                        </div>

                        {/* PRICE */}
                        <div className="sm:text-right">
                          <p className="text-[#7b5b46]">Price</p>

                          <h4 className="text-2xl sm:text-3xl font-black text-[#155b37]">
                            ₹
                            {(item.price || item.product.price) * item.quantity}
                          </h4>

                          {(item.price || item.product.price) * item.quantity >= 999 && (
  <p className="text-green-600 text-sm font-bold mt-1">
    ✓ Free Delivery
  </p>
)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="bg-white border border-[#eadccb] rounded-[30px] p-5 sm:p-7 shadow-sm h-fit xl:sticky xl:top-28">
              <h2 className="text-2xl font-black">Order Summary</h2>

              <div className="space-y-5 mt-8">
                <div className="flex items-center justify-between">
                  <span className="text-[#7b5b46]">Subtotal</span>

                  <span className="font-black">₹{subtotal}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#7b5b46]">Shipping</span>

                  <span className="font-black">
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>

                <div className="border-t border-[#eadccb] pt-5 flex items-center justify-between text-2xl font-black">
                  <span>Total</span>

                  <span>₹{total}</span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full h-14 sm:h-16 rounded-xl bg-[#155b37] text-white font-black text-base sm:text-lg mt-5 hover:bg-[#11482c] transition"
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {!embedded && <Footer />}
    </div>
  );
};

export default Cart;
