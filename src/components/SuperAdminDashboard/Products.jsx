import {
    Box,
    CircularProgress,
    Card,
    CardContent,
    Typography,
    IconButton,
    Button,
    CardActions,
    CardMedia,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Pagination,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Grid,
    Paper,
    Container,
    Stack,
    Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from "react";
import {
    useGetProductsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
} from "../../redux/productApi.js";
import EditProductModal from "./EditProductModal";
import AddProductForm from "./AddProductForm.jsx";
import debounce from "lodash/debounce";

export default function Products() {
    const { data: products, isLoading, isError } = useGetProductsQuery();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openAddProductModal, setOpenAddProductModal] = useState(false);

    // Search and filtering
    const [searchInput, setSearchInput] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Sorting state
    const [sortBy, setSortBy] = useState('');

    // Pagination state
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [currentProducts, setCurrentProducts] = useState([]);

    const handleAddProductClick = () => {
        setOpenAddProductModal(true);
    };

    const handleCloseAddProductModal = () => {
        setOpenAddProductModal(false);
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setOpenModal(true);
    };

    const handleDeleteClick = async (productId) => {
        if (!productId) {
            console.error("Product ID is required");
            return;
        }

        try {
            await deleteProduct({ productId });
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleSave = async (updatedProduct) => {
        try {
            await updateProduct(updatedProduct);
            setOpenModal(false);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(event.target.value);
        setPage(1); // Reset to first page when changing items per page
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    // Update filteredProducts based on search input and sorting
    useEffect(() => {
        if (!products) return;

        let intermediateProducts = [...products];

        // Apply search filter
        if (searchInput.trim()) {
            const lower = searchInput.toLowerCase();
            intermediateProducts = intermediateProducts.filter((p) =>
                p.name?.toLowerCase().includes(lower)
            );
        }

        // Apply sorting
        if (sortBy === 'name-asc') {
            intermediateProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        } else if (sortBy === 'name-desc') {
            intermediateProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        }

        setFilteredProducts(intermediateProducts);
        setPage(1); // Reset to first page when search or sort changes

    }, [searchInput, products, sortBy]);

    // Update pagination data
    useEffect(() => {
        if (filteredProducts?.length) {
            setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));

            // Get current page products
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            setCurrentProducts(filteredProducts.slice(startIndex, endIndex));
        } else {
            setCurrentProducts([]);
            setTotalPages(1);
        }
    }, [filteredProducts, page, itemsPerPage]);

    // Consistent container for all states
    const renderContent = () => {
        if (isLoading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (isError) {
            return (
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="error">Error loading products. Please try again later.</Typography>
                </Paper>
            );
        }

        if (!products || products.length === 0) {
            return (
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>No products available.</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddProductClick}
                        sx={{ mt: 2 }}
                    >
                        Add Your First Product
                    </Button>
                </Paper>
            );
        }

        if (filteredProducts.length === 0) {
            return (
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>No products found matching your search.</Typography>
                </Paper>
            );
        }

        // Define a fixed width for the cards
        const cardWidth = 300; // Adjust this value as needed

        return (
            <Grid container spacing={3} sx={{ width: '100%', margin: '0 auto' }}>
                {currentProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Card
                            sx={{
                                width: cardWidth, // Apply the fixed width
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                },
                                borderRadius: '4px',
                                overflow: 'hidden',
                                position: 'relative',
                                maxWidth: '100%',
                            }}
                        >
                            <Box
                                sx={{
                                    height: 180,
                                    backgroundColor: '#f9f9f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 2,
                                    borderBottom: '1px solid #eee',
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    alt={product.name}
                                    image={product.image_link || "default-image.jpg"}
                                    sx={{
                                        height: '100%',
                                        width: 'auto',
                                        maxHeight: '100%',
                                        maxWidth: '100%',
                                        objectFit: "contain",
                                    }}
                                />
                            </Box>

                            <CardContent
                                sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 2,
                                    pb: 1,
                                }}
                            >
                                <Tooltip title={product.name || "Untitled Product"}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 500,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            lineHeight: 1.3,
                                            minHeight: '3.9em',
                                            maxHeight: '3.9em',
                                            mb: 1.5,
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {product.name || "Untitled Product"}
                                    </Typography>
                                </Tooltip>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 600,
                                        color: 'primary.main',
                                        mt: 'auto',
                                    }}
                                >
                                    ${product.price?.$numberDecimal ?? "0.00"}
                                </Typography>
                            </CardContent>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                p: 1,
                                borderTop: '1px solid #eee'
                            }}>
                                <IconButton
                                    color="primary"
                                    onClick={() => handleEditClick(product)}
                                    size="small"
                                    sx={{ mr: 1 }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeleteClick(product.id)}
                                    size="small"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} flexWrap="wrap">
                    <Typography variant="h5">Product List</Typography>
                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                        <TextField
                            size="small"
                            variant="outlined"
                            placeholder="Search product..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                            }}
                        />
                        <FormControl size="small">
                            <InputLabel id="sort-by-label">Sort By</InputLabel>
                            <Select
                                labelId="sort-by-label"
                                id="sort-by"
                                value={sortBy}
                                label="Sort By"
                                onChange={handleSortChange}
                                sx={{ minWidth: 120 }}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                                <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddProductClick}
                        >
                            Add Product
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<UploadFileIcon />}
                        >
                            Import in Bulk
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {renderContent()}

            {/* Pagination Controls */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 4,
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel id="items-per-page-label">Items per page</InputLabel>
                    <Select
                        labelId="items-per-page-label"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        label="Items per page"
                    >
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={24}>24</MenuItem>
                        <MenuItem value={48}>48</MenuItem>
                        <MenuItem value={96}>96</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" mr={2}>
                        Showing {Math.min((page - 1) * itemsPerPage + 1, filteredProducts.length)} - {Math.min(page * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                    </Typography>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            </Box>

            {/* Add Product Modal */}
            <Dialog
                open={openAddProductModal}
                onClose={handleCloseAddProductModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <AddProductForm onClose={handleCloseAddProductModal} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddProductModal} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Product Modal */}
            {selectedProduct && (
                <EditProductModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    product={selectedProduct}
                    onSave={handleSave}
                />
            )}
        </Container>
    );
}