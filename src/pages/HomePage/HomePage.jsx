import React from "react";
import { Box, Container } from "@mui/material";
import ShopByCategory from "./ShopByCategory";
import WhyChooseUs from "../../components/WhyChooseUs";
import BluemedixProducts from "../../components/BluemedixProducts.jsx";

const HomePage = () => {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "white" }}>
      <Container maxWidth={false} sx={{ py: 4 }}>
        <ShopByCategory />
      </Container>

      <Container maxWidth={false} sx={{ py: 4 }}>
        <WhyChooseUs />
      </Container>

      <Container maxWidth={false} sx={{ py: 4 }}>
        <BluemedixProducts />
      </Container>
    </Box>
  );
};

export default HomePage;
