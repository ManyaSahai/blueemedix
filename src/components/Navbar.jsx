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
export const sortedSearchCategoryDropDown =
  SearchCategoryDropDown.slice().sort();

const Navigation = [
  {
    label: "Home",
    icon: <HomeIcon />,
  },
  {
    label: "Category",
    icon: <CategoryIcon />,
  },
  {
    label: "Offers",
    icon: <LocalOfferIcon />,
  },
  {
    label: "Login",
    icon: <PersonIcon />,
  },
];

// Main component
const Navbar = () => {
  const [searchCategory, setSearchCategory] = useState("All");
  const [categoryHovered, setCategoryHovered] = useState(false);

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
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
              {sortedSearchCategoryDropDown.map((item) => {
                return (
                  <MenuItem value={item} key={item}>
                    {item}
                  </MenuItem>
                );
              })}
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
                  }}
                  onMouseEnter={() => setCategoryHovered(true)}
                  onMouseLeave={() => setCategoryHovered(false)}
                >
                  <CircleIconButton size="small">
                    {navItem.icon}
                  </CircleIconButton>
                  <Typography variant="body2">{navItem.label}</Typography>

                  {/* Dropdown Box */}
                  {categoryHovered && (
                    <Box
                      onMouseEnter={() => setCategoryHovered(true)}
                      onMouseLeave={() => setCategoryHovered(false)}
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
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {sortedSearchCategoryDropDown.map((item) => (
                          <Typography
                            variant="body2"
                            key={item}
                            sx={{ cursor: "pointer" }}
                          >
                            {item}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                </NavItem>
              );
            }

            // Other nav items
            return (
              <NavItem
                key={navItem.label}
                sx={{ display: "flex", flexDirection: "column", gap: "2px" }}
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
            <IconButtonContainer>
              <IconButton color="primary">
                <Badge badgeContent={0} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <IconLabel>Cart</IconLabel>
            </IconButtonContainer>
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
          <FranchiseButton variant="outlined">
            Franchise Enquiry
          </FranchiseButton>
        </Box>
      </Toolbar>
    </NavbarContainer>
  );
};

export default Navbar;
