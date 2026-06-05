import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Boxes,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Tags,
  Inbox,
  FileText,
  Users,
  ShoppingCart,
  BadgePercent,
  Star,
  RotateCcw,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

const navItems = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    to: "/admin/categories",
    label: "Categories",
    icon: Tags,
  },

  {
    to: "/admin/products",
    label: "Products",
    icon: Package,
  },

  {
    to: "/admin/testimonials",
    label: "Testimonials",
    icon: MessageSquare,
  },

  {
    to: "/admin/enquiries",
    label: "Contact Enquiries",
    icon: Inbox,
  },

  {
    to: "/admin/policies",
    label: "Policies",
    icon: FileText,
  },
  {
  to: "/admin/users",
  label: "Users",
  icon: Users,
},
{
  to: "/admin/orders",
  label: "Orders",
  icon: ShoppingCart,
},
{
  to: "/admin/returns",
  label: "Returns",
  icon: RotateCcw,
},
{
  to: "/admin/coupons",
  label: "Coupons Management",
  icon: BadgePercent,
},
{
  to: "/admin/reviews",
  label: "Reviews",
  icon: Star,
},
];

  return (
    <div className="bg-[#fff7ee] min-h-screen">
     <>
  {/* Mobile Overlay */}
  {sidebarOpen && (
    <div
      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      onClick={() => setSidebarOpen(false)}
    />
  )}

  {/* Sidebar */}
  <aside
  className={`
    fixed top-0 left-0 h-screen
    w-72 bg-[#155b37] text-white flex flex-col
    z-50 transform transition-transform duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
>
    {/* Mobile Close Button */}
    <div className="lg:hidden flex justify-end p-4">
      <button onClick={() => setSidebarOpen(false)}>
        <X size={26} />
      </button>
    </div>

    <div className="p-6 border-b border-white/10">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-white text-[#155b37] flex items-center justify-center">
          <Boxes size={22} />
        </div>

        <div>
          <h2 className="font-black text-xl">
            Herbal Admin
          </h2>

          <p className="text-xs text-white/70">
            Kevino Dashboard
          </p>
        </div>
      </Link>
    </div>

    <nav
  className="flex-1 p-4 space-y-2 overflow-y-auto"
  style={{
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  }}
>
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
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
            <Icon size={19} />
            {item.label}
          </NavLink>
        );
      })}
    </nav>

    <div className="p-4 border-t border-white/10">
      <p className="text-sm text-white/70 mb-3">
        {admin?.email}
      </p>

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  </aside>
</>

     <main className="flex-1 lg:ml-72 min-h-screen">
       <div className="bg-white border-b border-[#eadccb] px-4 md:px-8 py-5 flex items-center justify-between">
  <div className="flex items-center gap-3">
    
    {/* Hamburger */}
    <button
      onClick={() => setSidebarOpen(true)}
      className="lg:hidden w-11 h-11 rounded-xl border border-[#eadccb] flex items-center justify-center"
    >
      <Menu size={22} />
    </button>

    <div>
      <h1 className="text-xl md:text-2xl font-black text-[#24110a]">
        Admin Panel
      </h1>

      <p className="hidden sm:block text-sm text-[#7a6255]">
        Manage your herbal e-commerce website dynamically.
      </p>
    </div>
  </div>

  <button
    onClick={handleLogout}
    className="lg:hidden px-4 py-2 rounded-xl bg-[#155b37] text-white text-sm"
  >
    Logout
  </button>
</div>

        <div className="p-4 md:p-8 overflow-x-hidden">
  <Outlet />
</div>
      </main>
    </div>
  );
};

export default AdminLayout;