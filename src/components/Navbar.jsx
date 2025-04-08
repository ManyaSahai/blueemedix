import React, { useState } from "react";
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
import PhoneIcon from "@mui/icons-material/Phone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import logo from "../images/logo.png";
import { useTheme } from "@mui/material/styles";
import { useContext } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ColorModeContext } from "../Theme";

const NavbarContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  position: "static",
}));
const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const LogoText = styled(Typography)(({ theme }) => ({
  color: "#3f51b5",
  fontWeight: "bold",
  marginLeft: "8px",
}));

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

const BottomNav = styled(Box)(({ theme }) => ({
  display: "flex",
  marginTop: theme.spacing(1),
  padding: theme.spacing(0, 2),
}));

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

// Main component
const Navbar = () => {
  const [searchCategory, setSearchCategory] = useState("All");

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  return (
    <NavbarContainer>
      <Toolbar>
        <LogoContainer>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={logo}
              alt="BlueMedix Logo"
              style={{ height: "140px", marginRight: "8px" }}
            />
          </Box>
        </LogoContainer>

        <SearchContainer>
          <StyledFormControl variant="standard">
            <Select
              value={searchCategory}
              onChange={handleCategoryChange}
              disableUnderline
              sx={{ borderRight: "1px solid #ccc" }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Medicines">Medicines</MenuItem>
              <MenuItem value="Wellness">Wellness</MenuItem>
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

        <Box sx={{ display: "flex", ml: "auto" }}>
          <IconButtonContainer>
            <IconButton color="primary">
              <CloudUploadIcon />
            </IconButton>
            <IconLabel>Upload Rx</IconLabel>
          </IconButtonContainer>

          <IconButtonContainer>
            <IconButton color="primary">
              <Badge badgeContent={0} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconLabel>Cart</IconLabel>
          </IconButtonContainer>

          <IconButtonContainer>
            <IconButton color="primary">
              <PersonIcon />
            </IconButton>
            <IconLabel>Sign in / Sign up</IconLabel>
          </IconButtonContainer>

          {/* 🌗 Dark/Light Mode Toggle */}
          <IconButtonContainer>
            <IconButton
              color="primary"
              onClick={useContext(ColorModeContext).toggleColorMode}
            >
              {useTheme().palette.mode === "dark" ? (
                <LightModeIcon />
              ) : (
                <DarkModeIcon />
              )}
            </IconButton>
            <IconLabel>
              {useTheme().palette.mode === "dark" ? "Light" : "Dark"}
            </IconLabel>
          </IconButtonContainer>
        </Box>
      </Toolbar>

      <BottomNav sx={{ mt: "-20px" }}>
        <NavItem>
          <CircleIconButton size="small">
            <HomeIcon fontSize="small" />
          </CircleIconButton>
          <Typography variant="body2">Home</Typography>
        </NavItem>

        <NavItem>
          <CircleIconButton size="small">
            <CategoryIcon fontSize="small" />
          </CircleIconButton>
          <Typography variant="body2">Category</Typography>
        </NavItem>

        <NavItem>
          <CircleIconButton size="small">
            <LocalOfferIcon fontSize="small" />
          </CircleIconButton>
          <Typography variant="body2">Offer</Typography>
        </NavItem>

        <NavItem>
          <CircleIconButton size="small">
            <PhoneIcon fontSize="small" />
          </CircleIconButton>
          <Typography variant="body2">+91 8051000044</Typography>
        </NavItem>

        <FranchiseButton variant="outlined">Franchise Enquiry</FranchiseButton>
      </BottomNav>
    </NavbarContainer>
  );
};

export default Navbar;
