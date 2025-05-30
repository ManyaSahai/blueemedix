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
    Chip,
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    LocationOn,
    Pin,
    CheckCircle,
    Cancel,
    HourglassEmpty,
    ArrowUpward, // For sorting
    ArrowDownward,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';

// Styled Components for better UI
const StyledPaper = styled(Paper)(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Add shadow for depth
    paddingLeft: theme.spacing(2), // Add left padding
    paddingRight: theme.spacing(2), // Add right padding
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

const getVerificationColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'approved':
            return { color: 'success', icon: CheckCircle };
        case 'pending':
            return { color: 'warning', icon: HourglassEmpty };
        case 'rejected':
            return { color: 'error', icon: Cancel };
        default:
            return { color: 'default', icon: HourglassEmpty };
    }
};

const Sellers = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalSellers, setTotalSellers] = useState(0);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPageData, setCurrentPageData] = useState([]); // Add this line

    const fetchSellers = useCallback(async (currentPage, perPage, sortField, order) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/superAdmin/sellers?page=${currentPage + 1}&limit=${perPage}&sortBy=${sortField}&order=${order}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch sellers');
            }

            const data = await response.json();
            if (data.success) {
                setSellers(data.sellers);
                setTotalSellers(data.count);
            } else {
                throw new Error('Failed to fetch sellers: Invalid response format');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSellers(page, rowsPerPage, sortBy, sortOrder);
    }, [fetchSellers, page, rowsPerPage, sortBy, sortOrder]);

      useEffect(() => {
        // Calculate the data for the current page
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        const currentData = sellers.slice(start, end);
        setCurrentPageData(currentData);
    }, [sellers, page, rowsPerPage]);

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
                Error fetching sellers: {error}
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
                                Name
                                <IconButton onClick={() => handleSort('name')} size="small">
                                    {getSortIcon('name')}
                                </IconButton>
                            </Box>
                        </StyledTableHeadCell>
                        <StyledTableHeadCell>
                            <Box display="flex" alignItems="center" gap={1}>
                                Email
                                <IconButton onClick={() => handleSort('e_mail')} size="small">
                                    {getSortIcon('e_mail')}
                                </IconButton>
                            </Box>
                        </StyledTableHeadCell>
                        <StyledTableHeadCell>
                            <Box display="flex" alignItems="center" gap={1}>
                                Phone
                                <IconButton onClick={() => handleSort('phone_no')} size="small">
                                    {getSortIcon('phone_no')}
                                </IconButton>
                            </Box>
                        </StyledTableHeadCell>
                        <StyledTableHeadCell>
                            <Box display="flex" alignItems="center" gap={1}>
                                Region
                                <IconButton onClick={() => handleSort('region')} size="small">
                                    {getSortIcon('region')}
                                </IconButton>
                            </Box>
                        </StyledTableHeadCell>
                        <StyledTableHeadCell>
                            <Box display="flex" alignItems="center" gap={1}>
                                Pincode
                                <IconButton onClick={() => handleSort('address.pin_code')} size="small">
                                    {getSortIcon('address.pin_code')}
                                </IconButton>
                            </Box>
                        </StyledTableHeadCell>
                        <StyledTableHeadCell>Verification Status</StyledTableHeadCell>
                        <StyledTableHeadCell>Registered On</StyledTableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentPageData.map((seller, index) => {
                        const verification = getVerificationColor(seller.verification_status);
                        return (
                            <TableRow key={seller._id}>
                                <StyledTableCell>{(page * rowsPerPage) + index + 1}</StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Person fontSize="small" color="primary" />
                                        <Typography>{seller.name}</Typography>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Email fontSize="small" color="secondary" />
                                        <Typography>{seller.e_mail}</Typography>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Phone fontSize="small" color="action" />
                                        <Typography>{seller.phone_no}</Typography>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LocationOn fontSize="small" color="info" />
                                        <Typography>{seller.region}</Typography>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Pin fontSize="small" color="warning" />
                                        <Typography>{seller.address?.pin_code}</Typography>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Tooltip title={seller.verification_status || "Not Verified"}>
                                        <Chip
                                            icon={<verification.icon color="inherit" fontSize="small" />}
                                            label={seller.verification_status || "Not Verified"}
                                            color={verification.color}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Tooltip>
                                </StyledTableCell>
                                <StyledTableCell>
                                    {format(new Date(seller.created_at), 'PPPppp')}
                                </StyledTableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={totalSellers}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20, 50]}
            />
        </StyledPaper>
    );
};

export default Sellers;
