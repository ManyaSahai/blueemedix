import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Theme from "./Theme";
import Footer from "./components/Footer";
import Homepage from "./pages/HomePage/HomePage.jsx";
import About from "./pages/AboutPage/About.jsx";
import Category from "./pages/CategoryPage/Category.jsx";
import Contact from "./pages/ContactPage/Contact.jsx";
import Offers from "./pages/OffersPage/Offers.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard/SuperAdminDashboard.jsx";
import Products from "./components/SuperAdminDashboard/Products.jsx";
import Users from "./components/SuperAdminDashboard/Users.jsx";

function App() {
  const location = useLocation();
  const isSuperAdmin = location.pathname.startsWith("/superadmin");

  return (
    <Theme>
      {!isSuperAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/category" element={<Category />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" />
        <Route path="/offers" element={<Offers />} />

        {/* Super Admin Layout Route with Nested Children */}
        <Route path="/superadmin/*" element={<SuperAdminDashboard />}>
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users/>} />
          {/* Add more child routes here later */}
        </Route>
      </Routes>
      {!isSuperAdmin && <Footer />}
    </Theme>
  );
}

export default App;
