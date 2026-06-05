import { useEffect, useState } from "react";

import {
  MessageSquare,
  Package,
  ShoppingCart,
  Tags,
  Truck,
  Users,
  Wallet,
} from "lucide-react";

import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

import { api } from "../../utils/api";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    categories: 0,
    products: 0,
    testimonials: 0,
    users: 0,
  });

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  const [chartData, setChartData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [catRes, productRes, testiRes, orderStatsRes, usersRes] =
        await Promise.allSettled([
          api.get("/categories/admin"),
          api.get("/products/admin"),
          api.get("/testimonials/admin"),
          api.get("/orders/admin/stats"),
          api.get("/users"),
        ]);

      setCounts({
        categories:
          catRes.status === "fulfilled"
            ? catRes.value.data.categories?.length || 0
            : 0,

        products:
          productRes.status === "fulfilled"
            ? productRes.value.data.products?.length || 0
            : 0,

        testimonials:
          testiRes.status === "fulfilled"
            ? testiRes.value.data.testimonials?.length || 0
            : 0,

        users:
          usersRes.status === "fulfilled"
            ? usersRes.value.data.users?.length ||
              usersRes.value.data?.length ||
              0
            : 0,
      });

      setStats(
        orderStatsRes.status === "fulfilled"
          ? orderStatsRes.value.data.stats
          : {
              totalOrders: 0,
              totalRevenue: 0,
              pendingOrders: 0,
              deliveredOrders: 0,
            },
      );
      if (orderStatsRes.status === "fulfilled") {
        setChartData(orderStatsRes.value.data.chartData || []);
      }

      if (productRes.status === "fulfilled") {
        const lowStock = productRes.value.data.products.filter(
          (product) => product.stock <= 5,
        );

        setLowStockProducts(lowStock);
      }
      {
        setChartData(orderStatsRes.value.data.chartData || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      bg: "bg-[#e7f2df]",
    },

    {
      title: "Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: Wallet,
      bg: "bg-[#fff0d9]",
    },

    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Package,
      bg: "bg-[#fef3c7]",
    },

    {
      title: "Delivered",
      value: stats.deliveredOrders,
      icon: Truck,
      bg: "bg-[#dcfce7]",
    },
  ];

  const overviewCards = [
    {
      title: "Users",
      value: counts.users,
      icon: Users,
    },

    {
      title: "Categories",
      value: counts.categories,
      icon: Tags,
    },

    {
      title: "Products",
      value: counts.products,
      icon: Package,
    },

    {
      title: "Testimonials",
      value: counts.testimonials,
      icon: MessageSquare,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-xl font-bold">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-[#24110a]">
  Dashboard Overview
</h2>

<p className="text-[#7a6255] mt-2 text-sm md:text-base">
  Monitor your herbal store performance dynamically.
</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-10">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white border border-[#eadccb] rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition"
            >
              <div
                className={`w-16 h-16 rounded-2xl ${card.bg} flex items-center justify-center text-[#155b37]`}
              >
                <Icon size={28} />
              </div>

              <p className="text-[#7a6255] mt-5">{card.title}</p>

              <h3 className="text-3xl md:text-4xl font-black mt-2 text-[#24110a] break-all">
                {card.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* LOW STOCK PRODUCTS */}
      <div className="mt-10 bg-white border border-[#eadccb] rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-black text-[#24110a]">
              Low Stock Alerts
            </h3>

            <p className="text-[#7a6255] text-sm mt-1">
              Products running out of stock
            </p>
          </div>

          <div className="h-12 w-fit px-5 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black">
            {lowStockProducts.length} Alerts
          </div>
        </div>

        {lowStockProducts.length ? (
          <div className="space-y-4">
            {lowStockProducts.map((product) => (
              <div
                key={product._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-[#f1e4d4] rounded-2xl p-4"
              >
                <div>
                  <h4 className="font-black text-base md:text-lg text-[#24110a]">
                    {product.name}
                  </h4>

                  <p className="text-sm text-[#7a6255] mt-1">
                    Category: {product.category?.name || "Herbal"}
                  </p>
                </div>

                <div
                  className={`px-4 py-2 rounded-full text-sm font-black ${
                    product.stock === 0
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {product.stock === 0
                    ? "Out Of Stock"
                    : `${product.stock} Left`}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <h4 className="text-2xl font-black text-[#155b37]">
              All Products Well Stocked 🎉
            </h4>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 mt-10">
        <div className="xl:col-span-2 bg-white border border-[#eadccb] rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-black text-[#24110a]">
                Revenue Analytics
              </h3>

              <p className="text-[#7a6255] mt-1">Monthly revenue overview</p>
            </div>

            <div className="bg-[#f6efe6] px-4 md:px-5 py-3 rounded-2xl w-fit">
              <p className="text-sm text-[#7a6255]">Total Revenue</p>

              <h4 className="text-2xl font-black text-[#155b37]">
                ₹{stats.totalRevenue}
              </h4>
            </div>
          </div>

          <div className="h-[250px] sm:h-[300px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="month" />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#155b37"
                  fill="#dff3e7"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#eadccb] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-[#24110a]">
                Store Overview
              </h3>

              <p className="text-[#7a6255] text-sm mt-1">
                Quick stats overview
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-[#f6efe6] flex items-center justify-center text-[#155b37]">
              <Users size={22} />
            </div>
          </div>

          <div className="space-y-5">
            {overviewCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center justify-between border border-[#f1e4d4] rounded-2xl p-4 hover:bg-[#fffaf5] transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#f6efe6] flex items-center justify-center text-[#155b37]">
                      <Icon size={22} />
                    </div>

                    <div className="w-full overflow-x-hidden">
                      <p className="text-[#7a6255] text-sm">{item.title}</p>

                      <h4 className="text-2xl font-black text-[#24110a]">
                        {item.value}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
