import React from "react";
import { Box, Container } from "@mui/material";
import ShopByCategory from "./ShopByCategory";
import WhyChooseUs from "../../components/WhyChooseUs";
import BluemedixProducts from "../../components/BluemedixProducts.jsx";

const HomePage = () => {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <ShopByCategory />
      <WhyChooseUs />
      <BluemedixProducts />
    </Box>
  );
};

export default HomePage;
