import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Breadcrumbs,
  Link,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CircularProgress,
  Pagination,
  useMediaQuery,
  Drawer,
  Divider,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Add, Remove, FilterList } from "@mui/icons-material";

const CategoryContainer = styled(Box)(({ theme }) => ({
  padding: "24px 0",
  width: "100%",
  maxWidth: "100%",
}));

const CategoryTitle = styled(Typography)(() => ({
  marginBottom: "24px",
  fontWeight: 600,
}));

const LoadingContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 300,
  width: "100%",
}));

const ProductCard = styled(Card)(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));

const ProductCardContent = styled(CardContent)(() => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
}));

const ProductMedia = styled(CardMedia)(() => ({
  height: 140,
  objectFit: "contain",
  marginBottom: "12px",
}));

const PaginationContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  padding: "24px 0",
  width: "100%",
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  border: "1px solid #1976d2",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

// Main flex container for layout
const FlexContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  flexDirection: "column", // Default for mobile is column (stacked)
  gap: theme.spacing(3),

  [theme.breakpoints.up("md")]: {
    flexDirection: "row", // For medium screens and up, use row layout
  },
}));

// Filter section container
const FilterSection = styled(Box)(({ theme }) => ({
  width: "100%", // Full width on mobile

  [theme.breakpoints.up("md")]: {
    width: "25%", // 1/4 of space on medium screens and up
    flexShrink: 0,
  },
}));

// Products section container
const ProductsSection = styled(Box)(({ theme }) => ({
  width: "100%", // Full width on mobile

  [theme.breakpoints.up("md")]: {
    width: "75%", // 3/4 of space on medium screens and up
    flexGrow: 1,
  },
}));

// Changed from 12 to 10 products per page
const PRODUCTS_PER_PAGE = 10;

const ProductListingComponent = () => {
  const { categoryId } = useParams();
  const [allProducts, setAllProducts] = useState([]); // Store all fetched products
  const [displayedProducts, setDisplayedProducts] = useState([]); // Products for current page
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Responsive state
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleAddToCart = (productId, quantity) => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role")

    if (!userId && role!=='Customer') {
    alert("Please log in as a customer to add items to your cart.");
    console.log(role)
    window.location.href = '/login'; // Basic JavaScript redirect if no router is readily available
    return;
    }

    fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, productId, quantity }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }
        return response.json();
      })
      .then(() => {
        alert("Product added to cart!");
      })
      .catch((error) => {
        console.error("Failed to add item to cart:", error);
      });
  };

  const handleIncrement = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 1) + 1,
    }));
  };

  const handleDecrement = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]:
        prevQuantities[productId] > 1 ? prevQuantities[productId] - 1 : 1,
    }));
  };

  // Handle client-side pagination
  const handlePageChange = (event, value) => {
    setPage(value);
    // Update displayed products based on the new page
    updateDisplayedProducts(value);
    window.scrollTo(0, 0);
  };

  // Update displayed products based on current page
  const updateDisplayedProducts = (currentPage) => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    setDisplayedProducts(allProducts.slice(startIndex, endIndex));
  };

  const toggleMobileFilter = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products/cat");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const allCategory = {
          _id: "all",
          name: "All Products",
          description: "Browse all our products",
          image_link: "https://cdn-icons-png.flaticon.com/512/4290/4290854.png",
        };

        setCategories([allCategory, ...data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Reset to first page when category changes
    setPage(1);
  }, [categoryId]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint;
        if (categoryId === "all") {
          // Fetch all products without pagination parameters
          endpoint = `http://localhost:5000/api/products`;
        } else {
          const matchedCategory = categories.find(
            (cat) => formatCategorySlug(cat.name) === categoryId
          );

          if (matchedCategory) {
            // Fetch all products for the category without pagination parameters
            endpoint = `http://localhost:5000/api/products/category/${matchedCategory._id}`;
            setCurrentCategory(matchedCategory);
          } else {
            setCurrentCategory({ name: categoryId }); // Set a temporary category name for display
            setAllProducts([]);
            setDisplayedProducts([]);
            setLoading(false);
            return;
          }
        }

        if (
          categoryId === "all" &&
          categories.find((cat) => cat._id === "all")
        ) {
          setCurrentCategory(categories.find((cat) => cat._id === "all"));
        }

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Handle different API response formats
        const products = Array.isArray(data) ? data : data.products || [];
        
        // Set all products
        setAllProducts(products);
        
        // Calculate total pages based on all products and products per page
        setTotalPages(Math.ceil(products.length / PRODUCTS_PER_PAGE));
        
        // Initialize quantities for all products
        const initialQuantities = {};
        products.forEach((product) => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
        
        // Set products for the first page
        setDisplayedProducts(products.slice(0, PRODUCTS_PER_PAGE));
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (
      (categories.length > 0 && categoryId !== "all") ||
      categoryId === "all"
    ) {
      fetchAllProducts();
    } else if (categoryId !== "all") {
      setLoading(false);
    }
  }, [categoryId, categories]);

  // Update displayed products when page changes
  useEffect(() => {
    if (allProducts.length > 0) {
      updateDisplayedProducts(page);
    }
  }, [page, allProducts]);

  const formatCategorySlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  // Filters component to be reused in both desktop and mobile views
  const FiltersComponent = () => (
    <>
      <FilterContainer>
        <Typography
          variant="body2"
          sx={{ marginBottom: "6px", fontWeight: "bold" }}
        >
          Special Deals
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <FormControlLabel control={<Checkbox />} label="Up to 10%" />
          <FormControlLabel control={<Checkbox />} label="11% to 25%" />
          <FormControlLabel control={<Checkbox />} label="26% to 50%" />
          <FormControlLabel control={<Checkbox />} label="Above 50%" />
        </Box>
      </FilterContainer>

      <FilterContainer>
        <Typography
          variant="body2"
          sx={{ marginBottom: "6px", fontWeight: "bold" }}
        >
          Categories
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/category/${
                category._id === "all"
                  ? "all"
                  : formatCategorySlug(category.name)
              }`}
              color="inherit"
              underline="hover"
              onClick={() => isMobile && setMobileFilterOpen(false)}
            >
              {category.name}
            </Link>
          ))}
        </Box>
      </FilterContainer>
    </>
  );

  if (loading) {
    return (
      <CategoryContainer>
        <Container maxWidth={false}>
          <LoadingContainer>
            <CircularProgress />
          </LoadingContainer>
        </Container>
      </CategoryContainer>
    );
  }

  if (error) {
    return (
      <CategoryContainer>
        <Container maxWidth={false}>
          <Box sx={{ py: 4 }}>
            <Typography variant="h5" color="error">
              Error: {error}
            </Typography>
          </Box>
        </Container>
      </CategoryContainer>
    );
  }

  if (!currentCategory) {
    return (
      <Container maxWidth={false}>
        <Box sx={{ py: 4 }}>
          <Typography variant="h5">Category not found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <CategoryContainer>
      <Container maxWidth={false}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link color="inherit" href="/">
            Home
          </Link>
          <Link color="inherit" href="/category/all">
            Categories
          </Link>
          <Typography color="text.primary">{currentCategory.name}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          {currentCategory.image_link && (
            <Box
              component="img"
              src={currentCategory.image_link}
              alt={currentCategory.name}
              sx={{ width: 80, height: 80, mr: 2, objectFit: "contain" }}
            />
          )}
          <CategoryTitle variant="h4">{currentCategory.name}</CategoryTitle>
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {currentCategory.description ||
            `Browse our selection of ${currentCategory.name.toLowerCase()} products`}
        </Typography>

        {/* Display total products and current page info */}
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Showing page {page} of {totalPages} ({allProducts.length} products total)
        </Typography>

        {/* Mobile filter toggle button - only visible on mobile */}
        {isMobile && (
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={toggleMobileFilter}
            sx={{ mb: 2, width: "100%" }}
          >
            Filters
          </Button>
        )}

        {/* Mobile drawer for filters */}
        <Drawer
          anchor="left"
          open={isMobile && mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "80%",
              maxWidth: "300px",
              padding: 2,
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Filters
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FiltersComponent />
          </Box>
        </Drawer>

        {/* Main flex container for layout */}
        <FlexContainer>
          {/* Filters - visible directly on desktop, hidden in drawer on mobile */}
          {!isMobile && (
            <FilterSection>
              <FiltersComponent />
            </FilterSection>
          )}

          {/* Products section */}
          <ProductsSection>
            {displayedProducts.length === 0 ? (
              <Typography variant="body1">
                No products found in this category.
              </Typography>
            ) : (
              <>
                <Grid container spacing={2}>
                  {displayedProducts.map((product) => {
                    const quantity = quantities[product._id] || 1;

                    return (
                      <Grid item xs={12} sm={6} md={6} lg={4} key={product._id}>
                        <ProductCard>
                          <ProductCardContent>
                            <ProductMedia
                              component="img"
                              alt={product.name}
                              image={
                                product.image_link ||
                                "https://placehold.co/300x200?text=No+Image"
                              }
                            />
                            <Box sx={{ maxWidth: 350 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  wordWrap: "break-word",
                                  overflowWrap: "break-word",
                                  whiteSpace: "normal",
                                }}
                              >
                                {product.name}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              ₹ {product.price?.$numberDecimal || product.price}
                            </Typography>

                            <Box sx={{ mt: "auto", width: 350 }}>
                              <Box display="flex" alignItems="center" mt={2}>
                                <IconButton
                                  onClick={() => handleDecrement(product._id)}
                                  color="primary"
                                  disabled={quantity <= 1}
                                  size="small"
                                >
                                  <Remove />
                                </IconButton>
                                <Typography variant="body1" mx={1}>
                                  {quantity}
                                </Typography>
                                <IconButton
                                  onClick={() => handleIncrement(product._id)}
                                  color="primary"
                                  size="small"
                                >
                                  <Add />
                                </IconButton>
                              </Box>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  handleAddToCart(product._id, quantity)
                                }
                                sx={{ mt: 2, width: "100%" }}
                              >
                                Add to Cart
                              </Button>
                            </Box>
                          </ProductCardContent>
                        </ProductCard>
                      </Grid>
                    );
                  })}
                </Grid>

                <PaginationContainer>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size={isMobile ? "medium" : "large"}
                  />
                </PaginationContainer>
              </>
            )}
          </ProductsSection>
        </FlexContainer>
      </Container>
    </CategoryContainer>
  );
};

export default ProductListingComponent;