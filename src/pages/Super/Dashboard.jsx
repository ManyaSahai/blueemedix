import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  useTheme, 
  useMediaQuery,
  Chip,
  CircularProgress
} from '@mui/material';
import { 
  Category,
  Inventory,
  ShoppingBag,
  People,
  ShoppingCart,
  HourglassEmpty,
  AddShoppingCart,
  Verified,
  Cancel,
  ThumbDown,
  LocalShipping,
  CheckCircle
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper function to render status chip with appropriate color
const StatusChip = ({ status }) => {
  let color = 'default';
  let label = status;
  
  if (status === 'accepted') {
    color = 'success';
    label = 'Order Accepted';
  } else if (status === 'pending') {
    color = 'warning';
    label = 'Pending';
  } else if (status === 'cancelled') {
    color = 'error';
    label = 'Cancelled';
  } else if (status === 'delivered') {
    color = 'info';
    label = 'Delivered';
  } else if (status === 'rejected') {
    color = 'error';
    label = 'Rejected';
  } else if (status === 'dispatched') {
    color = 'primary';
    label = 'Shipped';
  }
  
  return <Chip label={label} color={color} size="small" />;
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);
  const [todayMetrics, setTodayMetrics] = useState([]);
  const [weeklyChartData, setWeeklyChartData] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get auth token from localStorage
        const token = localStorage.getItem('token');
        
        // Request headers with authorization token
        const headers = {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        };
        
        // Fetch summary metrics
        const countResponse = await fetch('http://localhost:5000/api/superAdmin/dashboard/metrics/count', {
          method: 'GET',
          headers
        });
        const countData = await countResponse.json();
        const { customerCount, categoryCount, orderCount, productCount } = countData;
        
        // Fetch today's order metrics
        const todayOrdersResponse = await fetch('http://localhost:5000/api/superAdmin/dashboard/metrics/todayOrdersCount', {
          method: 'GET',
          headers
        });
        const todayOrdersData = await todayOrdersResponse.json();
        const todayOrderCounts = todayOrdersData.eventCounts;
        
        // Fetch weekly data
        const weeklyResponse = await fetch('http://localhost:5000/api/superAdmin/dashboard/metrics/weeklyCount', {
          method: 'GET',
          headers
        });
        const weeklyResponseData = await weeklyResponse.json();
        const weeklyData = weeklyResponseData.eventCounts;
        
        // Fetch latest orders
        const latestOrdersResponse = await fetch('http://localhost:5000/api/superAdmin/dashboard/metrics/last10', {
          method: 'GET',
          headers
        });
        const latestOrdersResponseData = await latestOrdersResponse.json();
        const latestOrdersData = latestOrdersResponseData.orders;
        
        // Process summary data
        setSummaryData([
          { title: 'Category', value: categoryCount.toString(), icon: <Category /> },
          { title: 'Product', value: productCount.toString(), icon: <Inventory /> },
          { title: 'Total Orders', value: orderCount.toString(), icon: <ShoppingBag /> },
          { title: 'Users', value: customerCount.toString(), icon: <People /> },
        ]);
        
        // Process today's metrics
        setTodayMetrics([
          { title: "Today's Orders", value: (todayOrderCounts.order_placed || 0).toString(), icon: <ShoppingCart /> },
          { title: "Today's Pending Orders", value: (todayOrderCounts.order_placed - todayOrderCounts.order_accepted - todayOrderCounts.order_rejected || 0).toString(), icon: <HourglassEmpty /> },
          { title: "Today's Order Placed", value: (todayOrderCounts.order_placed || 0).toString(), icon: <AddShoppingCart /> },
          { title: "Today's Orders Accepted", value: (todayOrderCounts.order_accepted || 0).toString(), icon: <CheckCircle /> },
          { title: "Today's Orders Shipped", value: (todayOrderCounts.order_dispatched || 0).toString(), icon: <LocalShipping /> },
          { title: "Today's Orders Delivered", value: (todayOrderCounts.order_delivered || 0).toString(), icon: <Verified /> },
          { title: "Today's Orders Rejected", value: (todayOrderCounts.order_rejected || 0).toString(), icon: <ThumbDown /> },
          { title: "Today's Orders Cancelled", value: (todayOrderCounts.order_cancelled || 0).toString(), icon: <Cancel /> },
        ]);
        
        // Generate weekly data for chart
        // Note: This is a simplified approach - you may need to adjust based on your real data structure
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date();
        const weeklyChartData = Array(7).fill().map((_, index) => {
          const day = new Date();
          day.setDate(today.getDate() - (6 - index));
          return {
            name: index === 6 ? 'Today' : days[day.getDay()],
            orderPlaced: index === 6 ? weeklyData.order_placed || 0 : 0,
            rejected: index === 6 ? weeklyData.order_rejected || 0 : 0,
            delivered: index === 6 ? weeklyData.order_delivered || 0 : 0,
            shipped: index === 6 ? weeklyData.order_dispatched || 0 : 0,
            totalOrder: index === 6 ? weeklyData.order_placed || 0 : 0
          };
        });
        setWeeklyChartData(weeklyChartData);
        
        // Process latest orders
        const formattedLatestOrders = latestOrdersData.map(order => ({
          orderNo: order._id.substring(order._id.length - 6).toUpperCase(),
          orderDate: formatDate(order.createdAt),
          totalAmount: `Rs ${order.totalAmount.toFixed(2)}`,
          status: order.status,
          rawOrder: order // Keep the raw order for reference if needed
        }));
        setLatestOrders(formattedLatestOrders);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Stat box styling for consistent appearance
  const statBoxStyle = {
    p: 2, 
    display: 'flex', 
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center', 
    height: '100%',
    width: 400
  };

  const iconBoxStyle = { 
    bgcolor: '#0d47a1', 
    color: 'white', 
    borderRadius: 1, 
    p: 1, 
    mr: isMobile ? 0 : 2,
    mb: isMobile ? 1 : 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px'
  };

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        {/* Summary Stats - 4 in a row on large screens */}
        <Grid container spacing={2}>
          {summaryData.map((item, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Paper elevation={1} sx={statBoxStyle}>
                <Box sx={iconBoxStyle}>
                  {item.icon}
                </Box>
                <Box textAlign={isMobile ? 'center' : 'left'}>
                  <Typography variant="body2" color="textSecondary">
                    {item.title}
                  </Typography>
                  <Typography variant="h6" component="div">
                    {item.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Today's Metrics - 4 in a row on lg, 3 on md/sm */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {todayMetrics.map((item, index) => (
            <Grid item xs={6} sm={6} md={4} lg={3} key={index}>
              <Paper elevation={1} sx={statBoxStyle}>
                <Box sx={iconBoxStyle}>
                  {item.icon}
                </Box>
                <Box textAlign={isMobile ? 'center' : 'left'}>
                  <Typography variant="body2" color="textSecondary">
                    {item.title}
                  </Typography>
                  <Typography variant="h6" component="div">
                    {item.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Weekly Order Chart */}
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'medium' }}>
            Weekly Order Chart
          </Typography>
          <Box sx={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart
                data={weeklyChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orderPlaced" name="Order Placed" stroke="#2196f3" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="rejected" name="Rejected" stroke="#f44336" />
                <Line type="monotone" dataKey="delivered" name="Delivered" stroke="#ff9800" />
                <Line type="monotone" dataKey="shipped" name="Shipped" stroke="#4caf50" />
                <Line type="monotone" dataKey="totalOrder" name="Total Orders" stroke="#9c27b0" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Latest Orders Table */}
        <Paper sx={{ p: 2, mt: 2, overflow: 'hidden' }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            component="div" 
            sx={{ 
              fontWeight: 'medium', 
              bgcolor: '#e8eaf6', 
              p: 1,
              borderRadius: 1
            }}
          >
            Latest 10 Orders
          </Typography>
          <TableContainer component={Box}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Order No</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {latestOrders.map((order) => (
                  <TableRow
                    key={order.orderNo}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      ORD{order.orderNo}
                    </TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>{order.totalAmount}</TableCell>
                    <TableCell>
                      <StatusChip status={order.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;