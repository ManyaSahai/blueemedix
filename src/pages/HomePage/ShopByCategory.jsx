import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";

import categoryData from "../CategoryData.jsx";

const CategorySection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  backgroundColor: theme.palette.background.paper,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  position: "relative",
  display: "inline-block",
  "&:after": {
    content: '""',
    position: "absolute",
    width: "60%",
    height: "3px",
    bottom: "-8px",
    left: "0",
    backgroundColor: theme.palette.primary.main,
  },
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  overflow: "hidden",
  position: "relative",
  margin: theme.spacing(2, 0),
}));

const CarouselContent = styled(Box)(({ theme }) => ({
  display: "flex",
  transition: "transform 0.5s ease",
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  width: 150,
  height: 180,
  cursor: "pointer",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[6],
  },
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const CategoryImage = styled(CardMedia)(({ theme }) => ({
  height: 100,
  width: 100,
  backgroundSize: "contain",
  margin: "0 auto",
}));

const CategoryName = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

const ArrowButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 2,
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  boxShadow: theme.shadows[2],
}));

const ShopByCategory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef(null);

  const getItemsPerView = () => {
    if (isMobile) return 2;
    if (isTablet) return 4;
    return 6;
  };

  const itemsPerView = getItemsPerView();
  const totalItems = categoryData.length;

  const handleNext = () => {
    if (scrollPosition < totalItems - itemsPerView) {
      setScrollPosition(scrollPosition + 1);
    }
  };

  const handlePrev = () => {
    if (scrollPosition > 0) {
      setScrollPosition(scrollPosition - 1);
    }
  };

  return (
    <CategorySection>
      <Container>
        <SectionTitle variant="h4">Shop By Category</SectionTitle>

        <Box sx={{ position: "relative" }}>
          {scrollPosition > 0 && (
            <ArrowButton
              onClick={handlePrev}
              sx={{ left: { xs: -16, md: -20 } }}
              size="small"
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </ArrowButton>
          )}

          <CarouselContainer>
            <CarouselContent
              ref={carouselRef}
              sx={{
                transform: `translateX(-${scrollPosition * 160}px)`,
              }}
            >
              {categoryData.map((category, index) => (
                <Link
                  to={category.path}
                  key={index}
                  style={{ textDecoration: "none" }}
                >
                  <CategoryCard>
                    <CategoryImage
                      component="img"
                      image={category.image}
                      alt={category.label}
                    />
                    <CardContent>
                      <CategoryName variant="body2">
                        {category.label}
                      </CategoryName>
                    </CardContent>
                  </CategoryCard>
                </Link>
              ))}
            </CarouselContent>
          </CarouselContainer>

          {scrollPosition < totalItems - itemsPerView && (
            <ArrowButton
              onClick={handleNext}
              sx={{ right: { xs: -16, md: -20 } }}
              size="small"
            >
              <ArrowForwardIosIcon fontSize="small" />
            </ArrowButton>
          )}
        </Box>
      </Container>
    </CategorySection>
  );
};

export default ShopByCategory;
