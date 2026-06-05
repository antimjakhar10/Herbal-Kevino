import { useEffect, useState } from "react";
import { Edit, Plus, Trash2, Upload, X } from "lucide-react";
import { api, getImageUrl } from "../../utils/api";

const initialForm = {
  name: "",
  role: "Verified Buyer",
  message: "",
  rating: 5,
  order: 0,
  active: true,
  image: null,
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await api.get("/testimonials/admin");
      setTestimonials(data.testimonials || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load testimonials");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    const fileInput = document.querySelector('input[name="image"]');
    if (fileInput) fileInput.value = "";
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      role: item.role || "Verified Buyer",
      message: item.message || "",
      rating: item.rating || 5,
      order: item.order || 0,
      active: item.active ?? true,
      image: null,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.message.trim()) {
      return alert("Name and message are required");
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("role", form.role);
    formData.append("message", form.message);
    formData.append("rating", form.rating);
    formData.append("order", form.order);
    formData.append("active", form.active);

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      setLoading(true);

      if (editingId) {
        await api.put(`/testimonials/admin/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/testimonials/admin", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.log("Testimonial save error:", error.response?.data || error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to save testimonial"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;

    try {
      await api.delete(`/testimonials/admin/${id}`);
      fetchTestimonials();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete testimonial");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-black mb-8">Testimonials</h2>

      <div className="space-y-7">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#eadccb] rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 mb-5">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Plus size={21} />
              {editingId ? "Edit Testimonial" : "Add Testimonial"}
            </h3>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold flex items-center gap-2"
              >
                <X size={16} />
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Input
              label="Customer Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ananya Sharma"
            />

            <Input
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Verified Buyer"
            />

            <Input
              label="Rating"
              name="rating"
              type="number"
              min="1"
              max="5"
              value={form.rating}
              onChange={handleChange}
            />

            <Input
              label="Order"
              name="order"
              type="number"
              value={form.order}
              onChange={handleChange}
            />

            <div className="md:col-span-2 xl:col-span-3">
              <label className="text-sm font-bold">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="4"
                placeholder="Write customer feedback..."
                className="w-full mt-2 rounded-xl border border-[#eadccb] px-4 py-3 outline-none focus:border-[#155b37]"
              />
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <label className="text-sm font-bold">Customer Image</label>
              <label className="mt-2 h-32 border-2 border-dashed border-[#eadccb] rounded-xl flex flex-col items-center justify-center cursor-pointer bg-[#fffaf4]">
                <Upload size={24} className="text-[#155b37]" />
                <span className="text-sm text-[#7a6255] mt-2">
                  {form.image ? form.image.name : "Upload image optional"}
                </span>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            <label className="md:col-span-2 xl:col-span-3 flex items-center gap-3 bg-[#fffaf4] border border-[#eadccb] rounded-xl px-3 py-3">
              <input
                name="active"
                type="checkbox"
                checked={form.active}
                onChange={handleChange}
              />
              <span className="font-semibold text-sm">Active</span>
            </label>

            <button
              disabled={loading}
              className="md:col-span-2 xl:col-span-3 w-full h-12 rounded-xl bg-[#155b37] text-white font-bold disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Testimonial"
                : "Add Testimonial"}
            </button>
          </div>
        </form>

        <div className="bg-white border border-[#eadccb] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#eadccb]">
            <h3 className="text-xl font-black">All Testimonials</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-[#fff7ee] text-left">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {testimonials.map((item) => (
                  <tr key={item._id} className="border-t border-[#f0e5d8]">
                    <td className="p-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-[#fff7ee] border border-[#eadccb] flex items-center justify-center font-bold text-[#155b37]">
                        {item.image ? (
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          item.name?.charAt(0)
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-bold">{item.name}</td>
                    <td className="p-4">{item.role}</td>
                    <td className="p-4 max-w-[340px] text-[#7a6255]">
                      {item.message}
                    </td>
                    <td className="p-4 text-[#f5b400]">
                      {"★".repeat(item.rating || 5)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleEdit(item)}
                        className="w-10 h-10 rounded-xl bg-green-50 text-green-700 inline-flex items-center justify-center mr-2"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => deleteTestimonial(item._id)}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-600 inline-flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

                {!testimonials.length && (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-[#7a6255]">
                      No testimonials added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-bold">{label}</label>
    <input
      {...props}
      className="w-full mt-2 h-12 rounded-xl border border-[#eadccb] px-4 outline-none focus:border-[#155b37]"
    />
  </div>
);

export default AdminTestimonials;