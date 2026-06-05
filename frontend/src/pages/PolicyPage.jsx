import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { api } from "../utils/api";

const PolicyPage = ({ type }) => {
  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    fetchPolicy();
  }, [type]);

  const fetchPolicy = async () => {
    try {
      const { data } = await api.get(`/policies/${type}`);

      setPolicy(data.policy);
    } catch (error) {
      console.log(error);
    }
  };

  const decodedContent = policy?.content
    ?.replace(/&lt;/g, "<")
    ?.replace(/&gt;/g, ">")
    ?.replace(/&quot;/g, '"')
    ?.replace(/&#39;/g, "'")
    ?.replace(/&amp;/g, "&");

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 py-10 md:py-12">
        <div className="bg-white border border-[#eadccb] rounded-[24px] p-6 md:p-8 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-black mb-6 text-[#24110a]">
            {policy?.title}
          </h1>

          <div
            className="prose max-w-none overflow-hidden break-words text-[#3b2a22]
prose-headings:text-[#24110a]
prose-headings:font-black
prose-headings:mb-3
prose-headings:mt-6
prose-p:text-[#5f4639]
prose-p:leading-7
prose-p:my-3
prose-li:text-[#5f4639]
prose-strong:text-[#24110a]
prose-a:text-[#155b37]"
            dangerouslySetInnerHTML={{
              __html: decodedContent || "",
            }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PolicyPage;
