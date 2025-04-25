import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  useMediaQuery,
  Box
} from "@mui/material";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const regAdminId = localStorage.getItem("userId"); // Assuming 'userId' is the key for the admin's ID
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/auth/regAdmin/customer/${regAdminId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          setError(data.message || "Failed to fetch users.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [regAdminId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Users in Your Region
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="left">Email</TableCell>
              {!isSmallScreen && <TableCell align="left">Phone</TableCell>}
              {!isSmallScreen && <TableCell align="left">City</TableCell>}
              <TableCell align="left">Verification Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell align="left">{user.e_mail}</TableCell>
                {!isSmallScreen && <TableCell align="left">{user.phone_no}</TableCell>}
                {!isSmallScreen && <TableCell align="left">{user.address?.city || "-"}</TableCell>}
                <TableCell align="left">{user.verification_status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {users.length === 0 && !loading && !error && (
        <Typography variant="subtitle1" sx={{ mt: 2, color: "text.secondary" }}>
          No users found in your region.
        </Typography>
      )}
    </Container>
  );
}

export default UserManagement;