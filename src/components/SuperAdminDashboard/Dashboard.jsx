import React from 'react';
import { styled } from '@mui/material/styles';
import { Paper, Grid, Typography, Box } from '@mui/material';
import {
    Category,
    ShoppingCart,
    MonetizationOn,
    People,
    Today,
    Pending,
    Send,
    Place,
    CheckCircle,
    LocalShipping,
    DoneAll,
    Cancel,
    StackedLineChart,
    ListAlt
} from '@mui/icons-material';
import { Card, CardContent } from '@mui/material';

// Dummy data for the top boxes
const topData = [
    { title: 'Category', value: 10, icon: Category },
    { title: 'Products', value: 110598, icon: ShoppingCart },
    { title: 'Total Orders', value: 6436, icon: MonetizationOn },
    { title: 'Users', value: 16178, icon: People },
    { title: "Today's Orders", value: 0, icon: Today },
    { title: "Today's Pending Orders", value: 0, icon: Pending },
    { title: "Today's Quotation Sent", value: 0, icon: Send },
    { title: "Today's Order Placed", value: 0, icon: Place },
    { title: "Today's Order In-Review", value: 0, icon: Today },
    { title: "Today's Orders Shipped", value: 0, icon: LocalShipping },
    { title: "Today's Orders Delivered", value: 0, icon: DoneAll },
    { title: "Today's Orders Rejected", value: 0, icon: Cancel },
    { title: "Today's Orders Cancelled", value: 0, icon: Cancel },
];

// Dummy data for the Latest Orders table
const latestOrders = [
    { orderNo: 'ORD6485', orderDate: '04-03-2025', totalAmount: 'Rs 0.00', status: 'pending' },
    { orderNo: 'ORD6484', orderDate: '22-02-2025', totalAmount: 'Rs 101.52', status: 'order placed' },
    { orderNo: 'ORD6483', orderDate: '14-01-2025', totalAmount: 'Rs 0.00', status: 'delivered' },
    { orderNo: 'ORD6482', orderDate: '14-01-2025', totalAmount: 'Rs 0.00', status: 'shipped' },
    { orderNo: 'ORD6481', orderDate: '07-01-2025', totalAmount: 'Rs 576.72', status: 'order placed' },
    { orderNo: 'ORD6480', orderDate: '07-01-2025', totalAmount: 'Rs 576.72', status: 'order placed' },
    { orderNo: 'ORD6479', orderDate: '18-12-2024', totalAmount: 'Rs 547.20', status: 'order placed' },
    { orderNo: 'ORD6478', orderDate: '09-12-2024', totalAmount: 'Rs 268.24', status: 'delivered' },
    { orderNo: 'ORD6477', orderDate: '01-12-2024', totalAmount: 'Rs 0.00', status: 'pending' },
    { orderNo: 'ORD6476', orderDate: '01-12-2024', totalAmount: 'Rs 0.00', status: 'pending' },
];

// Styled Paper component for the top boxes
const TopPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for depth
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', // Smooth transition
    '&:hover': {
        transform: 'translateY(-5px)', // Slight lift on hover
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', // Increased shadow on hover
    },
    display: 'flex', // Use flexbox for layout
    flexDirection: 'column', // Stack items vertically
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Vertically center content
    height: '100%', // Ensure equal height for all boxes.
}));

// Component for the top boxes
const TopBox = ({ title, value, icon: Icon }) => {
    return (
        <TopPaper>
            <Icon sx={{ fontSize: 40, color: '#1976d2', marginBottom: 1 }} /> {/* Use color from theme */}
            <Typography variant="h6" component="div">
                {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {title}
            </Typography>
        </TopPaper>
    );
};

// Component for the Weekly Order Chart
const WeeklyOrderChart = () => {
    // Placeholder data. In a real application, this would come from an API.
    const chartData = [
        { day: 'Wed', orderPlaced: 5, rejected: 2, delivered: 8, shipped: 3, totalOrder: 18 },
        { day: 'Thu', orderPlaced: 7, rejected: 1, delivered: 6, shipped: 4, totalOrder: 18 },
        { day: 'Fri', orderPlaced: 9, rejected: 0, delivered: 7, shipped: 5, totalOrder: 21 },
        { day: 'Sat', orderPlaced: 6, rejected: 3, delivered: 9, shipped: 2, totalOrder: 20 },
        { day: 'Sun', orderPlaced: 8, rejected: 1, delivered: 5, shipped: 6, totalOrder: 20 },
        { day: 'Mon', orderPlaced: 10, rejected: 0, delivered: 8, shipped: 4, totalOrder: 22 },
        { day: 'Today', orderPlaced: 12, rejected: 2, delivered: 10, shipped: 5, totalOrder: 29 },
    ];

    // Find maximum value for scaling the chart.
    const maxValue = Math.max(...chartData.map(item => Math.max(...Object.values(item).filter(val => typeof val === 'number'))));

    // Define bar colors
    const barColors = {
        orderPlaced: '#1976d2', // Blue
        rejected: '#f44336', // Red
        delivered: '#4caf50', // Green
        shipped: '#ffc107', // Amber
        totalOrder: '#9c27b0' // Purple
    };

    return (
        <Card sx={{ mt: 4, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Weekly Order Chart
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        width: '100%',
                        overflowX: 'auto', // Add horizontal scroll for small screens
                        paddingBottom: '16px', // Add padding at the bottom for scrollbar
                    }}
                >
                    {/* Y-Axis (Values) */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '200px', // Fixed height for the chart
                            marginRight: '16px', // Space between y-axis and bars
                            minWidth: '40px',  // Ensure y-axis area has some minimum width
                        }}
                    >
                        {[...Array(5)].map((_, i) => {
                            const value = maxValue - (i * (maxValue / 4)); // Calculate y-axis values
                            return (
                                <Typography
                                    key={i}
                                    variant="caption"
                                    sx={{
                                        lineHeight: '0',
                                        verticalAlign: 'middle',
                                        color: '#666', // Light gray color
                                    }}
                                >
                                    {value}
                                </Typography>
                            );
                        })}
                    </Box>

                    {/* Bars and X-Axis */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            height: '200px', // Fixed height for the chart
                            width: 'fit-content', // Adjust width based on content
                        }}
                    >
                        {chartData.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    margin: '0 8px', // Space between bars
                                    minWidth: '40px', // Minimum width for each bar group
                                }}
                            >
                                {/* Bars for each category */}
                                {Object.keys(barColors).map(key => {
                                    if (item[key] === undefined) return null; //safety check
                                    const barHeight = (item[key] / maxValue) * 200; // Calculate bar height
                                    return (
                                        <Box
                                            key={key}
                                            sx={{
                                                width: '16px', // Bar width
                                                height: `${barHeight}px`,
                                                backgroundColor: barColors[key],
                                                marginBottom: '2px',
                                                borderRadius: '4px 4px 0 0', // Rounded top corners
                                                ...(barHeight > 0 ? {
                                                    transition: 'height 0.3s ease', // Smooth transition
                                                } : {}),
                                            }}
                                            title={`${key}: ${item[key]}`} //tooltip
                                        />
                                    );
                                })}

                                {/* X-Axis Label (Day) */}
                                <Typography
                                    variant="caption"
                                    sx={{
                                        marginTop: '4px',
                                        color: '#333', // Darker gray for x-axis labels
                                        fontWeight: '500',
                                    }}
                                >
                                    {item.day}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Legend */}
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    {Object.entries(barColors).map(([key, color]) => (
                        <Box key={key} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: color,
                                    marginRight: '4px',
                                    borderRadius: '2px',
                                }}
                            />
                            <Typography variant="caption">{key}</Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

// Component for the Latest 10 Orders table
const LatestOrdersTable = () => {
    return (
        <Card sx={{ mt: 4, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Latest 10 Orders
                </Typography>
                <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Order No</th>
                                <th style={tableHeaderStyle}>Order Date</th>
                                <th style={tableHeaderStyle}>Total Amount</th>
                                <th style={tableHeaderStyle}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {latestOrders.map((order, index) => (
                                <tr key={index} style={tableRowStyle}>
                                    <td style={tableCellStyle}>{order.orderNo}</td>
                                    <td style={tableCellStyle}>{order.orderDate}</td>
                                    <td style={tableCellStyle}>{order.totalAmount}</td>
                                    <td style={tableCellStyle}>
                                        <span style={getStatusStyle(order.status)}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </CardContent>
        </Card>
    );
};

// Styles for the table
const tableHeaderStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    color: '#333',
};

const tableCellStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #eee',
    color: '#555',
};

const tableRowStyle = {
    '&:hover': {
        backgroundColor: '#f8f8f8',
    },
};

// Function to get status style
const getStatusStyle = (status) => {
    switch (status) {
        case 'pending':
            return {
                backgroundColor: '#ffe082', // Amber
                color: '#7a4f01',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
            };
        case 'order placed':
            return {
                backgroundColor: '#b0e0e6', // light blue
                color: '#008b8b',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
            };
        case 'delivered':
            return {
                backgroundColor: '#c8e6c9', // Light green
                color: '#388e3c',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
            };
        case 'shipped':
            return {
                backgroundColor: '#ffcc80',  // Light Orange
                color: '#d16405',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
            };
        default:
            return {};
    }
};

// Main Dashboard Component
const Dashboard = () => {
    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {/* Top Boxes */}
                {topData.map((item, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex' }}>
                        <TopBox {...item} />
                    </Grid>
                ))}

                {/* Weekly Order Chart */}
                <Grid item xs={12}>
                    <WeeklyOrderChart />
                </Grid>

                {/* Latest 10 Orders Table */}
                <Grid item xs={12}>
                    <LatestOrdersTable />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
