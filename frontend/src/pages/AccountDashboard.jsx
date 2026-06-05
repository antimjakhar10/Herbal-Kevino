import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  User,
  Package2,
  Heart,
  ShoppingCart,
  RotateCcw,
  HelpCircle,
  LogOut,
  Menu,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Profile from "./Profile";
import Orders from "./Orders";
import Wishlist from "./Wishlist";
import Cart from "./Cart";
import MyReturns from "./MyReturns";
import HelpCenter from "./HelpCenter";

import { useUserAuth } from "../context/UserAuthContext";

const AccountDashboard = () => {
  const navigate = useNavigate();

  const { user, logout, wishlist, cart } = useUserAuth();

  const [activeTab, setActiveTab] = useState("dashboard");

  const [mobileMenu, setMobileMenu] = useState(false);

  const menus = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      key: "profile",
      label: "My Profile",
      icon: User,
    },
    {
      key: "orders",
      label: "My Orders",
      icon: Package2,
    },
    {
      key: "wishlist",
      label: "Wishlist",
      icon: Heart,
    },
    {
      key: "cart",
      label: "Cart",
      icon: ShoppingCart,
    },
    {
      key: "returns",
      label: "Returns",
      icon: RotateCcw,
    },
    {
      key: "help",
      label: "Help Center",
      icon: HelpCircle,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile embedded />;

      case "orders":
        return <Orders embedded />;

      case "wishlist":
        return <Wishlist embedded />;

      case "cart":
        return <Cart embedded />;

      case "returns":
        return <MyReturns embedded />;

      case "help":
        return <HelpCenter embedded />;

      default:
        return (
          <>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl border p-6">
                <p className="text-gray-500">Wishlist</p>
                <h3 className="text-4xl font-black mt-2">
                  {wishlist.length}
                </h3>
              </div>

              <div className="bg-white rounded-3xl border p-6">
                <p className="text-gray-500">Cart Items</p>
                <h3 className="text-4xl font-black mt-2">
                  {cart.length}
                </h3>
              </div>

              <div className="bg-white rounded-3xl border p-6">
                <p className="text-gray-500">Orders</p>
                <h3 className="text-4xl font-black mt-2">
                  --
                </h3>
              </div>

              <div className="bg-white rounded-3xl border p-6">
                <p className="text-gray-500">Returns</p>
                <h3 className="text-4xl font-black mt-2">
                  --
                </h3>
              </div>
            </div>

            <div className="bg-white rounded-3xl border p-8 mt-8">
              <h2 className="text-3xl font-black">
                Welcome Back 👋
              </h2>

              <p className="text-gray-600 mt-3">
                {user?.name}
              </p>

              <p className="text-gray-500 mt-1">
                {user?.email}
              </p>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* MOBILE BUTTON */}

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden mb-5 flex items-center gap-2 bg-white px-4 py-3 rounded-xl border"
        >
          <Menu size={18} />
          Menu
        </button>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* SIDEBAR */}

          <aside
            className={`bg-white border rounded-3xl p-5 h-fit ${
              mobileMenu ? "block" : "hidden lg:block"
            }`}
          >
            <div className="pb-5 border-b">
              <h2 className="font-black text-2xl">
                {user?.name}
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                {user?.email}
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {menus.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveTab(item.key);
                      setMobileMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${
                      activeTab === item.key
                        ? "bg-[#155b37] text-white"
                        : "hover:bg-[#f5f5f5]"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>

          {/* CONTENT */}

          <main>{renderContent()}</main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountDashboard;