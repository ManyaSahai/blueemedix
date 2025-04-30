import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";

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
  width: "100%",
}));

const CarouselContent = styled(Box)(({ theme }) => ({
  display: "flex",
  transition: "transform 0.5s ease",
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  flex: "0 0 auto",
  width: {
    xs: "calc(50% - 16px)",
    sm: "calc(25% - 16px)",
    md: "calc(16.666% - 16px)",
  },
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

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 200,
}));

const ShopByCategory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products/cat");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Add an "All" category at the beginning
        const allCategory = {
          _id: "all",
          name: "All Products",
          description: "Browse all our products",
          image_link: "https://cdn-icons-png.flaticon.com/512/4290/4290854.png", // placeholder image for "All"
        };
        
        setCategories([allCategory, ...data]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  // For infinite scroll, create a duplicated dataset after categories are loaded
  const duplicatedCategories = [...categories, ...categories, ...categories];
  
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselContentRef = useRef(null);

  // Update scroll position when categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      setScrollPosition(categories.length);
    }
  }, [categories]);

  const getItemsPerView = () => {
    if (isMobile) return 2;
    if (isTablet) return 4;
    return 6;
  };

  const itemsPerView = getItemsPerView();
  
  // Calculate item width based on container width and items per view
  const [itemWidth, setItemWidth] = useState(0);
  const containerRef = useRef(null);
  
  // Update item width when container size changes
  useEffect(() => {
    const updateItemWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setItemWidth(containerWidth / itemsPerView);
      }
    };
    
    // Initial calculation
    updateItemWidth();
    
    // Update on resize
    const handleResize = () => {
      updateItemWidth();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  const handleNext = () => {
    if (isAnimating || categories.length === 0) return;
    
    setIsAnimating(true);
    setScrollPosition(prev => prev + 1);
    
    // If we're nearing the end of the duplicated list, seamlessly jump back
    if (scrollPosition >= duplicatedCategories.length - itemsPerView - 5) {
      setTimeout(() => {
        // Disable animation temporarily
        if (carouselContentRef.current) {
          carouselContentRef.current.style.transition = 'none';
        }
        setScrollPosition(categories.length);
        
        // Re-enable animation after DOM update
        setTimeout(() => {
          if (carouselContentRef.current) {
            carouselContentRef.current.style.transition = 'transform 0.5s ease';
          }
          setIsAnimating(false);
        }, 50);
      }, 500); // Wait for animation to complete
    } else {
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handlePrev = () => {
    if (isAnimating || categories.length === 0) return;
    
    setIsAnimating(true);
    setScrollPosition(prev => prev - 1);
    
    // If we're nearing the beginning of the duplicated list, seamlessly jump to end
    if (scrollPosition <= 5) {
      setTimeout(() => {
        // Disable animation temporarily
        if (carouselContentRef.current) {
          carouselContentRef.current.style.transition = 'none';
        }
        setScrollPosition(duplicatedCategories.length - categories.length - itemsPerView);
        
        // Re-enable animation after DOM update
        setTimeout(() => {
          if (carouselContentRef.current) {
            carouselContentRef.current.style.transition = 'transform 0.5s ease';
          }
          setIsAnimating(false);
        }, 50);
      }, 500); // Wait for animation to complete
    } else {
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  // Set up auto-play for the carousel
  useEffect(() => {
    if (categories.length === 0) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [scrollPosition, isAnimating, categories.length]);

  // Format category name for use in URLs
  const formatCategorySlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  if (loading) {
    return (
      <CategorySection maxWidth={false} >
        <Container height={200}>
          <SectionTitle variant="h4">Shop By Category</SectionTitle>
          <LoadingContainer>
            <CircularProgress />
          </LoadingContainer>
        </Container>
      </CategorySection>
    );
  }

  if (error) {
    return (
      <CategorySection maxWidth={false}>
        <Container>
          <SectionTitle variant="h4">Shop By Category</SectionTitle>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="error">Error loading categories: {error}</Typography>
          </Box>
        </Container>
      </CategorySection>
    );
  }

  return (
    <CategorySection >
      <Container maxWidth={false}>
        <SectionTitle variant="h4">Shop By Category</SectionTitle>

        <Box sx={{ position: "relative" }}>
          <ArrowButton
            onClick={handlePrev}
            sx={{ 
              left: { xs: -16, md: -20 },
              opacity: isAnimating ? 0.5 : 1,
              pointerEvents: isAnimating ? 'none' : 'auto'
            }}
            size="small"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </ArrowButton>

          <CarouselContainer ref={containerRef}>
            <CarouselContent
              ref={carouselContentRef}
              sx={{
                transform: `translateX(-${scrollPosition * itemWidth}px)`,
                width: '100%',
              }}
            >
              {duplicatedCategories.map((category, index) => (
                <Link
                  to={`/category/${category._id === 'all' ? 'all' : formatCategorySlug(category.name)}`}
                  key={index}
                  style={{ 
                    textDecoration: "none", 
                    flex: `0 0 ${100/itemsPerView}%`,
                    maxWidth: `${100/itemsPerView}%`,
                    padding: "0 8px",
                    boxSizing: "border-box"
                  }}
                >
                  <CategoryCard>
                    <CategoryImage
                      component="img"
                      image={category.image_link}
                      alt={category.name}
                    />
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <CategoryName variant="body2">
                        {category.name}
                      </CategoryName>
                    </CardContent>
                  </CategoryCard>
                </Link>
              ))}
            </CarouselContent>
          </CarouselContainer>

          <ArrowButton
            onClick={handleNext}
            sx={{ 
              right: { xs: -16, md: -20 },
              opacity: isAnimating ? 0.5 : 1,
              pointerEvents: isAnimating ? 'none' : 'auto'
            }}
            size="small"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </ArrowButton>
        </Box>
      </Container>
    </CategorySection>
  );
};

export default ShopByCategory;