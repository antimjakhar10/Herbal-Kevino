import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";

import { AuthProvider } from "./context/AuthContext";
import { UserAuthProvider } from "./context/UserAuthContext";

/* USER PAGES */

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import OurStory from "./pages/OurStory";
import Contact from "./pages/Contact";
import NewArrivals from "./pages/NewArrivals";
import BestSellers from "./pages/BestSellers";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import OrderDetails from "./pages/OrderDetails";
import MyReturns from "./pages/MyReturns";

/* USER DASHBOARD */

import UserLayout from "./components/UserLayout";
import UserDashboardHome from "./pages/UserDashboardHome";

/* ADMIN */

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminPolicies from "./pages/admin/AdminPolicies";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminReturns from "./pages/admin/AdminReturns";

import AdminLayout from "./components/admin/AdminLayout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function App() {
  return (
    <AuthProvider>
      <UserAuthProvider>
        <BrowserRouter>
          <ScrollToTop />

          <Routes>
            {/* USER ROUTES */}

            <Route path="/" element={<Home />} />

            <Route path="/product/:slug" element={<ProductDetail />} />

            <Route path="/products" element={<Products />} />

            <Route path="/our-story" element={<OurStory />} />

            <Route path="/contact" element={<Contact />} />

            <Route path="/new-arrivals" element={<NewArrivals />} />

            <Route path="/best-sellers" element={<BestSellers />} />

            <Route path="/checkout" element={<Checkout />} />

            <Route path="/cart" element={<Cart />} />

            <Route path="/wishlist" element={<Wishlist />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/orders" element={<Orders />} />

            <Route path="/orders/:id" element={<OrderDetails />} />

            <Route path="/help" element={<HelpCenter />} />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            <Route path="/terms-conditions" element={<TermsConditions />} />

            <Route path="/refund-policy" element={<RefundPolicy />} />

            <Route path="/shipping-policy" element={<ShippingPolicy />} />

            <Route path="/my-returns" element={<MyReturns />} />

            {/* USER DASHBOARD */}

            <Route path="/account" element={<UserLayout />}>
              <Route index element={<UserDashboardHome />} />

              <Route path="profile" element={<Profile embedded />} />

              <Route path="orders" element={<Orders embedded />} />

              <Route path="wishlist" element={<Wishlist embedded />} />

              <Route path="cart" element={<Cart embedded />} />

              <Route path="returns" element={<MyReturns embedded />} />

              <Route path="help" element={<HelpCenter embedded />} />
            </Route>

            {/* ADMIN */}

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />

              <Route path="dashboard" element={<AdminDashboard />} />

              <Route path="categories" element={<AdminCategories />} />

              <Route path="products" element={<AdminProducts />} />

              <Route path="testimonials" element={<AdminTestimonials />} />

              <Route path="enquiries" element={<AdminEnquiries />} />

              <Route path="policies" element={<AdminPolicies />} />

              <Route path="users" element={<AdminUsers />} />

              <Route path="orders" element={<AdminOrders />} />

              <Route path="returns" element={<AdminReturns />} />

              <Route path="coupons" element={<AdminCoupons />} />

              <Route path="reviews" element={<AdminReviews />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserAuthProvider>
    </AuthProvider>
  );
}

export default App;
