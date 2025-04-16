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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useState, useEffect, useRef } from "react";
import {
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../redux/productApi.js";
import EditProductModal from "./EditProductModal";
import { FixedSizeGrid as GridVirtual } from "react-window";
import AddProductForm from "./AddProductForm.jsx";
import debounce from "lodash/debounce";

const CARD_WIDTH = 350;
const CARD_HEIGHT = 380;
const GAP = 16;

export default function Products() {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const containerRef = useRef(null);
  const [columnCount, setColumnCount] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

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
    console.log("Updating product:", updatedProduct);
    try {
      await updateProduct(updatedProduct);
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Update filteredProducts based on search input
  useEffect(() => {
    if (!products) return;

    const debouncedFilter = debounce(() => {
      if (!searchInput.trim()) {
        setFilteredProducts(products);
      } else {
        const lower = searchInput.toLowerCase();
        const filtered = products.filter((p) =>
          p.name?.toLowerCase().includes(lower)
        );
        setFilteredProducts(filtered);
      }
    }, 300);

    debouncedFilter();

    return () => {
      debouncedFilter.cancel();
    };
  }, [searchInput, products]);

  useEffect(() => {
    const updateColumnCount = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setColumnCount(
          Math.max(1, Math.floor((width + GAP) / (CARD_WIDTH + GAP)))
        );
      }
    };

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Error loading products</div>;
  if (!products || products.length === 0) return <div>No products available.</div>;

  const rowCount = Math.ceil(filteredProducts.length / columnCount);

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= filteredProducts.length) return null;
    const product = filteredProducts[index];
    const productId = product.id;

    return (
      <Box
        style={style}
        px={2}
        py={1}
        sx={{ overflowX: "hidden", display: "flex" }}
      >
        <Card
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <CardMedia
            component="img"
            alt={product.name}
            height="140"
            image={product.image_link || "default-image.jpg"}
            sx={{ objectFit: "contain" }}
          />

          <CardContent>
            <Typography variant="h6" gutterBottom>
              {product.name?.length > 50
                ? product.name.slice(0, 50) + "..."
                : product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${product.price?.$numberDecimal ?? "0.00"}
            </Typography>
          </CardContent>

          <CardActions sx={{ justifyContent: "flex-end", marginTop: "-16px" }}>
            <IconButton color="primary" onClick={() => handleEditClick(product)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleDeleteClick(productId)}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Box>
    );
  };

  return (
    <Box p={3} ref={containerRef} sx={{ overflowX: "hidden" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Product List</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search product..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddProductClick}>
            Add Product
          </Button>
          <Button variant="outlined" startIcon={<UploadFileIcon />}>
            Import in Bulk
          </Button>
        </Box>
      </Box>

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

      {filteredProducts.length === 0 ? (
        <Typography>No products found.</Typography>
      ) : (
        <GridVirtual
          columnCount={columnCount}
          columnWidth={CARD_WIDTH}
          height={600}
          rowCount={rowCount}
          rowHeight={CARD_HEIGHT}
          width={containerRef.current ? containerRef.current.offsetWidth : 0}
        >
          {Cell}
        </GridVirtual>
      )}

      {selectedProduct && (
        <EditProductModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          product={selectedProduct}
          onSave={handleSave}
        />
      )}
    </Box>
  );
}
