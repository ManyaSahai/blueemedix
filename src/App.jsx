import React from "react";
import { Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Theme from "./Theme";
import Footer from "./components/Footer";
import Homepage from "./pages/HomePage/HomePage.jsx";
import About from "./pages/AboutPage/About.jsx";
import Category from "./pages/CategoryPage/Category.jsx";
import Contact from "./pages/ContactPage/Contact.jsx";
import Offers from "./pages/OffersPage/Offers.jsx";

function App() {
  return (
      <Theme>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/category" element={<Category/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/login"/>
          <Route path="/offers" element={<Offers/>}/>
        </Routes>
        <Footer/>
      </Theme>
  );
}

export default App;
