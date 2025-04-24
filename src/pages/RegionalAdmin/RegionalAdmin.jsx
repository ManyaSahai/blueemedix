import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Card,
  CardContent,
  Chip,
  Grid,
  FormControl,
  Select,
  InputLabel,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  ArrowBack as BackIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Public as RegionIcon,
  Assignment as TaskIcon,
  RemoveShoppingCart as AbandonedIcon,
} from "@mui/icons-material";
import {useFetchPendingSellersQuery,
  useApproveSellerMutation,
  useRejectSellerMutation,
  useFetchApprovedSellersQuery} from "../../redux/regionalAdminApi";

import {getCachedPendingSellers,
  cachePendingSellers} from "../../utils/regionalSellerCache";

function RegionalAdminDashboard() {
  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("seller-approvals");
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const { data: pendingData, isLoading: isLoadingPending } = useFetchPendingSellersQuery();
  const { data: approvedData, isLoading: isLoadingApproved } = useFetchApprovedSellersQuery();
  const [approveSeller] = useApproveSellerMutation();
  const [rejectSeller] = useRejectSellerMutation();
  const [pendingSellers, setPendingSellers] = useState([]);
  const [approvedSellers, setApprovedSellers] = useState([]);

  
  useEffect(() => {
    console.log('Raw pendingData:', pendingData); // 👈 Add this
    if (pendingData?.sellers) {
      console.log('Fetched Pending Sellers:', pendingData.sellers);
      setPendingSellers(pendingData.sellers);
      cachePendingSellers(pendingData.sellers);
    } else {
      (async () => {
        const cached = await getCachedPendingSellers();
        console.log('Loaded Cached Pending Sellers:', cached);
        setPendingSellers(cached);
      })();
    }
  }, [pendingData]);

  // Add these handler functions to your component
const handleApprove = async (sellerId) => {
  try {
    await approveSeller(sellerId).unwrap();
    // Optional: Show success message
  } catch (error) {
    console.error("Failed to approve seller:", error);
    // Optional: Show error message
  }
};

const handleReject = async (sellerId) => {
  try {
    // You might want to prompt for a reason before calling this
    await rejectSeller({ sellerId, reason: "Application rejected" }).unwrap();
    // Optional: Show success message
  } catch (error) {
    console.error("Failed to reject seller:", error);
    // Optional: Show error message
  }
};
  
    

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const menuItems = [
    { id: "dashboard", icon: <DashboardIcon />, text: "Dashboard" },
    { id: "seller-approvals", icon: <StoreIcon />, text: "Seller Approvals" },
    { id: "seller-approved", icon: <StoreIcon />, text: "Approved Sellers" },
    { id: "seller-all", icon: <StoreIcon />, text: "All sellers"},
    { id: "regional-orders", icon: <OrdersIcon />, text: "Regional Orders" },
    {
      id: "regional-customers",
      icon: <CustomersIcon />,
      text: "Regional Customers",
    },
    {
      id: "abandoned-orders",
      icon: <AbandonedIcon />,
      text: "Abandoned Orders",
    },
    { id: "reports", icon: <ReportsIcon />, text: "Reports" },
    { id: "settings", icon: <SettingsIcon />, text: "Settings" },
  ];

  // Mock data for seller approvals
  const sellerApprovals = [
    {
      id: 1,
      name: "MediPlus Pharmacy",
      email: "medipluspharm@example.com",
      location: "North Region",
      status: "Pending",
      date: "2025-04-10",
    },
    {
      id: 2,
      name: "HealthCare Meds",
      email: "healthcaremeds@example.com",
      location: "East Region",
      status: "Pending",
      date: "2025-04-11",
    },
    {
      id: 3,
      name: "QuickMeds Pharmacy",
      email: "quickmeds@example.com",
      location: "West Region",
      status: "Pending",
      date: "2025-04-12",
    },
  ];

  // Mock data for regional orders
  const regionalOrders = [
    {
      id: 101,
      customer: "John Doe",
      items: 3,
      total: "$157.50",
      status: "Processing",
      date: "2025-04-13",
    },
    {
      id: 102,
      customer: "Mary Smith",
      items: 2,
      total: "$89.99",
      status: "Shipped",
      date: "2025-04-12",
    },
    {
      id: 103,
      customer: "Robert Johnson",
      items: 5,
      total: "$243.75",
      status: "Delivered",
      date: "2025-04-10",
    },
    {
      id: 104,
      customer: "Sarah Williams",
      items: 1,
      total: "$45.00",
      status: "Processing",
      date: "2025-04-13",
    },
  ];

  // Mock data for regional customers
  const regionalCustomers = [
    {
      id: 201,
      name: "John Doe",
      email: "john.doe@example.com",
      orders: 12,
      totalSpent: "$1,245.50",
      location: "North Region",
    },
    {
      id: 202,
      name: "Mary Smith",
      email: "mary.smith@example.com",
      orders: 8,
      totalSpent: "$876.25",
      location: "North Region",
    },
    {
      id: 203,
      name: "Robert Johnson",
      email: "robert.j@example.com",
      orders: 15,
      totalSpent: "$1,567.80",
      location: "East Region",
    },
    {
      id: 204,
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      orders: 5,
      totalSpent: "$435.40",
      location: "West Region",
    },
  ];

  // Mock data for abandoned orders
  const abandonedOrders = [
    {
      id: 301,
      customer: "Alice Cooper",
      items: 2,
      cartValue: "$125.75",
      abandonedDate: "2025-04-11",
      lastActive: "3 days ago",
    },
    {
      id: 302,
      customer: "Bob Martin",
      items: 1,
      cartValue: "$54.99",
      abandonedDate: "2025-04-12",
      lastActive: "2 days ago",
    },
    {
      id: 303,
      customer: "Carol Davis",
      items: 4,
      cartValue: "$211.25",
      abandonedDate: "2025-04-13",
      lastActive: "1 day ago",
    },
  ];

  // Render content based on active menu
  const renderContent = () => {
    switch (activeMenu) {
      case "seller-approvals":
        return (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Pending Seller Approvals</Typography>
              <Box>
                <TextField
                  placeholder="Search sellers..."
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <SearchIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "#666" }}
                      />
                    ),
                  }}
                  sx={{ mr: 2, width: 200 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  sx={{ mr: 2 }}
                >
                  Filter
                </Button>
                <Button variant="outlined" startIcon={<RefreshIcon />}>
                  Refresh
                </Button>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Seller Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Application Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingSellers.map((seller) => (
                    <TableRow key={seller.id}> {/* Use id not _id */}
                    <TableCell>{seller.id}</TableCell>
                    <TableCell>{seller.name}</TableCell>
                    <TableCell>{seller.e_mail}</TableCell>
                    <TableCell>{`${seller.address.city}, ${seller.address.state}`}</TableCell>
                    <TableCell>{seller.created_at ? new Date(seller.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={seller.verification_status || 'pending'}
                        size="small"
                        sx={{
                          backgroundColor: (seller.verification_status || 'pending') === "pending" ? "#fff9c4" : "#e8f5e9",
                          color: (seller.verification_status || 'pending') === "pending" ? "#ff8f00" : "#2e7d32",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleApprove(seller.id)}
                      >
                        <ApproveIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleReject(seller.id)}
                      >
                        <RejectIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          </Paper>
        );

      case "regional-orders":
        return (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Regional Orders</Typography>
              <Box>
                <FormControl sx={{ minWidth: 180, mr: 2 }}>
                  <Select value="all-regions" displayEmpty size="small">
                    <MenuItem value="all-regions">All Regions</MenuItem>
                    <MenuItem value="north">Bihar Region</MenuItem>
                    <MenuItem value="east">West Bengal Region </MenuItem>
                    <MenuItem value="west">Odhisha Region</MenuItem>
                    <MenuItem value="south">Jharkhand Region</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  placeholder="Search orders..."
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <SearchIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "#666" }}
                      />
                    ),
                  }}
                  sx={{ width: 200 }}
                />
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {regionalOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          size="small"
                          sx={{
                            backgroundColor:
                              order.status === "Processing"
                                ? "#e3f2fd"
                                : order.status === "Shipped"
                                ? "#fff9c4"
                                : "#e8f5e9",
                            color:
                              order.status === "Processing"
                                ? "#0d47a1"
                                : order.status === "Shipped"
                                ? "#ff8f00"
                                : "#2e7d32",
                          }}
                        />
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        );

      case "regional-customers":
        return (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Regional Customers</Typography>
              <Box>
                <FormControl sx={{ minWidth: 180, mr: 2 }}>
                  <Select value="all-regions" displayEmpty size="small">
                    <MenuItem value="all-regions">All Regions</MenuItem>
                    <MenuItem value="north">North Region</MenuItem>
                    <MenuItem value="east">East Region</MenuItem>
                    <MenuItem value="west">West Region</MenuItem>
                    <MenuItem value="south">South Region</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  placeholder="Search customers..."
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <SearchIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "#666" }}
                      />
                    ),
                  }}
                  sx={{ width: 200 }}
                />
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Orders</TableCell>
                    <TableCell>Total Spent</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {regionalCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.location}</TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>{customer.totalSpent}</TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined">
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        );

      case "abandoned-orders":
        return (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Abandoned Orders</Typography>
              <Box>
                <Button
                  variant="contained"
                  sx={{
                    mr: 2,
                    backgroundColor: "#1e4c75",
                    "&:hover": { backgroundColor: "#163858" },
                  }}
                >
                  Send Reminder Email
                </Button>
                <TextField
                  placeholder="Search..."
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <SearchIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "#666" }}
                      />
                    ),
                  }}
                  sx={{ width: 200 }}
                />
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>Cart ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Cart Value</TableCell>
                    <TableCell>Abandoned Date</TableCell>
                    <TableCell>Last Active</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {abandonedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{order.cartValue}</TableCell>
                      <TableCell>{order.abandonedDate}</TableCell>
                      <TableCell>{order.lastActive}</TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                          View Cart
                        </Button>
                        <Button size="small" variant="outlined" color="primary">
                          Notify
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        );

      default:
        return (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Select an option from the menu</Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Left Sidebar */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#fff",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#4CAF50", fontWeight: "bold" }}
          >
            Blue<span style={{ color: "#2196F3" }}>Medix</span>
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ color: "#333" }}
          >
            Regional Admin
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Manage your region
          </Typography>
        </Box>
        <Divider />
        <List sx={{ pt: 0 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.id}
              selected={activeMenu === item.id}
              onClick={() => setActiveMenu(item.id)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#e3f2fd",
                  borderLeft: "4px solid #2196F3",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: activeMenu === item.id ? "#2196F3" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  color: activeMenu === item.id ? "#2196F3" : "inherit",
                  fontWeight: activeMenu === item.id ? "medium" : "normal",
                }}
              />
              {item.id === "seller-approvals" && (
                <Chip
                  label="3"
                  size="small"
                  sx={{
                    height: 20,
                    minWidth: 20,
                    backgroundColor: "#f44336",
                    color: "white",
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Top Bar */}
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{ backgroundColor: "#fff", borderBottom: "1px solid #e0e0e0" }}
        >
          <Toolbar>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "medium", color: "#333" }}
              >
                Regional Admin Dashboard
              </Typography>
              <Chip
                label="North Region"
                size="small"
                icon={<RegionIcon sx={{ fontSize: 16 }} />}
                sx={{ ml: 2, backgroundColor: "#e8f5e9", color: "#2e7d32" }}
              />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  ml: 2,
                }}
                onClick={handleUserMenuOpen}
              >
                <Typography variant="body1" sx={{ mr: 1 }}>
                  Admin User
                </Typography>
                <Avatar sx={{ width: 32, height: 32, bgcolor: "#4CAF50" }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
              >
                <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleUserMenuClose}>Settings</MenuItem>
                <MenuItem onClick={handleUserMenuClose}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Pending Approvals
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "medium", mt: 1 }}
                      >
                        3
                      </Typography>
                    </Box>
                    <Avatar sx={{ backgroundColor: "#e3f2fd" }}>
                      <StoreIcon sx={{ color: "#2196F3" }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Regional Orders
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "medium", mt: 1 }}
                      >
                        42
                      </Typography>
                    </Box>
                    <Avatar sx={{ backgroundColor: "#fff9c4" }}>
                      <OrdersIcon sx={{ color: "#ff8f00" }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Active Customers
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "medium", mt: 1 }}
                      >
                        128
                      </Typography>
                    </Box>
                    <Avatar sx={{ backgroundColor: "#e8f5e9" }}>
                      <CustomersIcon sx={{ color: "#2e7d32" }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Abandoned Carts
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "medium", mt: 1 }}
                      >
                        7
                      </Typography>
                    </Box>
                    <Avatar sx={{ backgroundColor: "#ffebee" }}>
                      <AbandonedIcon sx={{ color: "#d32f2f" }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
}

export default RegionalAdminDashboard;
