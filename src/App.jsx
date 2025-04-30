import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Theme from "./Theme";
import Footer from "./components/Footer";
import Homepage from "./pages/HomePage/HomePage.jsx";
import About from "./pages/AboutPage/About.jsx";
import Category from "./pages/CategoryPage/Category.jsx";
import Contact from "./pages/ContactPage/Contact.jsx";
import Offers from "./pages/OffersPage/Offers.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard/SuperAdminDashboard.jsx";
import SellerDashboard from "./pages/SellerDashboard/Seller.jsx";
import RegionalAdmin from "./pages/RegionalAdmin/RegionalAdmin.jsx";
import Products from "./components/SuperAdminDashboard/Products.jsx";
import Users from "./components/SuperAdminDashboard/Users.jsx";
import Reports from "./components/SuperAdminDashboard/Reports.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./components/Register.jsx";
import Sellers from "./components/SuperAdminDashboard/Sellers.jsx";
import Cart from "./components/Cart.jsx";
import Orders from "./components/Orders.jsx";
import Profile from "./components/Profile/Profile.jsx"; // Import the new ProfilePage component
import "./index.css";
import RegionalAdminList from "./components/SuperAdminDashboard/RegionalAdminList.jsx";
import SuperAdmin from "./pages/Super/SuperAdmin.jsx";
import { getDashboardData, getOrders } from "./redux/SuperAdmin/api.js";
import store from "./redux/SuperAdmin/store.js";
import AllOrders from "./components/SuperAdminDashboard/AllOrders.jsx";
import Dashboard from "./pages/Super/Dashboard.jsx";
import CustomerDashboard from "./components/CustomerDashboard.jsx";
import TopSellingProducts from "./components/SuperAdminDashboard/SpecialProducts/TopSelling.jsx";
import CategoryList from "./components/SuperAdminDashboard/Category.jsx";
import OrderDetails from "./pages/SellerDashboard/OrderDetails.jsx";
import ProfilePage from "./components/Profile/Profile.jsx";

store.dispatch(getDashboardData());
store.dispatch(getOrders());
function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname.startsWith("/regionalAdmin") ||
    location.pathname.startsWith("/seller") ||
    location.pathname.startsWith("/regional-admin") ||
    location.pathname.startsWith("/admin")||
  location.pathname.startsWith("/dashboard");

  return (
    <Theme>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/category/:categoryId" element={<Category />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        {/* uncomment below line */}
        <Route path="/login" element={<Login />} />
        <Route path="/login2" element={<Register />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        {/* Seller routes */}
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/profile" element={<Profile />} />{" "}
        <Route path="/regional-admin/profile" element={<Profile />} />{" "}
        {/* Add this new route for the profile page */}
        <Route path="/regional-admin" element={<RegionalAdmin />} />
        {/* <Route path="/admin" element={<SuperAdmin />} /> */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="products" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<AllOrders />} />
          <Route path="reports" element={<Reports />} />
          <Route path="sellers" element={<Sellers />} />
          <Route path="regAdminList" element={<RegionalAdminList/>} />
          <Route path="top-selling-products" element={<TopSellingProducts />} />
          <Route path="category" element={<CategoryList />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="admin" element={<SuperAdmin />} />
        </Route>
      </Routes>

      {!hideNavbar && <Footer />}
    </Theme>
  );
}

export default App;
