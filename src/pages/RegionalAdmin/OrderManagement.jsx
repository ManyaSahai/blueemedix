import React, { useState } from "react";
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
    Chip,
    TablePagination,
} from "@mui/material";
import { useFetchRegionalOrdersQuery } from "../../redux/regionalAdminApi";

function OrderManagement() {
    const region = localStorage.getItem("region");
    const { data: orders, isLoading, isError, error } = useFetchRegionalOrdersQuery(region);
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

    // Function to determine chip color based on status
    const getStatusChipProps = (status) => {
        const statusConfig = {
            pending: { color: "warning", backgroundColor: "#9e9e9e" },
            accepted: { color: "info", backgroundColor: "#ff9800" },
            dispatched: { color: "primary", backgroundColor: "#2196f3" },
            delivered: { color: "success", backgroundColor: "#4caf50" },
            rejected: { color: "error", backgroundColor: "#f44336" },
            cancelled: { color: "default", backgroundColor: "#f44336" },
        };

        return statusConfig[status.toLowerCase()] || { color: "default", backgroundColor: "#f5f5f5" };
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert severity="error">
                {error?.data?.message || error?.error || "Failed to fetch orders."}
            </Alert>
        );
    }

    // Make sure orders is always an array
    const ordersList = Array.isArray(orders) ? orders : (orders?.orders || []);

    // Pagination Handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };

    // Calculate displayed orders
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const displayedOrders = ordersList.slice(startIndex, endIndex);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography variant="h5" gutterBottom>
                    Orders in {region} Region
                </Typography>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" width="5%">
                                    S.No
                                </TableCell>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Customer Name</TableCell>
                                {!isSmallScreen && <TableCell>Customer Email</TableCell>}
                                <TableCell>Order Status</TableCell>
                                <TableCell>Total Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedOrders.map((order, index) => {
                                const statusProps = getStatusChipProps(order.status);
                                return (
                                    <TableRow key={order._id}>
                                        <TableCell align="center">{startIndex + index + 1}</TableCell>
                                        <TableCell>{order._id}</TableCell>
                                        <TableCell>{order.customer?.name || "N/A"}</TableCell>
                                        {!isSmallScreen && <TableCell>{order.customer?.e_mail || "N/A"}</TableCell>}
                                        <TableCell>
                                            <Chip
                                                label={order.status}
                                                color={statusProps.color}
                                                size="small"
                                                sx={{
                                                    backgroundColor: statusProps.backgroundColor,
                                                    fontWeight: 500,
                                                    minWidth: "90px",
                                                    textAlign: "center",
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>₹{order.totalAmount.toLocaleString("en-IN")}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={ordersList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 20, 50]} // Add options for rows per page
                    labelRowsPerPage="Rows per page"
                />

                {ordersList.length === 0 && !isLoading && !isError && ( // Corrected condition
                    <Box textAlign="center" py={3}>
                        <Typography variant="body1">No orders found in this region.</Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}

export default OrderManagement;
