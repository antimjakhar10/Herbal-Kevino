import { useState } from "react";
import { X } from "lucide-react";
import { useUserAuth } from "../context/UserAuthContext";
import toast from "react-hot-toast";

const AuthModal = ({ open, onClose }) => {
  const { login, register } = useUserAuth();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

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

      if (isLogin) {
        await login(formData.email, formData.password);

        toast.success("Login successful");
      } else {
        await register(formData);

        toast.success("Account created successfully");
      }

      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[28px] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#eee2d3]">
          <div>
            <h2 className="text-2xl font-black text-[#1f120c]">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="text-[#7a6255] mt-1">
              {isLogin
                ? "Login to continue shopping"
                : "Join Kevino Herbals"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-[#f8f3ee] flex items-center justify-center"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-14 rounded-xl border border-[#e7d8c8] px-4 outline-none"
              />

              <input
                type="text"
                name="phone"
                required
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-14 rounded-xl border border-[#e7d8c8] px-4 outline-none"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            required
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-14 rounded-xl border border-[#e7d8c8] px-4 outline-none"
          />

          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-14 rounded-xl border border-[#e7d8c8] px-4 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl bg-[#155b37] text-white font-bold text-lg"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-[#155b37] font-semibold"
          >
            {isLogin
              ? "Create new account"
              : "Already have an account?"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;