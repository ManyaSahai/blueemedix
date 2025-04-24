import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    TableContainer,
    Table,
    TableRow,
    TableCell,
    TableBody,
    TableHead,
    Chip,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useSellerOrdersQuery, useOrderDetailsQuery, useUpdateOrderStatusMutation, useGetMeQuery } from "../../redux/sellerApi";
import OrderDetails from "./OrderDetails";
import RevenueOverview from "./RevenueOverview";
import CustomerList from "./CustomerList";
import Profile from "../../components/Profile/Profile"; // Import the Profile component
import { useNavigate } from "react-router-dom";

function SellerDashboard() {
    const [activeTab, setActiveTab] = useState("orderStatus");
    const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [orderDetailsMap, setOrderDetailsMap] = useState({});
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const isMenuOpen = Boolean(anchorEl);

    // Get seller ID from local storage
    const sellerId = localStorage.getItem('userId');

    // Fetch orders for the seller
    const {
        data: sellerOrdersData,
        isLoading: ordersLoading,
        error: ordersError,
        refetch: refetchOrders
    } = useSellerOrdersQuery(sellerId);

    // Fetch selected order details
    const {
        data: orderDetails,
        isLoading: orderDetailsLoading,
        error: orderDetailsError
    } = useOrderDetailsQuery(selectedOrderId, { skip: !selectedOrderId });

    // Mutation for updating order status
    const [updateOrderStatus, { isLoading: updateStatusLoading }] = useUpdateOrderStatusMutation();

    // Fetch user profile information
    const { data: meData } = useGetMeQuery();

    useEffect(() => {
        if (sellerOrdersData?.orders) {
            sellerOrdersData.orders.forEach(order => {
                const orderId = typeof order === 'string' ? order : (order._id || order.id);

                if (!orderDetailsMap[orderId]) {
                    fetch(`http://localhost:5000/api/orders/${orderId}`, {
                        headers: { 'Authorization': localStorage.getItem('authToken') || '' }
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success || data.order) {
                                setOrderDetailsMap(prev => ({
                                    ...prev,
                                    [orderId]: data.order || data
                                }));
                            }
                        })
                        .catch(err => console.error(`Error fetching details for ${orderId}:`, err));
                }
            });
        }
    }, [sellerOrdersData, orderDetailsMap]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleViewOrderDetails = (orderId) => {
        setSelectedOrderId(orderId);
        setOrderDetailsOpen(true);
    };

    const handleCloseOrderDetails = () => {
        setOrderDetailsOpen(false);
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const validStatuses = ['pending', 'accepted', 'dispatched', 'delivered', 'rejected', 'cancelled'];

            if (!validStatuses.includes(newStatus)) {
                setError(`Invalid status value: ${newStatus}. Status must be one of: ${validStatuses.join(', ')}`);
                return;
            }

            await updateOrderStatus({
                orderId,
                status: newStatus,
                description: `Order status updated to ${newStatus}`
            }).unwrap();

            refetchOrders();
        } catch (err) {
            console.error("Failed to update order status:", err);
            setError("Failed to update order status. Please try again.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return '#4caf50';
            case 'dispatched':
                return '#2196f3';
            case 'accepted':
                return '#ff9800';
            case 'rejected':
            case 'cancelled':
                return '#f44336';
            default:
                return '#9e9e9e';
        }
    };

    const renderContent = () => {
        if (ordersLoading && activeTab === "orderStatus") {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (ordersError && activeTab === "orderStatus") {
            return (
                <Alert severity="error" sx={{ m: 2 }}>
                    Error loading orders: {ordersError}
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
                        <Table size={isMobile ? 'small' : 'medium'}>
                            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sellerOrdersData?.orders && sellerOrdersData.orders.length > 0 ? (
                                    sellerOrdersData.orders.map((order) => {
                                        const isOrderObject = typeof order !== 'string' && order !== null && typeof order === 'object';
                                        const orderId = isOrderObject ? (order._id || order.id) : order;
                                        const orderDetails = orderDetailsMap[orderId];

                                        return (
                                            <TableRow key={orderId}>
                                                <TableCell>{orderId}</TableCell>
                                                <TableCell>
                                                    {isOrderObject && order.createdAt ? new Date(order.createdAt).toLocaleDateString() :
                                                        isOrderObject && order.created_at ? new Date(order.created_at).toLocaleDateString() :
                                                            orderDetails?.createdAt ? new Date(orderDetails.createdAt).toLocaleDateString() :
                                                                orderDetails?.created_at ? new Date(orderDetails.created_at).toLocaleDateString() :
                                                                    'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={isOrderObject ? (order.status || 'Unknown') :
                                                            orderDetails ? (orderDetails.status || 'Unknown') : 'Unknown'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: getStatusColor(isOrderObject ? order.status :
                                                                orderDetails?.status || 'pending'),
                                                            color: "white"
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                        onClick={() => handleViewOrderDetails(orderId)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No orders found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            case "customers":
                return <CustomerList sellerId={sellerId} />;
            case "revenue":
                return <RevenueOverview sellerOrders={sellerOrdersData?.orders} />;
            default:
                return <Typography>Select a tab</Typography>;
        }
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfileOpen = () => {
        setProfileOpen(true);
        handleProfileMenuClose();
    };

    const handleProfileClose = () => {
        setProfileOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        navigate('/login'); // Redirect to login page
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleProfileMenuClose}
        >
            <MenuItem onClick={handleProfileOpen}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Box sx={{ p: 2, backgroundColor: "#1e4c75", color: "white", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">BlueMedix Seller Dashboard</Typography>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                >
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <AccountCircle />
                    </Avatar>
                </IconButton>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 3, flexGrow: 1 }}>
                <Paper sx={{ borderRadius: 1, overflow: "hidden" }}>
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
                        <Tab label="Customers" value="customers" />
                        <Tab label="Revenue" value="revenue" />
                    </Tabs>

                    <Box sx={{ p: isMobile ? 2 : 3 }}>{renderContent()}</Box>
                </Paper>
            </Container>

            {renderMenu}

            {/* Order Details Dialog */}
            <OrderDetails
                open={orderDetailsOpen}
                onClose={handleCloseOrderDetails}
                orderDetails={orderDetails?.order}
                loading={orderDetailsLoading}
                error={orderDetailsError}
                selectedOrderId={selectedOrderId}
                updateStatusLoading={updateStatusLoading}
                handleUpdateStatus={handleUpdateStatus}
                getStatusColor={getStatusColor}
            />

            {/* Profile Dialog */}
            <Profile open={profileOpen} onClose={handleProfileClose} userData={meData?.user} loading={!meData} error={meData?.error} />
        </Box>
    );
}

export default SellerDashboard;