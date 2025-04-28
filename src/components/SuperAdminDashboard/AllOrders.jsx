import React, { useState, useEffect, useCallback } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    CircularProgress,
    Typography,
    Alert,
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    ShoppingCart,
    CheckCircle,
    Cancel,
    HourglassEmpty,
    ArrowUpward,
    ArrowDownward,
    CalendarMonth
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format, isValid } from 'date-fns';

const StyledPaper = styled(Paper)(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1.5),
    fontSize: '0.9rem',
    borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1.5),
    fontWeight: 'bold',
    fontSize: '1rem',
    backgroundColor: '#f5f5f5',
    color: '#333',
    borderBottom: '2px solid #ccc',
}));

const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending':
            return <HourglassEmpty color="warning" fontSize="small" />;
        case 'shipped':
            return <ShoppingCart color="info" fontSize="small" />;
        case 'delivered':
            return <CheckCircle color="success" fontSize="small" />;
        case 'cancelled':
        case 'rejected':
            return <Cancel color="error" fontSize="small" />;
        default:
            return <HourglassEmpty color="default" fontSize="small" />;
    }
};

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);
    const [sortBy, setSortBy] = useState('createdAt'); // Default sort by creation date
    const [sortOrder, setSortOrder] = useState('desc'); // Default sort order: descending
    const [currentPageData, setCurrentPageData] = useState([]);

    const fetchOrders = useCallback(async (currentPage, perPage, sortField, order) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token'); // Assuming you have a token
            const response = await fetch(
                `http://localhost:5000/api/orders?page=${currentPage + 1}&limit=${perPage}&sortBy=${sortField}&order=${order}`,
                {
                    headers: {
                        Authorization: `${token}`, // Include the token
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch orders');
            }

            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
                setTotalOrders(data.count);
            } else {
                throw new Error('Failed to fetch orders: Invalid response format');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders(page, rowsPerPage, sortBy, sortOrder);
    }, [fetchOrders, page, rowsPerPage, sortBy, sortOrder]);

    useEffect(() => {
        // Calculate the data for the current page
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        const currentData = orders.slice(start, end);
        setCurrentPageData(currentData);
    }, [orders, page, rowsPerPage]);

    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) {
            return null;
        }
        return sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">
                Error fetching orders: {error}
            </Alert>
        );
    }

    return (
        <StyledPaper>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableHeadCell>S.No</StyledTableHeadCell>
                        <StyledTableHeadCell>
                            <Box display="flex" alignItems="center" gap={1}>
                                Customer Name
                                <IconButton onClick={() => handleSort('customer.name')} size="small">
                                    {getSortIcon('customer.name')}
                                </IconButton>
                            </Box>
                        </StyledTableHeadCell>
                        <StyledTableHeadCell>Customer Email</StyledTableHeadCell>
                        <StyledTableHeadCell>Customer Phone</StyledTableHeadCell>
                        <StyledTableHeadCell>Seller Name</StyledTableHeadCell>
                        <StyledTableHeadCell>
                            <Box display="flex" alignItems="center" gap={1}>
                                Total Amount
                                <IconButton onClick={() => handleSort('totalAmount')} size="small">
                                    {getSortIcon('totalAmount')}
                                </IconButton>
                            </Box>
                        </StyledTableHeadCell>
                        <StyledTableHeadCell>Order Status</StyledTableHeadCell>
                        <StyledTableHeadCell>Payment Status</StyledTableHeadCell>
                        <StyledTableHeadCell>
                            <Box display="flex" alignItems="center" gap={1}>
                                Order Date
                                <IconButton onClick={() => handleSort('createdAt')} size="small">
                                    {getSortIcon('createdAt')}
                                </IconButton>
                            </Box>
                        </StyledTableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentPageData.map((order, index) => {
                        const orderDate = new Date(order.createdAt);
                        const formattedDate = isValid(orderDate)
                            ? format(orderDate, 'dd-MM-yyyy')
                            : 'Invalid Date';

                        return (
                            <TableRow key={order._id}>
                                <StyledTableCell>{(page * rowsPerPage) + index + 1}</StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Person fontSize="small" color="primary" />
                                        <Typography>{order.customer?.name || 'N/A'}</Typography>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Email fontSize="small" color="secondary" />
                                        <Typography>{order.customer?.e_mail || 'N/A'}</Typography>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Phone fontSize="small" color="info" />
                                        <Typography>{order.customer?.phone_no || 'N/A'}</Typography>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell>{order.seller?.name || 'N/A'}</StyledTableCell>
                                <StyledTableCell>{order.totalAmount}</StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {getStatusIcon(order.status)}
                                        <Typography>{order.status}</Typography>
                                    </Box>

                                </StyledTableCell>
                                <StyledTableCell>{order.payment_status}</StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <CalendarMonth fontSize="small" color="action" />
                                        <Typography>{formattedDate}</Typography>
                                    </Box>
                                </StyledTableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={totalOrders}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20, 50]}
            />
        </StyledPaper>
    );
};

export default AllOrders;
