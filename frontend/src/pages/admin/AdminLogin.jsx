import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

 const [form, setForm] = useState({
  email: "",
  password: "",
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7ee] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-[28px] shadow-xl border border-[#eadccb] p-8">
        <div className="w-16 h-16 rounded-full bg-[#155b37] text-white flex items-center justify-center mx-auto">
          <Leaf size={30} />
        </div>

        <h1 className="text-3xl font-black text-center mt-5 text-[#24110a]">
          Admin Login
        </h1>

        <p className="text-center text-[#7a6255] mt-2">
          Manage herbal products, categories and testimonials.
        </p>

        {error && (
          <div className="mt-5 bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label className="font-bold text-sm">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-2 h-13 border border-[#eadccb] rounded-xl px-4 outline-none focus:border-[#155b37]"
            />
          </div>

          <div>
            <label className="font-bold text-sm">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-2 h-13 border border-[#eadccb] rounded-xl px-4 outline-none focus:border-[#155b37]"
            />
          </div>

          <button
            disabled={loading}
            className="w-full h-13 rounded-xl bg-[#155b37] text-white font-bold hover:bg-[#0f472b] transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;