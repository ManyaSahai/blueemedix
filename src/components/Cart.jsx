import React, { useState, useRef } from "react";
import { 
  useGetCartQuery, 
  useDeleteCartItemMutation, 
  useUpdateCartItemMutation 
} from "../redux/cartApi";
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
  ButtonGroup,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckoutPage from "./Checkout";

const Cart = () => {
  const userId = localStorage.getItem("userId"); // Get user ID from localStorage
  const { data: cartItems, error, isLoading, refetch } = useGetCartQuery(userId);
  const [deleteCartItem] = useDeleteCartItemMutation(); // Mutation to delete cart items
  const [updateCartItem] = useUpdateCartItemMutation(); // Mutation to update cart item quantity
  const [showCheckout, setShowCheckout] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);
  
  // Create a local state to track cart changes before they're reflected in the API response
  const [localCart, setLocalCart] = useState(null);

  // Initialize localCart when cartItems are loaded
  React.useEffect(() => {
    if (cartItems?.cart) {
      setLocalCart(cartItems.cart);
    }
  }, [cartItems]);

  const handleRemoveItem = async (productId) => {
    try {
      await deleteCartItem({ userId, productId }).unwrap();
      // Update local cart immediately
      setLocalCart(prevCart => prevCart.filter(item => {
        const itemProductId = item.product.id || item.product._id;
        return itemProductId !== productId;
      }));
      // Refetch cart data after removal
      refetch();
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert("Error removing item");
    }
  };

  // Updated to use quantityChange and update local state immediately
  const handleUpdateQuantity = async (productId, quantityChange) => {
    console.log("Updating product quantity:", productId, quantityChange);
    
    // Update local cart immediately for responsive UI
    setLocalCart(prevCart => prevCart.map(item => {
      const itemProductId = item.product.id || item.product._id;
      if (itemProductId === productId) {
        // Calculate new quantity
        const newQuantity = Math.max(1, item.quantity + quantityChange);
        return {
          ...item,
          quantity: newQuantity
        };
      }
      return item;
    }));
    
    try {
      await updateCartItem({
        userId,
        productId,
        quantityChange
      }).unwrap();
      
      // Refetch cart data to ensure sync with server
      refetch();
    } catch (err) {
      console.error("Failed to update quantity:", err);
      alert("Error updating quantity");
      // Revert local cart on error
      if (cartItems?.cart) {
        setLocalCart(cartItems.cart);
      }
    }
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

  // Handler for when order is completed - called from CheckoutPage
  const handleOrderCompleted = () => {
    setShowCheckout(false);
    refetch(); // Refetch cart data (should be empty after order)
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading cart</div>;

  // Use localCart if available, otherwise fall back to cartItems.cart
  const displayCart = localCart || cartItems?.cart || [];

  // Calculate total price using the current display cart
  const totalPrice = displayCart.reduce((total, item) => {
    return (
      total +
      parseFloat(item.product.price?.$numberDecimal || 0) * item.quantity
    );
  }, 0);

  // Prepare properly formatted checkout data using the current local state
  const prepareCheckoutData = () => {
    console.log("Preparing checkout data from:", displayCart);
    
    if (!displayCart || !displayCart.length) {
      return { cart: [] };
    }
    
    // Create a properly formatted cart array for the checkout component
    const formattedCart = displayCart.map(item => {
      console.log("Formatting cart item for checkout:", item);
      return {
        product: {
          ...item.product,
          // Ensure both _id and id are available
          _id: item.product._id || item.product.id,
          id: item.product.id || item.product._id
        },
        quantity: item.quantity,
        price: parseFloat(item.product.price?.$numberDecimal || 0)
      };
    });
    
    console.log("Formatted cart for checkout:", formattedCart);
    
    return { cart: formattedCart };
  };

  // If showing checkout page
  if (showCheckout) {
    const checkoutData = prepareCheckoutData();
    return (
      <CheckoutPage 
        prescriptions={uploadedFiles} 
        cartData={checkoutData} 
        onOrderComplete={handleOrderCompleted}
      />
    );
  }

  return (
    <Container maxWidth={false}>
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
      {displayCart.length > 0 ? (
        <>
          {displayCart.map((item, index) => {
            const productId = item.product.id || item.product._id;
            return (
              <Card key={productId || index} sx={{ marginBottom: "16px" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="h6">{item.product.name}</Typography>
                      <Typography variant="body2">
                        Price: ₹
                        {parseFloat(item.product.price?.$numberDecimal || 0).toFixed(2)}
                      </Typography>
                      
                      {/* Updated quantity adjustment controls to pass quantityChange */}
                      <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          Quantity:
                        </Typography>
                        <ButtonGroup size="small" aria-label="quantity adjustment">
                          <Button 
                            onClick={() => handleUpdateQuantity(productId, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon fontSize="small" />
                          </Button>
                          <Button disableRipple sx={{ cursor: "default", backgroundColor: "white" }}>
                            {item.quantity}
                          </Button>
                          <Button onClick={() => handleUpdateQuantity(productId, +1)}>
                            <AddIcon fontSize="small" />
                          </Button>
                        </ButtonGroup>
                      </Box>
                      
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRemoveItem(productId)}
                        sx={{ marginTop: "8px" }}
                        startIcon={<DeleteIcon />}
                      >
                        Remove
                      </Button>
                    </Box>
                    
                    <Typography variant="h6">
                      ₹{(parseFloat(item.product.price?.$numberDecimal || 0) * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}

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
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
          <Typography variant="h6" gutterBottom>Your cart is empty.</Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => window.location.href = "/"}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Cart;