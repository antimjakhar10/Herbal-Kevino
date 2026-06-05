import {
  Mail,
  MapPin,
  Phone,
  Send,
  Leaf,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import logo from "../assets/logo.png";

import { api } from "../utils/api";

const Contact = () => {
  const [form, setForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      message: "",
    });

  const [contactInfo, setContactInfo] =
    useState({
      phone: "",
      email: "",
      address: "",
    });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo =
    async () => {
      try {
        const { data } =
          await api.get(
            "/contact-info"
          );

        setContactInfo(data.info);
      } catch (error) {
        console.log(error);
      }
    };

  const contactCards = [
    {
      icon: Phone,
      title: "Call Us",
      text:
        contactInfo.phone ||
        "Not Available",
    },

    {
      icon: Mail,
      title: "Email",
      text:
        contactInfo.email ||
        "Not Available",
    },

    {
      icon: MapPin,
      title: "Address",
      text:
        contactInfo.address ||
        "Not Available",
    },
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      await api.post(
        "/enquiries",
        form
      );

      alert(
        "Thank you! Your enquiry has been submitted."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Failed to submit enquiry"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#24110a]">
      <Navbar />

      <section className="relative h-[180px] sm:h-[240px] md:h-[340px] bg-[linear-gradient(rgba(0,55,28,.45),rgba(0,55,28,.45)),url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center flex items-center justify-center text-white">
        <div className="text-center px-4">
          <span className="inline-flex px-5 py-2 rounded-full bg-white/20 border border-white/30 font-bold tracking-widest text-sm">
            🌿 CONTACT US
          </span>

          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black mt-4 md:mt-6">
            Get In Touch
          </h1>

          <p className="mt-3 text-sm sm:text-base md:text-xl max-w-2xl mx-auto text-white/90">
            Have questions about
            our herbal products?
            We’re here to help.
          </p>

          <p className="mt-6 text-white/80">
            Home ›{" "}
            <b>Contact Us</b>
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {contactCards.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <div
                  key={item.title}
                  className="bg-white border border-[#eadccb] rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#edf6ef] text-[#155b37] flex items-center justify-center shrink-0">
                    <Icon
                      size={26}
                    />
                  </div>

                  <div>
                   <h3 className="text-lg sm:text-xl font-black">
                      {item.title}
                    </h3>

                    <p className="text-[#7a6255] mt-1 break-words text-sm sm:text-base leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* FORM */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
       <div className="bg-white border border-[#eadccb] rounded-2xl md:rounded-[28px] shadow-sm overflow-hidden grid lg:grid-cols-[1.15fr_0.85fr]">
          <form
            onSubmit={
              handleSubmit
            }
            className="p-5 sm:p-6 md:p-10"
          >
            <p className="text-[#155b37] font-black tracking-widest uppercase text-sm">
              Send enquiry
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mt-3 mb-6">
              Send Message
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label="Name"
                name="name"
                value={form.name}
                onChange={
                  handleChange
                }
                placeholder="Your name"
              />

              <Input
                label="Email"
                name="email"
                value={form.email}
                onChange={
                  handleChange
                }
                placeholder="Your email"
              />

              <Input
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={
                  handleChange
                }
                placeholder="Your phone"
              />

              <div className="md:col-span-2">
                <label className="font-bold text-sm">
                  Message
                </label>

                <textarea
                  name="message"
                  value={
                    form.message
                  }
                  onChange={
                    handleChange
                  }
                  rows="6"
                  placeholder="Write your message..."
                 className="w-full mt-2 h-11 sm:h-12 rounded-xl border border-[#eadccb] px-4 outline-none focus:border-[#155b37]"
                />
              </div>

              <button className="md:col-span-2 h-12 sm:h-14 rounded-xl bg-[#155b37] text-white font-black flex items-center justify-center gap-2 shadow-lg hover:bg-[#0f472b] transition">
                <Send size={18} />
                Submit Enquiry
              </button>
            </div>
          </form>

          {/* RIGHT SIDE */}
          <div className="relative bg-gradient-to-br from-[#edf6ef] via-[#fff7ee] to-[#dcebdc] min-h-[260px] sm:min-h-[320px] lg:min-h-[420px] flex items-center justify-center p-8 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#9fbd92]/30 rounded-full" />

            <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-[#155b37]/10 rounded-full" />

            <div className="relative z-10 text-center max-w-sm">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto bg-white rounded-full border border-[#eadccb] shadow-md flex items-center justify-center">
                <img
                  src={logo}
                  alt="Kevino"
                 className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain"
                />
              </div>

              <div className="mt-5 sm:mt-8 bg-white/75 backdrop-blur border border-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm">
                <Leaf
                  className="mx-auto text-[#155b37]"
                  size={38}
                />

                <h3 className="text-2xl font-black text-[#155b37] mt-4">
                  Natural Wellness
                  Support
                </h3>

                <p className="text-[#6d4d3b] mt-3 leading-relaxed">
                  Reach out for
                  product guidance,
                  order support,
                  and herbal
                  wellness
                  recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const Input = ({
  label,
  ...props
}) => (
  <div>
    <label className="font-bold text-sm">
      {label}
    </label>

    <input
      {...props}
      className="w-full mt-2 h-12 rounded-xl border border-[#eadccb] px-4 outline-none focus:border-[#155b37]"
    />
  </div>
);

export default Contact;