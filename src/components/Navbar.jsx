import React, { useState, useContext, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Badge,
  Button,
  Select,
  MenuItem,
  Box,
  FormControl,
  IconButton,
  Menu,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import HistoryIcon from "@mui/icons-material/History";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../images/logo.png";
import { useTheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ColorModeContext } from "../Theme";
import { Link, useNavigate } from "react-router-dom";

const NavbarContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxShadow: "0 2px 4px rgba(0,0,0,0.15)", // Slightly stronger box shadow
  position: "static",
}));

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const SearchContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: "100%",
  maxWidth: "500px",
  display: "flex",
}));

const StyledFormControl = styled(FormControl)({
  minWidth: "70px",
  "& .MuiSelect-select": {
    paddingTop: "8px",
    paddingBottom: "8px",
  },
});

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 1),
  },
}));

const IconButtonContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: "0 8px",
});

const IconLabel = styled(Typography)({
  fontSize: "0.7rem",
  marginTop: "2px",
});

const NavItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  margin: "0 10px",
  color: "#4caf50",
});

const CircleIconButton = styled(IconButton)({
  backgroundColor: "#e8f5e9",
  color: "#4caf50",
  padding: "8px",
  marginRight: "4px",
});

const FranchiseButton = styled(Button)(({ theme }) => ({
  marginLeft: "auto",
  borderColor: "#3f51b5",
  color: "#3f51b5",
}));

const SearchCategoryDropDown = [
  "All",
  "Baby Care",
  "Ayurveda",
  "Diabetes",
  "Personal Care",
  "Featured",
  "Fitness & Supplements",
  "Covid Prevention",
  "Healthcare Devices",
  "Health Conditions",
  "Other",
];
export const sortedSearchCategoryDropDown = SearchCategoryDropDown.slice().sort();

// Modified Navigation array with conditional item for Login/Dashboard
const getNavigationItems = (isCustomer) => [
  {
    label: "Home",
    icon: <HomeIcon />,
    path: "/",
  },
  {
    label: "Category",
    icon: <CategoryIcon />,
    path: "/categories",
  },
  {
    label: "Offers",
    icon: <LocalOfferIcon />,
    path: "/offers",
  },
  {
    label: isCustomer ? "Dashboard" : "Login",
    icon: isCustomer ? <DashboardIcon /> : <PersonIcon />,
    path: isCustomer ? "/customer" : "/login",
  },
];

// Main component
const Navbar = () => {
  const [searchCategory, setSearchCategory] = useState("All");
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [isCustomer, setIsCustomer] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const categoryDropdownRef = useRef(null);

  // Check localStorage for user role on component mount
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setIsCustomer(userRole === 'Customer');
    
    // Get user info from localStorage if available
    if (localStorage.getItem('name')) {
      setUserName(localStorage.getItem('name'));
    }
    
    if (localStorage.getItem('email')) {
      setUserEmail(localStorage.getItem('email'));
    }
  }, []);

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  const handleCategoryClick = (event) => {
    setCategoryAnchorEl(event.currentTarget);
    setCategoryMenuOpen(!categoryMenuOpen);
  };

  const handleCategoryMenuClose = () => {
    setCategoryMenuOpen(false);
    setCategoryAnchorEl(null);
  };

  const handleProfileClick = (event) => {
    if (isCustomer) {
      // If customer, just navigate to dashboard without opening modal
      navigate('/customer');
    } else {
      // If not customer, open the login/profile modal
      setProfileMenuAnchor(event.currentTarget);
    }
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleDashboardOpen = () => {
    setProfileMenuAnchor(null);
    navigate("/customer");
  };

  const handleLogout = () => {
    setProfileMenuAnchor(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('number');
    localStorage.removeItem('region');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('customerAddress');
    setIsCustomer(false);
    alert("Logged out successfully!");
    navigate('/');
  };

  // Close the category dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target) &&
        categoryAnchorEl &&
        !categoryAnchorEl.contains(event.target)
      ) {
        setCategoryMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryAnchorEl, categoryDropdownRef]);

  // Get navigation items based on user role
  const Navigation = getNavigationItems(isCustomer);

  return (
    <NavbarContainer sx={{ paddingY: "8px" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <LogoContainer>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link to="/">
              <img
                src={logo}
                alt="BlueMedix Logo"
                style={{
                  width: "auto",
                  height: "100px",
                  marginRight: "8px",
                  objectFit: "contain",
                }}
              />
            </Link>
          </Box>
        </LogoContainer>
        <SearchContainer>
          <StyledFormControl variant="standard">
            <Select
              value={searchCategory}
              onChange={handleCategoryChange}
              disableUnderline
              sx={{ borderRight: "1px solid #ccc", marginLeft: "20px" }}
            >
              {sortedSearchCategoryDropDown.map((item) => (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
          <StyledInputBase
            placeholder="Search for medicine & wellness products..."
            inputProps={{ "aria-label": "search" }}
          />
          <IconButton type="submit" aria-label="search">
            <SearchIcon sx={{ color: "#3f51b5" }} />
          </IconButton>
        </SearchContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {Navigation.map((navItem) => {
            if (navItem.label === "Category") {
              return (
                <NavItem
                  key={navItem.label}
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    cursor: "pointer", // Indicate it's clickable
                  }}
                  onClick={handleCategoryClick} // Use onClick
                  aria-controls={categoryMenuOpen ? "category-menu" : undefined}
                  aria-expanded={categoryMenuOpen ? "true" : "false"}
                >
                  <CircleIconButton size="small">
                    {navItem.icon}
                  </CircleIconButton>
                  <Typography variant="body2">{navItem.label}</Typography>

                  {/* Dropdown Box (now controlled by state) */}
                  <Box
                    ref={categoryDropdownRef}
                    open={categoryMenuOpen}
                    onClose={handleCategoryMenuClose}
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: 2,
                      boxShadow: 3,
                      zIndex: 1000,
                      minWidth: "200px",
                      display: categoryMenuOpen ? "flex" : "none", // Control visibility
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {sortedSearchCategoryDropDown.map((item) => (
                      <Typography
                        variant="body2"
                        key={item}
                        sx={{ cursor: "pointer", padding: "4px 8px" }}
                        onClick={() => {
                          // Handle category selection (e.g., navigate)
                          console.log(`Selected category: ${item}`);
                          navigate(`/category/${item.toLowerCase().replace(/\s+/g, '-')}`);
                          setCategoryMenuOpen(false); // Close on selection
                        }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </NavItem>
              );
            }

            // Modified Login/Dashboard nav item
            if (navItem.label === "Login" || navItem.label === "Dashboard") {
              return (
                <NavItem
                  key={navItem.label}
                  sx={{ display: "flex", flexDirection: "column", gap: "2px", cursor: "pointer" }}
                  onClick={isCustomer ? () => navigate('/customer') : handleProfileClick}
                  component={isCustomer ? Link : 'div'}
                  to={isCustomer ? '/customer' : undefined}
                  aria-controls={(!isCustomer && profileMenuAnchor) ? "profile-menu" : undefined}
                  aria-expanded={(!isCustomer && Boolean(profileMenuAnchor)) ? "true" : "false"}
                >
                  <CircleIconButton size="small">
                    {navItem.icon}
                  </CircleIconButton>
                  <Typography variant="body2">{navItem.label}</Typography>

                  {/* Profile Menu - Only visible when not customer */}
                  {!isCustomer && (
                    <Menu
                      anchorEl={profileMenuAnchor}
                      open={Boolean(profileMenuAnchor)}
                      onClose={handleProfileMenuClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      id="profile-menu"
                    >
                      <Box sx={{ px: 2, py: 1 }}>
                        <Typography variant="subtitle1">John Doe</Typography>
                        <Typography variant="body2" color="text.secondary">
                          john.doe@example.com
                        </Typography>
                      </Box>
                      <Divider />
                      <MenuItem onClick={handleDashboardOpen}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <DashboardIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography>Dashboard</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography>Logout</Typography>
                        </Box>
                      </MenuItem>
                    </Menu>
                  )}
                </NavItem>
              );
            }

            // Other nav items
            return (
              <NavItem
                key={navItem.label}
                sx={{ display: "flex", flexDirection: "column", gap: "2px" }}
                component={Link}
                to={navItem.path}
              >
                <CircleIconButton size="small">{navItem.icon}</CircleIconButton>
                <Typography variant="body2">{navItem.label}</Typography>
              </NavItem>
            );
          })}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link to="/cart">
              <IconButtonContainer>
                <IconButton color="primary">
                  <Badge badgeContent={0} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                <IconLabel>Cart</IconLabel>
              </IconButtonContainer>
            </Link>
            <Link to="/orders">
              <IconButtonContainer>
                <IconButton color="primary">
                  <Badge badgeContent={0} color="primary">
                    <HistoryIcon />
                  </Badge>
                </IconButton>
                <IconLabel>Orders</IconLabel>
              </IconButtonContainer>
            </Link>
            <IconButtonContainer>
              <IconButton color="primary" onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? (
                  <LightModeIcon />
                ) : (
                  <DarkModeIcon />
                )}
              </IconButton>
              <IconLabel>
                {theme.palette.mode === "dark" ? "Light" : "Dark"}
              </IconLabel>
            </IconButtonContainer>
          </Box>
          <FranchiseButton variant="outlined">
            Franchise Enquiry
          </FranchiseButton>
        </Box>
      </Toolbar>
    </NavbarContainer>
  );
};

export default Navbar;