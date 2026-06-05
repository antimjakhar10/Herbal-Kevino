import { useEffect, useState } from "react";
import { Eye, Download, } from "lucide-react";
import { api } from "../../utils/api";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",

  Confirmed: "bg-blue-100 text-blue-700",

  Packed: "bg-indigo-100 text-indigo-700",

  Shipped: "bg-purple-100 text-purple-700",

  "Out For Delivery": "bg-orange-100 text-orange-700",

  Delivered: "bg-green-100 text-green-700",

  Cancelled: "bg-red-100 text-red-700",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/admin");

      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/admin/${id}`, {
        status,
      });

      await fetchOrders();

      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              orderStatus: status,
            }
          : null,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${api.defaults.baseURL}/orders/invoice/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `invoice-${orderId}.pdf`;

      link.click();
    } catch (error) {
      console.log(error);
    }
  };


  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-semibold">
        Loading orders...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#24110a]">
            Orders Management
          </h2>

          <p className="text-[#7a6255] mt-1">
            Manage customer orders dynamically.
          </p>
        </div>

        <div className="bg-white border border-[#eadccb] rounded-2xl px-5 py-3 shadow-sm w-fit">
          <p className="text-sm text-[#7a6255]">Total Orders</p>

          <h3 className="text-2xl font-black">{orders.length}</h3>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-[#eadccb] rounded-3xl p-10 text-center">
          <h3 className="text-2xl font-bold mb-2">No Orders Found</h3>

          <p className="text-[#7a6255]">
            Orders will appear here once users place them.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#eadccb] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="bg-[#fff5ea] border-b border-[#eadccb]">
                <tr>
                  <th className="text-left px-6 py-4 font-bold">Order ID</th>

                  <th className="text-left px-6 py-4 font-bold">Customer</th>

                  <th className="text-left px-6 py-4 font-bold">Amount</th>

                  <th className="text-left px-6 py-4 font-bold">Payment</th>

                  <th className="text-left px-6 py-4 font-bold">Status</th>

                  <th className="text-left px-6 py-4 font-bold">Date</th>

                  <th className="text-left px-6 py-4 font-bold">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-[#f3e5d6] hover:bg-[#fffaf5] transition"
                  >
                    <td className="px-6 py-5 font-semibold">
                      #{order._id.slice(-6)}
                    </td>

                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold">
                          {order.shippingAddress?.fullName}
                        </p>

                        <p className="text-sm text-[#7a6255]">
                          {order.user?.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5 font-bold text-[#155b37]">
                      ₹{order.totalPrice}
                    </td>

                    <td className="px-6 py-5">{order.paymentMethod}</td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          statusColors[order.orderStatus]
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-[#7a6255]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#155b37] text-white font-semibold hover:opacity-90 transition"
                      >
                        <Eye size={18} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-black">Order Details</h3>

                <p className="text-[#7a6255] mt-1 break-all">
                  #{selectedOrder._id}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => downloadInvoice(selectedOrder._id)}
                  className="h-11 px-4 rounded-xl bg-[#155b37] text-white font-bold flex items-center gap-2"
                >
                  <Download size={18} />
                  Invoice
                </button>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="h-11 px-4 rounded-xl bg-[#f3f3f3] font-semibold"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-black mb-3 text-lg">Customer</h4>

                <div className="space-y-2 text-[#4b3425]">
                  <p>{selectedOrder.shippingAddress?.fullName}</p>

                  <p>{selectedOrder.shippingAddress?.phone}</p>

                  <p>{selectedOrder.user?.email}</p>
                </div>
              </div>

              <div>
                <h4 className="font-black mb-3 text-lg">Address</h4>

                <div className="space-y-2 text-[#4b3425]">
                  <p>{selectedOrder.shippingAddress?.street}</p>

                  <p>
                    {selectedOrder.shippingAddress?.city},{" "}
                    {selectedOrder.shippingAddress?.state}
                  </p>

                  <p>{selectedOrder.shippingAddress?.pincode}</p>

                  <p>{selectedOrder.shippingAddress?.country}</p>
                </div>
              </div>

              <div>
                <h4 className="font-black mb-3 text-lg">Payment</h4>

                <div className="space-y-2 text-[#4b3425]">
                  <p>Method: {selectedOrder.paymentMethod}</p>

                  <p>Paid: {selectedOrder.isPaid ? "Yes" : "No"}</p>

                  <p>Total: ₹{selectedOrder.totalPrice}</p>

                  <div className="pt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        statusColors[selectedOrder.orderStatus]
                      }`}
                    >
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h4 className="font-black text-xl">Products</h4>

                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) =>
                    updateStatus(selectedOrder._id, e.target.value)
                  }
                  className="px-4 py-3 rounded-xl border border-[#eadccb] outline-none"
                >
                  <option value="Pending">Pending</option>

                  <option value="Confirmed">Confirmed</option>

                  <option value="Packed">Packed</option>

                  <option value="Out For Delivery">Out For Delivery</option>

                  <option value="Shipped">Shipped</option>

                  <option value="Delivered">Delivered</option>

                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-4">
                {selectedOrder.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 border border-[#eadccb] rounded-2xl p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-2xl object-cover border border-[#eadccb]"
                    />

                    <div className="flex-1">
                      <h5 className="font-bold text-lg">{item.name}</h5>

                      <div className="flex flex-wrap gap-4 text-sm text-[#7a6255] mt-2">
                        <p>Qty: {item.quantity}</p>

                        <p>Variant: {item.variant || "-"}</p>

                        <p>Price: ₹{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
