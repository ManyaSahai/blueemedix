import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
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
  Box,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Badge,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  ShoppingCart as ShoppingCartIcon, // Import ShoppingCartIcon for Orders
} from "@mui/icons-material";
import SellerManagement from "./SellerManagement";
import UserManagement from "./UserManagement";
import OrderManagement from "./OrderManagement"; // Import the new OrderManagement component
import { useFetchAllRegionalSellersQuery } from "../../redux/regionalAdminApi";

function RegionalAdminDashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("sellers");
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: sellersData, error: errorSellers } =
    useFetchAllRegionalSellersQuery(undefined, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  // Snackbar state variables
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };



  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleLogout = () => {
    // Clear localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name')
    localStorage.removeItem('number')
    localStorage.removeItem('region')
    localStorage.removeItem('role')
    // Add any other keys you might be storing

    // Navigate to the login page or any other appropriate route
    navigate('/login');
  };

  const handleProfileNavigation = () => {
    navigate('/regional-admin/profile'); // Assuming '/profile' is your Profile component's route
  };


  const handleShowSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const menuItems = [
    { id: "dashboard", icon: <DashboardIcon />, text: "Dashboard" },
    { id: "sellers", icon: <StoreIcon />, text: "Sellers" },
    { id: "users", icon: <GroupIcon />, text: "Users" },
    { id: "orders", icon: <ShoppingCartIcon />, text: "Orders" }, // Add the Orders menu item
    { id: "settings", icon: <SettingsIcon />, text: "Settings" },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "sellers":
        return (
          <SellerManagement
            sellersData={sellersData}
            errorSellers={errorSellers}
            showSnackbar={handleShowSnackbar}
          />
        );
      case "users":
        return <UserManagement />;
      case "orders":
        return <OrderManagement />; // Render the OrderManagement component
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
          width: isSmallScreen ? 60 : 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isSmallScreen ? 60 : 240,
            boxSizing: "border-box",
            backgroundColor: "#fff",
            borderRight: "1px solid #e0e0e0",
            overflowX: "hidden",
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
          {!isSmallScreen && (
            <Typography
              variant="h6"
              sx={{ color: "#4CAF50", fontWeight: "bold" }}
            >
              Blue<span style={{ color: "#2196F3" }}>Medix</span>
            </Typography>
          )}
          {isSmallScreen && (
            <StoreIcon sx={{ color: "#4CAF50", fontSize: 30 }} />
          )}
        </Box>
        <Divider />
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: isSmallScreen ? "center" : "flex-start",
          }}
        >
          {!isSmallScreen && (
            <>
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
            </>
          )}
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
                justifyContent: isSmallScreen ? "center" : "flex-start",
                paddingLeft: isSmallScreen ? 1 : 2,
                paddingRight: isSmallScreen ? 1 : 3,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  color: activeMenu === item.id ? "#2196F3" : "inherit",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isSmallScreen && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    color: activeMenu === item.id ? "#2196F3" : "inherit",
                    fontWeight: activeMenu === item.id ? "medium" : "normal",
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: isSmallScreen ? 2 : 3 }}>
        {/* Top Bar */}
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{ backgroundColor: "#fff", borderBottom: "1px solid #e0e0e0" }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "medium", color: "#333" }}
            >
              Regional Admin Dashboard
            </Typography>
            {sellersData?.sellers?.[0]?.region && (
              <Chip
                label={sellersData.sellers[0].region + " Region"}
                size="small"
                icon={<StoreIcon sx={{ fontSize: 16 }} />}
                sx={{ ml: 2, backgroundColor: "#e8f5e9", color: "#2e7d32" }}
              />
            )}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton color="inherit">
                <Badge badgeContent={0} color="error">
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
                <Typography sx={{ display: { xs: "none", sm: "block" }, mr: 1 }}>
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
                  <MenuItem onClick={handleProfileNavigation}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Container maxWidth="xl" sx={{ mt: 3, mb: 4, px: isSmallScreen ? 0 : 2 }}>
          {renderContent()}
        </Container>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default RegionalAdminDashboard;