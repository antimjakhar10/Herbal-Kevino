import { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import { api, getImageUrl } from "../../utils/api";

const statuses = [
  "Requested",
  "Approved",
  "Pickup Scheduled",
  "Product Received",
  "Refunded",
  "Completed",
  "Rejected",
];

const AdminReturns = () => {
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const [refundMethod, setRefundMethod] = useState("");

  const [refundTransactionId, setRefundTransactionId] = useState("");

  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get("/returns/admin");

      setRequests(data.requests || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/returns/admin/${id}`, {
        status,
      });

      fetchRequests();
    } catch (error) {
      console.log(error);
    }
  };

  const saveRefundDetails = async () => {
    try {
      await api.put(`/returns/admin/${selectedRequest._id}`, {
  refundMethod,
  refundTransactionId,
  adminNote,
  status: "Refunded",
});

      fetchRequests();

      alert("Refund details updated");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div className="text-xl font-bold">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-black">Returns & Exchanges</h2>

        <p className="text-[#7a6255] mt-2">
          Manage return & exchange requests.
        </p>
      </div>

      <div className="bg-white border border-[#eadccb] rounded-[30px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fff8ee]">
              <tr className="text-left">
                <th className="px-6 py-5">Product</th>

                <th className="px-6 py-5">User</th>

                <th className="px-6 py-5">Type</th>

                <th className="px-6 py-5">Reason</th>

                <th className="px-6 py-5">Refund</th>

                <th className="px-6 py-5">Status</th>

                <th className="px-6 py-5">Update</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((item) => (
                <tr key={item._id} className="border-t border-[#f1e4d4]">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={getImageUrl(item.product?.images?.[0])}
                        alt=""
                        className="w-16 h-16 rounded-2xl object-cover border"
                      />

                      <div>
                        <h4 className="font-black">{item.product?.name}</h4>

                        <p className="text-sm text-[#7a6255]">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <h4 className="font-bold">{item.user?.name}</h4>

                    <p className="text-sm text-[#7a6255]">{item.user?.email}</p>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-black ${
                        item.type === "Return"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>

                  <td className="px-6 py-5 max-w-[300px]">{item.reason}</td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-black ${
                        item.refundStatus === "Processed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.refundStatus}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="px-4 py-2 rounded-full bg-[#eef7f2] text-[#155b37] text-xs font-black">
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedRequest(item);

                          setRefundMethod(item.refundMethod || "");

                          setRefundTransactionId(
                            item.refundTransactionId || "",
                          );

                          setAdminNote(item.adminNote || "");
                        }}
                        className="w-11 h-11 rounded-xl bg-[#eef7f2] text-[#155b37] flex items-center justify-center"
                      >
                        <Eye size={18} />
                      </button>

                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item._id, e.target.value)}
                        className="h-11 rounded-xl border border-[#eadccb] px-4"
                      >
                        {statuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}

              {!requests.length && (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-[#7a6255]">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[30px] p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center"
            >
              <X size={18} />
            </button>

            <h2 className="text-3xl font-black mb-8">Return Request Details</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#fffaf5] border border-[#eadccb] rounded-2xl p-5">
                <h3 className="font-black mb-4">Customer</h3>

                <div className="space-y-2 text-[#6b4d3f]">
                  <p>Name: {selectedRequest.user?.name}</p>

                  <p>Email: {selectedRequest.user?.email}</p>
                </div>
              </div>

              <div className="bg-[#fffaf5] border border-[#eadccb] rounded-2xl p-5">
                <h3 className="font-black mb-4">Product</h3>

                <div className="space-y-2 text-[#6b4d3f]">
                  <p>{selectedRequest.product?.name}</p>

                  <p>Qty: {selectedRequest.quantity}</p>

                  <p>Type: {selectedRequest.type}</p>
                </div>
              </div>

              <div className="md:col-span-2 bg-[#fffaf5] border border-[#eadccb] rounded-2xl p-5">
                <h3 className="font-black mb-4">Reason</h3>

                <p className="text-[#6b4d3f]">{selectedRequest.reason}</p>
              </div>

              <div className="md:col-span-2 bg-[#fffaf5] border border-[#eadccb] rounded-2xl p-5">
                <h3 className="font-black mb-4">Refund Details</h3>

                <div className="grid md:grid-cols-2 gap-4 text-[#6b4d3f]">
                  <p>Refund Amount: ₹{selectedRequest.refundAmount}</p>

                  <p>Refund Status: {selectedRequest.refundStatus}</p>

                  <p>Method: {selectedRequest.refundMethod || "-"}</p>

                  <p>
                    Transaction Id: {selectedRequest.refundTransactionId || "-"}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 bg-[#fffaf5] border border-[#eadccb] rounded-2xl p-5">
                <h3 className="font-black mb-4">Bank Details</h3>

                <div className="grid md:grid-cols-2 gap-4 text-[#6b4d3f]">
                  <p>
                    Account Holder:{" "}
                    {selectedRequest.bankDetails?.accountHolderName || "-"}
                  </p>

                  <p>Bank: {selectedRequest.bankDetails?.bankName || "-"}</p>

                  <p>
                    Account No:{" "}
                    {selectedRequest.bankDetails?.accountNumber || "-"}
                  </p>

                  <p>IFSC: {selectedRequest.bankDetails?.ifscCode || "-"}</p>

                  <p>UPI: {selectedRequest.bankDetails?.upiId || "-"}</p>
                </div>
              </div>
              <div className="md:col-span-2 bg-[#fffaf5] border border-[#eadccb] rounded-2xl p-5">
                <h3 className="font-black mb-5">Admin Refund Details</h3>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-bold text-sm">Refund Method</label>

                    <input
                      value={refundMethod}
                      onChange={(e) => setRefundMethod(e.target.value)}
                      placeholder="UPI / Bank Transfer"
                      className="w-full mt-2 h-12 rounded-xl border border-[#eadccb] px-4"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-sm">Transaction ID</label>

                    <input
                      value={refundTransactionId}
                      onChange={(e) => setRefundTransactionId(e.target.value)}
                      placeholder="Refund transaction id"
                      className="w-full mt-2 h-12 rounded-xl border border-[#eadccb] px-4"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-bold text-sm">Admin Note</label>

                    <textarea
                      rows={4}
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Write note..."
                      className="w-full mt-2 rounded-2xl border border-[#eadccb] p-4"
                    />
                  </div>
                </div>

                <button
                  onClick={saveRefundDetails}
                  className="mt-6 h-12 px-6 rounded-xl bg-[#155b37] text-white font-black"
                >
                  Save Refund Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReturns;
