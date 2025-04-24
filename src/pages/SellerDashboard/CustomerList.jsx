// CustomerList.js
import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Alert,
    Button,
    TableSortLabel,
    Snackbar,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import PlaceOrderModal from "./PlaceOrderModal"; // Import the new component

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: "serial",
        numeric: false,
        disablePadding: true,
        label: "Sr. No.",
    },
    {
        id: "name",
        numeric: false,
        disablePadding: false,
        label: "Name",
    },
    {
        id: "phone_no",
        numeric: true,
        disablePadding: false,
        label: "Phone",
    },
    {
        id: "e_mail",
        numeric: false,
        disablePadding: false,
        label: "Email",
    },
    {
        id: "gender",
        numeric: false,
        disablePadding: false,
        label: "Gender",
    },
    {
        id: "actions",
        numeric: false,
        disablePadding: false,
        label: "Actions",
    },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                {headCells.map((headCell, index) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

function CustomerList({ sellerId }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("serial");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleOpenOrderModal = (customer) => {
        setSelectedCustomer(customer);
        setOrderModalOpen(true);
    };

    const handleCloseOrderModal = () => {
        setOrderModalOpen(false);
        setSelectedCustomer(null);
    };

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `http://localhost:5000/api/userData/seller/${sellerId}`,
                    {
                        headers: {
                            Authorization: localStorage.getItem("authToken") || "",
                        },
                    }
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch customers");
                }
                const data = await response.json();
                if (data.success) {
                    setCustomers(data.data);
                } else {
                    setError(data.message || "Failed to fetch customers");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [sellerId]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    const sortedCustomers = stableSort(customers, getComparator(order, orderBy));

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Error loading customers: {error}
            </Alert>
        );
    }

    return (
        <Box>
            <TableContainer component={Paper} elevation={0}>
                <Typography variant="h6" sx={{ p: 2 }}>
                    Customers in Your Pincode
                </Typography>
                <Table>
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {sortedCustomers.map((customer, index) => (
                            <TableRow key={customer._id}>
                                <TableCell padding="none">{index + 1}</TableCell>
                                <TableCell>{customer.name}</TableCell>
                                <TableCell align="right">{customer.phone_no}</TableCell>
                                <TableCell>{customer.e_mail}</TableCell>
                                <TableCell>{customer.gender}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleOpenOrderModal(customer)}
                                    >
                                        Place Order
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {customers.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No customers found in your pincode.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Place Order Modal Component */}
            <PlaceOrderModal
                open={orderModalOpen}
                onClose={handleCloseOrderModal}
                selectedCustomer={selectedCustomer}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarOpen={setSnackbarOpen}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />
        </Box>
    );
}

export default CustomerList;