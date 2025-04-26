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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
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

const regions = ["Bihar", "Odisha", "West Bengal", "Chhattisgarh"];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success messages
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Keep for checking existing login
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const [registrationData, setRegistrationData] = useState({
    name: "",
    password: "",
    role: "Customer",
    gender: "Male",
    date_of_birth: "",
    e_mail: "",
    phone_no: "",
    region: "Bihar",
    address: {
      first_line: "",
      second_line: "",
      city: "",
      state: "Bihar",
      pin_code: "",
    },
  });

  const [registrationErrors, setRegistrationErrors] = useState({});
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();

  // Keep this helper for initial check and login flow
  const redirectBasedOnRole = (role) => {
    if (role === "SuperAdmin") {
      navigate("/regionalAdmin/products");
    } else if (role === "RegionalAdmin") {
      navigate("/regional-admin");
    } else if (role === "Seller") {
      navigate("/seller");
    } else {
      navigate("/"); // Customer default
    }
  };

  useEffect(() => {
    // Check if user is already logged in on component mount
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // Also get role
    if (token && role) {
      setIsLoggedIn(true);
      // Redirect immediately if logged in
      redirectBasedOnRole(role);
    }
  }, []);

  // --- Login Handlers ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage(""); // Clear messages on new attempt

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

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("region", data.user.region);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      setIsLoggedIn(true); // Set login state only on login success
      setIsLoading(false);

      redirectBasedOnRole(data.user.role);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    navigate("/login");
  };

  // --- Registration Handlers ---
  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;

    setRegistrationErrors(prevErrors => ({
        ...prevErrors,
        [name]: '',
        ...(name.startsWith('address.') && { [name]: '' }),
        ...(name === 'region' || name === 'address.state' && { region: '', 'address.state': ''})
    }));

    setError(''); // Clear messages when user starts typing/changing form
    setSuccessMessage('');


    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setRegistrationData({
        ...registrationData,
        address: {
          ...registrationData.address,
          [addressField]: value,
        },
      });
    } else {
      setRegistrationData({
        ...registrationData,
        [name]: value,
      });
    }
  };

  const validateRegistrationForm = (data) => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const pinCodeRegex = /^\d{6}$/;

    if (!data.name.trim()) errors.name = "Full Name is required";
    if (!data.e_mail.trim()) {
        errors.e_mail = "Email is required";
    } else if (!emailRegex.test(data.e_mail)) {
        errors.e_mail = "Invalid email format";
    }
    if (!data.password.trim()) errors.password = "Password is required";

    if (!data.phone_no.trim()) {
        errors.phone_no = "Phone Number is required";
    } else if (!phoneRegex.test(data.phone_no)) {
        errors.phone_no = "Invalid phone number (must be 10 digits)";
    }
    if (!data.date_of_birth) errors.date_of_birth = "Date of Birth is required";
    if (!data.gender) errors.gender = "Gender is required";

    if (!data.address.first_line.trim())
      errors["address.first_line"] = "Address Line 1 is required";
    if (!data.address.second_line.trim())
        errors["address.second_line"] = "Address Line 2 is required";
    if (!data.address.city.trim()) errors["address.city"] = "City is required";

    if (!data.address.pin_code.trim()) {
        errors["address.pin_code"] = "PIN Code is required";
    } else if (!pinCodeRegex.test(data.address.pin_code)) {
         errors["address.pin_code"] = "Invalid PIN Code (must be 6 digits)";
    }

    if (!data.role) errors.role = "Role is required";
    if (!data.region || !regions.includes(data.region)) errors.region = "Invalid Region selected";
    if (!data.address.state || !regions.includes(data.address.state)) errors["address.state"] = "Invalid State selected";

    if (data.region !== data.address.state) {
      errors.region = "Region and State must be the same";
      errors["address.state"] = "Region and State must be the same";
    }

    return errors;
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    const errors = validateRegistrationForm(registrationData);
    setRegistrationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsRegistering(true);
    setError("");
    setSuccessMessage("");

    try {
      const dataToSend = {
        name: registrationData.name,
        password: registrationData.password,
        role: registrationData.role,
        gender: registrationData.gender,
        date_of_birth: registrationData.date_of_birth,
        e_mail: registrationData.e_mail,
        phone_no: registrationData.phone_no,
        region: registrationData.region,
        address: {
          first_line: registrationData.address.first_line,
          second_line: registrationData.address.second_line,
          city: registrationData.address.city,
          state: registrationData.address.state,
          pin_code: registrationData.address.pin_code,
        },
      };

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
         const errorMessage = data.message || (data.results && data.results[0] && data.results[0].message) || 'Registration failed';
         throw new Error(errorMessage);
      }

      // --- MODIFIED SUCCESS HANDLING ---
      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
          const registrationResult = data.results[0];

          if (registrationResult.success) {
              const registeredRole = registrationResult.user?.role;

              if (registeredRole === 'Seller' || registeredRole === 'RegionalAdmin') {
                  // Approval Required: Show message, don't log in/redirect
                  setSuccessMessage("Registration successful! Approval pending. Please contact your regional admin.");

              } else {
                  // Customer (and potentially others not needing approval)
                  // Show success message and return to login form
                  setSuccessMessage("Registration successful!");

                  // *** Removed auto-login for Customer registration ***
                  // localStorage.setItem("token", registrationResult.token);
                  // localStorage.setItem("userId", registrationResult.user?.id);
                  // localStorage.setItem("role", registeredRole);
                  // if (registrationResult.refreshToken) { ... } else if (data.refreshToken) { ... }
                  // setIsLoggedIn(true);
                  // redirectBasedOnRole(registeredRole);
                  // *** End Removed Code ***
              }

              // Actions common to all successful registrations (approval needed or not)
              setRegistrationData({ // Clear the registration form
                  name: "", password: "", role: "Customer", gender: "Male", date_of_birth: "",
                  e_mail: "", phone_no: "", region: "Bihar",
                  address: { first_line: "", second_line: "", city: "", state: "Bihar", pin_code: "" }
              });
              setRegistrationErrors({}); // Clear validation errors
              setShowRegistrationForm(false); // Switch back to login view

          } else {
              // Registration failed within the results item (e.g. backend validation)
              const errorMessage = registrationResult.message || 'Registration failed for this user.';
              throw new Error(errorMessage);
          }

      } else {
          // Response structure unexpected
           throw new Error('Unexpected response format from server.');
      }


  } catch (err) {
    setError(err.message || "Registration failed. Please try again.");
    console.error("Registration Error:", err);
  } finally {
     setIsRegistering(false);
  }
};

  // Function to switch back to login form
  const handleGoToLogin = () => {
      setShowRegistrationForm(false);
      setRegistrationData({ // Clear registration form data
          name: "", password: "", role: "Customer", gender: "Male", date_of_birth: "",
          e_mail: "", phone_no: "", region: "Bihar",
          address: { first_line: "", second_line: "", city: "", state: "Bihar", pin_code: "" }
        });
      setRegistrationErrors({});
      setError(''); // Clear messages
      setSuccessMessage(''); // Clear messages
  }

  // Function to switch to registration form
  const handleGoToRegister = () => {
    setShowRegistrationForm(true);
    setError(''); // Clear messages
    setSuccessMessage(''); // Clear messages
     setRegistrationData({ // Reset registration form data
          name: "", password: "", role: "Customer", gender: "Male", date_of_birth: "",
          e_mail: "", phone_no: "", region: "Bihar",
          address: { first_line: "", second_line: "", city: "", state: "Bihar", pin_code: "" }
        });
      setRegistrationErrors({});
  }


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
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
              bgcolor: isLoggedIn ? "secondary.main" : (showRegistrationForm ? "secondary.main" : "primary.main"),
            }}
          >
            {isLoggedIn ? <LogoutIcon /> : (showRegistrationForm ? <PersonAddAltOutlinedIcon /> : <LockOutlinedIcon />)}
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            {isLoggedIn ? "You are logged in" : (showRegistrationForm ? "Create your account" : "Sign in to your account")}
          </Typography>

           {/* Display Success Message here */}
           {successMessage && (
                <Alert severity="success" sx={{ width: '100%', mt: 2, mb: 2 }}>
                    {successMessage}
                </Alert>
           )}
           {/* Display Error Message here (API/backend errors) */}
           {error && (
                <Alert severity="error" sx={{ width: '100%', mt: 2, mb: 2 }}>
                  {error}
                </Alert>
           )}


          {isLoggedIn ? (
            // --- Logged In View ---
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
          ) : showRegistrationForm ? (
            // --- Registration Form ---
            <Box
              component="form"
              onSubmit={handleRegistrationSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Account Information</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            autoComplete="name"
                            value={registrationData.name}
                            onChange={handleRegistrationChange}
                            error={!!registrationErrors.name}
                            helperText={registrationErrors.name}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                     <Grid item xs={12} sm={6}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="reg-email"
                            label="Email Address"
                            name="e_mail"
                            type="email"
                            autoComplete="email"
                            value={registrationData.e_mail}
                            onChange={handleRegistrationChange}
                            error={!!registrationErrors.e_mail}
                            helperText={registrationErrors.e_mail}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                     <Grid item xs={12} sm={6}>
                         <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="reg-password"
                            autoComplete="new-password"
                            value={registrationData.password}
                            onChange={handleRegistrationChange}
                            error={!!registrationErrors.password}
                            helperText={registrationErrors.password}
                            variant="outlined"
                            size="small"
                         />
                    </Grid>
                     <Grid item xs={12} sm={6}>
                         <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="phone_no"
                            label="Phone Number"
                            name="phone_no"
                            type="tel"
                            autoComplete="tel"
                            value={registrationData.phone_no}
                            onChange={handleRegistrationChange}
                            error={!!registrationErrors.phone_no}
                            helperText={registrationErrors.phone_no}
                            variant="outlined"
                            size="small"
                         />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal" required size="small" error={!!registrationErrors.gender}>
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select
                                labelId="gender-label"
                                id="gender"
                                name="gender"
                                value={registrationData.gender}
                                label="Gender"
                                onChange={handleRegistrationChange}
                            >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                             <FormHelperText>{registrationErrors.gender}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="date_of_birth"
                            label="Date of Birth"
                            name="date_of_birth"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={registrationData.date_of_birth}
                            onChange={handleRegistrationChange}
                            error={!!registrationErrors.date_of_birth}
                            helperText={registrationErrors.date_of_birth}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                     <Grid item xs={12} sm={6}>
                         <FormControl fullWidth margin="normal" required size="small" error={!!registrationErrors.role}>
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                id="role"
                                name="role"
                                value={registrationData.role}
                                label="Role"
                                onChange={handleRegistrationChange}
                            >
                                <MenuItem value="Customer">Customer</MenuItem>
                                <MenuItem value="Seller">Seller</MenuItem>
                                <MenuItem value="RegionalAdmin">Regional Admin</MenuItem>
                            </Select>
                             <FormHelperText>{registrationErrors.role}</FormHelperText>
                         </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal" required size="small" error={!!registrationErrors.region}>
                            <InputLabel id="region-label">Region</InputLabel>
                            <Select
                                labelId="region-label"
                                id="region"
                                name="region"
                                value={registrationData.region}
                                label="Region"
                                onChange={handleRegistrationChange}
                            >
                                {regions.map((region) => (
                                    <MenuItem key={region} value={region}>
                                        {region}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{registrationErrors.region}</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Address</Typography>
                 <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="first_line"
                            label="Address Line 1"
                            name="address.first_line"
                            value={registrationData.address.first_line}
                            onChange={handleRegistrationChange}
                            error={!!registrationErrors['address.first_line']}
                            helperText={registrationErrors['address.first_line']}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                     <Grid item xs={12}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="second_line"
                            label="Address Line 2"
                            name="address.second_line"
                            value={registrationData.address.second_line}
                            onChange={handleRegistrationChange}
                            error={!!registrationErrors['address.second_line']}
                            helperText={registrationErrors['address.second_line']}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                         <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="city"
                            label="City"
                            name="address.city"
                            value={registrationData.address.city}
                            onChange={handleRegistrationChange}
                            error={!!registrationErrors['address.city']}
                            helperText={registrationErrors['address.city']}
                            variant="outlined"
                            size="small"
                         />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                         <FormControl fullWidth margin="normal" required size="small" error={!!registrationErrors['address.state']}>
                            <InputLabel id="state-label">State</InputLabel>
                             <Select
                                labelId="state-label"
                                id="state"
                                name="address.state"
                                value={registrationData.address.state}
                                label="State"
                                onChange={handleRegistrationChange}
                            >
                                {regions.map((region) => (
                                    <MenuItem key={region} value={region}>
                                        {region}
                                    </MenuItem>
                                ))}
                            </Select>
                             <FormHelperText>{registrationErrors['address.state']}</FormHelperText>
                         </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="pin_code"
                            label="PIN Code"
                            name="address.pin_code"
                            value={registrationData.address.pin_code}
                            onChange={handleRegistrationChange}
                            error={!!registrationErrors['address.pin_code']}
                            helperText={registrationErrors['address.pin_code']}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                 </Grid>


              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isRegistering}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {isRegistering ? (
                  <>
                    <CircularProgress
                      size={24}
                      sx={{ mr: 1, color: "white" }}
                    />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

                <Button
                    fullWidth
                    variant="text"
                    onClick={handleGoToLogin}
                    sx={{ mt: 1 }}
                >
                    Already have an account? Sign in
                </Button>
            </Box>
          ) : (
            // --- Login Form ---
            <Box
              component="form"
              onSubmit={handleLoginSubmit}
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
              <Button
                fullWidth
                variant="text"
                onClick={handleGoToRegister}
                sx={{ mt: 1 }}
              >
                Don't have an account? Register
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;