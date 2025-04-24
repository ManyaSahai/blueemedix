<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State for Auth Flow
  const [authStep, setAuthStep] = useState('email-check'); // email-check, login, register
  
  // Email Check State
  const [email, setEmail] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false);
  
  // Login State  
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Registration State
  const [registrationData, setRegistrationData] = useState({
    name: '',
    password: '',
    role: 'Customer',
    gender: 'Male',
    date_of_birth: '',
    e_mail: '',
    phone_no: '',
    region: 'Bihar',
    address: {
      first_line: '',
      second_line: '',
      city: '',
      state: '',
      pin_code: ''
    },
    desc: '' // For seller role
  });
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
>>>>>>> origin/main
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

  const redirectBasedOnRole = (role) => {
    if (role === 'SuperAdmin') {
      navigate('/superadmin/products');
    } else if (role === 'RegionalAdmin') {
      navigate('/regional-admin');
    } else if (role === 'Seller') {
      navigate('/seller');
    } else {
      navigate('/'); // Customer default
    }
  };

  const handleEmailCheck = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    setIsLoading(true);
    setError("");
=======
    setCheckingEmail(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    setIsLoggingIn(true);
    setError('');
>>>>>>> origin/main

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
<<<<<<< HEAD
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
=======
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('role', data.user.role);
>>>>>>> origin/main
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

<<<<<<< HEAD
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
=======
      // Redirect based on role
      redirectBasedOnRole(data.user.role);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setRegistrationData({
        ...registrationData,
        address: {
          ...registrationData.address,
          [addressField]: value
        }
      });
    } else {
      setRegistrationData({
        ...registrationData,
        [name]: value
      });
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setError('');

    try {
      // Format data for API
      const formattedData = {
        ...registrationData,
        phone_no: registrationData.phone_no,
        address: {
          ...registrationData.address,
          pin_code: registrationData.address.pin_code
        }
      };

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store tokens in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('role', data.user.role);
      
      // Show success message and redirect
      alert('Registration successful!');
      redirectBasedOnRole(data.user.role);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Return to email check step
  const goBackToEmailCheck = () => {
    setAuthStep('email-check');
    setError('');
  };

  // Render Email Check Form
  const renderEmailCheckForm = () => (
    <form className="mt-8 space-y-6" onSubmit={handleEmailCheck}>
      <div className="rounded-md shadow-sm">
        <div>
          <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={checkingEmail}
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {checkingEmail ? 'Checking...' : 'Continue'}
        </button>
      </div>
    </form>
  );

  // Render Login Form
  const renderLoginForm = () => (
    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            readOnly
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 bg-gray-100 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBackToEmailCheck}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Use a different email
        </button>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoggingIn}
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isLoggingIn ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  );

  // Render Registration Form
  const renderRegistrationForm = () => (
    <form className="mt-6 space-y-6" onSubmit={handleRegistration}>
      <div className="space-y-4">
        {/* Basic Info Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={registrationData.name}
                onChange={handleRegistrationChange}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="reg-email"
                name="e_mail"
                type="email"
                required
                value={registrationData.e_mail}
                onChange={handleRegistrationChange}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="johndoe@example.com"
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                required
                value={registrationData.password}
                onChange={handleRegistrationChange}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Create a strong password"
              />
            </div>
            <div>
              <label htmlFor="phone_no" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone_no"
                name="phone_no"
                type="tel"
                required
                value={registrationData.phone_no}
                onChange={handleRegistrationChange}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="9876543210"
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                value={registrationData.gender}
                onChange={handleRegistrationChange}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                required
                value={registrationData.date_of_birth}
                onChange={handleRegistrationChange}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={registrationData.role}
                onChange={handleRegistrationChange}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="Customer">Customer</option>
                <option value="Seller">Seller</option>
                <option value="RegionalAdmin">Regional Admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                id="region"
                name="region"
                required
                value={registrationData.region}
                onChange={handleRegistrationChange}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="first_line" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                id="first_line"
                name="address.first_line"
                type="text"
                required
                value={registrationData.address.first_line}
                onChange={handleRegistrationChange}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="123 Main St"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="second_line" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                id="second_line"
                name="address.second_line" 
                type="text"
                required
                value={registrationData.address.second_line}
                onChange={handleRegistrationChange}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Apt 4B"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                id="city"
                name="address.city"
                type="text"
                required
                value={registrationData.address.city}
                onChange={handleRegistrationChange}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Patna"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                id="state"
                name="address.state"
                type="text"
                required
                value={registrationData.address.state}
                onChange={handleRegistrationChange}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Bihar"
              />
            </div>
            <div>
              <label htmlFor="pin_code" className="block text-sm font-medium text-gray-700 mb-1">
                PIN Code
              </label>
              <input
                id="pin_code"
                name="address.pin_code"
                type="text"
                required
                value={registrationData.address.pin_code}
                onChange={handleRegistrationChange}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="800001"
              />
            </div>
          </div>
        </div>
        
        {/* Seller Description - only show if role is Seller */}
        {registrationData.role === 'Seller' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Seller Information</h3>
            <div>
              <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="desc"
                name="desc"
                rows="3"
                value={registrationData.desc}
                onChange={handleRegistrationChange}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Tell us about your business"
              ></textarea>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBackToEmailCheck}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Use a different email
        </button>
      </div>

      <div>
        <button
          type="submit"
          disabled={isRegistering}
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isRegistering ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {authStep === 'email-check' && 'Welcome to Our Platform'}
          {authStep === 'login' && 'Sign in to your account'}
          {authStep === 'register' && 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {authStep === 'email-check' && "Let's check if you already have an account"}
          {authStep === 'login' && "Welcome back! Please enter your password to continue"}
          {authStep === 'register' && "We're excited to have you join us"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          {authStep === 'email-check' && renderEmailCheckForm()}
          {authStep === 'login' && renderLoginForm()}
          {authStep === 'register' && renderRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default Login;
>>>>>>> origin/main
