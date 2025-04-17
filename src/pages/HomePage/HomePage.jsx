import React from "react";
import { Box, Container } from "@mui/material";
import ShopByCategory from "./ShopByCategory";
import WhyChooseUs from "../../components/WhyChooseUs";

const HomePage = () => {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <ShopByCategory />
      <WhyChooseUs />
    </Box>
  );
};

export default HomePage;
