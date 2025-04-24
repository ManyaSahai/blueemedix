// PlaceOrderModal.js
import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Modal,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Button,
    TextField,
    IconButton,
    Pagination,
    Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

function PlaceOrderModal({
    open,
    onClose,
    selectedCustomer,
    setSnackbarMessage,
    setSnackbarOpen,
}) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [prescriptionImage, setPrescriptionImage] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [upiId, setUpiId] = useState("");
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [categoryError, setCategoryError] = useState(null);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState(null);
    const [cartError, setCartError] = useState(null);
    const [productsPage, setProductsPage] = useState(1);
    const [productsPerPage] = useState(5);
    const totalProductsPages = Math.ceil(products.length / productsPerPage);
    const indexOfLastProduct = productsPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    useEffect(() => {
        const fetchCategories = async () => {
            setCategoryLoading(true);
            setCategoryError(null);
            try {
                const response = await fetch("http://localhost:5000/api/products/cat", {
                    headers: {
                        Authorization: localStorage.getItem("authToken") || "",
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch categories");
                }
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setCategoryError(err.message);
            } finally {
                setCategoryLoading(false);
            }
        };

        if (open && categories.length === 0 && !categoryLoading && !categoryError) {
            fetchCategories();
        }
    }, [open, categories.length, categoryLoading, categoryError]);

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            if (selectedCategory) {
                setProductsLoading(true);
                setProductsError(null);
                setProductsPage(1);
                try {
                    const response = await fetch(
                        `http://localhost:5000/api/products/category/${selectedCategory}`,
                        {
                            headers: {
                                Authorization: localStorage.getItem("authToken") || "",
                            },
                        }
                    );
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Failed to fetch products");
                    }
                    const data = await response.json();
                    setProducts(data);
                } catch (err) {
                    setProductsError(err.message);
                } finally {
                    setProductsLoading(false);
                }
            } else {
                setProducts([]);
            }
        };

        fetchProductsByCategory();
    }, [selectedCategory]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleAddToCart = async (product) => {
        if (!selectedCustomer) {
            setCartError("No customer selected.");
            return;
        }
        setCartError(null);
        try {
            const response = await fetch(`http://localhost:5000/api/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // 'Authorization': localStorage.getItem('authToken') || '',
                },
                body: JSON.stringify({
                    userId: selectedCustomer._id,
                    productId: product._id,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add to cart");
            }
            const data = await response.json();
            if (data.success) {
                setCart(
                    data.cart
                        .map((item) => {
                            const foundProduct = products.find((p) => p._id === item.product);
                            if (foundProduct) {
                                const { quantity: productQuantity, ...otherProductDetails } =
                                    foundProduct;
                                return {
                                    productId: item.product,
                                    quantity: item.quantity,
                                    ...otherProductDetails,
                                };
                            }
                            return {
                                productId: item.product,
                                quantity: item.quantity,
                            };
                        })
                        .filter((item) => item.productId)
                );
                setSnackbarMessage(data.message || "Item added to cart");
                setSnackbarOpen(true);
            } else {
                setCartError(data.message || "Failed to add to cart");
            }
        } catch (err) {
            setCartError(err.message);
        }
    };

    const handleDeleteCartItem = async (productId) => {
        if (!selectedCustomer) {
            setCartError("No customer selected.");
            return;
        }
        setCartError(null);
        try {
            const response = await fetch(
                `http://localhost:5000/api/cart/${selectedCustomer._id}/${productId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: localStorage.getItem("authToken") || "",
                    },
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete from cart");
            }
            const data = await response.json();
            if (data.message === "Item removed from cart") {
                setCart((prevCart) =>
                    prevCart.filter((item) => item.productId !== productId)
                );
                setSnackbarMessage(data.message);
                setSnackbarOpen(true);
            } else {
                setCartError(data.message || "Failed to delete from cart");
            }
        } catch (err) {
            setCartError(err.message);
        }
    };

    const handleUpdateCartItemQuantity = async (productId, quantityChange) => {
        if (!selectedCustomer) {
            setCartError("No customer selected.");
            return;
        }
        setCartError(null);
        try {
            const response = await fetch(
                `http://localhost:5000/api/cart/${selectedCustomer._id}/${productId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("authToken") || "",
                    },
                    body: JSON.stringify({ quantityChange }),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update cart");
            }
            const data = await response.json();
            if (data.success) {
                setCart((prevCart) =>
                    prevCart.map((item) =>
                        item.productId === productId
                            ? { ...item, quantity: data.item.quantity }
                            : item
                    )
                );
                setSnackbarMessage(data.message || "Cart updated");
                setSnackbarOpen(true);
            } else {
                setCartError(data.message || "Failed to update cart");
            }
        } catch (err) {
            setCartError(err.message);
        }
    };

    const handleIncrementQuantity = (productId) => {
        handleUpdateCartItemQuantity(productId, 1);
    };

    const handleDecrementQuantity = (productId) => {
        const cartItem = cart.find((item) => item.productId === productId);
        if (cartItem && cartItem.quantity > 1) {
            handleUpdateCartItemQuantity(productId, -1);
        }
    };

    const handleProductsPageChange = (event, value) => {
        setProductsPage(value);
    };

    const handlePrescriptionChange = (event) => {
      setPrescriptionImage(event.target.files[0]);
    };

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleUpiIdChange = (event) => {
        setUpiId(event.target.value);
    };

    const handlePlaceOrder = async () => {
      if (!selectedCustomer) {
        setCartError("No customer selected.");
        return;
      }
      if (cart.length === 0) {
        setCartError("Your cart is empty.");
        return;
      }
    
      const productsForOrder = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
    
      const formData = new FormData();
      formData.append('userId', selectedCustomer._id);
      formData.append('products', JSON.stringify(productsForOrder));
      formData.append('payment_method', paymentMethod);
      formData.append('upi_id', paymentMethod === "upi" ? upiId : '');
    
      // Append the prescription image ONLY if a file has been selected
      if (prescriptionImage) {
        formData.append('prescription_image', prescriptionImage);
      }
    
      try {
        const response = await fetch("http://localhost:5000/api/orders/create", {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("authToken") || "",
          },
          body: formData,
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error placing order:", errorData); // Log the error details
          throw new Error(errorData.message || "Failed to place order");
        }
    
        const orderData = await response.json();
        if (orderData.success) {
          setSnackbarMessage(orderData.message || "Order placed successfully!");
          setSnackbarOpen(true);
          onClose();
          setCart([]);
          setSelectedCategory("");
          setProducts([]);
          setPrescriptionImage(null);
          setPaymentMethod("upi");
          setUpiId("");
          setProductsPage(1);
        } else {
          setCartError(orderData.message || "Failed to place order.");
        }
      } catch (error) {
        setCartError(error.message);
      }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="place-order-modal-title"
            aria-describedby="place-order-modal-description"
        >
            <Box sx={style}>
                <Typography
                    id="place-order-modal-title"
                    variant="h6"
                    component="h2"
                    gutterBottom
                >
                    Place Order for {selectedCustomer?.name}
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="category-select-label">Select Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={selectedCategory}
                        label="Select Category"
                        onChange={handleCategoryChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {categoryLoading && (
                            <MenuItem disabled>Loading categories...</MenuItem>
                        )}
                        {categoryError && (
                            <MenuItem disabled error>{`Error: ${categoryError}`}</MenuItem>
                        )}
                        {categories.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Products in Selected Category
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell>Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productsLoading && (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            )}
                            {productsError && (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" error>
                                        {`Error: ${productsError}`}
                                    </TableCell>
                                </TableRow>
                            )}
                            {currentProducts.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>
                                        Rs {product.price?.$numberDecimal || product.price}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products.length === 0 &&
                                !productsLoading &&
                                !productsError && (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            No products in this category.
                                        </TableCell>
                                    </TableRow>
                                )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {products.length > 0 && (
                    <Pagination
                        count={totalProductsPages}
                        page={productsPage}
                        onChange={handleProductsPageChange}
                        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                    />
                )}

                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Shopping Cart
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell>Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cartError && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" error>
                                        {`Error: ${cartError}`}
                                    </TableCell>
                                </TableRow>
                            )}
                            {cart.map((item) => (
                                <TableRow key={item.productId}>
                                    <TableCell>{item?.name}</TableCell>
                                    <TableCell>
                                        Rs {item?.price?.$numberDecimal || item?.price}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleDecrementQuantity(item.productId)
                                                }
                                                disabled={item.quantity <= 1}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <TextField
                                                sx={{ width: '50px', mx: 1 }}
                                                size="small"
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const newQuantity = parseInt(e.target.value, 10);
                                                    if (!isNaN(newQuantity) && newQuantity > 0) {
                                                        const quantityDifference = newQuantity - item.quantity;
                                                        handleUpdateCartItemQuantity(item.productId, quantityDifference);
                                                    } else if (newQuantity <= 0) {
                                                        handleDeleteCartItem(item.productId);
                                                    }
                                                }}
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleIncrementQuantity(item.productId)
                                                }
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteCartItem(item.productId)}
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {cart.length === 0 && !cartError && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        Cart is empty.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="prescription-upload">
                        Upload Prescription (Optional)
                    </InputLabel>
                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="prescription-upload"
                        type="file"
                        onChange={handlePrescriptionChange}
                    />
                    <TextField
                        fullWidth
                        label="Uploaded Prescription"
                        value={prescriptionImage ? prescriptionImage.name : ""}
                        InputProps={{
                            readOnly: true,
                        }}
                        onClick={() =>
                            document.getElementById("prescription-upload").click()
                        }
                        helperText="Click to upload prescription image"
                    />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="payment-method-label">Payment Method</InputLabel>
                    <Select
                        labelId="payment-method-label"
                        id="payment-method"
                        value={paymentMethod}
                        label="Payment Method"
                        onChange={handlePaymentMethodChange}
                    >
                        <MenuItem value="upi">UPI</MenuItem>
                        {/* Add other payment methods if needed */}
                    </Select>
                </FormControl>

                {paymentMethod === "upi" && (
                    <TextField
                        fullWidth
                        label="UPI ID"
                        value={upiId}
                        onChange={handleUpiIdChange}
                        sx={{ mb: 2 }}
                    />
                )}

                <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                    <Button onClick={onClose} sx={{ mr: 2 }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePlaceOrder}
                        disabled={cart.length === 0}
                    >
                        Place Order
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default PlaceOrderModal;