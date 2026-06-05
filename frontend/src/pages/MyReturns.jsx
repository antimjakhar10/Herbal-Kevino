import { useEffect, useState } from "react";

import { RotateCcw, RefreshCcw, Wallet, CheckCircle2 } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { api, getImageUrl } from "../utils/api";

const statusColors = {
  Requested: "bg-yellow-100 text-yellow-700",

  Approved: "bg-blue-100 text-blue-700",

  "Pickup Scheduled": "bg-purple-100 text-purple-700",

  "Product Received": "bg-indigo-100 text-indigo-700",

  Refunded: "bg-green-100 text-green-700",

  Completed: "bg-green-100 text-green-700",

  Rejected: "bg-red-100 text-red-700",
};

const MyReturns = ({ embedded = false }) => {
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const { data } = await api.get("/returns/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(data.requests || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-black">
        Loading...
      </div>
    );
  }

  return (
    <div className={`${embedded ? "" : "min-h-screen"} bg-[#fffaf5]`}>
      {!embedded && <Navbar />}

      <section className={`${embedded ? "" : "max-w-7xl mx-auto"} px-4 py-8`}>
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
            My Returns & Exchanges
          </h1>

          <p className="text-[#7b5b46] mt-3 text-base sm:text-lg max-w-2xl">
            Track your return, exchange and refund requests.
          </p>
        </div>

        {!requests.length ? (
          <div className="bg-white border border-[#eadccb] rounded-3xl p-8 sm:p-12 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-[#edf6ef] flex items-center justify-center text-[#155b37]">
              <RotateCcw size={42} />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black mt-6">
              No Return Requests
            </h3>

            <p className="text-[#7b5b46] mt-3">
              You have not submitted any return or exchange requests yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {requests.map((item) => (
              <div
                key={item._id}
                className="
bg-white
border
border-[#eadccb]
rounded-3xl
p-4
sm:p-6
shadow-sm
hover:shadow-lg
transition
"
              >
                {/* TOP */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#eadccb] pb-5">
                  <div>
                    <p className="text-[#7b5b46] text-sm">Request ID</p>

                    <h3 className="text-2xl font-black mt-1">
                      #{item._id.slice(-6)}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-black ${
                        item.type === "Return"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.type}
                    </span>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-black ${
                        statusColors[item.status]
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* PRODUCT */}
                <div className="flex flex-col sm:flex-row gap-5 mt-6">
                  <img
                    src={getImageUrl(item.product?.images?.[0])}
                    alt=""
                    className="
w-full
sm:w-32
md:w-36
h-52
sm:h-32
md:h-36
rounded-3xl
border
border-[#eadccb]
object-cover
shrink-0
"
                  />

                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                      {item.product?.name}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 text-[#6b4d3f]">
                      <p>
                        Qty: <span className="font-bold">{item.quantity}</span>
                      </p>

                      <p>
                        Refund:{" "}
                        <span className="font-bold text-[#155b37]">
                          ₹{item.refundAmount}
                        </span>
                      </p>

                      <p>
                        Refund Status:{" "}
                        <span className="font-bold">{item.refundStatus}</span>
                      </p>
                    </div>

                    {/* REASON */}
                    <div className="
mt-5
bg-[#fffaf5]
border
border-[#eadccb]
rounded-2xl
p-4
sm:p-5
">
                      <h4 className="font-black mb-2">Reason</h4>

                      <p className="text-[#6b4d3f]">{item.reason}</p>
                    </div>
                  </div>
                </div>

                {/* REFUND DETAILS */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="
bg-[#fffaf5]
border
border-[#eadccb]
rounded-2xl
p-4
sm:p-5
">
                    <div className="w-12 h-12 rounded-2xl bg-[#edf6ef] text-[#155b37] flex items-center justify-center mb-4">
                      <Wallet size={22} />
                    </div>

                    <h4 className="font-black">Refund Method</h4>

                    <p className="mt-2 text-[#6b4d3f]">
                      {item.refundMethod || "Pending"}
                    </p>
                  </div>

                  <div className="bg-[#fffaf5] border border-[#eadccb] rounded-2xl p-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#edf6ef] text-[#155b37] flex items-center justify-center mb-4">
                      <RefreshCcw size={22} />
                    </div>

                    <h4 className="font-black">Transaction ID</h4>

                    <p className="mt-2 text-[#6b4d3f] break-all">
                      {item.refundTransactionId || "Pending"}
                    </p>
                  </div>

                  <div className="bg-[#fffaf5] border border-[#eadccb] rounded-2xl p-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#edf6ef] text-[#155b37] flex items-center justify-center mb-4">
                      <CheckCircle2 size={22} />
                    </div>

                    <h4 className="font-black">Admin Note</h4>

                    <p className="mt-2 text-[#6b4d3f]">
                      {item.adminNote || "No note available"}
                    </p>
                  </div>
                </div>

                {item.type === "Return" && (
                  <div className="mt-6 bg-[#fffaf5] border border-[#eadccb] rounded-2xl p-5">
                    <h4 className="font-black mb-4">Submitted Bank Details</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <p className="break-words text-[#6b4d3f]">
                        Account Holder:
                        {item.bankDetails?.accountHolderName || "-"}
                      </p>

                      <p className="break-words text-[#6b4d3f]">
                        Bank:
                        {item.bankDetails?.bankName || "-"}
                      </p>

                      <p className="break-words text-[#6b4d3f]">
                        Account:
                        {item.bankDetails?.accountNumber || "-"}
                      </p>

                      <p className="break-words text-[#6b4d3f]">
                        IFSC:
                        {item.bankDetails?.ifscCode || "-"}
                      </p>

                      <p className="break-words text-[#6b4d3f]">
                        UPI:
                        {item.bankDetails?.upiId || "-"}
                      </p>
                    </div>
                  </div>
                )}

                {item.refundStatus === "Processed" && (
                  <div className="
mt-6
bg-green-50
border
border-green-200
rounded-2xl
p-4
sm:p-5
">
                    <h4 className="font-black text-green-700">
                      Refund Processed Successfully
                    </h4>

                    <p className="mt-2 text-green-700">
                     <span className="font-black text-[#155b37] text-lg"> ₹{item.refundAmount} </span> has been refunded successfully.
                    </p>

                    <p className="mt-2">
                      Transaction ID:
                      <span className="font-bold">
                        {" "}
                        {item.refundTransactionId}
                      </span>
                    </p>

                    <p className="mt-2">
                      Method:
                      <span className="font-bold"> {item.refundMethod}</span>
                    </p>
                  </div>
                )}

                {/* DATE */}
                <div className="mt-6 text-sm text-[#7b5b46] border-t border-[#eadccb] pt-4">
                  Requested On: {new Date(item.createdAt).toLocaleDateString()}
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

export default MyReturns;
