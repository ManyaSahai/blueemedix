import React from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Chip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress
} from "@mui/material";
import { useGetOrderByIdQuery } from "../redux/ordersApi";

const OrderDetails = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetOrderByIdQuery(id);
  if (data) {console.log(data)}else{console.log("data missing")};


  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load order.</Typography>;

  const { order } = data;

  const {
    customer,
    seller,
    shippingAddress,
    items,
    totalAmount,
    status,
    prescription_image,
    payment_method,
    upi_id,
    payment_status,
    tracking,
    createdAt
  } = order;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Order Details</Typography>

      {/* Customer & Seller Info */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Customer</Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <Avatar sx={{ mr: 2 }} />
              <Box>
                <Typography>{customer.name}</Typography>
                <Typography variant="body2">{customer.e_mail}</Typography>
                <Typography variant="body2">📞 {customer.phone_no}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Seller</Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <Avatar sx={{ mr: 2 }} />
              <Box>
                <Typography>{seller.name}</Typography>
                <Typography variant="body2">{seller.e_mail}</Typography>
                <Typography variant="body2">📞 {seller.phone_no}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Shipping Address */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Shipping Address</Typography>
        <Typography variant="body2" mt={1}>
          {shippingAddress.first_line}, {shippingAddress.second_line}
          <br />
          {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pin_code}
          <br />
          India
        </Typography>
      </Paper>

      {/* Items List */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Items Ordered</Typography>
        <List>
          {items.map((item) => (
            <ListItem key={item._id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  variant="square"
                  src={item.product.image_link}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.product.name}
                secondary={`Qty: ${item.quantity} × ₹${item.price.toFixed(2)} = ₹${(item.quantity * item.price).toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Total: ₹{totalAmount.toFixed(2)}</Typography>
      </Paper>

      {/* Payment Details */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Payment Details</Typography>
        <Typography>Method: {payment_method.toUpperCase()}</Typography>
        <Typography>UPI ID: {upi_id}</Typography>
        <Chip
          label={payment_status.toUpperCase()}
          color={payment_status === "paid" ? "success" : "warning"}
          size="small"
          sx={{ mt: 1 }}
        />
      </Paper>

      {/* Tracking */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Order Tracking</Typography>
        {tracking.map((t) => (
          <Box key={t._id} my={1}>
            <Chip label={t.status} color="info" size="small" />
            <Typography variant="body2">{new Date(t.timestamp).toLocaleString()}</Typography>
            <Typography variant="body2">{t.description}</Typography>
          </Box>
        ))}
      </Paper>

      {/* Prescription Image */}
      {prescription_image && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">Prescription Image</Typography>
          <Box mt={1}>
            <img
              src={prescription_image}
              alt="Prescription"
              style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }}
            />
          </Box>
        </Paper>
      )}

      <Typography variant="body2" color="text.secondary">
        Ordered on: {new Date(createdAt).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default OrderDetails;
