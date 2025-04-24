import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

function OrderDetails({
  open,
  onClose,
  orderDetails,
  loading,
  error,
  selectedOrderId,
  updateStatusLoading,
  handleUpdateStatus: handleUpdateStatusProp,
  getStatusColor,
}) {
  const [newStatus, setNewStatus] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [isUpdateAllowed, setIsUpdateAllowed] = useState(true);

  useEffect(() => {
    // Reset state when the dialog opens or order details change
    if (open && orderDetails) {
      setNewStatus("");
      setUpdateError("");
      setIsUpdateAllowed(true);
    }
  }, [open, orderDetails]);

  if (!orderDetails) return null;

  const order = orderDetails;

  const allowedTransitions = {
    'pending': ['accepted', 'rejected'],
    'accepted': ['dispatched', 'cancelled'],
    'rejected': [],
    'dispatched': ['delivered', 'cancelled'],
    'delivered': [],
    'cancelled': []
  };

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
    setUpdateError(""); // Clear any previous error
    setIsUpdateAllowed(allowedTransitions[order.status]?.includes(event.target.value) || false);
  };

  const handleUpdate = () => {
    if (newStatus && isUpdateAllowed) {
      handleUpdateStatusProp(selectedOrderId, newStatus);
    } else if (!isUpdateAllowed) {
      setUpdateError(`Cannot change order status from '${order.status}' to '${newStatus}'`);
    } else {
      setUpdateError("Please select a new status");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Order Details - {selectedOrderId}
        <Chip
          label={order?.status?.toUpperCase()}
          size="small"
          sx={{ ml: 2, bgcolor: getStatusColor(order?.status), color: "white" }}
        />
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">
            Error loading order details: {error}
          </Alert>
        ) : (
          <Box>
            {/* Customer Details */}
            <Typography variant="h6" gutterBottom>Customer Information</Typography>
            <Box sx={{ mb: 3, p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
              <Typography><strong>Name:</strong> {order.customer.name}</Typography>
              <Typography><strong>Email:</strong> {order.customer.e_mail}</Typography>
              <Typography><strong>Phone:</strong> {order.customer.phone_no}</Typography>
            </Box>

            {/* Shipping Address */}
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <Box sx={{ mb: 3, p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
              <Typography>{order.shippingAddress.first_line}</Typography>
              {order.shippingAddress.second_line && (
                <Typography>{order.shippingAddress.second_line}</Typography>
              )}
              <Typography>
                {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.pin_code}
              </Typography>
            </Box>

            {/* Order Items */}
            <Typography variant="h6" gutterBottom>Order Items</Typography>
            <TableContainer component={Paper} elevation={0} sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>Item</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={item._id || index}>
                      <TableCell>
                        {item.product ? item.product.name : "Product Unavailable"}
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">Rs{item.price.toFixed(2)}</TableCell>
                      <TableCell align="right">Rs{(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right"><strong>Total Amount:</strong></TableCell>
                    <TableCell align="right"><strong>Rs{order.totalAmount.toFixed(2)}</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Payment Information */}
            <Typography variant="h6" gutterBottom>Payment Information</Typography>
            <Box sx={{ mb: 3, p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
              <Typography><strong>Method:</strong> {order.payment_method.toUpperCase()}</Typography>
              {order.upi_id && (
                <Typography><strong>UPI ID:</strong> {order.upi_id}</Typography>
              )}
              <Typography><strong>Status:</strong> {order.payment_status.toUpperCase()}</Typography>
            </Box>

            {/* Tracking Information */}
            <Typography variant="h6" gutterBottom>Order Tracking</Typography>
            <Box sx={{ mb: 2 }}>
              {order.tracking.map((track, index) => (
                <Box key={track._id || index} sx={{
                  display: 'flex',
                  mb: 1,
                  p: 1,
                  bgcolor: index === 0 ? '#f0f7ff' : 'transparent',
                  borderRadius: 1
                }}>
                  <Box sx={{ minWidth: 180 }}>
                    {new Date(track.timestamp).toLocaleString()}
                  </Box>
                  <Box sx={{ minWidth: 100 }}>
                    <Chip
                      label={track.status.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(track.status),
                        color: "white"
                      }}
                    />
                  </Box>
                  <Box sx={{ ml: 2, flex: 1 }}>
                    {track.description}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Prescription */}
            {order.prescription_image && (
  <>
    <Typography variant="h6" gutterBottom>Prescription</Typography>
    <Box sx={{ mb: 2, textAlign: 'center' }}>
      <Button variant="outlined" href={order.prescription_image} target="_blank">
        View Prescription Image
      </Button>
    </Box>
  </>
)}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150, mr: 2 }}>
            <Select
              value={newStatus}
              displayEmpty
              renderValue={() => "Update Status"}
              disabled={updateStatusLoading}
              onChange={handleStatusChange}
            >
              <MenuItem value="pending" disabled={!allowedTransitions[order.status]?.includes('pending')}>Pending</MenuItem>
              <MenuItem value="accepted" disabled={!allowedTransitions[order.status]?.includes('accepted')}>Accepted</MenuItem>
              <MenuItem value="dispatched" disabled={!allowedTransitions[order.status]?.includes('dispatched')}>Dispatched</MenuItem>
              <MenuItem value="delivered" disabled={!allowedTransitions[order.status]?.includes('delivered')}>Delivered</MenuItem>
              <MenuItem value="rejected" disabled={!allowedTransitions[order.status]?.includes('rejected')}>Rejected</MenuItem>
              <MenuItem value="cancelled" disabled={!allowedTransitions[order.status]?.includes('cancelled')}>Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={handleUpdate}
            variant="contained"
            color="primary"
            disabled={updateStatusLoading || !newStatus || !isUpdateAllowed}
          >
            {updateStatusLoading ? <CircularProgress size={24} color="inherit" /> : "Update"}
          </Button>
          {updateError && (
            <Typography color="error" sx={{ ml: 2 }}>
              {updateError}
            </Typography>
          )}
        </Box>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderDetails;