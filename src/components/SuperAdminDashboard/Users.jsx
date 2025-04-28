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
    LocationOn,
    ArrowUpward,
    ArrowDownward
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCustomers, setTotalCustomers] = useState(0);
      const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPageData, setCurrentPageData] = useState([]);

    const fetchCustomers = useCallback(async (currentPage, perPage, sortField, order) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token'); // Assuming you have a token
            const response = await fetch(
                `http://localhost:5000/api/superAdmin/customers?page=${currentPage + 1}&limit=${perPage}&sortBy=${sortField}&order=${order}`,
                {
                    headers: {
                        Authorization: `${token}`, // Include the token
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch customers');
            }

            const data = await response.json();
            if (data.success) {
                setCustomers(data.users);
                setTotalCustomers(data.count);
            } else {
                throw new Error('Failed to fetch customers: Invalid response format');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers(page, rowsPerPage, sortBy, sortOrder);
    }, [fetchCustomers, page, rowsPerPage, sortBy, sortOrder]);

      useEffect(() => {
        // Calculate the data for the current page
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        const currentData = customers.slice(start, end);
        setCurrentPageData(currentData);
    }, [customers, page, rowsPerPage]);

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
                Error fetching customers: {error}
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
                        <StyledTableHeadCell>Phone</StyledTableHeadCell>
                        <StyledTableHeadCell>Pincode</StyledTableHeadCell>
                        <StyledTableHeadCell>Region</StyledTableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentPageData.map((customer, index) => (
                        <TableRow key={customer._id}>
                            <StyledTableCell>{(page * rowsPerPage) + index + 1}</StyledTableCell>
                            <StyledTableCell>
                                 <Box display="flex" alignItems="center" gap={1}>
                                        <Person fontSize="small" color="primary" />
                                        <Typography>{customer.name}</Typography>
                                    </Box>
                            </StyledTableCell>
                            <StyledTableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                        <Email fontSize="small" color="secondary" />
                                         <Typography>{customer.e_mail}</Typography>
                                    </Box>
                            </StyledTableCell>
                            <StyledTableCell>
                                 <Box display="flex" alignItems="center" gap={1}>
                                        <Phone fontSize="small" color="info" />
                                        <Typography>{customer.phone_no}</Typography>
                                    </Box>
                            </StyledTableCell>
                            <StyledTableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <LocationOn fontSize="small" color="warning"/>
                                    <Typography>{customer.address?.pin_code || 'N/A'}</Typography>
                                </Box>

                            </StyledTableCell>
                            <StyledTableCell>{customer.region}</StyledTableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={totalCustomers}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20, 50]}
            />
        </StyledPaper>
    );
};

export default Customers;
