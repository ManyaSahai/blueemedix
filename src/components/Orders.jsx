import React from "react";
import { useGetOrdersByUserQuery } from "../redux/ordersApi";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";

export default function Orders() {
  const userId = localStorage.getItem("userId");
  const { data, isLoading, isError } = useGetOrdersByUserQuery(userId);
  //console.log(data.orders[0].items[0].product.name)
  // console.log(data)

  if (isLoading) return <p style={{ color: "white", textAlign: "center" }}>Loading your orders...</p>;
  if (isError) return <p style={{ color: "red", textAlign: "center" }}>Failed to load orders.</p>;

  return (
    <Box sx={{ maxWidth: "1000px", margin: "auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom color="white">
        Your Past Orders
      </Typography>

      {data?.orders?.length ? (
        <Grid container spacing={2}>
          {data.orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card sx={{ backgroundColor: "#1e1e1e", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">
                    Order ID: {order._id}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    Date: {new Date(order.createdAt).toLocaleString()}
                  </Typography>

                  <Typography variant="body2" mt={1}>
                    Seller: <strong>{order.seller?.name || "N/A"}</strong>
                  </Typography>

                  <Typography variant="body2" mt={1}>
                    Shipping: {order.shippingAddress?.first_line}, {order.shippingAddress?.second_line}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pin_code}
                  </Typography>

                  <Divider sx={{ my: 2, borderColor: "#444" }} />

                  <Typography variant="subtitle1">Items:</Typography>
                  {order.items.map((item, index) => (
  <Typography variant="body2" key={index}>
    - {item.product?.name} × {item.quantity}
  </Typography>
))}



                  {order.prescription_image && (
                    <Box mt={2}>
                      <Typography variant="subtitle2">Prescription:</Typography>
                      <Avatar
                        variant="rounded"
                        src={order.prescription_image}
                        alt="Prescription"
                        sx={{ width: 100, height: 100, mt: 1 }}
                      />
                    </Box>
                  )}

                  <Divider sx={{ my: 2, borderColor: "#444" }} />

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                    <Chip label={`Status: ${order.status}`} color="warning" />
                    <Chip label={`Payment: ${order.payment_method}`} color="primary" />
                    <Chip label={`Paid: ${order.payment_status}`} color="success" />
                  </Box>

                  <Typography variant="body1" mt={2}>
                    Total Amount: ₹{order.totalAmount}
                  </Typography>

                  {order.tracking?.length > 0 && (
                    <>
                      <Divider sx={{ my: 2, borderColor: "#444" }} />
                      <Typography variant="subtitle2">Tracking:</Typography>
                      {order.tracking.map((t, i) => (
                        <Typography variant="body2" key={i}>
                          - {t.status} @ {new Date(t.timestamp).toLocaleString()}
                        </Typography>
                      ))}
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="gray">You haven’t placed any orders yet.</Typography>
      )}
    </Box>
  );
}
