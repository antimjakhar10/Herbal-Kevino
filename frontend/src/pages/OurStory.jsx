import { Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";

const OurStory = () => {
  const features = [
    {
      icon: Leaf,
      title: "Natural Ingredients",
      text: "Herbal formulas inspired by Ayurveda.",
    },
    {
      icon: ShieldCheck,
      title: "Quality Tested",
      text: "Carefully selected and trusted products.",
    },
    {
      icon: Sparkles,
      title: "Premium Wellness",
      text: "Clean, effective and everyday care.",
    },
    {
      icon: Truck,
      title: "Customer First",
      text: "Reliable service and easy delivery.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#24110a]">
      <Navbar />

      <section
  className="relative h-[220px] sm:h-[280px] md:h-[320px] lg:h-[380px] overflow-hidden flex items-center justify-center text-white"
>
        {/* Background Image */}
        <img
          src={hero3}
          alt="Kevino Herbals"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#002d18]/55 via-[#00351c]/40 to-[#00351c]/35"></div>

        {/* Soft Blur */}
        <div className="absolute inset-0 backdrop-blur-[0.5px]"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 font-bold tracking-[2px] text-[11px] sm:text-sm shadow-lg">
            🌿 KEVINO HERBALS
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mt-4 sm:mt-7 leading-none">
            Our Story
          </h1>

          <p className="mt-3 sm:mt-6 text-sm sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-white/90 font-medium">
            Bringing ancient Ayurvedic wisdom to modern wellness.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-white/85 text-lg">
            <span>Home</span>
            <span>›</span>
            <span className="font-bold text-white">Our Story</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-white border border-[#eadccb] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#edf6ef] text-[#155b37] flex items-center justify-center">
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-black mt-5">{item.title}</h3>
                <p className="text-[#7a6255] mt-2 leading-relaxed">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-white border border-[#eadccb] rounded-2xl md:rounded-[32px] shadow-sm overflow-hidden grid lg:grid-cols-2">
          {/* Left Image Section */}
          <div className="relative bg-gradient-to-br from-[#f6f1e8] to-[#efe7db] min-h-[260px] sm:min-h-[380px] lg:min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* background blur circles */}
            <div className="absolute top-10 left-10 w-40 h-40 bg-[#dcefdc] rounded-full blur-3xl opacity-40"></div>
            <div className="absolute bottom-10 right-10 w-52 h-52 bg-[#f5d8b8] rounded-full blur-3xl opacity-30"></div>

            {/* main image card */}
            <div className="relative bg-white p-3 sm:p-5 rounded-[24px] sm:rounded-[30px] shadow-2xl border border-[#eadccb] rotate-0 lg:rotate-[-3deg] hover:rotate-0 transition duration-500">
              <img
                src={hero2}
                alt="Kevino Herbals"
                className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[340px] lg:h-[340px] object-cover rounded-[20px] sm:rounded-[24px]"
              />

              {/* floating badge */}
              <div className="absolute -bottom-5 -right-5 bg-[#155b37] text-white px-5 py-3 rounded-2xl shadow-lg">
                <p className="text-sm font-semibold tracking-wide">
                  100% Natural
                </p>
              </div>
            </div>
          </div>

          {/* Right Content Section */}
          <div className="p-5 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center">
            <p className="text-[#155b37] font-black tracking-[3px] uppercase text-sm">
              About Kevino
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#155b37] mt-4 leading-tight">
              Natural care, made with trust
            </h2>

            <div className="w-24 h-1 bg-[#155b37] rounded-full mt-6"></div>

            <p className="text-[#6d4d3b] text-sm sm:text-base lg:text-lg leading-[1.9] mt-7">
              Kevino Herbals is built with a simple vision: to make natural,
              Ayurvedic, and reliable wellness products accessible for everyday
              life. Our products combine traditional herbal knowledge with
              modern quality standards.
            </p>

            <p className="text-[#6d4d3b] text-sm sm:text-base lg:text-lg leading-[1.9] mt-5">
              From pain relief to digestion, skincare, immunity and complete
              wellness — every product is crafted to feel safe, effective, and
              premium.
            </p>

            {/* small highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-[#f8f4ed] border border-[#eadccb] rounded-2xl p-4">
                <h4 className="font-black text-[#155b37] text-lg">Ayurvedic</h4>
                <p className="text-sm text-[#7a6255] mt-1">
                  Inspired by traditional herbal wisdom.
                </p>
              </div>

              <div className="bg-[#f8f4ed] border border-[#eadccb] rounded-2xl p-4">
                <h4 className="font-black text-[#155b37] text-lg">
                  Trusted Care
                </h4>
                <p className="text-sm text-[#7a6255] mt-1">
                  Crafted for everyday wellness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fff7ee] py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#24110a]">
            Why Choose Kevino?
          </h2>

          <p className="text-[#6d4d3b] text-lg mt-4 max-w-3xl mx-auto">
            We believe wellness should be natural, simple, and trustworthy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 md:mt-12">
            {[
              "Ayurvedic approach",
              "Premium packaging",
              "Made for daily wellness",
            ].map((title) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-[#eadccb] p-5 sm:p-8 shadow-sm"
              >
                <h3 className="text-2xl font-black text-[#155b37]">{title}</h3>

                <p className="text-[#7a6255] mt-3 leading-relaxed">
                  Carefully designed to bring natural care into your lifestyle.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OurStory;
