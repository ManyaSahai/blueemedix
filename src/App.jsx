import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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

function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname.startsWith("/superadmin") ||
    location.pathname.startsWith("/seller") ||
    location.pathname.startsWith("/regional-admin");

  return (
    <Theme>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/category/:categoryId" element={<Category />} />
        <Route path="/contact" element={<Contact />} />
        {/* uncomment below line */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/login"  element={<Register />} /> */}
        <Route path="/offers" element={<Offers />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/regional-admin" element={<RegionalAdmin />} />

        <Route path="/superadmin/*" element={<SuperAdminDashboard />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="sellers" element={<Sellers />} />
        </Route>
      </Routes>

      {!hideNavbar && <Footer />}
    </Theme>
  );
}

export default App;
