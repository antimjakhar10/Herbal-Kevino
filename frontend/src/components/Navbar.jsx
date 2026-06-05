import { useEffect, useRef, useState } from "react";

import {
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  Menu,
  Package2,
  Search,
  ShoppingCart,
  User,
  X,
  RotateCcw,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";

import { useUserAuth } from "../context/UserAuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const location = useLocation();

  const profileRef = useRef();

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { user, logout, cart, wishlist } = useUserAuth();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const navLinks = [
    {
      label: "Our Story",
      href: "/our-story",
    },

    {
      label: "New Arrivals",
      href: "/new-arrivals",
    },

    {
      label: "Our Products",
      href: "/products",
    },

    {
      label: "Best Sellers",
      href: "/best-sellers",
    },

    {
      label: "Contact Us",
      href: "/contact",
    },
  ];

  const accountLinks = [
    {
      label: "My Profile",
      path: "/profile",
      icon: User,
    },

    {
      label: "My Orders",
      path: "/orders",
      icon: Package2,
    },

    {
      label: "My Returns",
      path: "/my-returns",
      icon: RotateCcw,
    },

    {
      label: "Wishlist",
      path: "/wishlist",
      icon: Heart,
    },

    {
      label: "Help Center",
      path: "/help",
      icon: HelpCircle,
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchText.trim();

    if (!query) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const redirectToLogin = (path) => {
    navigate(`/login?redirect=${encodeURIComponent(path)}`);
  };

  return (
    <>
      {/* TOPBAR */}
      <div
        className={`bg-[#155b37] text-white text-sm py-2 overflow-hidden transition-all duration-300 ${
          isScrolled ? "hidden" : "block"
        }`}
      >
        <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] font-semibold">
          <span className="mx-10">🌿 100% Ayurvedic & Natural Products</span>

          <span className="mx-10">🚚 Free Shipping Above ₹999</span>

          <span className="mx-10">✨ Flat 10% OFF For New Customers</span>

          <span className="mx-10">💚 Trusted Herbal Wellness Store</span>
        </div>
      </div>

      {/* NAVBAR */}
      <header
        className={`z-[999] bg-white/95 backdrop-blur-xl border-b border-[#ede5dc] shadow-[0_4px_20px_rgba(0,0,0,0.04)]
  ${isScrolled ? "fixed top-0 left-0 right-0" : "relative"}`}
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-[62px] md:h-[92px] flex items-center justify-between">
          {mobileSearchOpen ? (
  <form
    onSubmit={(e) => {
      handleSearch(e);
      setMobileSearchOpen(false);
    }}
    className="md:hidden flex items-center w-full h-11 border border-[#e4dbd3] rounded-full px-4 gap-2"
  >
    <button
      type="button"
      onClick={() => setMobileSearchOpen(false)}
    >
      <X size={18} />
    </button>

    <input
      autoFocus
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      placeholder="Search products..."
      className="flex-1 outline-none bg-transparent"
    />
  </form>
) : (
            <>
              {/* LOGO */}
              <Link to="/">
                <img
                  src={logo}
                  alt="Kevino Herbals"
                  className="w-[46px] h-[46px] md:w-[90px] md:h-[90px] object-contain transition duration-300 hover:scale-105 "
                />
              </Link>

              {/* DESKTOP NAV */}
              <nav className="hidden lg:flex items-center gap-8 ml-10 text-[#2d1a11] font-semibold text-[15px]">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`relative transition-all duration-300 hover:text-[#155b37] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#155b37] after:transition-all after:duration-300 ${
                      location.pathname === item.href
                        ? "text-[#155b37] after:w-full"
                        : "after:w-0 hover:after:w-full"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* RIGHT */}
              <div className="flex items-center ml-auto gap-1 sm:gap-2">
                {/* SEARCH */}
                <form
                  onSubmit={handleSearch}
                  className="hidden md:flex items-center w-[260px] lg:w-[320px] xl:w-[360px] h-[48px] bg-[#faf8f5] border border-[#ebe2d8] rounded-full px-5 mr-4 shadow-sm"
                >
                  <button type="submit">
                    <Search size={17} className="text-[#755b4e]" />
                  </button>

                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search products..."
                    className="bg-transparent outline-none w-full px-3 text-[14px]"
                  />
                </form>

                <button
                  onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                  className="md:hidden w-9 h-9 flex items-center justify-center"
                >
                  {mobileSearchOpen ? <X size={20} /> : <Search size={19} />}
                </button>

                {/* WISHLIST */}
                <button
                  onClick={() => {
                    if (!user) {
                      redirectToLogin("wishlist");
                      return;
                    }

                    navigate("/wishlist");
                  }}
                  className="relative w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#f6f1ea] transition"
                >
                  <Heart size={21} />

                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#155b37] text-white rounded-full flex items-center justify-center text-[11px] font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* ORDERS */}
                <button
                  onClick={() => {
                    if (!user) {
                      redirectToLogin("/orders");
                      return;
                    }

                    navigate("/orders");
                  }}
                  className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center hover:bg-[#fff7ee]"
                >
                  <Package2 size={21} />
                </button>

                {/* CART */}
                <button
                  onClick={() => {
                    if (!user) {
                      redirectToLogin("/cart");
                      return;
                    }

                    navigate("/cart");
                  }}
                  className="relative w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#f6f1ea] transition"
                >
                  <ShoppingCart size={24} />

                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#155b37] text-white rounded-full flex items-center justify-center text-[11px] font-bold">
                      {cart.length}
                    </span>
                  )}
                </button>

                {/* USER */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => {
                      if (!user) {
                        navigate("/login");
                        return;
                      }

                      navigate("/account");
                    }}
                    className="w-11 h-11 rounded-full bg-gradient-to-br from-[#155b37] to-[#1d7a4e] text-white flex items-center justify-center font-black text-lg shadow-md"
                  >
                    {user?.name?.charAt(0) || <User size={18} />}
                  </button>
                </div>

                {/* MOBILE MENU */}
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center border border-[#eadccb]"
                >
                  {open ? <X size={21} /> : <Menu size={21} />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="lg:hidden border-t border-[#eee4d8] bg-white px-4 py-5 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="
block
px-5
py-4
rounded-3xl
bg-[#faf8f5]
text-[#3b1608]
font-bold
text-lg
border
border-[#f0e2d3]
hover:bg-[#f8efe4]
transition
"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
