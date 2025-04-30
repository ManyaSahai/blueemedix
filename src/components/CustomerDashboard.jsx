import React from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Person,
  Logout,
  Download,
  ArrowBack,
} from "@mui/icons-material";
import { useGetOrdersByUserQuery } from "../redux/ordersApi";
import jsPDF from "jspdf";
import { autoTable } from 'jspdf-autotable'; 

const DashboardContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const OrderStatusChip = styled(Chip)(({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "#4caf50";
      case "dispatched":
        return "#2196f3";
      case "accepted":
        return "#ff9800";
      case "rejected":
      case "cancelled":
        return "#f44336";
      case "pending":
      default:
        return "#9e9e9e";
    }
  };

  return {
    backgroundColor: getStatusColor(),
    color: "white",
  };
});

const DashboardPage = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "info"
  });
  
  const name = localStorage.getItem("name");
  const e_mail = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");
  
  // Only fetch orders if there's a valid userId (not null or "null")
  const validUserId = userId && userId !== "null" ? userId : undefined;
  const { data, isLoading, isError } = useGetOrdersByUserQuery(validUserId);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('number');
    localStorage.removeItem('region');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('customerAddress');
    handleMenuClose();
    navigate("/login");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showNotification = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const generateInvoicePDF = (invoiceData) => {
    const doc = new jsPDF();
  
    // Invoice header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 105, 20, { align: "center" });
  
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
  
    // Company and order info
    doc.text("BlueMedix", 14, 40);
    doc.text("Invoice #: " + invoiceData.orderId.substring(0, 10), 14, 45);
    doc.text("Date: " + new Date(invoiceData.orderDate).toLocaleDateString(), 14, 50);
    doc.text("Status: " + invoiceData.status, 14, 55);
  
    // Customer info
    doc.text("Bill To:", 140, 40);
    doc.text(invoiceData.customerName, 140, 45);
    doc.text(invoiceData.shippingAddress.first_line, 140, 50);
    if (invoiceData.shippingAddress.second_line) {
      doc.text(invoiceData.shippingAddress.second_line, 140, 55);
    }
    doc.text(`${invoiceData.shippingAddress.city}, ${invoiceData.shippingAddress.state} - ${invoiceData.shippingAddress.pin_code}`, 140, 60);
  
    // Items table
    const tableColumn = ["Item", "Quantity", "Price (₹)", "Total (₹)"];
    const tableRows = invoiceData.items.map(item => [
      item.name,
      item.quantity,
      item.price.toFixed(2),
      item.total.toFixed(2)
    ]);
  
    autoTable(doc, { // Use the imported autoTable function
      startY: 70,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [96, 125, 139] },
      margin: { top: 20 },
    });
  
    // Summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Payment Information:", 14, finalY);
    doc.setFont("helvetica", "normal");
    doc.text("Payment Method: " + invoiceData.paymentMethod.toUpperCase(), 14, finalY + 5);
    doc.text("Payment Status: " + invoiceData.paymentStatus, 14, finalY + 10);
  
    // Total
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", 14, finalY + 15); // Moved Total under Payment Info
    doc.text("₹" + invoiceData.totalAmount.toFixed(2), 170, finalY + 15, { align: "right" }); // Aligned to the right
  
    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text("Thank you for shopping with BlueMedix!", 105, finalY + 30, { align: "center" }); // Adjusted footer position
  
    // Save PDF
    const fileName = `Invoice-${invoiceData.orderId.substring(0, 8)}.pdf`;
    doc.save(fileName);
  };

  const handleDownloadInvoice = async (orderId) => {
    setIsDownloading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/order/invoice/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoice data');
      }
      
      const data = await response.json();
      
      if (data.success) {
        generateInvoicePDF(data.invoice);
        showNotification("Invoice downloaded successfully", "success");
      } else {
        throw new Error(data.message || 'Failed to generate invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      showNotification(`Error: ${error.message}`, "error");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBackToStore = () => {
    navigate("/");
  };
  
  const handleProfileClick = () => {
    navigate("/customer/profile");
    handleMenuClose();
  };

  return (
    <DashboardContainer maxWidth="xl">
      {/* Header with back button and profile */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToStore}
          sx={{ textTransform: "none" }}
        >
          Back to Store
        </Button>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Hi, {name}
          </Typography>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
              {name ? name.charAt(0).toUpperCase() : "U"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 2,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                minWidth: 180,
                "& .MuiMenuItem-root": {
                  px: 2,
                  py: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Main Content */}
      <Paper elevation={3} sx={{ minHeight: "70vh", p: 3, borderRadius: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
            My Orders
          </Typography>

          {isLoading ? (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography>Loading your orders...</Typography>
            </Box>
          ) : isError ? (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography color="error">
                There was an error loading your orders. Please try again.
              </Typography>
            </Box>
          ) : data?.orders?.length > 0 ? (
            <TableContainer 
              component={Paper} 
              elevation={0} 
              variant="outlined"
              sx={{ borderRadius: 2, overflow: "hidden" }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Invoice</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.orders.map((order) => (
                    <TableRow key={order._id} hover>
                      <TableCell>{order._id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {order.items.map((item, index) => (
                          <Typography
                            variant="body2"
                            key={index}
                            sx={{ 
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "150px"
                            }}
                          >
                            {item.product?.name} × {item.quantity}
                          </Typography>
                        ))}
                      </TableCell>
                      <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <OrderStatusChip
                          label={order.status}
                          size="small"
                          status={order.status.toLowerCase()}
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Download Invoice">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleDownloadInvoice(order._id)}
                            disabled={isDownloading}
                          >
                            {isDownloading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <Download />
                            )}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <ShoppingBag
                sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No orders yet
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                component={Link}
                to="/"
              >
                Start Shopping
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Notification Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContainer>
  );
};

export default DashboardPage;