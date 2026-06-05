import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useUserAuth } from "../context/UserAuthContext";

import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const { register } = useUserAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

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

      await register(formData);

      toast.success("Account created successfully");

      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Registration failed"
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
          <div className="bg-[#f7efe6] p-10 md:p-14 flex flex-col justify-center">
            <span className="inline-flex w-fit px-5 py-2 rounded-full bg-[#155b37] text-white font-bold text-sm tracking-widest">
              🌿 NATURAL WELLNESS
            </span>

            <h1 className="text-4xl md:text-5xl font-black leading-tight mt-7 text-[#1f120c]">
              Join Kevino Herbals
            </h1>

            <p className="mt-6 text-lg text-[#6d4d3b] leading-relaxed">
              Create your account and start shopping premium
              herbal wellness products.
            </p>
          </div>

          <div className="p-8 md:p-14">
            <div className="max-w-md mx-auto">
              <h2 className="text-4xl font-black text-[#1f120c]">
                Register
              </h2>

              <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-5"
              >
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-14 rounded-xl border border-[#e7d8c8] px-4 outline-none focus:border-[#155b37]"
                />

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-14 rounded-xl border border-[#e7d8c8] px-4 outline-none focus:border-[#155b37]"
                />

                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full h-14 rounded-xl border border-[#e7d8c8] px-4 outline-none focus:border-[#155b37]"
                />

                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-14 rounded-xl border border-[#e7d8c8] px-4 outline-none focus:border-[#155b37]"
                />

                <button
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-[#155b37] text-white font-black text-lg"
                >
                  {loading
                    ? "Please wait..."
                    : "Create Account"}
                </button>
              </form>

              <p className="text-center mt-8 text-[#7b5b46]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#155b37] font-black"
                >
                  Login
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

export default Register;