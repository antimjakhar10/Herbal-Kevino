import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

import {
  HiOutlineMail,
  HiOutlineLocationMarker,
} from "react-icons/hi";

import { FiPhone } from "react-icons/fi";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#fffaf5] border-t border-[#eadccb] mt-4 overflow-hidden">
      {/* TOP STRIP */}
      <div className="bg-[#5a1f00] text-white py-3 overflow-hidden">
        <div className="flex gap-10 md:gap-16 whitespace-nowrap text-xs md:text-sm font-semibold animate-marquee px-4">
          <span>🌿 100% Natural Ingredients</span>
          <span>🛡️ Trusted Ayurvedic Formula</span>
          <span>↩️ Easy 7-Day Returns</span>
          <span>🔐 Secure Checkout</span>
          <span>🚚 Free Shipping Above ₹999</span>

          <span>🌿 100% Natural Ingredients</span>
          <span>🛡️ Trusted Ayurvedic Formula</span>
          <span>↩️ Easy 7-Day Returns</span>
          <span>🔐 Secure Checkout</span>
          <span>🚚 Free Shipping Above ₹999</span>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="max-w-[1350px] mx-auto px-5 md:px-8 lg:px-10 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] gap-8 lg:gap-12">
          {/* ABOUT */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <img
              src="/logo.png"
              alt="Kevino Herbals"
              className="w-24 md:w-28 mb-4"
            />

            <p className="text-[#7b5b46] text-[15px] leading-8 max-w-[300px]">
              Bringing ancient Ayurvedic wisdom to modern skincare and wellness.
              100% natural, ethically sourced and mindfully crafted.
            </p>

            <div className="flex items-center gap-3 mt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#eadccb] flex items-center justify-center hover:bg-[#155b37] hover:text-white transition"
              >
                <FaFacebookF size={15} />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#eadccb] flex items-center justify-center hover:bg-[#155b37] hover:text-white transition"
              >
                <FaInstagram size={15} />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#eadccb] flex items-center justify-center hover:bg-[#155b37] hover:text-white transition"
              >
                <FaTwitter size={15} />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#eadccb] flex items-center justify-center hover:bg-[#155b37] hover:text-white transition"
              >
                <FaYoutube size={15} />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#eadccb] flex items-center justify-center hover:bg-[#155b37] hover:text-white transition"
              >
                <HiOutlineMail size={17} />
              </a>
            </div>
          </div>

          {/* MOBILE LINKS ROW */}
          <div className="grid grid-cols-2 gap-4 md:gap-8 lg:contents">
            {/* QUICK LINKS */}
            <div className="text-center lg:text-left">
              <h3 className="text-[26px] font-black text-[#1f120c] mb-4">
                Quick Links
              </h3>

              <div className="space-y-3 text-[#7b5b46] text-[16px]">
                <Link
                  to="/"
                  className="block hover:text-[#155b37] transition"
                >
                  Home
                </Link>

                <Link
                  to="/our-story"
                  className="block hover:text-[#155b37] transition"
                >
                  About Us
                </Link>

                <Link
                  to="/products"
                  className="block hover:text-[#155b37] transition"
                >
                  Shop All
                </Link>

                <Link
                  to="/new-arrivals"
                  className="block hover:text-[#155b37] transition"
                >
                  New Arrivals
                </Link>

                <Link
                  to="/contact"
                  className="block hover:text-[#155b37] transition"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* SUPPORT */}
            <div className="text-center lg:text-left">
              <h3 className="text-[26px] font-black text-[#1f120c] mb-4">
                Support
              </h3>

              <div className="space-y-3 text-[#7b5b46] text-[16px]">
                <Link
                  to="/help"
                  className="block hover:text-[#155b37] transition"
                >
                  Help Center
                </Link>

                <Link
                  to="/shipping-policy"
                  className="block hover:text-[#155b37] transition"
                >
                  Shipping Policy
                </Link>

                <Link
                  to="/privacy-policy"
                  className="block hover:text-[#155b37] transition"
                >
                  Privacy Policy
                </Link>

                <Link
                  to="/refund-policy"
                  className="block hover:text-[#155b37] transition"
                >
                  Refund Policy
                </Link>

                <Link
                  to="/terms-conditions"
                  className="block hover:text-[#155b37] transition"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>

          {/* CONTACT */}
          <div className="text-center lg:text-left">
            <h3 className="text-[26px] font-black text-[#1f120c] mb-4">
              Contact Info
            </h3>

            <div className="space-y-4 text-[#7b5b46]">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <FiPhone
                  size={18}
                  className="text-[#155b37] flex-shrink-0"
                />
                <span className="text-[16px]">
                  +91 90684 53970
                </span>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-3">
                <HiOutlineMail
                  size={18}
                  className="text-[#155b37] flex-shrink-0"
                />
                <span className="text-[16px]">
                  kevinoherbalandhealthcare@gmail.com
                </span>
              </div>

              <div className="flex items-start justify-center lg:justify-start gap-3">
                <HiOutlineLocationMarker
                  size={18}
                  className="text-[#155b37] mt-1 flex-shrink-0"
                />

                <span className="text-[16px]">
                   SHYAMPUR AMBIWALA RANA CHOWK, Prem Nagar, Dehradun, Uttarakhand
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-[#eadccb] py-4 px-4">
        <p className="text-center text-[#7b5b46] text-sm">
          © 2026 Kevino Herbals. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;