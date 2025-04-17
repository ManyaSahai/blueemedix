import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import categoryData from "../CategoryData.jsx";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const CategoryContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600,
}));

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);

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

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body2">
              Products for {category.label} category will be displayed here
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </CategoryContainer>
  );
};

export default CategoryPage;
