import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useUserAuth } from "../context/UserAuthContext";

import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const { login } = useUserAuth();

  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await login(formData.email, formData.password);

      toast.success("Login successful");

      navigate(redirect);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 overflow-hidden rounded-[34px] border border-[#eadccb] bg-white shadow-sm">
          {/* LEFT */}
          <div className="bg-gradient-to-br from-[#155b37] to-[#0f3f26] text-white p-10 md:p-14 flex flex-col justify-center">
            <span className="inline-flex w-fit px-5 py-2 rounded-full bg-white/20 border border-white/20 font-bold text-sm tracking-widest">
              🌿 KEVINO HERBALS
            </span>

            <h1 className="text-4xl md:text-5xl font-black leading-tight mt-7">
              Welcome Back
            </h1>

            <p className="mt-6 text-lg text-white/85 leading-relaxed">
              Login to continue shopping premium Ayurvedic &
              herbal wellness products.
            </p>

            <div className="space-y-4 mt-10">
              {[
                "Premium herbal wellness products",
                "Easy order tracking",
                "Fast & secure checkout",
                "Wishlist & cart sync",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-white text-[#155b37] flex items-center justify-center text-sm font-black">
                    ✓
                  </div>

                  <p className="font-medium">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="p-8 md:p-14">
            <div className="max-w-md mx-auto">
              <h2 className="text-4xl font-black text-[#1f120c]">
                Login
              </h2>

              <p className="text-[#7b5b46] mt-3">
                Enter your credentials to continue
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-6"
              >
                <div>
                  <label className="font-bold text-[#2b130b]">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full mt-3 h-14 rounded-xl border border-[#e7d8c8] px-4 outline-none focus:border-[#155b37]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#2b130b]">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full mt-3 h-14 rounded-xl border border-[#e7d8c8] px-4 outline-none focus:border-[#155b37]"
                  />
                </div>

                <button
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-[#155b37] text-white font-black text-lg hover:scale-[1.01] transition disabled:opacity-70"
                >
                  {loading
                    ? "Please wait..."
                    : "Login"}
                </button>
              </form>

              <p className="text-center mt-8 text-[#7b5b46]">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#155b37] font-black"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;