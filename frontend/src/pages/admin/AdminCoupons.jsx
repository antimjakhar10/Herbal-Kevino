import {
  useEffect,
  useState,
} from "react";

import {
  BadgePercent,
  Trash2,
} from "lucide-react";

import { api } from "../../utils/api";

import toast from "react-hot-toast";

const AdminCoupons = () => {
  const [coupons, setCoupons] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      code: "",
      type: "percentage",
      value: "",
      minOrderAmount: "",
      expiryDate: "",
    });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get(
        "/coupons/admin"
      );

      setCoupons(data.coupons || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post(
        "/coupons/admin",
        formData
      );

      toast.success(
        "Coupon created successfully"
      );

      setFormData({
        code: "",
        type: "percentage",
        value: "",
        minOrderAmount: "",
        expiryDate: "",
      });

      fetchCoupons();
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Failed to create coupon"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (
    id
  ) => {
    try {
      await api.delete(
        `/coupons/admin/${id}`
      );

      toast.success(
        "Coupon deleted"
      );

      fetchCoupons();
    } catch (error) {
      toast.error(
        "Failed to delete coupon"
      );
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#eef7f2] flex items-center justify-center text-[#155b37]">
          <BadgePercent size={26} />
        </div>

        <div>
          <h2 className="text-3xl font-black">
            Coupons Management
          </h2>

          <p className="text-[#7a6255]">
            Create and manage discount
            coupons
          </p>
        </div>
      </div>

      <div className="grid xl:grid-cols-[420px_1fr] gap-8">
        {/* LEFT */}
        <div className="bg-white border border-[#eadccb] rounded-3xl p-6 shadow-sm h-fit">
          <h3 className="text-2xl font-black mb-6">
            Create Coupon
          </h3>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block font-bold mb-2">
                Coupon Code
              </label>

              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={
                  handleChange
                }
                placeholder="HERBAL20"
                className="w-full h-14 rounded-2xl border border-[#eadccb] px-4 uppercase"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-2">
                Discount Type
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={
                  handleChange
                }
                className="w-full h-14 rounded-2xl border border-[#eadccb] px-4"
              >
                <option value="percentage">
                  Percentage
                </option>

                <option value="flat">
                  Flat
                </option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-2">
                Discount Value
              </label>

              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={
                  handleChange
                }
                placeholder="20"
                className="w-full h-14 rounded-2xl border border-[#eadccb] px-4"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-2">
                Minimum Order
              </label>

              <input
                type="number"
                name="minOrderAmount"
                value={
                  formData.minOrderAmount
                }
                onChange={
                  handleChange
                }
                placeholder="500"
                className="w-full h-14 rounded-2xl border border-[#eadccb] px-4"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">
                Expiry Date
              </label>

              <input
                type="date"
                name="expiryDate"
                value={
                  formData.expiryDate
                }
                onChange={
                  handleChange
                }
                className="w-full h-14 rounded-2xl border border-[#eadccb] px-4"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-[#155b37] text-white font-black text-lg"
            >
              {loading
                ? "Creating..."
                : "Create Coupon"}
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="bg-white border border-[#eadccb] rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#eadccb]">
            <h3 className="text-2xl font-black">
              All Coupons
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#fff5ea]">
                <tr>
                  <th className="text-left px-6 py-4">
                    Code
                  </th>

                  <th className="text-left px-6 py-4">
                    Type
                  </th>

                  <th className="text-left px-6 py-4">
                    Value
                  </th>

                  <th className="text-left px-6 py-4">
                    Min Order
                  </th>

                  <th className="text-left px-6 py-4">
                    Expiry
                  </th>

                  <th className="text-left px-6 py-4">
                    Status
                  </th>

                  <th className="text-left px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {coupons.map(
                  (coupon) => (
                    <tr
                      key={coupon._id}
                      className="border-t border-[#f1e4d4]"
                    >
                      <td className="px-6 py-5 font-black text-[#155b37]">
                        {
                          coupon.code
                        }
                      </td>

                      <td className="px-6 py-5 capitalize">
                        {
                          coupon.type
                        }
                      </td>

                      <td className="px-6 py-5 font-bold">
                        {coupon.type ===
                        "percentage"
                          ? `${coupon.value}%`
                          : `₹${coupon.value}`}
                      </td>

                      <td className="px-6 py-5">
                        ₹
                        {
                          coupon.minOrderAmount
                        }
                      </td>

                      <td className="px-6 py-5">
                        {new Date(
                          coupon.expiryDate
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            coupon.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {coupon.active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() =>
                            deleteCoupon(
                              coupon._id
                            )
                          }
                          className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center"
                        >
                          <Trash2
                            size={18}
                          />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {!coupons.length && (
              <div className="py-20 text-center">
                <h3 className="text-2xl font-black">
                  No Coupons Yet
                </h3>

                <p className="text-[#7a6255] mt-2">
                  Create your first
                  coupon
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;