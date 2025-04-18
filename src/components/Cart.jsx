import React, { useState } from "react";
import { useGetCartQuery, useDeleteCartItemMutation } from "../redux/cartApi";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Divider,
} from "@mui/material";
import CheckoutPage from "./Checkout";

const Cart = () => {
  const userId = localStorage.getItem("userId"); // Get user ID from localStorage
  const { data: cartItems, error, isLoading } = useGetCartQuery(userId);
  const [deleteCartItem] = useDeleteCartItemMutation(); // Mutation to delete cart items
  const [showCheckout, setShowCheckout] = useState(false);

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
    return <CheckoutPage />;
  }

  return (
    <Container maxWidth="md">
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
