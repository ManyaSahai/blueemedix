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
    Button,
    Tooltip,
    IconButton
} from '@mui/material';
import {
    Person,
    Email,
    LocationOn,
    CheckCircle,
    Cancel,
    HourglassEmpty,
    ArrowUpward,
    ArrowDownward,
    Done,
    Close
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';

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

const RegionalAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPageData, setCurrentPageData] = useState([]);

    const fetchAdmins = useCallback(async (currentPage, perPage, sortField, order) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/superAdmin/regional-admins?page=${currentPage + 1}&limit=${perPage}&sortBy=${sortField}&order=${order}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch admins');
            }

            const data = await response.json();
            if (data.success) {
                setAdmins(data.admins);
                setTotalAdmins(data.count);
            } else {
                throw new Error('Failed to fetch admins: Invalid response format');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdmins(page, rowsPerPage, sortBy, sortOrder);
    }, [fetchAdmins, page, rowsPerPage, sortBy, sortOrder]);

    useEffect(() => {
        // Calculate the data for the current page
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        const currentData = admins.slice(start, end);
        setCurrentPageData(currentData);
    }, [admins, page, rowsPerPage]);

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

    const handleApprove = async (adminId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/superAdmin/regional-admins/${adminId}/approve`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to approve admin');
            }

            // Update the admin's status in the local state
            setAdmins(prevAdmins =>
                prevAdmins.map(admin =>
                    admin.id === adminId ? { ...admin, Verification: 'approved' } : admin
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleReject = async (adminId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/superAdmin/regional-admins/${adminId}/decline`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reject admin');
            }

            // Update the admin's status in the local state
            setAdmins(prevAdmins =>
                prevAdmins.map(admin =>
                    admin.id === adminId ? { ...admin, Verification: 'rejected' } : admin
                )
            );
        } catch (err) {
            setError(err.message);
        }
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
                Error fetching admins: {error}
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
                                <IconButton onClick={() => handleSort('email')} size="small">
                                    {getSortIcon('email')}
                                </IconButton>
                            </Box>
                        </StyledTableHeadCell>
                        <StyledTableHeadCell>Region</StyledTableHeadCell>
                        <StyledTableHeadCell>Verification Status</StyledTableHeadCell>
                        <StyledTableHeadCell>Sellers Count</StyledTableHeadCell>
                        <StyledTableHeadCell>Actions</StyledTableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentPageData.map((admin, index) => {
                        const verification = getVerificationColor(admin.Verification);
                        return (
                            <TableRow key={admin.id}>
                                <StyledTableCell>{(page * rowsPerPage) + index + 1}</StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Person fontSize="small" color="primary" />
                                        <Typography>{admin.name}</Typography>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Email fontSize="small" color="secondary" />
                                        <Typography>{admin.email}</Typography>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LocationOn fontSize="small" color="info" />
                                        <Typography>{admin.region}</Typography>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Tooltip title={admin.Verification || "Not Verified"}>
                                        <Chip
                                            icon={<verification.icon color="inherit" fontSize="small" />}
                                            label={admin.Verification || "Not Verified"}
                                            color={verification.color}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Tooltip>
                                </StyledTableCell>
                                <StyledTableCell>{admin.sellers_count}</StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" gap={1}>
                                        <Tooltip title="Approve">
                                            <IconButton
                                                size="small"
                                                color="success"
                                                onClick={() => handleApprove(admin.id)}
                                                disabled={admin.Verification?.toLowerCase() === 'approved'}
                                            >
                                                <Done fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reject">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleReject(admin.id)}
                                                disabled={admin.Verification?.toLowerCase() === 'rejected' || admin.Verification?.toLowerCase() === 'approved'}

                                            >
                                                <Close fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </StyledTableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={totalAdmins}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20, 50]}
            />
        </StyledPaper>
    );
};

export default RegionalAdmins;
