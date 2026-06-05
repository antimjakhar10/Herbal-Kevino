import { useEffect, useState } from "react";
import { api } from "../utils/api";

import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

import { useUserAuth } from "../context/UserAuthContext";

import toast from "react-hot-toast";

const Profile = ({ embedded = false }) => {
  const { user, updateUserData } = useUserAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("userToken");

      const { data } = await api.put(
        "/auth/profile",
        {
          name: formData.name,
          phone: formData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      updateUserData(data.user);

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${embedded ? "" : "min-h-screen"} bg-[#fffaf5]`}>
      {!embedded && <Navbar />}

      <section className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-14">
        <div
          className="
bg-white
border
border-[#eadccb]
rounded-3xl
overflow-hidden
shadow-sm
"
        >
          {/* TOP SECTION */}
          <div
            className="
bg-gradient-to-r
from-[#155b37]
to-[#1f7a53]
px-5
sm:px-8
md:px-12
py-6
sm:py-8
md:py-10
text-white
"
          >
            <div
              className="
flex
flex-col
sm:flex-row
sm:items-center
gap-4
sm:gap-6
"
            >
              <div
                className="
w-20
h-20
sm:w-24
sm:h-24
md:w-28
md:h-28
rounded-full
bg-white
text-[#155b37]
text-3xl
sm:text-4xl
md:text-5xl
font-black
flex
items-center
justify-center
shrink-0
"
              >
                {user?.name?.charAt(0)}
              </div>

              <div>
                <h1
                  className="
text-2xl
sm:text-3xl
md:text-4xl
font-black
break-words
"
                >
                  {user?.name}
                </h1>

                <p
                  className="
text-white/80
mt-2
text-sm
sm:text-base
md:text-lg
break-all
"
                >
                  {user?.email}
                </p>

                <p
                  className="
text-white/80
mt-1
text-sm
sm:text-base
"
                >
                  {user?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div
            className="
p-4
sm:p-6
md:p-10
"
          >
            <div className="mb-10">
              <h2
                className="
text-3xl
sm:text-4xl
font-black
text-[#1f120c]
leading-tight
"
              >
                Personal Information
              </h2>

              <p
                className="
text-[#7b5b46]
mt-3
text-base
sm:text-lg
max-w-xl
"
              >
                Manage your account details and personal information
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              <div
                className="
grid
grid-cols-1
md:grid-cols-2
gap-4
sm:gap-5
"
              >
                <div>
                  <label className="block text-[#2b130b] font-bold mb-3">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="
w-full
h-12
sm:h-14
rounded-2xl
border
border-[#e7d8c8]
px-4
sm:px-5
outline-none
focus:border-[#155b37]
"
                  />
                </div>

                <div>
                  <label className="block text-[#2b130b] font-bold mb-3">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full h-14 rounded-2xl border border-[#e7d8c8] px-5 bg-[#f8f5f1] text-[#7b5b46]"
                  />
                </div>

                <div>
                  <label className="block text-[#2b130b] font-bold mb-3">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full h-14 rounded-2xl border border-[#e7d8c8] px-5 outline-none focus:border-[#155b37]"
                  />
                </div>
              </div>

              <div className="h-px bg-[#eadccb] my-2" />

              {/* STATS */}
              <div
                className="
grid
grid-cols-1
sm:grid-cols-2
md:grid-cols-3
gap-4
sm:gap-5
pt-4
"
              >
                <div
                  className="
border
border-[#eadccb]
rounded-3xl
p-4
sm:p-6
bg-[#fffaf5]
"
                >
                  <p className="text-[#7b5b46] font-medium">Total Orders</p>

                  <h3
                    className="
text-3xl
sm:text-4xl
font-black
mt-3
text-[#1f120c]
"
                  >
                    0
                  </h3>
                </div>

                <div className="border border-[#eadccb] rounded-3xl p-6 bg-[#fffaf5]">
                  <p className="text-[#7b5b46] font-medium">Saved Addresses</p>

                  <h3 className="text-4xl font-black mt-3 text-[#1f120c]">
                    {user?.addresses?.length || 0}
                  </h3>
                </div>

                <div className="border border-[#eadccb] rounded-3xl p-6 bg-[#fffaf5]">
                  <p className="text-[#7b5b46] font-medium">Wishlist Items</p>

                  <h3 className="text-4xl font-black mt-3 text-[#1f120c]">
                    {user?.wishlist?.length || 0}
                  </h3>
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={loading}
                  className="
w-full
sm:w-auto
h-12
sm:h-14
px-8
sm:px-10
rounded-2xl
bg-[#155b37]
text-white
font-black
text-base
sm:text-lg
hover:bg-[#11472c]
transition
"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {!embedded && <Footer />}
    </div>
  );
};

export default Profile;
