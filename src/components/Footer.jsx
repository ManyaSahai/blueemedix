import React from "react";
import { Box, Container, Grid, Typography, Link } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GetAppIcon from "@mui/icons-material/GetApp";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        mt: 4,
        borderTop: "1px solid #e0e0e0",
        backgroundColor: "#fff",
      }}
    >
      {/* Main Footer Content */}
      <Container maxWidth={false} sx={{ px: { xs: 3, md: 6 }, py: 4 }}>
        <Grid container spacing={2} justifyContent="space-between">
          {/* Logo Section */}
          <Grid item xs={12} md={3} sx={{ mb: { xs: 3, md: 0 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <img
                src="/src/images/logo.png"
                alt="BlueMedix Logo"
                style={{ height: 110, marginBottom: 16 }}
              />
            </Box>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} md={2} sx={{ mb: { xs: 4, md: 0 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Quick Links
              </Typography>
              <Link
                href="/login"
                color="inherit"
                underline="none"
                sx={{ mb: 1.5 }}
              >
                My Account
              </Link>
              <Link
                href="/customer"
                color="inherit"
                underline="none"
                sx={{ mb: 1.5 }}
              >
                My Orders
              </Link>
              <Link href="/offer-zone" color="inherit" underline="none">
                Offer Zone
              </Link>
            </Box>
          </Grid>

          {/* Download App Section */}
          <Grid item xs={12} md={3} sx={{ mb: { xs: 4, md: 0 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Download App
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <GetAppIcon sx={{ color: "primary.main", mr: 1 }} />
                <Box
                  component="a"
                  href="https://play.google.com/store/apps/details?id=com.bluemedix.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                    alt="Get it on Google Play"
                    style={{ height: 50 }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Contact Us Section */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <HomeIcon
                  sx={{ mr: 1, mt: 0.5, fontSize: 20, color: "text.secondary" }}
                />
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  BHIVE Premium workspace-Block B, AKR Tech Park-A,
                  <br />
                  Krishna Reddy Industrial Area, Near Kudlu Gate,
                  <br />
                  Bangalore-560068
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PhoneIcon
                  sx={{ mr: 1, fontSize: 20, color: "text.secondary" }}
                />
                <Typography variant="body2">+91 8051000044</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EmailIcon
                  sx={{ mr: 1, fontSize: 20, color: "text.secondary" }}
                />
                <Typography variant="body2">info@bluemedix.in</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Divider */}
      <Box sx={{ width: "100%", borderTop: "1px solid #e0e0e0" }} />

      {/* Bottom Bar */}
      <Container maxWidth={false} sx={{ px: { xs: 3, md: 6 }, py: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Social Media Icons */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
              mb: { xs: 2, md: 0 },
            }}
          >
            <Link
              href="https://facebook.com/bluemedix"
              color="inherit"
              sx={{ mr: 3 }}
            >
              <FacebookIcon sx={{ fontSize: 24 }} />
            </Link>
            <Link
              href="https://instagram.com/bluemedix"
              color="inherit"
              sx={{ mr: 3 }}
            >
              <InstagramIcon sx={{ fontSize: 24 }} />
            </Link>
            <Link
              href="https://twitter.com/bluemedix"
              color="inherit"
              sx={{ mr: 3 }}
            >
              <TwitterIcon sx={{ fontSize: 24 }} />
            </Link>
            <Link href="https://linkedin.com/company/bluemedix" color="inherit">
              <LinkedInIcon sx={{ fontSize: 24 }} />
            </Link>
          </Grid>

          {/* Footer Links */}
          <Grid item xs={12} md={9}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                flexWrap: "wrap",
                gap: { xs: 2, md: 3 },
              }}
            >
              <Link href="" color="inherit" underline="none">
                About Us
              </Link>
              <Link href="" color="inherit" underline="none">
                Contact us
              </Link>
              <Link href="" color="inherit" underline="none">
                Terms & Conditions
              </Link>
              <Link href="" color="inherit" underline="none">
                Privacy Policy
              </Link>
              <Link href="" color="inherit" underline="none">
                Return Policy
              </Link>
              <Link href="" color="inherit" underline="none">
                FAQs
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Text */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Copyright © 2025 BlueMedix. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
