import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Phone,
  Mail,
  Package,
  RefreshCcw,
  CreditCard,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const HelpCenter = ({ embedded = false }) => {
  const helpItems = [
    {
      icon: <Package size={28} />,
      title: "Orders & Shipping",
      desc: "Track orders, delivery updates and shipping help.",
    },
    {
      icon: <RefreshCcw size={28} />,
      title: "Returns & Refunds",
      desc: "Easy return process and refund related support.",
    },
    {
      icon: <CreditCard size={28} />,
      title: "Payments",
      desc: "Issues related to COD, Razorpay and online payments.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Product Support",
      desc: "Get guidance regarding herbal wellness products.",
    },
  ];

  return (
    <div className={`${embedded ? "" : "min-h-screen"} bg-[#fffaf5]`}>
      {!embedded && <Navbar />}

      <section className={`${embedded ? "" : "max-w-7xl mx-auto"} px-4 py-8`}>
        {/* TOP */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#1f120c] leading-tight">
            Help Center
          </h1>

          <p className="text-[#7b5b46] text-base sm:text-lg mt-3 max-w-2xl">
            How can we help you today?
          </p>
        </div>

        {/* HELP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {helpItems.map((item, index) => (
            <div
              key={index}
              className="
bg-white
border
border-[#eadccb]
rounded-3xl
p-5
sm:p-6
md:p-7
shadow-sm
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#eef7f2] flex items-center justify-center text-[#155b37]">
                  {item.icon}
                </div>

                <ChevronRight className="text-[#7b5b46]" size={22} />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#1f120c] mt-5">
                {item.title}
              </h2>

              <p className="text-[#6f5848] mt-3 text-[15px] sm:text-base leading-7">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CONTACT SECTION */}
        <div className="mt-12 bg-white border border-[#eadccb] rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1f120c]">
            Contact Support
          </h2>

          <p className="text-[#7b5b46] mt-4 text-lg">
            Need more help? Reach out to our support team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
            <div
              className="
border
border-[#eadccb]
rounded-2xl
p-5
sm:p-6
bg-[#fffdf9]
hover:shadow-md
transition
"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#eef7f2] flex items-center justify-center text-[#155b37]">
                  <Phone size={24} />
                </div>

                <div>
                  <p className="text-[#7b5b46]">Customer Support</p>

                 <h3 className="text-lg sm:text-2xl font-black break-words">+91 90684 53970</h3>
                </div>
              </div>
            </div>

            <div className="border border-[#eadccb] rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#eef7f2] flex items-center justify-center text-[#155b37]">
                  <Mail size={24} />
                </div>

                <div>
                  <p className="text-[#7b5b46]">Email Support</p>

                  <h3 className="text-sm sm:text-lg md:text-xl font-black break-all leading-relaxed text-[#1f120c]">
                    kevinoherbalandhealthcare@gmail.com
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* SUPPORT TIMING */}
          <div className="mt-8 border border-[#eadccb] rounded-2xl p-5 sm:p-6 bg-[#fffaf5]">
            <h3 className="text-xl sm:text-2xl font-black text-[#1f120c]">
              Support Timings
            </h3>

            <p className="text-[#7b5b46] mt-3 text-lg">
              Monday - Saturday : 9:00 AM to 7:00 PM
            </p>
          </div>
        </div>
      </section>

      {!embedded && <Footer />}
    </div>
  );
};

export default HelpCenter;
