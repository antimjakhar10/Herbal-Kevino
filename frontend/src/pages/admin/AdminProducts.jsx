import { useEffect, useState } from "react";
import { Edit, Plus, Search, Trash2, Upload, X } from "lucide-react";
import JoditEditor from "jodit-react";
import { useMemo } from "react";
import { api, getImageUrl } from "../../utils/api";

const initialForm = {
  name: "",
  category: "",
  shortDescription: "",
  description: "",
  price: "",
  mrp: "",
  stock: "",
  badge: "",
  tags: "",
  benefits: "",
  ingredients: "",
  howToUse: "",

  productDetailsText: "",
  faqText: "",
  reviewsText: "",

  variantOptionsText: "",
  shippingInfo: "",
  extraFeatures: "",

  rating: 5,
  reviewsCount: 0,

  isBestSeller: false,
  isNewArrival: false,
  featured: false,
  active: true,

  images: [],
};

const inputClass =
  "w-full h-14 rounded-2xl border border-[#eadccb] bg-white px-4 outline-none focus:border-[#155b37]";

const textareaClass =
  "w-full rounded-2xl border border-[#eadccb] bg-white px-4 py-4 outline-none focus:border-[#155b37]";

const AdminProducts = () => {
  const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [form, setForm] = useState(initialForm);

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 300,
      placeholder: "Start typing...",
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "link",
        "image",
        "|",
        "fontsize",
        "paragraph",
        "|",
        "undo",
        "redo",
      ],
    }),
    [],
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, productRes] = await Promise.all([
        api.get("/categories/admin"),
        api.get("/products/admin"),
      ]);

      setCategories(catRes.data.categories || []);

      setProducts(productRes.data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
            ? Array.from(files || [])
            : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);

    setEditingId(null);

    setShowForm(false);

    setMessage({
      type: "",
      text: "",
    });

    const fileInput = document.querySelector('input[name="images"]');

    if (fileInput) fileInput.value = "";
  };

  const toArray = (value) =>
    !value
      ? []
      : value
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);

  const parseLines = (text, keys) => {
    if (!text.trim()) return [];

    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const values = line.split("|").map((x) => x.trim());

        const obj = {};

        keys.forEach((key, index) => {
          obj[key] = values[index] || "";
        });

        return obj;
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);

      formData.append("category", form.category);

      formData.append("shortDescription", form.shortDescription);

      formData.append("description", form.description);

      formData.append("price", form.price);

      formData.append("mrp", form.mrp);

      formData.append("stock", form.stock);

      formData.append("badge", form.badge);

      formData.append("howToUse", form.howToUse);

      formData.append("rating", form.rating);

      formData.append("reviewsCount", form.reviewsCount);

      formData.append("tags", JSON.stringify(toArray(form.tags)));

      formData.append("benefits", JSON.stringify(toArray(form.benefits)));

      formData.append("ingredients", JSON.stringify(toArray(form.ingredients)));

      formData.append(
        "variantOptions",
        JSON.stringify(
          parseLines(form.variantOptionsText, [
            "name",
            "price",
            "mrp",
            "stock",
          ]),
        ),
      );

      formData.append(
        "shippingInfo",
        JSON.stringify(toArray(form.shippingInfo)),
      );

      formData.append(
        "extraFeatures",
        JSON.stringify(toArray(form.extraFeatures)),
      );

      formData.append(
        "productDetails",
        JSON.stringify(parseLines(form.productDetailsText, ["title", "value"])),
      );

      formData.append(
        "faq",
        JSON.stringify(parseLines(form.faqText, ["question", "answer"])),
      );

      formData.append(
        "reviews",
        JSON.stringify(
          parseLines(form.reviewsText, [
            "name",
            "role",
            "rating",
            "date",
            "message",
          ]),
        ),
      );

      formData.append("isBestSeller", form.isBestSeller);

      formData.append("isNewArrival", form.isNewArrival);

      formData.append("featured", form.featured);

      formData.append("active", form.active);

      form.images.forEach((img) => formData.append("images", img));

      if (editingId) {
        await api.put(`/products/admin/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/products/admin", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setMessage({
        type: "success",
        text: editingId
          ? "Product updated successfully"
          : "Product added successfully",
      });

      fetchData();

      resetForm();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to save product",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/admin/${id}`);

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (product) => {
    setShowForm(true);

    setEditingId(product._id);

    setForm({
      name: product.name || "",

      category: product.category?._id || "",

      shortDescription: product.shortDescription || "",

      description: product.description || "",

      price: product.price || "",

      mrp: product.mrp || "",

      stock: product.stock || "",

      badge: product.badge || "",

      tags: product.tags?.join(", ") || "",

      benefits: product.benefits?.join(", ") || "",

      ingredients: product.ingredients?.join(", ") || "",

      variantOptionsText:
        product.variantOptions
          ?.map((v) => `${v.name} | ${v.price} | ${v.mrp} | ${v.stock}`)
          .join("\n") || "",

      shippingInfo: product.shippingInfo?.join(", ") || "",

      extraFeatures: product.extraFeatures?.join(", ") || "",

      howToUse: product.howToUse || "",

      rating: product.rating || 5,

      reviewsCount: product.reviewsCount || 0,

      productDetailsText:
        product.productDetails
          ?.map((item) => `${item.title} | ${item.value}`)
          .join("\n") || "",

      faqText:
        product.faq
          ?.map((item) => `${item.question} | ${item.answer}`)
          .join("\n") || "",

      reviewsText:
        product.reviews
          ?.map(
            (item) =>
              `${item.name} | ${item.role} | ${item.rating} | ${item.date} | ${item.message}`,
          )
          .join("\n") || "",

      isBestSeller: product.isBestSeller || false,

      isNewArrival: product.isNewArrival || false,

      featured: product.featured || false,

      active: product.active ?? true,

      images: [],
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-black text-[#24110a]">Products</h2>

          <p className="text-[#7a6255] mt-2">
            Manage your herbal store products.
          </p>
        </div>
      </div>

      {message.text && (
        <div
          className={`mb-6 rounded-2xl px-5 py-4 font-bold ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* TOP BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="relative w-full lg:max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a6255]"
          />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 rounded-2xl border border-[#eadccb] bg-white pl-12 pr-4 outline-none focus:border-[#155b37]"
          />
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="h-14 px-7 rounded-2xl bg-[#155b37] text-white font-black flex items-center justify-center gap-2"
        >
          {showForm ? (
            <>
              <X size={18} />
              Close Form
            </>
          ) : (
            <>
              <Plus size={18} />
              Add Product
            </>
          )}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#eadccb] rounded-[30px] p-7 shadow-sm mb-10"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-black">
              {editingId ? "Edit Product" : "Add Product"}
            </h3>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="h-12 px-5 rounded-xl bg-red-50 text-red-600 font-bold"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div>
              <label className="font-bold block mb-2">Product Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="font-bold block mb-2">Category</label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select category</option>

                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-2">Short Description</label>

              <input
                type="text"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                placeholder="Small product summary"
                className={inputClass}
              />
            </div>

            <div>
              <label className="font-bold block mb-2">Price</label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="299"
                className={inputClass}
              />
            </div>

            <div>
              <label className="font-bold block mb-2">MRP</label>

              <input
                type="number"
                name="mrp"
                value={form.mrp}
                onChange={handleChange}
                placeholder="399"
                className={inputClass}
              />
            </div>

            <div>
              <label className="font-bold block mb-2">Stock</label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="50"
                className={inputClass}
              />
            </div>

            <div>
              <label className="font-bold block mb-2">Badge</label>

              <input
                type="text"
                name="badge"
                value={form.badge}
                onChange={handleChange}
                placeholder="Best Seller"
                className={inputClass}
              />
            </div>

            <div>
              <label className="font-bold block mb-2">Tags</label>

              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Ayurvedic, Herbal"
                className={inputClass}
              />
            </div>

            <div>
              <label className="font-bold block mb-2">Ingredients</label>

              <input
                type="text"
                name="ingredients"
                value={form.ingredients}
                onChange={handleChange}
                placeholder="Ashwagandha, Tulsi"
                className={inputClass}
              />
            </div>

            <div>
              <label className="font-bold block mb-2">Benefits</label>

              <input
                type="text"
                name="benefits"
                value={form.benefits}
                onChange={handleChange}
                placeholder="Pain Relief, Energy Boost"
                className={inputClass}
              />
            </div>

            <div>
              <label className="font-bold block mb-2">Variant Pricing</label>

              <textarea
                rows={6}
                name="variantOptionsText"
                value={form.variantOptionsText}
                onChange={handleChange}
                className={textareaClass}
                placeholder={`60 Tablets | 299 | 399 | 20
120 Tablets | 549 | 699 | 10
180 Tablets | 799 | 999 | 5`}
              />

              <p className="text-xs text-[#7a6255] mt-2">
                Format: Variant | Price | MRP | Stock
              </p>
            </div>

            <div>
              <label className="font-bold block mb-2">Rating</label>

              <input
                type="number"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="5"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <label className="font-bold block mb-2">Full Description</label>

              <div className="rounded-2xl overflow-hidden border border-[#eadccb]">
                <JoditEditor
                  value={form.description}
                  config={editorConfig}
                  onBlur={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      description: value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <label className="font-bold block mb-2">How To Use</label>

              <div className="rounded-2xl overflow-hidden border border-[#eadccb]">
                <JoditEditor
                  value={form.howToUse}
                  config={editorConfig}
                  onBlur={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      howToUse: value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <label className="font-bold block mb-2">Product Details</label>

              <textarea
                rows={6}
                name="productDetailsText"
                value={form.productDetailsText}
                onChange={handleChange}
                placeholder={`Weight | 60 Tablets
Shelf Life | 24 Months
Form | Tablet`}
                className={textareaClass}
              />

              <p className="text-xs text-[#7a6255] mt-2">
                One detail per line using: Title | Value
              </p>
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <label className="font-bold block mb-2">FAQ</label>

              <textarea
                rows={6}
                name="faqText"
                value={form.faqText}
                onChange={handleChange}
                placeholder={`Is it safe? | Yes completely herbal
How to use? | Take twice daily`}
                className={textareaClass}
              />

              <p className="text-xs text-[#7a6255] mt-2">
                One FAQ per line using: Question | Answer
              </p>
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <label className="font-bold block mb-2">Reviews</label>

              <textarea
                rows={7}
                name="reviewsText"
                value={form.reviewsText}
                onChange={handleChange}
                placeholder={`Rahul | Verified Buyer | 5 | 12 May 2026 | Amazing product
Priya | Featured Review | 4 | 10 May 2026 | Very effective`}
                className={textareaClass}
              />

              <p className="text-xs text-[#7a6255] mt-2">
                Format: Name | Role | Rating | Date | Review
              </p>
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <label className="font-bold block mb-2">Upload Images</label>

              <label className="border-2 border-dashed border-[#eadccb] rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-[#155b37] transition">
                <Upload size={42} className="text-[#155b37]" />

                <p className="mt-4 font-bold">Upload Product Images</p>

                <p className="text-sm text-[#7a6255] mt-1">
                  JPG, PNG up to 5 files
                </p>

                <input
                  type="file"
                  name="images"
                  multiple
                  onChange={handleChange}
                  className="hidden"
                />
              </label>

              {!!form.images.length && (
                <div className="flex flex-wrap gap-3 mt-5">
                  {form.images.map((img, index) => (
                    <div
                      key={index}
                      className="w-24 h-24 rounded-2xl overflow-hidden border border-[#eadccb]"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 xl:col-span-3 flex flex-wrap gap-5">
              {[
                ["isBestSeller", "Best Seller"],
                ["isNewArrival", "New Arrival"],
                ["featured", "Featured"],
                ["active", "Active"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 bg-[#fff8ee] border border-[#eadccb] rounded-2xl px-5 py-4 font-bold"
                >
                  <input
                    type="checkbox"
                    name={key}
                    checked={form[key]}
                    onChange={handleChange}
                  />

                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className="h-14 px-8 rounded-2xl bg-[#155b37] text-white font-black text-lg"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Product"
                  : "Add Product"}
            </button>
          </div>
        </form>
      )}

      {/* PRODUCTS TABLE */}
      <div className="bg-white border border-[#eadccb] rounded-[30px] overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eadccb]">
          <h3 className="text-2xl font-black">All Products</h3>

          <p className="text-[#7a6255]">Total: {filteredProducts.length}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-[#fff8ee]">
              <tr className="text-left">
                <th className="px-6 py-5">Image</th>

                <th className="px-6 py-5">Product</th>

                <th className="px-6 py-5">Category</th>

                <th className="px-6 py-5">Price</th>

                <th className="px-6 py-5">Stock</th>

                <th className="px-6 py-5">Status</th>

                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-t border-[#f3e7d8]">
                  <td className="px-6 py-5">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#fff8ee]">
                      {product.images?.[0] ? (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          🌿
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <h4 className="font-black text-lg">{product.name}</h4>
                  </td>

                  <td className="px-6 py-5">{product.category?.name || "-"}</td>

                  <td className="px-6 py-5 font-black text-lg">
                    ₹{product.price}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-black ${
                        product.stock <= 5
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-black ${
                        product.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="w-11 h-11 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!filteredProducts.length && (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-[#7a6255]">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
