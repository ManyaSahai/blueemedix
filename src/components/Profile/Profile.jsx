// src/components/Profile/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  CircularProgress,
  Alert,
  Box,
  Grid,
  Paper,
  Avatar,
  Button,
  TextField,
  Divider,
  MenuItem,
  FormControl,
  Select,
  Snackbar,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  Container,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Wc as GenderIcon,
  LocationOn as LocationIcon,
  VerifiedUser as VerifiedIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for edit mode and form fields
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentTab, setCurrentTab] = useState(0);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real app, replace this with your actual API call
        setLoading(true);

        // Mock data for demonstration - replace with actual API call
        setTimeout(() => {
          const mockData = {
            name: "John Doe",
            e_mail: "john.doe@example.com",
            phone_no: "+1 (555) 123-4567",
            date_of_birth: "1990-01-01",
            gender: "Male",
            role: "Seller",
            verification_status: "Verified",
            region: "North America",
            verified_by: "Admin User",
            verification_date: "2023-06-15",
            created_at: "2023-01-10T14:30:00",
            updated_at: "2023-12-05T09:15:00",
            address: {
              first_line: "123 Main Street",
              second_line: "Apt 4B",
              city: "New York",
              state: "NY",
              pin_code: "10001",
            },
            desc: "Experienced seller with 5 years in e-commerce specializing in electronics and accessories.",
          };

          setUserData(mockData);
          setEditedData({
            name: mockData.name || "",
            e_mail: mockData.e_mail || "",
            phone_no: mockData.phone_no || "",
            date_of_birth: mockData.date_of_birth
              ? new Date(mockData.date_of_birth)
              : null,
            gender: mockData.gender || "",
          });
          setLoading(false);
        }, 1000); // Simulating API delay
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing, reset to original data
      setEditedData({
        name: userData.name || "",
        e_mail: userData.e_mail || "",
        phone_no: userData.phone_no || "",
        date_of_birth: userData.date_of_birth
          ? new Date(userData.date_of_birth)
          : null,
        gender: userData.gender || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field) => (event) => {
    setEditedData({ ...editedData, [field]: event.target.value });
  };

  const handleDateChange = (newDate) => {
    setEditedData({ ...editedData, date_of_birth: newDate });
  };

  const handleSave = () => {
    // In a real app, make an API call to update the profile
    // For demo purposes, just update the local state
    setUserData({
      ...userData,
      ...editedData,
    });

    // Show success message
    setSnackbarMessage("Profile updated successfully!");
    setSnackbarOpen(true);
    setIsEditing(false);
  };

  const handleBackToSeller = () => {
    navigate("/seller");
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Generate avatar text from name (initials)
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format verification status with appropriate color
  const getVerificationStatusColor = (status) => {
    if (!status) return "default";
    switch (status.toLowerCase()) {
      case "verified":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Error loading profile information.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackToSeller}
        sx={{ mb: 2 }}
      >
        Back to Seller Dashboard
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            User Profile
          </Typography>
          {!isEditing ? (
            <Button
              startIcon={<EditIcon />}
              variant="contained"
              color="primary"
              onClick={handleEditToggle}
            >
              Edit Profile
            </Button>
          ) : (
            <Box>
              <Button
                startIcon={<SaveIcon />}
                variant="contained"
                color="success"
                onClick={handleSave}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button
                startIcon={<CancelIcon />}
                variant="outlined"
                color="error"
                onClick={handleEditToggle}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
        <Divider sx={{ mb: 3 }} />

        {userData && (
          <Grid container spacing={3}>
            {/* Profile Header with Avatar */}
            <Grid item xs={12}>
              <Paper
                elevation={2}
                sx={{ p: 3, display: "flex", alignItems: "center", mb: 2 }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: "primary.main",
                    fontSize: "2.5rem",
                    mr: 3,
                  }}
                >
                  {getInitials(userData.name)}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {userData.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {userData.role}
                  </Typography>
                  {userData.verification_status && (
                    <Chip
                      icon={<VerifiedIcon />}
                      label={userData.verification_status}
                      color={getVerificationStatusColor(
                        userData.verification_status
                      )}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Tabs Navigation */}
            <Grid item xs={12}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  aria-label="profile tabs"
                >
                  <Tab label="Basic Information" />
                  <Tab label="Personal Details" />
                  <Tab label="Verification" />
                </Tabs>
              </Box>
            </Grid>

            {/* Tab Content */}
            <Grid item xs={12}>
              {/* Basic Information Tab */}
              {currentTab === 0 && (
                <Grid container spacing={3}>
                  {/* Name */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <PersonIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold">
                            Name
                          </Typography>
                        </Box>
                        {isEditing ? (
                          <TextField
                            fullWidth
                            value={editedData.name}
                            onChange={handleInputChange("name")}
                            variant="outlined"
                          />
                        ) : (
                          <Typography>{userData.name}</Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <EmailIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold">
                            Email
                          </Typography>
                        </Box>
                        {isEditing ? (
                          <TextField
                            fullWidth
                            value={editedData.e_mail}
                            onChange={handleInputChange("e_mail")}
                            variant="outlined"
                            type="email"
                          />
                        ) : (
                          <Typography>{userData.e_mail}</Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <PhoneIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold">
                            Phone
                          </Typography>
                        </Box>
                        {isEditing ? (
                          <TextField
                            fullWidth
                            value={editedData.phone_no}
                            onChange={handleInputChange("phone_no")}
                            variant="outlined"
                          />
                        ) : (
                          <Typography>{userData.phone_no}</Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Role */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <VerifiedIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold">
                            Role
                          </Typography>
                        </Box>
                        <Typography>{userData.role}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {/* Personal Details Tab */}
              {currentTab === 1 && (
                <Grid container spacing={3}>
                  {/* Gender */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <GenderIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold">
                            Gender
                          </Typography>
                        </Box>
                        {isEditing ? (
                          <FormControl fullWidth variant="outlined">
                            <Select
                              value={editedData.gender || ""}
                              onChange={handleInputChange("gender")}
                              displayEmpty
                            >
                              <MenuItem value="">
                                <em>Not specified</em>
                              </MenuItem>
                              <MenuItem value="Male">Male</MenuItem>
                              <MenuItem value="Female">Female</MenuItem>
                              <MenuItem value="Other">Other</MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
                          <Typography>
                            {userData.gender || "Not specified"}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Date of Birth */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <CakeIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold">
                            Date of Birth
                          </Typography>
                        </Box>
                        {isEditing ? (
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={editedData.date_of_birth}
                              onChange={handleDateChange}
                              renderInput={(params) => (
                                <TextField {...params} fullWidth />
                              )}
                            />
                          </LocalizationProvider>
                        ) : (
                          <Typography>
                            {userData.date_of_birth
                              ? new Date(
                                  userData.date_of_birth
                                ).toLocaleDateString()
                              : "Not specified"}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Region */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <LocationIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold">
                            Region
                          </Typography>
                        </Box>
                        <Typography>
                          {userData.region || "Not specified"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Address */}
                  {userData.address && (
                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <LocationIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold">
                              Address
                            </Typography>
                          </Box>
                          <Typography>{userData.address.first_line}</Typography>
                          {userData.address.second_line && (
                            <Typography>
                              {userData.address.second_line}
                            </Typography>
                          )}
                          <Typography>{`${userData.address.city}, ${userData.address.state} ${userData.address.pin_code}`}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Verification Tab */}
              {currentTab === 2 && (
                <Grid container spacing={3}>
                  {/* Verification Status */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <VerifiedIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold">
                            Verification Status
                          </Typography>
                        </Box>
                        <Chip
                          label={userData.verification_status || "Not verified"}
                          color={getVerificationStatusColor(
                            userData.verification_status
                          )}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Verified By */}
                  {userData.verified_by && (
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <PersonIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold">
                              Verified By
                            </Typography>
                          </Box>
                          <Typography>{userData.verified_by}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {/* Verification Date */}
                  {userData.verification_date && (
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <CakeIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold">
                              Verification Date
                            </Typography>
                          </Box>
                          <Typography>
                            {new Date(
                              userData.verification_date
                            ).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {/* Description */}
                  {userData.desc && (
                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              Description
                            </Typography>
                          </Box>
                          <Typography>{userData.desc}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>

            {/* Footer with timestamps */}
            <Grid item xs={12}>
              <Box
                sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
              >
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(userData.created_at).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last Updated: {new Date(userData.updated_at).toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
}

export default ProfilePage;
