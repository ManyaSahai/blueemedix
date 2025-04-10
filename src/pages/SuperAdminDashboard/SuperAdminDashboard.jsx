import Header from "../../components/SuperAdminDashboard/Header";
import { useGetProductsQuery } from "../../redux/productApi";
import { CircularProgress, Grid, Card, CardContent, Typography } from '@mui/material';

export default function SuperAdminDashboard(){
    const { data: products, isLoading, isError } = useGetProductsQuery();
    if (isLoading) return <CircularProgress />;
    if (isError) return <div>Error loading products</div>;
    return(
        <main>
            <Header/>
            <Grid container spacing={2}>
            {products?.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card>
                    <CardContent>
                    <Typography variant="h6">{product.title}</Typography>
                    <Typography variant="body2">${product.price}</Typography>
                    </CardContent>
                </Card>
                </Grid>
            ))}
            </Grid>
        </main>
    );
}