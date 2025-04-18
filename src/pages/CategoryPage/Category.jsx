import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FixedSizeGrid as VirtualGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { fetchAndCacheProducts } from "../../utils/dataCache.js";
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
  CardMedia
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {useGetProductsQuery} from "../../redux/productApi.js";

import categoryData from "../CategoryData.jsx";
import { useAddItemToCartMutation } from "../../redux/cartApi.js";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const CategoryContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600,
}));
const CARD_WIDTH = 300;
const CARD_HEIGHT = 280;
const COLUMN_COUNT = 3;


const CategoryPage = () => {
  // console.log(categoryData);
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const {data:productsData, refetch} = useGetProductsQuery();
  const [addItemToCart] = useAddItemToCartMutation();
const handleAddToCart = (product) => {
  // Call the mutation to add the product to the cart
  addItemToCart({ productId: product._id, quantity: 1 })
    .unwrap()
    .then(() => {
      alert('Product added to cart!');
    })
    .catch((error) => {
      console.error('Failed to add item to cart:', error);
    });
};
  // console.log(products);

  useEffect(() => {
    const loadCached = async () => {
      const cached = await fetchAndCacheProducts();
      setProducts(cached); // Show instantly from IndexedDB
      refetch(); // Then trigger live API fetch
    };
    loadCached();
  }, []);
  
  useEffect(() => {
    if (productsData) {
      setProducts(productsData); // Update when fresh data comes
    }
  }, [productsData]);

  useEffect(() => {
    const formattedCategoryId = categoryId.replace(/-/g, " ");
    const foundCategory = categoryData.find(
      (cat) => cat.label.toLowerCase() === formattedCategoryId.toLowerCase()
    );

    if (foundCategory) {
      setCategory(foundCategory);
    } else if (categoryId === "all") {
      setCategory(categoryData.find((cat) => cat.label === "All"));
    }
  }, [categoryId]);

  if (!category) {
    return (
      <Container>
        <Box sx={{ py: 4 }}>
          <Typography variant="h5">Category not found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <CategoryContainer>
      <Container>
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
          <Typography color="text.primary">{category.label}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Box
            component="img"
            src={category.image}
            alt={category.label}
            sx={{ width: 80, height: 80, mr: 2 }}
          />
          <CategoryTitle variant="h4">{category.label}</CategoryTitle>
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Browse our selection of {category.label.toLowerCase()} products
        </Typography>

        <Grid container spacing={8}>

        <Box sx={{display:"flex", flexDirection:"column", alignItems:"center", gap:"24px"}}>
          <Box sx={{border: '1px solid #1976d2', borderRadius: 2, boxShadow: 3, px: 4, py:2}}>
            <Typography variant="body2" sx={{marginBottom:"6px"}}>
              Special Deals
            </Typography>
            <Box sx={{display:"flex", flexDirection:"column", alignItems:"flex-start" , gap:"8px"}}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Up to 10%"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="11% to 25%"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="26% to 50%"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Above 50%"
                />
            </Box>  
          </Box>
          <Box sx={{}}>
            Brands
          </Box>
        </Box>
        
          <Grid item xs={12}>
            <Typography variant="body2">
              Products for {category.label} category will be displayed here
            </Typography>
            <Box sx={{ height: 500, width: '100%' }}>
              <AutoSizer>
                {({ height, width }) => {
                  const columnCount = Math.floor(width / CARD_WIDTH);
                  const rowCount = Math.ceil(products.length / columnCount);

                  return (
                    <VirtualGrid
                      columnCount={columnCount}
                      columnWidth={CARD_WIDTH}
                      height={height}
                      rowCount={rowCount}
                      rowHeight={CARD_HEIGHT}
                      width={width}
                    >
                      {({ columnIndex, rowIndex, style }) => {
                        const index = rowIndex * columnCount + columnIndex;
                        const product = products[index];
                        if (!product) return null;

                        return (
                          <Box key={product._id} style={style} p={1}>
                            <Card sx={{ height: '100%' }}>
                              <CardContent>
                              <CardMedia
                                component="img"
                                alt={product.name}
                                height="140"
                                image={product.image_link || "default-image.jpg"}
                                sx={{ objectFit: "contain" }}
                              />
                                <Typography variant="subtitle1" noWrap>
                                  {product.name}
                                </Typography>
                                <Typography variant="body2">
                              ₹{product.price?.$numberDecimal || product.price}
                            </Typography>
                            <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleAddToCart(product)}
                                  sx={{ mt: 2 }}
                                >
                                  Add to Cart
                                </Button>
                              </CardContent>
                            </Card>
                          </Box>
                        );
                      }}
                    </VirtualGrid>
                  );
                }}
              </AutoSizer>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </CategoryContainer>
  );
};

export default CategoryPage;
