import {
    Box,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
    Button,
    CardActions,
  } from "@mui/material";
  import EditIcon from "@mui/icons-material/Edit";
  import DeleteIcon from "@mui/icons-material/Delete";
  import AddIcon from "@mui/icons-material/Add";
  import UploadFileIcon from "@mui/icons-material/UploadFile";
  import { useGetProductsQuery } from "../../redux/productApi.js";
  
  export default function Products() {
    const { data: products, isLoading, isError } = useGetProductsQuery();
  
    if (isLoading) return <CircularProgress />;
    if (isError) return <div>Error loading products</div>;
  
    return (
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Product List</Typography>
          <Box display="flex" gap={2}>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add Product
            </Button>
            <Button variant="outlined" startIcon={<UploadFileIcon />}>
              Import in Bulk
            </Button>
          </Box>
        </Box>
  
        <Grid container spacing={3}>
          {products?.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${product.price}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <IconButton color="primary" title="Edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" title="Delete">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
  