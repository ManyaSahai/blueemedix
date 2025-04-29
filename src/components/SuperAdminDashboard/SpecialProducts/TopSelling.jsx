import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Container,
    CircularProgress,
    Paper,
    Box,
} from '@mui/material';


const TopSellingProducts = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopSellingProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/analytics/top/top-products');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // **Important:** Parse the response as JSON
                const text = await response.text();
                try {
                    const data = JSON.parse(text);
                    setTopProducts(data);
                } catch (parseError) {
                    // Handle the case where the response is not valid JSON
                    setError(new Error(`Error parsing JSON: ${parseError.message}.  Server response was: ${text}`));
                    setLoading(false);
                    return; // Exit the function to prevent further errors
                }

            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopSellingProducts();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error">
                    {error.message}
                </Typography>
            </Paper>
        );
    }

    if (!topProducts || topProducts.length === 0) {
        return (
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography>No top selling products available.</Typography>
            </Paper>
        );
    }

    const cardWidth = 300;

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>Top Selling Products</Typography>
            <Grid container spacing={3} sx={{ width: '100%', margin: '0 auto' }}>
                {topProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.productId} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Card
                            sx={{
                                width: cardWidth,
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
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 2,
                                    borderBottom: '1px solid #eee',
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    alt={product.productDetails?.name || "Product"}
                                    image={product.productDetails?.image_link || "default-image.jpg"}
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
                                    {product.productDetails?.name || "Product Name"}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 600,
                                        color: 'primary.main',
                                        mt: 'auto',
                                    }}
                                >
                                    ₹ {product.productDetails?.price?. $numberDecimal ?? "0.00"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default TopSellingProducts;
