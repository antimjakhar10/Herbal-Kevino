import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { CheckCircle2, Clock3, RotateCcw, X, Download } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { api, API, API_HOST } from "../utils/api";

const trackingSteps = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",

  Confirmed: "bg-blue-100 text-blue-700",

  Packed: "bg-indigo-100 text-indigo-700",

  Shipped: "bg-purple-100 text-purple-700",

  "Out For Delivery": "bg-orange-100 text-orange-700",

  Delivered: "bg-green-100 text-green-700",

  Cancelled: "bg-red-100 text-red-700",
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [returnType, setReturnType] = useState("Return");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const { data } = await api.get(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(data.order);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const openReturnModal = (item) => {
    setSelectedItem(item);
  };

  const getOrderImage = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_HOST}/${image.replace(/\\/g, "/").replace(/^\/+/, "")}`;
  };

  const downloadInvoice = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await fetch(`${API}/orders/invoice/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `invoice-${id}.pdf`;

      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  const submitReturnRequest = async () => {
    try {
      if (!reason) {
        alert("Please enter reason");
        return;
      }

      if (returnType === "Return") {
        if (
          !bankDetails.accountHolderName ||
          !bankDetails.bankName ||
          !bankDetails.accountNumber ||
          !bankDetails.ifscCode
        ) {
          alert("Please fill all bank details for refund");
          return;
        }
      }

      setSubmitting(true);

      const token = localStorage.getItem("userToken");

      await api.post(
        "/returns",
        {
          orderId: order._id,
          productId: selectedItem.product,
          quantity: selectedItem.quantity,
          type: returnType,
          reason,

          bankDetails: returnType === "Return" ? bankDetails : {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(`${returnType} request submitted successfully`);

      setSelectedItem(null);

      setReason("");

      setReturnType("Return");

      setBankDetails({
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        upiId: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-black">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-black">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-14">
        <button
          onClick={() => navigate("/orders")}
          className="mb-8 h-12 px-6 rounded-xl border border-[#155b37] text-[#155b37] font-bold"
        >
          Back To Orders
        </button>

        <div className="bg-white border border-[#eadccb] rounded-[30px] p-8 shadow-sm">
          {/* TOP */}
          <div className="flex flex-col md:flex-row md:justify-between gap-5 border-b border-[#eadccb] pb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black break-all">
                Order #{order._id.slice(-6)}
              </h1>

              <p className="text-[#7b5b46] mt-3">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col md:items-end gap-3">
              <span
                className={`h-fit px-5 py-2 rounded-full font-bold ${
                  statusColors[order.orderStatus]
                }`}
              >
                {order.orderStatus}
              </span>

              <button
                onClick={downloadInvoice}
                className="w-full md:w-auto h-12 px-5 rounded-xl bg-[#155b37] text-white font-bold flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download Invoice
              </button>
            </div>
          </div>

          {/* TRACKING */}
          {order.orderStatus === "Cancelled" ? (
            <div className="mt-8 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 font-bold">
              This order has been cancelled.
            </div>
          ) : (
            <div className="mt-8">
              <h3 className="text-2xl md:text-3xl font-black mb-8">
  Order Tracking
</h3>

              {/* MOBILE TRACKING */}
              <div className="flex flex-col gap-5 md:hidden">
                {trackingSteps.map((step, index) => {
                  const currentStep = trackingSteps.indexOf(order.orderStatus);
                  const completed = index <= currentStep;

                  return (
                    <div key={step} className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
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

                      <p
                        className={`font-bold ${
                          completed ? "text-[#155b37]" : "text-[#9a8475]"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP TRACKING */}
              <div className="hidden md:flex items-center justify-between gap-2 overflow-x-auto pb-2">
                {trackingSteps.map((step, index) => {
                  const currentStep = trackingSteps.indexOf(order.orderStatus);
                  const completed = index <= currentStep;

                  return (
                    <div
                      key={step}
                      className="flex items-center flex-1 min-w-[140px]"
                    >
                      <div className="flex flex-col items-center w-full">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
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

                        <p
                          className={`mt-3 text-sm font-bold text-center ${
                            completed ? "text-[#155b37]" : "text-[#9a8475]"
                          }`}
                        >
                          {step}
                        </p>
                      </div>

                      {index !== trackingSteps.length - 1 && (
                        <div
                          className={`h-[3px] flex-1 mb-8 ${
                            completed ? "bg-[#155b37]" : "bg-[#eadccb]"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
            <div className="bg-[#fffaf5] border border-[#eadccb] rounded-3xl p-5 md:p-6">
              <h3 className="text-xl font-black mb-5">Shipping Address</h3>

              <div className="space-y-2 text-[#5d4334]">
                <p className="font-bold">{order.shippingAddress?.fullName}</p>

                <p>{order.shippingAddress?.phone}</p>

                <p>{order.shippingAddress?.street}</p>

                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>

                <p>{order.shippingAddress?.pincode}</p>
              </div>
            </div>

            <div className="bg-[#fffaf5] border border-[#eadccb] rounded-3xl p-6">
              <h3 className="text-xl font-black mb-5">Payment Info</h3>

              <div className="space-y-3 text-[#5d4334]">
                <p>
                  Method:{" "}
                  <span className="font-bold">{order.paymentMethod}</span>
                </p>

                <p>
                  Payment Status:{" "}
                  <span className="font-bold">
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </p>

                <p>
                  Total Amount:{" "}
                  <span className="font-black text-[#155b37]">
                    ₹{order.totalPrice}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-[#fffaf5] border border-[#eadccb] rounded-3xl p-6">
              <h3 className="text-xl font-black mb-5">Order Summary</h3>

              <div className="space-y-3 text-[#5d4334]">
                <p>
                  Items:{" "}
                  <span className="font-bold">{order.orderItems.length}</span>
                </p>

                <p>
                  Status: <span className="font-bold">{order.orderStatus}</span>
                </p>

                <p>
                  Ordered On:{" "}
                  <span className="font-bold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="mt-10">
            <h3 className="text-2xl font-black mb-6">Ordered Products</h3>

            <div className="space-y-5">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="border border-[#eadccb] rounded-3xl p-4 md:p-5 flex flex-col sm:flex-row gap-4"
                >
                  <img
                    src={getOrderImage(item.image)}
                    alt={item.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border border-[#eadccb] shrink-0"
                  />

                  <div className="flex-1">
                    <h4 className="text-lg sm:text-xl md:text-2xl font-black">
                      {item.name}
                    </h4>

                    <div className="flex flex-wrap gap-5 mt-4 text-[#7b5b46]">
                      <p>Qty: {item.quantity}</p>

                      <p>Variant: {item.variant || "-"}</p>

                      <p>Price: ₹{item.price}</p>
                    </div>
                  </div>

                  <div className="sm:text-right flex flex-col gap-4">
                    <div className="text-2xl md:text-3xl font-black text-[#155b37]">
                      ₹{item.price * item.quantity}
                    </div>

                    {order.orderStatus === "Delivered" && (
                      <button
                        onClick={() => openReturnModal(item)}
                        className="w-full sm:w-auto h-11 px-5 rounded-xl bg-red-50 text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition"
                      >
                        <RotateCcw size={16} />
                        Return / Exchange
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[30px] relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
              <div className="p-6 md:p-8">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center"
                >
                  <X size={18} />
                </button>

                <h2 className="text-3xl font-black mb-2">Return / Exchange</h2>

                <p className="text-[#7b5b46] mb-8">
                  Submit your request for this product.
                </p>

                {/* PRODUCT */}
                <div className="flex items-center gap-4 border border-[#eadccb] rounded-2xl p-4 mb-6">
                  <img
                    src={getOrderImage(selectedItem.image)}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover border"
                  />

                  <div>
                    <h4 className="font-black text-lg">{selectedItem.name}</h4>

                    <p className="text-[#7b5b46] mt-1">
                      Qty: {selectedItem.quantity}
                    </p>
                  </div>
                </div>

                {/* TYPE */}
                <div className="mb-5">
                  <label className="font-bold text-sm">Request Type</label>

                  <select
                    value={returnType}
                    onChange={(e) => setReturnType(e.target.value)}
                    className="w-full mt-2 h-12 rounded-xl border border-[#eadccb] px-4"
                  >
                    <option>Return</option>

                    <option>Exchange</option>
                  </select>

                  {returnType === "Return" && (
                    <div className="space-y-4 mb-5">
                      <div>
                        <label className="font-bold text-sm">
                          Account Holder Name
                        </label>

                        <input
                          type="text"
                          value={bankDetails.accountHolderName}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              accountHolderName: e.target.value,
                            })
                          }
                          className="w-full mt-2 h-14 rounded-2xl border border-[#eadccb] px-4"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-sm">Bank Name</label>

                        <input
                          type="text"
                          value={bankDetails.bankName}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              bankName: e.target.value,
                            })
                          }
                          className="w-full mt-2 h-14 rounded-2xl border border-[#eadccb] px-4"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="font-bold text-sm">
                            Account Number
                          </label>

                          <input
                            type="text"
                            value={bankDetails.accountNumber}
                            onChange={(e) =>
                              setBankDetails({
                                ...bankDetails,
                                accountNumber: e.target.value,
                              })
                            }
                            className="w-full mt-2 h-14 rounded-2xl border border-[#eadccb] px-4"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-sm">IFSC Code</label>

                          <input
                            type="text"
                            value={bankDetails.ifscCode}
                            onChange={(e) =>
                              setBankDetails({
                                ...bankDetails,
                                ifscCode: e.target.value,
                              })
                            }
                            className="w-full mt-2 h-14 rounded-2xl border border-[#eadccb] px-4"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-sm">
                          UPI ID (Optional)
                        </label>

                        <input
                          type="text"
                          value={bankDetails.upiId}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              upiId: e.target.value,
                            })
                          }
                          className="w-full mt-2 h-14 rounded-2xl border border-[#eadccb] px-4"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* REASON */}
                <div>
                  <label className="font-bold text-sm">Reason</label>

                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please explain your issue..."
                    className="w-full mt-2 rounded-2xl border border-[#eadccb] p-4 resize-none outline-none"
                  />
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="flex-1 h-12 rounded-2xl border border-[#eadccb] font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={submitReturnRequest}
                    disabled={submitting}
                    className="flex-1 h-14 rounded-2xl bg-[#155b37] text-white font-black"
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default OrderDetails;
