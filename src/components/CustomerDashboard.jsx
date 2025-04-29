import React from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  LocalShipping,
  AccountCircle,
  Favorite,
  LocationOn,
  Help,
  Logout,
  Download,
  ArrowBack,
  Person,
  Email,
  Phone,
  CalendarToday,
  Home,
  Work,
  Payment,
} from "@mui/icons-material";
import { useGetOrdersByUserQuery , useGetOrderByIdQuery} from "../redux/ordersApi";
// import Orders from "./Orders";

const DashboardContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const OrderStatusChip = styled(Chip)(({ status }) => ({
  backgroundColor:
    status === "Delivered"
      ? "#4caf50"
      : status === "Shipped"
      ? "#2196f3"
      : status === "Processing"
      ? "#ff9800"
      : "#f44336",
  color: "white",
}));

const InvoiceButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  marginRight: theme.spacing(1),
}));

const DashboardPage = () => {
  const [activeTab, setActiveTab] = React.useState("orders");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const storedAddress = localStorage.getItem("customerAddress") ? JSON.parse(localStorage.getItem("customerAddress"))
  : null;

const name = localStorage.getItem("name");
const e_mail = localStorage.getItem("email");
const phone_no = localStorage.getItem("number");
  const userId = localStorage.getItem("userId");
  const { data, isLoading, isError } = useGetOrdersByUserQuery(userId);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  // console.log(data)
  

  // Mock order data with invoice URLs
  // const orders = [
  //   {
  //     id: "ORD-12345",
  //     date: "2023-04-15",
  //     status: "Delivered",
  //     total: "$124.95",
  //     items: 3,
  //     tracking: "UPS-1Z999AA1012345678",
  //     invoiceUrl: "https://example.com/invoices/ORD-12345.pdf",
  //   },
  //   {
  //     id: "ORD-12346",
  //     date: "2023-04-02",
  //     status: "Shipped",
  //     total: "$56.80",
  //     items: 2,
  //     tracking: "FEDEX-123456789012",
  //     invoiceUrl: "https://example.com/invoices/ORD-12346.pdf",
  //   },
  //   {
  //     id: "ORD-12347",
  //     date: "2023-03-28",
  //     status: "Processing",
  //     total: "$89.50",
  //     items: 1,
  //     tracking: "",
  //     invoiceUrl: "https://example.com/invoices/ORD-12347.pdf",
  //   },
  // ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    navigate("/login");
  };

  const handleDownloadInvoice = (invoiceUrl) => {
    // In a real app, this would trigger the download
    window.open(invoiceUrl, "_blank");
  };

  const handleBackToStore = () => {
    navigate("/");
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
            <Badge overlap="circular">
              <Avatar sx={{ width: 40, height: 40 }}>{name}</Avatar>
            </Badge>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Avatar /> My Account
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

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <List component="nav" sx={{ py: 0 }}>
              <ListItem
                button
                selected={activeTab === "orders"}
                onClick={() => handleTabChange("orders")}
              >
                <ListItemIcon>
                  <ShoppingBag
                    color={activeTab === "orders" ? "primary" : "inherit"}
                  />
                </ListItemIcon>
                <ListItemText primary="My Orders" />
              </ListItem>

              <ListItem
                button
                selected={activeTab === "tracking"}
                onClick={() => handleTabChange("tracking")}
              >
                <ListItemIcon>
                  <LocalShipping
                    color={activeTab === "tracking" ? "primary" : "inherit"}
                  />
                </ListItemIcon>
                <ListItemText primary="Order Tracking" />
              </ListItem>

              <ListItem
                button
                selected={activeTab === "profile"}
                onClick={() => handleTabChange("profile")}
              >
                <ListItemIcon>
                  <AccountCircle
                    color={activeTab === "profile" ? "primary" : "inherit"}
                  />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>

              <ListItem
                button
                selected={activeTab === "addresses"}
                onClick={() => handleTabChange("addresses")}
              >
                <ListItemIcon>
                  <LocationOn
                    color={activeTab === "addresses" ? "primary" : "inherit"}
                  />
                </ListItemIcon>
                <ListItemText primary="Addresses" />
              </ListItem>

              <ListItem
                button
                selected={activeTab === "wishlist"}
                onClick={() => handleTabChange("wishlist")}
              >
                <ListItemIcon>
                  <Favorite
                    color={activeTab === "wishlist" ? "primary" : "inherit"}
                  />
                </ListItemIcon>
                <ListItemText primary="Wishlist" />
              </ListItem>

              <Divider sx={{ my: 1 }} />

              <ListItem button>
                <ListItemIcon>
                  <Help />
                </ListItemIcon>
                <ListItemText primary="Help & Support" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ minHeight: "70vh", p: 3 }}>
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  My Orders
                </Typography>

                {data?.orders?.length > 0 ? (
                  <TableContainer component={Paper} elevation={0} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Order ID</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Items</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id}</TableCell>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {order.items.map((item, index) => (
                                <Typography
                                  variant="body2"
                                  key={index}
                                  sx={{ whiteSpace: "nowrap" }}
                                >
                                  - {item.product?.name} × {item.quantity}
                                </Typography>
                              ))}
                            </TableCell>
                            <TableCell>₹{order.totalAmount}</TableCell>
                            <TableCell>
                              <OrderStatusChip
                                label={order.status}
                                size="small"
                                status={order.status.toLowerCase()}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                <Tooltip title="Download Invoice">
                                  <InvoiceButton
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Download />}
                                    onClick={() =>
                                      handleDownloadInvoice(order.invoiceUrl)
                                    }
                                  >
                                    Invoice
                                  </InvoiceButton>
                                </Tooltip>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => navigate(`/orders/${order._id}`)}
                                >
                                  Details
                                </Button>
                              </Box>
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
            )}


            {/* Order Tracking Tab */}
            {activeTab === "tracking" && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Order Tracking
                </Typography>

                {orders.filter((o) => o.tracking).length > 0 ? (
                  <Grid container spacing={3}>
                    {orders
                      .filter((o) => o.tracking)
                      .map((order) => (
                        <Grid item xs={12} key={order.id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={3}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Order ID
                                  </Typography>
                                  <Typography variant="subtitle1">
                                    {order.id}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Tracking Number
                                  </Typography>
                                  <Typography variant="subtitle2">
                                    {order.tracking}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Status
                                  </Typography>
                                  <OrderStatusChip
                                    label={order.status}
                                    size="small"
                                    status={order.status.toLowerCase()}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    fullWidth
                                    onClick={() =>
                                      window.open(
                                        `https://www.ups.com/track?tracknum=${order.tracking}`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    Track Package
                                  </Button>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: "center", py: 5 }}>
                    <LocalShipping
                      sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      No shipments to track
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Your recent orders don't have tracking information yet
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Profile Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, display: "flex", alignItems: "center" }}
                        >
                          <Person sx={{ mr: 1 }} /> Personal Details
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                            Name
                            </Typography>
                            <Typography variant="body1">{name}</Typography>
                          </Grid>
                          
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Email
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Email fontSize="small" sx={{ mr: 1 }} />{" "}
                            {e_mail}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Phone
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Phone fontSize="small" sx={{ mr: 1 }} /> +1 (555)
                            {phone_no}
                          </Typography>
                        </Box>

                        {/* <Box>
                          <Typography variant="body2" color="text.secondary">
                            Date of Birth
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <CalendarToday fontSize="small" sx={{ mr: 1 }} />{" "}
                            January 15, 1990
                          </Typography>
                        </Box> */}
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, display: "flex", alignItems: "center" }}
                        >
                          <Payment sx={{ mr: 1 }} /> Payment Methods
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          You haven't saved any payment methods yet.
                        </Typography>

                        <Button variant="outlined" sx={{ mt: 2 }}>
                          Add Payment Method
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Button variant="contained" color="primary">
                      Edit Profile
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Saved Addresses
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Home sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            Home Address
                          </Typography>
                        </Box>

                        <Typography variant="body2">
                          {storedAddress ? (
                            <>
                              {storedAddress.first_line}, {storedAddress.second_line}
                              <br />
                              {storedAddress.city}, {storedAddress.state} {storedAddress.pin_code}
                              <br />
                              India
                            </>
                          ) : (
                            "No address available"
                          )}
                        </Typography>

                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                          <Button variant="outlined" size="small">
                            Edit
                          </Button>
                          <Button variant="outlined" size="small" color="error">
                            Delete
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Work sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            Work Address
                          </Typography>
                        </Box>

                        <Typography variant="body2">
                          456 Business Ave
                          <br />
                          Suite 200
                          <br />
                          New York, NY 10005
                          <br />
                          United States
                        </Typography>

                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                          <Button variant="outlined" size="small">
                            Edit
                          </Button>
                          <Button variant="outlined" size="small" color="error">
                            Delete
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card
                      variant="outlined"
                      sx={{ borderStyle: "dashed", height: "100%" }}
                    >
                      <CardContent
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          p: 4,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ mb: 2, textAlign: "center" }}
                        >
                          Add a new address
                        </Typography>
                        <Button variant="contained">Add Address</Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Your Wishlist
                </Typography>

                <Box sx={{ textAlign: "center", py: 5 }}>
                  <Favorite
                    sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    Your wishlist is empty
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Save items you like for future purchases
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/"
                  >
                    Continue Shopping
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default DashboardPage;
