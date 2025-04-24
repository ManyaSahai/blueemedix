import React from "react";
import { Box, Paper, Typography } from "@mui/material";

function RevenueOverview({ sellerOrders }) {
  const calculateRevenue = () => {
    if (!sellerOrders || sellerOrders.length === 0) {
      return "0.00";
    }
    // In a real implementation, you would calculate based on actual order details
    // For now, we're using a placeholder.
    return "5,842.50";
  };

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
            Rs{calculateRevenue()}
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
              {sellerOrders?.filter(o => o.status === "delivered")?.length || 0}
            </Typography>
            <Typography variant="body2">Completed Orders</Typography>
          </Box>
          <Box
            sx={{ p: 2, bgcolor: "#fff4e5", borderRadius: 1, flex: 1 }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {sellerOrders?.filter(o => o.status === "dispatched")?.length || 0}
            </Typography>
            <Typography variant="body2">In Progress</Typography>
          </Box>
          <Box
            sx={{ p: 2, bgcolor: "#ffeef0", borderRadius: 1, flex: 1 }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {sellerOrders?.filter(o => ["rejected", "cancelled"].includes(o.status))?.length || 0}
            </Typography>
            <Typography variant="body2">Abandoned Orders</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default RevenueOverview;