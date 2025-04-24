import React, { useState, useRef } from "react";
import { useGetCartQuery, useDeleteCartItemMutation } from "../redux/cartApi";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Divider,
  Alert,
  IconButton,
  Stack,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckoutPage from "./Checkout";

const Cart = () => {
  const userId = localStorage.getItem("userId"); // Get user ID from localStorage
  const { data: cartItems, error, isLoading } = useGetCartQuery(userId);
  const [deleteCartItem] = useDeleteCartItemMutation(); // Mutation to delete cart items
  const [showCheckout, setShowCheckout] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleRemoveItem = (productId) => {
    deleteCartItem({ userId, productId }) // Remove item from cart
      .unwrap()
      .then(() => {
        alert("Item removed from cart");
      })
      .catch((err) => {
        console.error("Failed to remove item:", err);
        alert("Error removing item");
      });
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      const fileType = file.type;
      // Allow PDFs, images and common document formats
      return (
        fileType.includes("pdf") ||
        fileType.includes("image") ||
        fileType.includes("document") ||
        fileType.includes("msword") ||
        fileType.includes("officedocument")
      );
    });

    if (validFiles.length) {
      setUploadedFiles([...uploadedFiles, ...validFiles]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }

    // Reset file input
    event.target.value = null;
  };

  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles(
      uploadedFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading cart</div>;

  // Calculate total price
  const totalPrice = cartItems?.cart?.reduce((total, item) => {
    return (
      total +
      parseFloat(item.product.price?.$numberDecimal || 0) * item.quantity
    );
  }, 0);

  // If showing checkout page
  if (showCheckout) {
    return <CheckoutPage prescriptions={uploadedFiles} />;
  }

  return (
    <Container maxWidth="md">
      {uploadSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Prescription uploaded successfully!
        </Alert>
      )}

      {/* Upload Prescription Button Section */}
      <Card sx={{ mb: 3, mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upload Your Prescription
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload prescriptions as PDF, document, or image files
          </Typography>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            multiple
          />

          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadClick}
            sx={{ mb: 2 }}
          >
            Upload Prescription
          </Button>

          {uploadedFiles.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Uploaded Files ({uploadedFiles.length})
              </Typography>
              <Stack spacing={1}>
                {uploadedFiles.map((file, index) => (
                  <Paper
                    key={index}
                    variant="outlined"
                    sx={{
                      p: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" noWrap sx={{ maxWidth: "80%" }}>
                      {file.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile(index)}
                      aria-label="remove file"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cartItems?.cart?.length > 0 ? (
        <>
          {cartItems.cart.map((item, index) => (
            <Card key={item.product.id || index} sx={{ marginBottom: "16px" }}>
              <CardContent>
                <Typography variant="h6">{item.product.name}</Typography>
                <Typography variant="body2">
                  Price: ₹
                  {parseFloat(item.product.price?.$numberDecimal || 0).toFixed(
                    2
                  )}
                </Typography>
                <Typography variant="body2">
                  Quantity: {item.quantity}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemoveItem(item.product.id)}
                  sx={{ marginTop: "8px" }}
                >
                  Remove from Cart
                </Button>
              </CardContent>
            </Card>
          ))}

          <Card sx={{ marginTop: "20px", marginBottom: "20px" }}>
            <CardContent>
              <Typography variant="h6">Order Summary</Typography>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">
                  ₹{totalPrice?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1">₹50.00</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">
                  ₹{(totalPrice + 50).toFixed(2) || "50.00"}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{ marginTop: "16px" }}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <Typography variant="body1">Your cart is empty.</Typography>
      )}
    </Container>
  );
};

export default Cart;
