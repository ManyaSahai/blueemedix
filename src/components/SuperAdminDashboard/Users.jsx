import React, { useEffect } from "react";
import { useGetUsersQuery } from "../../redux/usersApi";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Users = () => {
  const { data: users = [], isLoading, isError } = useGetUsersQuery();

  useEffect(() => {
    if (users.length > 0) {
      console.log("📦 Users loaded from cache or API:", users);
    }
  }, [users]);

  if (isLoading) return <Typography>Loading users...</Typography>;
  if (isError) return <Typography color="error">Failed to load users</Typography>;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Users List</Typography>
        <Button variant="contained" color="primary">
          + Create User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>First Name</strong></TableCell>
              <TableCell><strong>Last Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, idx) => (
              <TableRow key={idx}>
                <TableCell>{user.name.firstname}</TableCell>
                <TableCell>{user.name.lastname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <IconButton color="primary" title="Edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" title="Delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Users;
