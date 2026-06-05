import { useEffect, useState } from "react";
import { Edit, Plus, Trash2, Upload, X } from "lucide-react";
import { api, getImageUrl } from "../../utils/api";

const initialForm = {
  name: "",
  order: "",
  active: true,
  image: null,
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories/admin");
      setCategories(data.categories || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load categories");
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

  const handleEdit = (cat) => {
    setEditingId(cat._id);

    setForm({
      name: cat.name || "",
      order: cat.order || "",
      active: cat.active ?? true,
      image: null,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return alert("Category name is required");
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("order", form.order || 0);
    formData.append("active", form.active);

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      setLoading(true);

      if (editingId) {
        await api.put(`/categories/admin/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/categories/admin", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      console.log("Category save error:", error.response?.data || error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to save category"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/admin/${id}`);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-black mb-8">Categories</h2>

      <div className="space-y-7">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#eadccb] rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 mb-5">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Plus size={21} />
              {editingId ? "Edit Category" : "Add Category"}
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
              label="Category Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Pain Relief"
            />

            <Input
              label="Order"
              name="order"
              type="number"
              value={form.order}
              onChange={handleChange}
              placeholder="1"
            />

            <div className="md:col-span-2 xl:col-span-3">
              <label className="text-sm font-bold">Image</label>

              <label className="mt-2 h-32 border-2 border-dashed border-[#eadccb] rounded-xl flex flex-col items-center justify-center cursor-pointer bg-[#fffaf4]">
                <Upload size={24} className="text-[#155b37]" />

                <span className="text-sm text-[#7a6255] mt-2">
                  {form.image ? form.image.name : "Upload category image"}
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
                ? "Update Category"
                : "Add Category"}
            </button>
          </div>
        </form>

        <div className="bg-white border border-[#eadccb] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#eadccb]">
            <h3 className="text-xl font-black">All Categories</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-[#fff7ee] text-left">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Order</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id} className="border-t border-[#f0e5d8]">
                    <td className="p-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-[#fff7ee] border border-[#eadccb]">
                        {cat.image ? (
                          <img
                            src={getImageUrl(cat.image)}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            🌿
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-bold">{cat.name}</td>
                    <td className="p-4 text-[#7a6255]">{cat.slug}</td>
                    <td className="p-4">{cat.order}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          cat.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {cat.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="w-10 h-10 rounded-xl bg-green-50 text-green-700 inline-flex items-center justify-center mr-2"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => deleteCategory(cat._id)}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-600 inline-flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

                {!categories.length && (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-[#7a6255]">
                      No categories added yet.
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

export default AdminCategories;