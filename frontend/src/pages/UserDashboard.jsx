import { useState } from "react";
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
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Profile from "./Profile";
import Orders from "./Orders";
import Wishlist from "./Wishlist";
import Cart from "./Cart";
import MyReturns from "./MyReturns";
import HelpCenter from "./HelpCenter";

import { useUserAuth } from "../context/UserAuthContext";

const UserDashboard = () => {
  const navigate = useNavigate();

  const { user, logout, wishlist, cart } =
    useUserAuth();

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

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
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
              <div className="bg-white border rounded-3xl p-6">
                <p className="text-[#7b5b46]">
                  Wishlist
                </p>

                <h3 className="text-4xl font-black mt-2">
                  {wishlist.length}
                </h3>
              </div>

              <div className="bg-white border rounded-3xl p-6">
                <p className="text-[#7b5b46]">
                  Cart Items
                </p>

                <h3 className="text-4xl font-black mt-2">
                  {cart.length}
                </h3>
              </div>

              <div className="bg-white border rounded-3xl p-6">
                <p className="text-[#7b5b46]">
                  Account
                </p>

                <h3 className="text-4xl font-black mt-2">
                  Active
                </h3>
              </div>

              <div className="bg-white border rounded-3xl p-6">
                <p className="text-[#7b5b46]">
                  Status
                </p>

                <h3 className="text-4xl font-black mt-2 text-green-600">
                  Verified
                </h3>
              </div>
            </div>

            <div className="bg-white border rounded-3xl p-8 mt-8">
              <h2 className="text-3xl font-black">
                Welcome Back 👋
              </h2>

              <p className="mt-3 text-lg">
                {user?.name}
              </p>

              <p className="text-[#7b5b46]">
                {user?.email}
              </p>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
          className="lg:hidden mb-4 h-12 px-4 bg-white border rounded-xl flex items-center gap-2"
        >
          {sidebarOpen ? (
            <X size={18} />
          ) : (
            <Menu size={18} />
          )}
          Menu
        </button>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside
            className={`bg-white border rounded-3xl p-5 h-fit ${
              sidebarOpen
                ? "block"
                : "hidden lg:block"
            }`}
          >
            <div className="pb-5 border-b">
              <h2 className="text-2xl font-black">
                {user?.name}
              </h2>

              <p className="text-sm text-[#7b5b46] mt-2">
                {user?.email}
              </p>
            </div>

            <div className="space-y-2 mt-5">
              {menus.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveTab(item.key);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold ${
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-semibold"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>

          <div>{renderContent()}</div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;