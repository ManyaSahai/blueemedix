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
<<<<<<< HEAD
import Products from "./components/SuperAdminDashboard/Products.jsx";
import Users from "./components/SuperAdminDashboard/Users.jsx";
=======
import SellerDashboard from "./pages/SellerDashboard/Seller.jsx";
>>>>>>> bd766d6 (added seller dashboard)

function App() {
  const location = useLocation();
  const isSuperAdmin = location.pathname.startsWith("/superadmin");

<<<<<<< HEAD
  return (
    <Theme>
      {!isSuperAdmin && <Navbar />}
=======
  const hideNavbarRoutes = ["/superadmin", "/seller"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  return (
    <Theme>
      {shouldShowNavbar && <Navbar />}
>>>>>>> bd766d6 (added seller dashboard)
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/category" element={<Category />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" />
        <Route path="/offers" element={<Offers />} />
<<<<<<< HEAD

        {/* Super Admin Layout Route with Nested Children */}
        <Route path="/superadmin/*" element={<SuperAdminDashboard />}>
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users/>} />
          {/* Add more child routes here later */}
        </Route>
      </Routes>
      {!isSuperAdmin && <Footer />}
=======
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/seller" element={<SellerDashboard />} />
      </Routes>
      <Footer />
>>>>>>> bd766d6 (added seller dashboard)
    </Theme>
  );
}

export default App;
