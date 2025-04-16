import { Box, TextField, Button, Grid, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useAddProductMutation } from "../../redux/productApi";  // Only using addProductMutation now

export default function AddProductForm({ onClose }) {
  const [addProduct, { isLoading, isError }] = useAddProductMutation(); // Only this mutation is used

  const [productData, setProductData] = useState({
    name: '',
    price: 0,
    description: '',
    image_link: '',
    discount: 0,
    quantity: 0,
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct(productData).unwrap();
      setProductData({
        name: '',
        price: 0,
        description: '',
        image_link: '',
        discount: 0,
        quantity: 0,
      });
      onClose(); // Close modal if passed
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Box p={3}>
      <h2>Add New Product</h2>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product Name"
                fullWidth
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                fullWidth
                name="price"
                value={productData.price}
                onChange={handleInputChange}
                required
                type="number"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Image URL"
                fullWidth
                name="image_link"
                value={productData.image_link}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Discount"
                fullWidth
                name="discount"
                value={productData.discount}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                fullWidth
                name="quantity"
                value={productData.quantity}
                onChange={handleInputChange}
                type="number"
              />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained" color="primary">
                Add Product
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
      {isError && <div>Error occurred while adding the product.</div>}
    </Box>
  );
}
