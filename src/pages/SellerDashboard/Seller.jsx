import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Divider,
  Alert,
} from "@mui/material";

function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("orderStatus");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  Fakestore API data
  const [orders, setOrders] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);

        generateSampleOrders(data);
        generateSampleComplaints();

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const generateSampleOrders = (productData) => {
    if (!productData || productData.length === 0) return;

    const statuses = [
      "Accepted",
      "Dispatched",
      "Delivered",
      "Rejected",
      "Cancelled",
    ];
    const customers = [
      "John Doe",
      "Jane Smith",
      "Mike Jones",
      "Sarah Brown",
      "Alex Wilson",
    ];

    const generatedOrders = productData.slice(0, 10).map((product, index) => {
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));

      return {
        id: `ORD00${index + 1}`,
        product: product.title,
        productId: product.id,
        customer: customers[Math.floor(Math.random() * customers.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        date: orderDate.toISOString().split("T")[0],
        price: product.price,
        quantity: Math.floor(Math.random() * 3) + 1,
      };
    });

    setOrders(generatedOrders);
  };

  const generateSampleComplaints = () => {
    const issues = [
      "Wrong product",
      "Damaged package",
      "Late delivery",
      "Product quality",
      "Missing items",
    ];
    const statuses = ["isValid", "Not Valid"];
    const resolutions = ["Replace", "Refund", "None"];
    const customers = [
      "John Doe",
      "Jane Smith",
      "Mike Jones",
      "Sarah Brown",
      "Alex Wilson",
    ];

    const generatedComplaints = Array(5)
      .fill()
      .map((_, index) => {
        const orderNum = Math.floor(Math.random() * 10) + 1;
        return {
          id: `COMP00${index + 1}`,
          customer: customers[Math.floor(Math.random() * customers.length)],
          order: `ORD00${orderNum}`,
          issue: issues[Math.floor(Math.random() * issues.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          resolution:
            resolutions[Math.floor(Math.random() * resolutions.length)],
          date: new Date(
            Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
        };
      });

    setComplaints(generatedComplaints);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const calculateRevenue = () => {
    return orders
      .reduce((total, order) => {
        if (order.status === "Delivered") {
          return total + order.price * order.quantity;
        }
        return total;
      }, 0)
      .toFixed(2);
  };

  const getAbandonedOrders = () => {
    return orders.filter(
      (order) => order.status === "Rejected" || order.status === "Cancelled"
    );
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const renderContent = () => {
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
          Error loading data: {error}
        </Alert>
      );
    }

    switch (activeTab) {
      case "orderStatus":
        return (
          <TableContainer component={Paper} elevation={0}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Order Status
            </Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.product.substring(0, 30)}...</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      ${(order.price * order.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                          value=""
                          displayEmpty
                          renderValue={() => "Update Status"}
                          onChange={(e) =>
                            handleUpdateStatus(order.id, e.target.value)
                          }
                        >
                          <MenuItem value="Accepted">Accepted</MenuItem>
                          <MenuItem value="Dispatched">Dispatched</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case "placeOrder":
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Place Order (Admin)
            </Typography>
            <Typography variant="body2" gutterBottom>
              Select products from inventory to create a new order
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              Available Products
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.slice(0, 5).map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.title.substring(0, 30)}...</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ backgroundColor: "#1e4c75" }}
                        >
                          Add to Order
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3 }}>
              <Button variant="contained" sx={{ backgroundColor: "#1e4c75" }}>
                Create New Order
              </Button>
            </Box>
          </Paper>
        );

      case "customerRegister":
        return (
          <TableContainer component={Paper} elevation={0}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Customer Registration
            </Typography>
            <Typography variant="body2" sx={{ px: 2, pb: 2 }}>
              Manage your customers and their registration status
            </Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Registration Date</TableCell>
                  <TableCell>Orders</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  {
                    id: "CUST001",
                    name: "John Doe",
                    email: "john@example.com",
                    date: "2025-01-12",
                    orders: 3,
                    status: "Active",
                  },
                  {
                    id: "CUST002",
                    name: "Jane Smith",
                    email: "jane@example.com",
                    date: "2025-02-03",
                    orders: 5,
                    status: "Active",
                  },
                  {
                    id: "CUST003",
                    name: "Mike Jones",
                    email: "mike@example.com",
                    date: "2025-03-18",
                    orders: 1,
                    status: "New",
                  },
                  {
                    id: "CUST004",
                    name: "Sarah Brown",
                    email: "sarah@example.com",
                    date: "2025-03-22",
                    orders: 2,
                    status: "Active",
                  },
                  {
                    id: "CUST005",
                    name: "Alex Wilson",
                    email: "alex@example.com",
                    date: "2025-04-01",
                    orders: 0,
                    status: "Inactive",
                  },
                ].map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.date}</TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>{customer.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case "customerFeedback":
        return (
          <Box>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">
                Customer Feedback & Complaints
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Manage customer feedback and address complaints
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Complaints
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell>Complaint ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Issue</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Resolution</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {complaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell>{complaint.id}</TableCell>
                        <TableCell>{complaint.customer}</TableCell>
                        <TableCell>{complaint.order}</TableCell>
                        <TableCell>{complaint.issue}</TableCell>
                        <TableCell>{complaint.date}</TableCell>
                        <TableCell>{complaint.status}</TableCell>
                        <TableCell>{complaint.resolution}</TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select
                              value=""
                              displayEmpty
                              renderValue={() => "Actions"}
                            >
                              <MenuItem value="valid">Mark as Valid</MenuItem>
                              <MenuItem value="invalid">
                                Mark as Not Valid
                              </MenuItem>
                              <MenuItem value="replace">
                                Provide Replacement
                              </MenuItem>
                              <MenuItem value="refund">Process Refund</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        );

      case "revenue":
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
                  ${calculateRevenue()}
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
                    {orders.filter((o) => o.status === "Delivered").length}
                  </Typography>
                  <Typography variant="body2">Completed Orders</Typography>
                </Box>
                <Box
                  sx={{ p: 2, bgcolor: "#fff4e5", borderRadius: 1, flex: 1 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {orders.filter((o) => o.status === "Dispatched").length}
                  </Typography>
                  <Typography variant="body2">In Progress</Typography>
                </Box>
                <Box
                  sx={{ p: 2, bgcolor: "#ffeef0", borderRadius: 1, flex: 1 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {getAbandonedOrders().length}
                  </Typography>
                  <Typography variant="body2">Abandoned Orders</Typography>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Abandoned Orders
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell>ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getAbandonedOrders().length > 0 ? (
                      getAbandonedOrders().map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>
                            {order.product.substring(0, 20)}...
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            ${(order.price * order.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined">
                              Send Reminder
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No abandoned orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        );

      case "invoices":
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Invoices</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              View and manage all your invoices
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>Invoice ID</TableCell>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders
                    .filter((o) => o.status === "Delivered")
                    .slice(0, 5)
                    .map((order, index) => (
                      <TableRow key={`inv-${order.id}`}>
                        <TableCell>INV00{index + 1}</TableCell>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          ${(order.price * order.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">
                            View Invoice
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        );

      default:
        return <Typography>Select a tab</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box sx={{ p: 2, backgroundColor: "#1e4c75", color: "white" }}>
        <Typography variant="h5">BlueMedix Seller Dashboard</Typography>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 3, flex: 1 }}>
        <Paper sx={{ borderRadius: 1, overflow: "hidden" }}>
          {/* Navigation Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "#f5f5f5",
              "& .Mui-selected": { color: "#1e4c75" },
              "& .MuiTabs-indicator": { backgroundColor: "#1e4c75" },
            }}
          >
            <Tab label="Order Status" value="orderStatus" />
            <Tab label="Place Order" value="placeOrder" />
            <Tab label="Customer Register" value="customerRegister" />
            <Tab label="Customer Feedback" value="customerFeedback" />
            <Tab label="Revenue" value="revenue" />
            <Tab label="Invoices" value="invoices" />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 0 }}>{renderContent()}</Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SellerDashboard;
