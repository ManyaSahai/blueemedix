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
    Box,
    Button,
    TablePagination,
} from "@mui/material";
import { CheckCircle, Cancel, Pending } from "@mui/icons-material";
import { green, red, grey } from "@mui/material/colors";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const regAdminId = localStorage.getItem("userId");
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); // You can adjust this default value

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

    // Pagination functions
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page when rows per page change
    };

    const getVerificationIcon = (status) => {
        const lowerCaseStatus = status.toLowerCase();
        switch (lowerCaseStatus) {
            case "approved":
                return <CheckCircle style={{ color: green[500] }} />;
            case "rejected":
                return <Cancel style={{ color: red[500] }} />;
            default:
                return <Pending style={{ color: grey[500] }} />;
        }
    };

    const getVerificationText = (status) => {
        const lowerCaseStatus = status.toLowerCase();
        switch (lowerCaseStatus) {
            case "approved":
                return "Approved";
            case "rejected":
                return "Rejected";
            default:
                return "Pending";
        }
    };

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

    // Calculate the index range for the current page
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const displayedUsers = users.slice(startIndex, endIndex);

    return (
        <Container maxWidth="lg" sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Users in Your Region
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            {!isSmallScreen && <TableCell align="left">Phone</TableCell>}
                            {!isSmallScreen && <TableCell align="left">City</TableCell>}
                            <TableCell align="left">Verification Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedUsers.map((user, index) => (
                            <TableRow
                                key={user._id}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell>{startIndex + index + 1}</TableCell>
                                <TableCell component="th" scope="row">
                                    {user.name}
                                </TableCell>
                                <TableCell align="left">{user.e_mail}</TableCell>
                                {!isSmallScreen && <TableCell align="left">{user.phone_no}</TableCell>}
                                {!isSmallScreen && (
                                    <TableCell align="left">{user.address?.city || "-"}</TableCell>
                                )}
                                <TableCell align="left">
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {getVerificationIcon(user.verification_status)}
                                        <span>{getVerificationText(user.verification_status)}</span>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]} // Options for rows per page
                    component="div"
                    count={users.length} // Total number of users
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
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