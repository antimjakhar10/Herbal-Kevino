import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { api, API_HOST } from "../utils/api";
import { CheckCircle2, Clock3, PackageCheck, Truck } from "lucide-react";

const Orders = ({ embedded = false }) => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const { data } = await api.get("/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrderImage = (image) => {
    if (!image) return "";

    // already full url
    if (image.startsWith("http")) {
      return image;
    }

    // clean slashes
    const cleanImage = image.replace(/\\/g, "/").replace(/^\/+/, "");

    return `${API_HOST}/${cleanImage}`;
  };

  const trackingSteps = [
    "Pending",
    "Confirmed",
    "Packed",
    "Shipped",
    "Out For Delivery",
    "Delivered",
  ];

  return (
    <div className={`${embedded ? "" : "min-h-screen"} bg-[#fffaf5]`}>
      {!embedded && <Navbar />}

      <section
        className={`${embedded ? "" : "max-w-7xl mx-auto"} px-4 py-8 md:py-10`}
      >
        {/* HEADING */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black">My Orders</h1>

          <p className="text-[#7b5b46] mt-3">
            Track your herbal wellness orders
          </p>
        </div>

        {/* EMPTY STATE */}
        {!orders.length ? (
          <div className="bg-white border border-[#eadccb] rounded-[30px] py-24 text-center">
            <div className="text-7xl">📦</div>

            <h2 className="text-3xl font-black mt-6">No Orders Yet</h2>

            <p className="text-[#7b5b46] mt-4">
              Your placed orders will appear here
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-7 h-14 px-8 rounded-xl bg-[#155b37] text-white font-bold hover:bg-[#11482c] transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-[#eadccb] rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md transition"
              >
                {/* TOP */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#eadccb] pb-4">
                  <div>
                    <h3 className="font-black text-xl sm:text-2xl">
                      Order #{order._id.slice(-6)}
                    </h3>

                    <p className="text-[#7b5b46] mt-1 text-sm sm:text-base">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="w-fit px-4 py-2 rounded-full bg-[#eef7f2] text-[#155b37] font-bold text-sm">
                    {order.orderStatus}
                  </span>
                </div>

                {/* ITEMS */}
                <div className="mt-6 space-y-5">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={`${order._id}-${index}`}
                      className="flex gap-4 sm:gap-5 py-2"
                    >
                      {/* IMAGE */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-[#eadccb] bg-[#f6efe7] shrink-0">
                        {item.image ? (
                          <img
                            src={getOrderImage(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* INFO */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base sm:text-lg line-clamp-2">
                          {item.name}
                        </h4>

                        <p className="text-[#7b5b46] mt-1 text-sm">
                          Qty: {item.quantity}
                        </p>

                        <p className="font-black text-xl mt-2 text-[#24110a]">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TRACKING */}
                {order.orderStatus === "Cancelled" ? (
                  <div className="mt-8 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 font-bold">
                    This order has been cancelled.
                  </div>
                ) : (
                  <div className="mt-8 border-t border-[#eadccb] pt-6">
                    <h4 className="font-black text-lg mb-6">Order Tracking</h4>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {trackingSteps.map((step, index) => {
                        const currentStep = trackingSteps.indexOf(
                          order.orderStatus,
                        );

                        const completed = index <= currentStep;

                        return (
                          <div key={step} className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                completed
                                  ? "bg-[#155b37] text-white"
                                  : "bg-[#f3ece5] text-[#9a8475]"
                              }`}
                            >
                              {completed ? (
                                <CheckCircle2 size={20} />
                              ) : (
                                <Clock3 size={18} />
                              )}
                            </div>

                            <div>
                              <p
                                className={`text-sm font-bold ${
                                  completed
                                    ? "text-[#155b37]"
                                    : "text-[#9a8475]"
                                }`}
                              >
                                {step}
                              </p>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* FOOTER */}
                <div className="mt-6 border-t border-[#eadccb] pt-5 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                  <div>
                    <p className="text-[#7b5b46]">Payment Method</p>

                    <h4 className="font-bold">{order.paymentMethod}</h4>
                  </div>

                  <div className="text-right">
                    <p className="text-[#7b5b46]">Total</p>

                    <h3 className="text-3xl font-black text-[#155b37]">₹{order.totalPrice}</h3>

                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="mt-3 sm:mt-4 w-full sm:w-auto h-11 px-6 rounded-xl bg-[#155b37] text-white font-bold hover:bg-[#11482c] transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {!embedded && <Footer />}
    </div>
  );
};

export default Orders;
