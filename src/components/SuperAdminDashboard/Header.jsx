import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  IconButton,
  Typography,
  Avatar,
  AppBar,
  Toolbar,
  Badge,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import InventoryIcon from "@mui/icons-material/Inventory";
import MapIcon from "@mui/icons-material/Map";
import BarChartIcon from "@mui/icons-material/BarChart";
import StoreIcon from "@mui/icons-material/Store";
import StarIcon from "@mui/icons-material/Star";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Define the dropdown options with their labels and paths
const specialProductOptions = [
  { label: "Top-Selling Products", path: "top-selling-products" },
  { label: "Featured Products", path: "featured" },
  { label: "Recently Added", path: "recently-added" },
];

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState(null);
  const [messageAnchor, setMessageAnchor] = React.useState(null);
  const [selectedSpecialProduct, setSelectedSpecialProduct] = React.useState("");
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchor);
  const isMessageMenuOpen = Boolean(messageAnchor);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleMessageMenuOpen = (event) => {
    setMessageAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
    setMessageAnchor(null);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSpecialProductChange = (event) => {
    const selectedPath = event.target.value;
    setSelectedSpecialProduct(selectedPath);
    if (selectedPath) {
      navigate(`/admin/${selectedPath}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name')
    localStorage.removeItem('number')
    localStorage.removeItem('region')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    localStorage.removeItem('customerAddress')
    console.log("Logging out");
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/admin/profile");
    handleMenuClose();
  };

  const DrawerItems = [
    { label: "Dashboard", icon: DashboardIcon, path: "dashboard" },
    { label: "Customers", icon: PeopleIcon, path: "users" },
    { label: "Orders", icon: InventoryIcon, path: "orders" },
    { label: "Offers", icon: LocalOfferIcon, path: "offers" },
    { label: "Products", icon: InventoryIcon, path: "products" },
    { label: "Regional admin", icon: MapIcon, path: "regAdminList" },
    { label: "Reports", icon: BarChartIcon, path: "reports" },
    { label: "Sellers", icon: StoreIcon, path: "sellers" },
    {
      label: "Special Product",
      icon: StarIcon,
      dropdown: (
        <FormControl fullWidth margin="normal">
          <InputLabel id="special-product-label">Special Products</InputLabel>
          <Select
            labelId="special-product-label"
            id="special-product-select"
            value={selectedSpecialProduct}
            label="Special Products"
            onChange={handleSpecialProductChange}
          >
            <MenuItem value="None">
              <em>None</em>
            </MenuItem>
            {specialProductOptions.map((option) => (
              <MenuItem key={option.path} value={option.path}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
  ];

  // Group items by category
  const mainMenuItems = DrawerItems.slice(0, 5);
  const adminMenuItems = DrawerItems.slice(5, 8);

  const DrawerList = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        backgroundColor: "#f8f9fa",
      }}
      role="presentation"
    >
      {/* Header with Logo/Brand */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "16px",
          backgroundColor: "#3f51b5",
          color: "white",
          height: "64px",
        }}
      >
        <Avatar sx={{ bgcolor: "#fff", color: "#3f51b5", marginRight: 2 }}>
          A
        </Avatar>
        <Typography variant="h6" component="div">
          Admin Portal
        </Typography>
      </Box>

      <Divider />

      {/* Main Menu Items */}
      <List>
        {mainMenuItems.map((item) => (
          <ListItem
            key={item.label}
            disablePadding
            component={NavLink}
            to={`/admin/${item.path}`}
            sx={{
              "&.active": {
                "& .MuiListItemButton-root": {
                  backgroundColor: "rgba(63, 81, 181, 0.08)",
                  borderLeft: "4px solid #3f51b5",
                },
                "& .MuiListItemIcon-root": {
                  color: "#3f51b5",
                },
                "& .MuiListItemText-primary": {
                  fontWeight: "bold",
                  color: "#3f51b5",
                },
              },
            }}
          >
            <ListItemButton
              sx={{ borderRadius: "0 24px 24px 0", margin: "4px 8px 4px 0" }}
            >
              <ListItemIcon sx={{ minWidth: "42px" }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} sx={{ color: "#333" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Admin Section Label */}
      <Typography
        variant="overline"
        sx={{
          paddingLeft: "16px",
          paddingTop: "12px",
          color: "#637381",
          fontWeight: 600,
        }}
      >
        Administration
      </Typography>

      {/* Admin Menu Items */}
      <List>
        {adminMenuItems.map((item) => (
          <ListItem
            key={item.label}
            disablePadding
            component={NavLink}
            to={`/admin/${item.path}`}
            sx={{
              "&.active": {
                "& .MuiListItemButton-root": {
                  backgroundColor: "rgba(63, 81, 181, 0.08)",
                  borderLeft: "4px solid #3f51b5",
                },
                "& .MuiListItemIcon-root": {
                  color: "#3f51b5",
                },
                "& .MuiListItemText-primary": {
                  fontWeight: "bold",
                  color: "#3f51b5",
                },
              },
            }}
          >
            <ListItemButton
              sx={{ borderRadius: "0 24px 24px 0", margin: "4px 8px 4px 0" }}
            >
              <ListItemIcon sx={{ minWidth: "42px" }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} sx={{ color: "#333" }} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* Special Product with Dropdown */}
        <ListItem key="special-product" disablePadding>
          <ListItemButton sx={{ flexDirection: "column", alignItems: "flex-start", padding: "8px 16px" }}>
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
              <ListItemIcon sx={{ minWidth: "42px" }}>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary="Special Product" sx={{ color: "#333" }} />
            </Box>
            {DrawerItems.find((item) => item.label === "Special Product")?.dropdown}
          </ListItemButton>
        </ListItem>
      </List>

      {/* Footer area with version info */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: "16px",
          textAlign: "center",
          color: "#637381",
        }}
      >
        <Typography variant="caption">Admin Panel v1.0</Typography>
      </Box>
    </Box>
  );

  // Profile menu
  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
      {/* <MenuItem onClick={handleMenuClose}>My Account</MenuItem> */}
      <Divider />
      {/* <MenuItem onClick={handleMenuClose}>Settings</MenuItem> */}
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  // Notifications menu
  const renderNotificationsMenu = (
    <Menu
      anchorEl={notificationAnchor}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isNotificationMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Typography variant="body2">New order received</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Typography variant="body2">Server update completed</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Typography variant="body2">New user registered</Typography>
      </MenuItem>
      <Divider />
      <MenuItem sx={{ justifyContent: "center" }}>
        <Typography variant="body2" color="primary">
          View all notifications
        </Typography>
      </MenuItem>
    </Menu>
  );

  // Messages menu
  const renderMessagesMenu = (
    <Menu
      anchorEl={messageAnchor}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMessageMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Typography variant="body2">Message from John</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Typography variant="body2">Message from Support Team</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Typography variant="body2">Message from Sales</Typography>
      </MenuItem>
      <Divider />
      <MenuItem sx={{ justifyContent: "center" }}>
        <Typography variant="body2" color="primary">
          View all messages
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#fff",
          color: "#333",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            sx={{
              mr: 2,
              display: { xs: "block", sm: "block" },
              color: "#3f51b5",
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: { xs: "none", sm: "block" },
              color: "#3f51b5",
              fontWeight: "bold",
            }}
          >
            BLUEMEDIX ADMIN DASHBOARD
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Search Icon */}
          {/* <IconButton size="large" color="inherit">
            <SearchIcon />
          </IconButton> */}

          {/* Notifications */}
          {/* <IconButton
            size="large"
            color="inherit"
            onClick={handleNotificationMenuOpen}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton> */}

          {/* Messages */}
          {/* <IconButton
            size="large"
            color="inherit"
            onClick={handleMessageMenuOpen}
          >
            <Badge badgeContent={3} color="primary">
              <MailIcon />
            </Badge>
          </IconButton> */}

          {/* Profile */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#3f51b5" }}>
              JD
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Render menus */}
      {renderProfileMenu}
      {renderNotificationsMenu}
      {renderMessagesMenu}

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            paddingTop: "64px", // Make room for the AppBar
          },
        }}
      >
        {DrawerList}
      </Drawer>

      {/* Add this to push content below the fixed AppBar */}
      <Toolbar />
    </Box>
  );
}