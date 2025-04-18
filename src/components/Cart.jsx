import React, { useEffect } from 'react';
import { useGetCartQuery, useDeleteCartItemMutation } from '../redux/cartApi';  // Adjust import path if necessary
import { Button, Card, CardContent, Typography } from '@mui/material';

const Cart = () => {
  const userId = localStorage.getItem('userId'); // Get user ID from localStorage
  const { data: cartItems, error, isLoading } = useGetCartQuery(userId);
console.log(cartItems);// Fetch cart items for the logged-in user
  const [deleteCartItem] = useDeleteCartItemMutation(); // Mutation to delete cart items

  const handleRemoveItem = (productId) => {
    deleteCartItem({ userId, productId })  // Remove item from cart
      .unwrap()
      .then(() => {
        alert('Item removed from cart');
      })
      .catch((err) => {
        console.error('Failed to remove item:', err);
        alert('Error removing item');
      });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading cart</div>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      {cartItems?.cart?.length > 0 ? (
  cartItems.cart.map((item, index) => (
    <Card key={item.product.id || index} sx={{ marginBottom: '16px' }}>
      <CardContent>
        <Typography variant="h6">{item.product.name}</Typography>
        <Typography variant="body2">
          Price: ₹{parseFloat(item.product.price?.$numberDecimal || 0).toFixed(2)}
        </Typography>
        <Typography variant="body2">Quantity: {item.quantity}</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleRemoveItem(item.product.id)}
          sx={{ marginTop: '8px' }}
        >
          Remove from Cart
        </Button>
      </CardContent>
    </Card>
  ))
) : (
  <Typography variant="body1">Your cart is empty.</Typography>
)}
    </div>
  );
};

export default Cart;
