// src/components/Dashboard.js
import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Inventory,
  Category,
  ShoppingCart,
  Group,
  ShoppingBasket,
  HourglassEmpty,
  Description,
  LocalShipping,
  CheckCircle,
  Cancel,
  HighlightOff,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: `${drawerWidth}px`,
    }),
  }),
);

const StyledAppBar = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const StatsCard = ({ icon, title, value, color = 'primary' }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
      <Box sx={{ 
        backgroundColor: `${color}.main`, 
        p: 1, 
        borderRadius: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        {icon}
      </Box>
      <Box sx={{ ml: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
      </Box>
    </Paper>
  );
};

const Dashboard = ({ open, toggleDrawer }) => {
  const dashboardData = useSelector(state => state.dashboard);
  const orders = useSelector(state => state.orders);

  return (
    <>
      <StyledAppBar position="fixed" open={open} color="default" elevation={1}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 1 }}>BlueMedix</Typography>
            <AccountCircleIcon />
          </Box>
        </Toolbar>
      </StyledAppBar>
      <Main open={open}>
        <Toolbar />
        <Container maxWidth="xl">
          {/* Top Stats Row */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                icon={<Category sx={{ color: 'white' }} />} 
                title="Category" 
                value={dashboardData.categoryCount} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                icon={<Inventory sx={{ color: 'white' }} />} 
                title="Product" 
                value={dashboardData.productCount} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                icon={<ShoppingCart sx={{ color: 'white' }} />} 
                title="Total Orders" 
                value={dashboardData.totalOrders} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                icon={<Group sx={{ color: 'white' }} />} 
                title="Users" 
                value={dashboardData.userCount} 
              />
            </Grid>
          </Grid>

          {/* Order Stats Row */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                icon={<ShoppingBasket sx={{ color: 'white' }} />} 
                title="Today's Orders" 
                value={dashboardData.todaysOrders} 
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                icon={<HourglassEmpty sx={{ color: 'white' }} />} 
                title="Today's Pending Orders" 
                value={dashboardData.todaysPendingOrders} 
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                icon={<Description sx={{ color: 'white' }} />} 
                title="Today's Quotation Sent" 
                value={dashboardData.todaysQuotationSent} 
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                icon={<ShoppingCart sx={{ color: 'white' }} />} 
                title="Today's Order Placed" 
                value={dashboardData.todaysOrderPlaced} 
                color="success"
              />
            </Grid>
          </Grid>

          {/* More Order Stats Row */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                icon={<HourglassEmpty sx={{ color: 'white' }} />} 
                title="Today's Order In-Review" 
                value={dashboardData.todaysOrderInReview} 
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                icon={<LocalShipping sx={{ color: 'white' }} />} 
                title="Today's Orders Shipped" 
                value={dashboardData.todaysOrdersShipped} 
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                icon={<CheckCircle sx={{ color: 'white' }} />} 
                title="Today's Orders Delivered" 
                value={dashboardData.todaysOrdersDelivered} 
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                icon={<HighlightOff sx={{ color: 'white' }} />} 
                title="Today's Orders Rejected" 
                value={dashboardData.todaysOrdersRejected} 
                color="error"
              />
            </Grid>
          </Grid>

          {/* Last Row */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard 
                icon={<Cancel sx={{ color: 'white' }} />} 
                title="Today's Orders Cancelled" 
                value={dashboardData.todaysOrdersCancelled} 
                color="error"
              />
            </Grid>
          </Grid>

          {/* Weekly Chart */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Order Chart
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardData.weeklyOrderData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="orderPlaced" stroke="#8884d8" name="Order Placed" />
                  <Line type="monotone" dataKey="rejected" stroke="#ff0000" name="Rejected" />
                  <Line type="monotone" dataKey="delivered" stroke="#ff8c00" name="Delivered" />
                  <Line type="monotone" dataKey="shipped" stroke="#008000" name="Shipped" />
                  <Line type="monotone" dataKey="totalOrder" stroke="#800080" name="Total Order" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Latest Orders Table */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Latest 10 Orders
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order No</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.orderNo}>
                      <TableCell component="th" scope="row">
                        <Typography color="primary">{order.orderNo}</Typography>
                      </TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>{order.totalAmount}</TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status} 
                          color={order.status === 'Pending' ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Main>
    </>
  );
};

export default Dashboard;