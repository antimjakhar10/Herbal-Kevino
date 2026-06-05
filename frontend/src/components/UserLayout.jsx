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

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";

const UserLayout = () => {
  const { user, logout } = useUserAuth();

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    {
      to: "/account",
      label: "Dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/account/profile",
      label: "My Profile",
      icon: User,
    },
    {
      to: "/account/orders",
      label: "My Orders",
      icon: Package2,
    },
    {
      to: "/account/wishlist",
      label: "Wishlist",
      icon: Heart,
    },
    {
      to: "/account/cart",
      label: "Cart",
      icon: ShoppingCart,
    },
    {
      to: "/account/returns",
      label: "Returns",
      icon: RotateCcw,
    },
    {
      to: "/account/help",
      label: "Help Center",
      icon: HelpCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fff7ee] flex">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0
          h-screen w-72
          bg-[#155b37]
          text-white
          flex flex-col
          z-50
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)}>
            <X size={26} />
          </button>
        </div>

        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-black">
            My Account
          </h2>

          <p className="text-white/70 text-sm mt-1">
            Kevino Herbal
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                end={item.end}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${
                    isActive
                      ? "bg-white text-[#155b37]"
                      : "text-white/80 hover:bg-white/10"
                  }`
                }
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <h4 className="font-bold">
            {user?.name}
          </h4>

          <p className="text-sm text-white/70 mb-4">
            {user?.email}
          </p>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="bg-white border-b border-[#eadccb] px-4 md:px-8 py-5 flex items-center gap-4">

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-11 h-11 rounded-xl border border-[#eadccb] flex items-center justify-center"
          >
            <Menu size={22} />
          </button>

          <div>
            <h1 className="text-2xl font-black text-[#24110a]">
              My Account
            </h1>

            <p className="text-[#7a6255] text-sm">
              Manage profile, orders, wishlist and returns.
            </p>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;