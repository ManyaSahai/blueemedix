// Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Alert,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const regions = ['Bihar', 'Odisha', 'West Bengal', 'Chhattisgarh'];

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      const role = localStorage.getItem('role');
      redirectBasedOnRole(role);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email check failed');
      }

      if (data.isRegistered) {
        setAuthStep('login');
      } else {
        // Pre-fill email in registration form
        setRegistrationData({
          ...registrationData,
          e_mail: email
        });
        setAuthStep('register');
      }
    } catch (err) {
      setError(err.message || 'Failed to check email. Please try again.');
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch("http://localhost:5000/api/auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ e_mail: email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store tokens in local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      setIsLoggedIn(true);
      setIsLoading(false);

      // Redirect to dashboard or home page
      const role = data.user.role;
      if (role === "SuperAdmin") {
        navigate("/superadmin/products");
      } else if (role === "RegionalAdmin") {
        navigate("/regional-admin");
      } else if (role === "Seller") {
        navigate("/seller");
      } else {
        navigate("/"); // Customer default
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Remove tokens from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          elevation={6}
          sx={{
            mt: 8,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: isLoggedIn ? "secondary.main" : "primary.main",
            }}
          >
            {isLoggedIn ? <LogoutIcon /> : <LockOutlinedIcon />}
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            {isLoggedIn ? "You are logged in" : "Sign in to your account"}
          </Typography>

          {isLoggedIn ? (
            <Box sx={{ width: "100%" }}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{ py: 1.5 }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email-address"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress
                      size={24}
                      sx={{ mr: 1, color: "white" }}
                    />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
