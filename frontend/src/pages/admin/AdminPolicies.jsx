import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { api } from "../../utils/api";

const policyTypes = [
  {
    label: "Privacy Policy",
    value: "privacy-policy",
  },
  {
    label: "Terms & Conditions",
    value: "terms-conditions",
  },
  {
    label: "Refund Policy",
    value: "refund-policy",
  },
  {
    label: "Shipping Policy",
    value: "shipping-policy",
  },
];

const AdminPolicies = () => {
  const [selectedType, setSelectedType] =
    useState("privacy-policy");

  const [title, setTitle] = useState("");

  const [content, setContent] =
    useState("");

  const fetchPolicy = async (type) => {
    try {
      const { data } = await api.get(
        `/policies/${type}`
      );

      if (data.policy) {
        setTitle(data.policy.title);
        setContent(data.policy.content);
      } else {
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPolicy(selectedType);
  }, [selectedType]);

  const handleSave = async () => {
  try {
    await api.post("/policies", {
      type: selectedType,
      title,
      content,
    });

    alert("Policy saved successfully");
  } catch (error) {
    console.log(error);
    alert("Save failed");
  }
};

  return (
    <div className="p-6">
      <h1 className="text-3xl font-black mb-6">
        Website Policies
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow border">
        <select
          value={selectedType}
          onChange={(e) =>
            setSelectedType(e.target.value)
          }
          className="w-full h-12 border rounded-xl px-4 mb-5"
        >
          {policyTypes.map((item) => (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Page Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full h-12 border rounded-xl px-4 mb-5"
        />

        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          className="bg-white mb-5"
        />

        <button
          onClick={handleSave}
          className="h-12 px-8 rounded-xl bg-[#155b37] text-white font-bold"
        >
          Save Policy
        </button>
      </div>
    </div>
  );
};

export default AdminPolicies;