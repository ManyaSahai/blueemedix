import React from "react";
import { Box, Typography, Stack, useTheme, useMediaQuery } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";

const WhyChooseUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const features = [
    {
      icon: <VerifiedIcon sx={{ fontSize: 40, color: "white" }} />,
      title: "Genuine",
      subtitle: "Medicines",
    },
    {
      icon: <LocalOfferIcon sx={{ fontSize: 40, color: "white" }} />,
      title: "Attractive",
      subtitle: "Discounts & Offers",
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: "white" }} />,
      title: "Timely",
      subtitle: "Delivery",
    },
    {
      icon: <CreditCardIcon sx={{ fontSize: 40, color: "white" }} />,
      title: "Easy",
      subtitle: "Payments",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        px: 3,
        py: 4,
        my: 4,
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 3 : 5}
        alignItems="center"
        justifyContent="space-around"
        flexWrap="wrap"
      >
        {features.map((item, index) => (
          <Stack
            key={index}
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ width: isMobile ? "100%" : "auto" }}
          >
            <Box
              sx={{
                backgroundColor: "#3F4DB9",
                p: 1.5,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                height: 60,
              }}
            >
              {item.icon}
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="600">
                {item.title}
              </Typography>
              <Typography variant="body2">{item.subtitle}</Typography>
            </Box>
          </Stack>
        ))}
      </Stack>

      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          color: "#333",
          mt: 4,
          textAlign: isMobile ? "center" : "left",
        }}
      >
        Delivery in{" "}
        <Box component="span" sx={{ color: "#3F4DB9", fontWeight: 700 }}>
          24–48 HRS
        </Box>
      </Typography>
    </Box>
  );
};

export default WhyChooseUs;
