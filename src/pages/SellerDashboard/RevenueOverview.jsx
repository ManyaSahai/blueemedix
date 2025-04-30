import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";

function RevenueOverview({ sellerId }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSellerOrders = async () => {
            setLoading(true);
            setError(null);
            try {
              const sellerId = localStorage.getItem("userId")
                const token = localStorage.getItem("token"); // Assuming you have a token
                const orderIdResponse = await fetch(
                    `http://localhost:5000/api/orders/seller/${sellerId}`,
                    {
                        headers: {
                            Authorization: `${token}`,
                        },
                    }
                );
                const orderIdData = await orderIdResponse.json();

                if (orderIdData.success && orderIdData.orders) {
                    const allOrdersDetails = await Promise.all(
                        orderIdData.orders.map(async (orderId) => {
                            const orderResponse = await fetch(
                                `http://localhost:5000/api/orders/${orderId}`,
                                {
                                    headers: {
                                        Authorization: `${token}`,
                                    },
                                }
                            );
                            const orderData = await orderResponse.json();
                            return orderData.success ? orderData.order : null;
                        })
                    );
                    // Filter out any failed order fetches
                    const validOrders = allOrdersDetails.filter(order => order !== null);
                    setOrders(validOrders);
                } else {
                    setError(orderIdData.message || "Failed to fetch order IDs.");
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchSellerOrders();
    }, [sellerId]);

    const calculateRevenue = () => {
        if (!orders || orders.length === 0) {
            return "0.00";
        }
        let totalRevenue = 0;
        orders.forEach(order => {
            if (order.status === "delivered") {
                totalRevenue += parseFloat(order.totalAmount);
            }
        });
        return totalRevenue.toFixed(2);
    };

    const acceptedOrdersCount = orders?.filter(o => o.status === "accepted").length || 0;
    const dispatchedOrdersCount = orders?.filter(o => o.status === "dispatched").length || 0;
    const deliveredOrdersCount = orders?.filter(o => o.status === "delivered").length || 0;
    const rejectedOrdersCount = orders?.filter(o => o.status === "rejected").length || 0;
    const cancelledOrdersCount = orders?.filter(o => o.status === "cancelled").length || 0;

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2, color: "error.main" }}>
                <Typography variant="body1">Error: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">Revenue Overview</Typography>
                <Typography variant="body2">
                    Track your revenue and financial performance
                </Typography>

                <Box sx={{ mt: 3, p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
                    <Typography
                        variant="h4"
                        sx={{ color: "#1e4c75", fontWeight: "bold" }}
                    >
                        Rs {calculateRevenue()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                        Total Revenue (Delivered Orders)
                    </Typography>
                </Box>

                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                    <Box
                        sx={{ p: 2, bgcolor: "#f0f7ff", borderRadius: 1, flex: 1 }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {acceptedOrdersCount}
                        </Typography>
                        <Typography variant="body2">Orders Accepted</Typography>
                    </Box>
                    <Box
                        sx={{ p: 2, bgcolor: "#e0f2f7", borderRadius: 1, flex: 1 }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {dispatchedOrdersCount}
                        </Typography>
                        <Typography variant="body2">Orders Dispatched</Typography>
                    </Box>
                    <Box
                        sx={{ p: 2, bgcolor: "#f8bbd0", borderRadius: 1, flex: 1 }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {deliveredOrdersCount}
                        </Typography>
                        <Typography variant="body2">Orders Delivered</Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                    <Box
                        sx={{ p: 2, bgcolor: "#ffe0b2", borderRadius: 1, flex: 1 }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {rejectedOrdersCount}
                        </Typography>
                        <Typography variant="body2">Orders Rejected</Typography>
                    </Box>
                    <Box
                        sx={{ p: 2, bgcolor: "#ffcdd2", borderRadius: 1, flex: 1 }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {cancelledOrdersCount}
                        </Typography>
                        <Typography variant="body2">Orders Cancelled</Typography>
                    </Box>
                    {/* You can add more status categories here if needed */}
                </Box>
            </Paper>
        </Box>
    );
}

export default RevenueOverview;