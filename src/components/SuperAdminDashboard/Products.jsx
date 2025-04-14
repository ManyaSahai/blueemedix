import { Box, CircularProgress, Grid, Card, CardContent, Typography, IconButton, Button, CardActions } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useState } from "react";
import { useGetProductsQuery, useUpdateProductMutation, useDeleteProductMutation } from "../../redux/productApi.js";
import EditProductModal from "./EditProductModal"; // Import your modal component

export default function Products() {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setOpenModal(true); // Open modal when the edit button is clicked
  };

  const handleDeleteClick = async (productId) => {
    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSave = async (updatedProduct) => {
    try {
      await updateProduct(updatedProduct);
      setOpenModal(false); // Close modal after saving
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Error loading products</div>;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Product List</Typography>
        <Box display="flex" gap={2}>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Product
          </Button>
          <Button variant="outlined" startIcon={<UploadFileIcon />}>
            Import in Bulk
          </Button>
        </Box>
      </Box>
      <Grid container spacing={3}>
        {products?.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} sx={{ display: "flex", alignItems: "center", margin: "auto" }}>
            <Card sx={{ height: "150px", width: "400px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.title.length > 50 ? product.title.slice(0, 50) + '...' : product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${product.price}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", marginTop: "-50px" }}>
                <IconButton color="primary" title="Edit" onClick={() => handleEditClick(product)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" title="Delete" onClick={() => handleDeleteClick(product.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProductModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          product={selectedProduct}
          onSave={handleSave}
        />
      )}
    </Box>
  );
}
