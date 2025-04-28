import React from 'react';
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
  Chip
} from '@mui/material';
import { 
  Category,
  Inventory,
  ShoppingBag,
  People,
  ShoppingCart,
  HourglassEmpty,
  ReceiptLong,
  AddShoppingCart,
  RateReview,
  LocalShipping,
  Verified,
  Cancel,
  ThumbDown
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Temporary Data
const summaryData = [
  { title: 'Category', value: '10', icon: <Category /> },
  { title: 'Product', value: '110598', icon: <Inventory /> },
  { title: 'Total Orders', value: '6436', icon: <ShoppingBag /> },
  { title: 'Users', value: '16178', icon: <People /> },
];

const todayMetrics = [
  { title: "Today's Orders", value: '0', icon: <ShoppingCart /> },
  { title: "Today's Pending Orders", value: '0', icon: <HourglassEmpty /> },
  // { title: "Today's Quotation Sent", value: '0', icon: <ReceiptLong /> },
  { title: "Today's Order Placed", value: '0', icon: <AddShoppingCart /> },
  // { title: "Today's Order In Review", value: '0', icon: <RateReview /> },
  { title: "Today's Orders Shipped", value: '0', icon: <LocalShipping /> },
  { title: "Today's Orders Delivered", value: '0', icon: <Verified /> },
  { title: "Today's Orders Rejected", value: '0', icon: <ThumbDown /> },
  { title: "Today's Orders Cancelled", value: '0', icon: <Cancel /> },
];

const weeklyChartData = [
  { name: 'Wed', orderPlaced: 0, rejected: 0, delivered: 0, shipped: 0, totalOrder: 0 },
  { name: 'Thu', orderPlaced: 0, rejected: 0, delivered: 0, shipped: 0, totalOrder: 0 },
  { name: 'Fri', orderPlaced: 0, rejected: 0, delivered: 0, shipped: 0, totalOrder: 0 },
  { name: 'Sat', orderPlaced: 0, rejected: 0, delivered: 0, shipped: 0, totalOrder: 0 },
  { name: 'Sun', orderPlaced: 0, rejected: 0, delivered: 0, shipped: 0, totalOrder: 0 },
  { name: 'Mon', orderPlaced: 0, rejected: 0, delivered: 0, shipped: 0, totalOrder: 0 },
  { name: 'Today', orderPlaced: 0, rejected: 0, delivered: 0, shipped: 0, totalOrder: 0 },
];

const latestOrders = [
  { orderNo: 'ORD4485', orderDate: '04-03-2023', totalAmount: 'Rs 0.00', status: 'Pending' },
  { orderNo: 'ORD4484', orderDate: '22-02-2023', totalAmount: 'Rs 101.52', status: 'Order Placed' },
  { orderNo: 'ORD4483', orderDate: '14-01-2023', totalAmount: 'Rs 0.00', status: 'Pending' },
  { orderNo: 'ORD4482', orderDate: '14-01-2023', totalAmount: 'Rs 0.00', status: 'Pending' },
  { orderNo: 'ORD4481', orderDate: '07-01-2023', totalAmount: 'Rs 576.72', status: 'Order Placed' },
  { orderNo: 'ORD4480', orderDate: '07-01-2023', totalAmount: 'Rs 576.72', status: 'Order Placed' },
  { orderNo: 'ORD4479', orderDate: '18-12-2024', totalAmount: 'Rs 547.20', status: 'Order Placed' },
  { orderNo: 'ORD4478', orderDate: '09-12-2024', totalAmount: 'Rs 268.24', status: 'Order Placed' },
  { orderNo: 'ORD4477', orderDate: '01-12-2024', totalAmount: 'Rs 0.00', status: 'Pending' },
  { orderNo: 'ORD4476', orderDate: '01-12-2024', totalAmount: 'Rs 0.00', status: 'Pending' },
];

// Helper function to render status chip with appropriate color
const StatusChip = ({ status }) => {
  let color = 'default';
  
  if (status === 'Order Placed') {
    color = 'success';
  } else if (status === 'Pending') {
    color = 'warning';
  } else if (status === 'Cancelled') {
    color = 'error';
  } else if (status === 'Delivered') {
    color = 'info';
  }
  
  return <Chip label={status} color={color} size="small" />;
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1, py: 3 }}>
        {/* Summary Stats - 4 in a row on large screens */}
        <Grid container spacing={2}>
          {summaryData.map((item, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
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
            <Grid item xs={6} sm={4} md={4} lg={3} key={index}>
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
                <YAxis domain={[-1, 1]} ticks={[-1, -0.5, 0, 0.5, 1]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orderPlaced" stroke="#2196f3" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="rejected" stroke="#f44336" />
                <Line type="monotone" dataKey="delivered" stroke="#ff9800" />
                <Line type="monotone" dataKey="shipped" stroke="#4caf50" />
                <Line type="monotone" dataKey="totalOrder" stroke="#9c27b0" />
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
                      {order.orderNo}
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