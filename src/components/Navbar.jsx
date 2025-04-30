import React, { useState, useContext, useEffect } from "react";
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
import logo from "../images/logo.png";
import { useTheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ColorModeContext } from "../Theme";
import { Link, useNavigate } from "react-router-dom";

const NavbarContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
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

// Main component
const Navbar = () => {
  const [searchCategory, setSearchCategory] = useState("All");
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [isLoggedInAsCustomer, setIsLoggedInAsCustomer] = useState(false);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  
  // Check localStorage for user role and token on component mount
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    setIsLoggedInAsCustomer(userRole === 'Customer' && token);
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

  const handleCategorySelect = (category) => {
    navigate(`/category/${category.toLowerCase().replace(/\s+/g, '-')}`);
    setCategoryMenuOpen(false);
  };

  const handleLoginOrDashboard = () => {
    if (isLoggedInAsCustomer) {
      navigate('/customer');
    } else {
      navigate('/login');
    }
  };

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
          {/* Home */}
          <NavItem
            component={Link}
            to="/"
            sx={{ display: "flex", flexDirection: "column", gap: "2px" }}
          >
            <CircleIconButton size="small">
              <HomeIcon />
            </CircleIconButton>
            <Typography variant="body2">Home</Typography>
          </NavItem>

          {/* Category */}
          <NavItem
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              cursor: "pointer",
            }}
            onClick={handleCategoryClick}
          >
            <CircleIconButton size="small">
              <CategoryIcon />
            </CircleIconButton>
            <Typography variant="body2">Category</Typography>

            {/* Category Dropdown */}
            {categoryMenuOpen && (
              <Box
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
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {sortedSearchCategoryDropDown.map((item) => (
                  <Typography
                    variant="body2"
                    key={item}
                    sx={{ cursor: "pointer", padding: "4px 8px" }}
                    onClick={() => handleCategorySelect(item)}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            )}
          </NavItem>

          {/* Offers */}
          <NavItem
            component={Link}
            to="/offers"
            sx={{ display: "flex", flexDirection: "column", gap: "2px" }}
          >
            <CircleIconButton size="small">
              <LocalOfferIcon />
            </CircleIconButton>
            <Typography variant="body2">Offers</Typography>
          </NavItem>

          {/* Login/Dashboard - This is the modified component */}
          <NavItem
            onClick={handleLoginOrDashboard}
            sx={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "2px",
              cursor: "pointer" 
            }}
          >
            <CircleIconButton size="small">
              {isLoggedInAsCustomer ? <DashboardIcon /> : <PersonIcon />}
            </CircleIconButton>
            <Typography variant="body2">
              {isLoggedInAsCustomer ? "Dashboard" : "Login"}
            </Typography>
          </NavItem>
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