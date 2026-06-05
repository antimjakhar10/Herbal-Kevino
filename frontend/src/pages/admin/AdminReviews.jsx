import {
  useEffect,
  useState,
} from "react";

import { Trash2 } from "lucide-react";

import toast from "react-hot-toast";

import { api } from "../../utils/api";

const AdminReviews = () => {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts =
    async () => {
      try {
        const { data } =
          await api.get(
            "/products/admin"
          );

        setProducts(
          data.products || []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const handleDelete =
    async (
      productId,
      reviewId
    ) => {
      try {
        await api.delete(
          `/products/admin/${productId}/review/${reviewId}`
        );

        toast.success(
          "Review deleted"
        );

        fetchProducts();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to delete review"
        );
      }
    };

  if (loading) {
    return (
      <div className="text-xl font-black">
        Loading...
      </div>
    );
  }

  const reviewProducts =
    products.filter(
      (product) =>
        product.reviews?.length
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black">
          Product Reviews
        </h2>

        <div className="bg-[#155b37] text-white px-5 py-3 rounded-2xl font-bold">
          {
            reviewProducts.length
          }{" "}
          Products
        </div>
      </div>

      <div className="space-y-8">
        {reviewProducts.map(
          (product) => (
            <div
              key={product._id}
              className="bg-white border border-[#eadccb] rounded-3xl overflow-hidden"
            >
              <div className="bg-[#fff8ee] px-6 py-5 border-b border-[#eadccb]">
                <h3 className="text-2xl font-black">
                  {product.name}
                </h3>

                <p className="text-[#7a6255] mt-2">
                  {
                    product.reviewsCount
                  }{" "}
                  Reviews • ⭐{" "}
                  {Number(
                    product.rating
                  ).toFixed(1)}
                </p>
              </div>

              <div className="divide-y divide-[#eadccb]">
                {product.reviews.map(
                  (review) => (
                    <div
                      key={
                        review._id
                      }
                      className="p-6 flex flex-col lg:flex-row justify-between gap-6"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-4">
                          <h4 className="font-black text-lg">
                            {
                              review.name
                            }
                          </h4>

                          <span className="bg-[#eef7f2] text-[#155b37] px-3 py-1 rounded-full text-sm font-bold">
                            {
                              review.role
                            }
                          </span>

                          <span className="text-[#ff9800] font-bold">
                            {"★".repeat(
                              review.rating
                            )}
                          </span>
                        </div>

                        <p className="text-[#7a6255] text-sm mt-2">
                          {
                            review.date
                          }
                        </p>

                        <p className="mt-4 text-[#3a2417] leading-relaxed">
                          {
                            review.message
                          }
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleDelete(
                            product._id,
                            review._id
                          )
                        }
                        className="h-12 px-5 rounded-xl bg-red-50 text-red-600 font-bold flex items-center gap-2"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )
        )}

        {!reviewProducts.length && (
          <div className="bg-white border border-[#eadccb] rounded-3xl py-20 text-center">
            <h3 className="text-3xl font-black">
              No Reviews Yet
            </h3>

            <p className="text-[#7a6255] mt-3">
              User reviews will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;