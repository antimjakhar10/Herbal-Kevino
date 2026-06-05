import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useNavigate, useSearchParams } from "react-router-dom";

import { CheckCircle2, Tag, Trash2 } from "lucide-react";
import { useUserAuth } from "../context/UserAuthContext";

import { api, getImageUrl } from "../utils/api";

import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const type = searchParams.get("type");

  const { user, cart, clearCart, updateUserData } = useUserAuth();

  const buyNowItem = JSON.parse(localStorage.getItem("buyNowItem"));

  const products =
    type === "buyNow"
      ? [buyNowItem]
      : cart.map((item) => ({
          product: item.product._id,
          productId: item.product._id,
          name: item.product.name,
          image: getImageUrl(item.product.images?.[0]),
          price: item.price || item.product.price,
          quantity: item.quantity,
          variant: item.variant,
        }));

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [couponCode, setCouponCode] = useState("");

  const [discount, setDiscount] = useState(0);

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [couponLoading, setCouponLoading] = useState(false);

  const [availableCoupons, setAvailableCoupons] = useState([]);

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const savedAddresses = user?.addresses || [];

  const subtotal = useMemo(() => {
    return products.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [products]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get("/coupons/available");

      setAvailableCoupons(data.coupons || []);
    } catch (error) {
      console.log(error);
    }
  };

  const shipping = subtotal > 999 ? 0 : 99;

  const finalTotal = subtotal + shipping - discount;

  const handleChange = (e) => {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const applyCoupon = async () => {
    try {
      if (!couponCode.trim()) {
        toast.error("Please enter coupon code");
        return;
      }

      setCouponLoading(true);

      const { data } = await api.post("/coupons/validate", {
        code: couponCode,
        subtotal,
      });

      setDiscount(data.discount);

      setAppliedCoupon(data.coupon);

      toast.success(`${data.coupon.code} applied successfully`);
    } catch (error) {
      setDiscount(0);

      setAppliedCoupon(null);

      toast.error(error.response?.data?.message || "Invalid coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleDeleteAddress = async (indexToDelete) => {
    try {
      const token = localStorage.getItem("userToken");

      const updatedAddresses = (user?.addresses || []).filter(
        (_, index) => index !== indexToDelete,
      );

      const { data } = await api.put(
        "/auth/profile",
        {
          addresses: updatedAddresses,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      updateUserData(data.user);

      if (selectedAddress === user?.addresses?.[indexToDelete]) {
        setSelectedAddress(null);
      }

      toast.success("Address deleted successfully");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const createOrderInDatabase = async (
    token,
    finalAddress,
    paymentMethod,
    razorpayData = {},
  ) => {
    return await api.post(
      "/orders",
      {
        orderItems: products.map((item) => ({
          product: item.productId || item.product,

          name: item.name,

          image: item.image,

          price: item.price,

          quantity: item.quantity,

          variant: item.variant,
        })),

        shippingAddress: finalAddress,

        paymentMethod,

        totalPrice: finalTotal,

        coupon: appliedCoupon ? appliedCoupon.code : null,

        discount,

        razorpayOrderId: razorpayData.razorpayOrderId || "",

        razorpayPaymentId: razorpayData.razorpayPaymentId || "",

        razorpaySignature: razorpayData.razorpaySignature || "",

        paymentStatus: paymentMethod === "Razorpay" ? "Paid" : "Pending",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  };

  const placeOrder = async () => {
    try {
      setLoading(true);

      const finalAddress = selectedAddress || {
        fullName: address.fullName,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: "India",
      };

      if (
        !finalAddress.fullName ||
        !finalAddress.phone ||
        !finalAddress.street ||
        !finalAddress.city ||
        !finalAddress.state ||
        !finalAddress.pincode
      ) {
        toast.error("Please complete shipping address");

        setLoading(false);

        return;
      }

      const token = localStorage.getItem("userToken");

      if (!selectedAddress) {
        const updatedAddresses = [...(user?.addresses || []), finalAddress];

        const { data: updatedProfile } = await api.put(
          "/auth/profile",
          {
            addresses: updatedAddresses,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        updateUserData(updatedProfile.user);
      }

      if (paymentMethod === "COD") {
        await createOrderInDatabase(token, finalAddress, "COD");

        if (type !== "buyNow") {
          await clearCart();
        }

        localStorage.removeItem("buyNowItem");

        toast.success("Order placed successfully");

        navigate("/orders");

        return;
      }

      const { data: razorpayOrder } = await api.post(
        "/orders/razorpay/create-order",
        {
          amount: finalTotal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const options = {
        key: razorpayOrder.key,

        amount: razorpayOrder.order.amount,

        currency: "INR",

        name: "Kevino Herbal",

        description: "Order Payment",

        order_id: razorpayOrder.order.id,

        handler: async function (response) {
          try {
            const { data: verifyData } = await api.post(
              "/orders/razorpay/verify",
              {
                razorpay_order_id: response.razorpay_order_id,

                razorpay_payment_id: response.razorpay_payment_id,

                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (!verifyData.success) {
              toast.error("Payment verification failed");

              return;
            }

            await createOrderInDatabase(token, finalAddress, "Razorpay", {
              razorpayOrderId: response.razorpay_order_id,

              razorpayPaymentId: response.razorpay_payment_id,

              razorpaySignature: response.razorpay_signature,
            });

            if (type !== "buyNow") {
              await clearCart();
            }

            localStorage.removeItem("buyNowItem");

            toast.success("Payment successful");

            navigate("/orders");
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          },
        },

        theme: {
          color: "#155b37",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <Navbar />

      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-6 md:py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-10">
        {/* LEFT */}
        <div className="bg-white border border-[#eadccb] rounded-[20px] md:rounded-[30px] p-4 sm:p-6 md:p-8 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-black mb-6 md:mb-10">
            Checkout
          </h1>

          {/* ADDRESS */}
          <div>
            <h2 className="text-xl md:text-2xl font-black mb-4 md:mb-6">
              Select Address
            </h2>

            {!!savedAddresses.length && (
              <div className="space-y-4 mb-8">
                {savedAddresses.map((item, index) => (
                  <div
  key={index}
  onClick={() => setSelectedAddress(item)}
  className={`w-full text-left border-2 rounded-2xl p-5 cursor-pointer transition ${
    selectedAddress === item
      ? "border-[#155b37] bg-[#eef7f2]"
      : "border-[#eadccb] bg-white"
  }`}
>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-black text-lg">{item.fullName}</h3>

                        <p className="text-[#6d5547] mt-2">
                          {item.street}, {item.city}, {item.state} -{" "}
                          {item.pincode}
                        </p>

                        <p className="text-[#6d5547] mt-1">{item.phone}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            handleDeleteAddress(index);
                          }}
                          className="w-10 h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition"
                        >
                          <Trash2 size={18} />
                        </button>

                        {selectedAddress === item && (
                          <CheckCircle2 className="text-[#155b37]" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* NEW ADDRESS */}
            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="fullName"
                value={address.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="h-14 rounded-xl border border-[#e7d8c8] px-4"
              />

              <input
                type="text"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="h-14 rounded-xl border border-[#e7d8c8] px-4"
              />

              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="Street Address"
                className="md:col-span-2 h-14 rounded-xl border border-[#e7d8c8] px-4"
              />

              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="City"
                className="h-14 rounded-xl border border-[#e7d8c8] px-4"
              />

              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
                placeholder="State"
                className="h-14 rounded-xl border border-[#e7d8c8] px-4"
              />

              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="h-14 rounded-xl border border-[#e7d8c8] px-4"
              />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="mt-12">
            <h2 className="text-2xl font-black mb-6">Payment Method</h2>

            <div className="space-y-4">
              <button
                onClick={() => setPaymentMethod("COD")}
                className={`w-full h-16 rounded-2xl border-2 text-left px-6 font-bold transition ${
                  paymentMethod === "COD"
                    ? "border-[#155b37] bg-[#eef7f2]"
                    : "border-[#eadccb]"
                }`}
              >
                Cash On Delivery
              </button>

              <button
                onClick={() => setPaymentMethod("Razorpay")}
                className={`w-full h-16 rounded-2xl border-2 text-left px-6 font-bold transition ${
                  paymentMethod === "Razorpay"
                    ? "border-[#155b37] bg-[#eef7f2]"
                    : "border-[#eadccb]"
                }`}
              >
                Razorpay / UPI / Cards
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white border border-[#eadccb] rounded-[30px] p-7 shadow-sm h-fit sticky top-28">
          <h2 className="text-2xl font-black mb-8">Order Summary</h2>

          {/* PRODUCTS */}
          <div className="space-y-5">
            {products.map((item, index) => (
              <div key={index} className="flex gap-4">
                <img
                  src={item.image}
                  alt=""
                  className="w-16 h-16 md:w-24 md:h-24 rounded-2xl object-cover bg-[#f6efe7]"
                />

                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>

                  <p className="text-sm text-[#7b5b46] mt-2">
                    Qty: {item.quantity}
                  </p>

                  <h4 className="font-black text-xl mt-2">
                    ₹{item.price * item.quantity}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* COUPON */}
          <div className="mt-8 border-t border-[#eadccb] pt-6">
            {!!availableCoupons.length && (
              <div className="mb-6">
                <h3 className="font-black text-lg mb-4">Available Offers</h3>

                <div className="space-y-4">
                  {availableCoupons.map((coupon) => (
                    <div
                      key={coupon._id}
                      className="border border-[#d8eadf] bg-[#f6fff8] rounded-2xl p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-black text-[#155b37] text-lg">
                            {coupon.code}
                          </h4>

                          <p className="text-sm text-[#567160] mt-1">
                            {coupon.type === "percentage"
                              ? `Save ${coupon.value}%`
                              : `Flat ₹${coupon.value} OFF`}
                          </p>

                          <p className="text-xs text-[#7a6255] mt-2">
                            Minimum order ₹{coupon.minOrderAmount}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setCouponCode(coupon.code);
                          }}
                          className="px-4 h-11 rounded-xl bg-[#155b37] text-white font-bold"
                        >
                          Use
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 mb-4">
              <Tag size={18} className="text-[#155b37]" />

              <h3 className="font-black text-lg">Apply Coupon</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 h-12 rounded-xl border border-[#eadccb] px-4 uppercase"
              />

              <button
                onClick={applyCoupon}
                disabled={couponLoading}
                className="h-12 px-5 rounded-xl bg-[#155b37] text-white font-bold"
              >
                {couponLoading ? "..." : "Apply"}
              </button>
            </div>

            {appliedCoupon && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-700 font-bold">
                  Coupon Applied: {appliedCoupon.code}
                </p>

                <p className="text-sm text-green-600 mt-1">
                  You saved ₹{discount}
                </p>
              </div>
            )}
          </div>

          {/* TOTALS */}
          <div className="mt-8 border-t border-[#eadccb] pt-6 space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>

              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>

              <span className="text-green-600 font-bold">-₹{discount}</span>
            </div>

            <div className="flex justify-between text-xl md:text-2xl font-black pt-4 border-t border-[#eadccb]">
              <span>Total</span>

              <span>₹{finalTotal}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-[#155b37] text-white font-black text-lg mt-8 hover:opacity-90 transition"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;
