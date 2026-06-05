import { useEffect, useState } from "react";

import {
  Edit,
  Mail,
  MapPin,
  Phone,
  Trash2,
  X,
} from "lucide-react";

import { api } from "../../utils/api";

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] =
    useState([]);

  const [showEdit, setShowEdit] =
    useState(false);

  const [contactInfo, setContactInfo] =
    useState({
      phone: "",
      email: "",
      address: "",
    });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const [
        enquiryRes,
        contactRes,
      ] = await Promise.all([
        api.get("/enquiries/admin"),
        api.get("/contact-info"),
      ]);

      setEnquiries(
        enquiryRes.data.enquiries ||
          []
      );

      setContactInfo(
        contactRes.data.info
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteEnquiry = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this enquiry?"
      )
    )
      return;

    await api.delete(
      `/enquiries/admin/${id}`
    );

    fetchEnquiries();
  };

  const handleContactChange = (
    e
  ) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]:
        e.target.value,
    });
  };

  const updateContactInfo =
    async () => {
      try {
        await api.put(
          "/contact-info/admin",
          contactInfo
        );

        alert(
          "Contact details updated successfully"
        );

        setShowEdit(false);
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Failed to update contact info"
        );
      }
    };

  return (
    <div>
      <h2 className="text-3xl font-black mb-3">
        Contact Enquiries
      </h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <p className="text-[#7a6255]">
          Manage customer enquiries
          and website contact
          details dynamically.
        </p>

        <button
          onClick={() =>
            setShowEdit(
              !showEdit
            )
          }
          className="h-12 px-5 rounded-xl bg-[#155b37] text-white font-bold flex items-center gap-2 w-fit"
        >
          {showEdit ? (
            <>
              <X size={18} />
              Close
            </>
          ) : (
            <>
              <Edit size={18} />
              Edit Contact Details
            </>
          )}
        </button>
      </div>

      {showEdit && (
        <div className="bg-white border border-[#eadccb] rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black">
                Website Contact
                Details
              </h3>

              <p className="text-[#7a6255] mt-1">
                Update phone,
                email and address
                shown on contact
                page.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* PHONE */}
            <div>
              <label className="font-bold text-sm mb-2 block">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a6255]"
                />

                <input
                  type="text"
                  name="phone"
                  value={
                    contactInfo.phone
                  }
                  onChange={
                    handleContactChange
                  }
                  placeholder="+91 9876543210"
                  className="w-full h-14 rounded-xl border border-[#eadccb] pl-11 pr-4 outline-none focus:border-[#155b37]"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="font-bold text-sm mb-2 block">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a6255]"
                />

                <input
                  type="text"
                  name="email"
                  value={
                    contactInfo.email
                  }
                  onChange={
                    handleContactChange
                  }
                  placeholder="support@example.com"
                  className="w-full h-14 rounded-xl border border-[#eadccb] pl-11 pr-4 outline-none focus:border-[#155b37]"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="font-bold text-sm mb-2 block">
                Address
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a6255]"
                />

                <input
                  type="text"
                  name="address"
                  value={
                    contactInfo.address
                  }
                  onChange={
                    handleContactChange
                  }
                  placeholder="Your office address"
                  className="w-full h-14 rounded-xl border border-[#eadccb] pl-11 pr-4 outline-none focus:border-[#155b37]"
                />
              </div>
            </div>
          </div>

          <button
            onClick={
              updateContactInfo
            }
            className="mt-6 h-12 px-6 rounded-xl bg-[#155b37] text-white font-bold"
          >
            Save Contact Details
          </button>
        </div>
      )}

      {/* ENQUIRIES */}
      <div className="bg-white border border-[#eadccb] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#eadccb] flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black">
              All Enquiries
            </h3>

            <p className="text-sm text-[#7a6255] mt-1">
              Total enquiries:{" "}
              {enquiries.length}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="bg-[#fff7ee] text-left">
              <tr>
                <th className="p-4">
                  Name
                </th>

                <th className="p-4">
                  Email
                </th>

                <th className="p-4">
                  Phone
                </th>

                <th className="p-4">
                  Message
                </th>

                <th className="p-4">
                  Date
                </th>

                <th className="p-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {enquiries.map(
                (item) => (
                  <tr
                    key={item._id}
                    className="border-t border-[#f0e5d8] hover:bg-[#fffaf5] transition"
                  >
                    <td className="p-4 font-bold">
                      {item.name}
                    </td>

                    <td className="p-4">
                      {item.email ||
                        "-"}
                    </td>

                    <td className="p-4">
                      {item.phone ||
                        "-"}
                    </td>

                    <td className="p-4 max-w-[360px]">
                      <p className="line-clamp-2">
                        {
                          item.message
                        }
                      </p>
                    </td>

                    <td className="p-4">
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() =>
                          deleteEnquiry(
                            item._id
                          )
                        }
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-600 inline-flex items-center justify-center"
                      >
                        <Trash2
                          size={18}
                        />
                      </button>
                    </td>
                  </tr>
                )
              )}

              {!enquiries.length && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-10 text-center text-[#7a6255]"
                  >
                    No enquiries
                    yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiries;