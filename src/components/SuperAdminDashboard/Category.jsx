import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editImageLink, setEditImageLink] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDiscount, setEditDiscount] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/cat');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch categories.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setEditName(category.name);
    setEditImageLink(''); // You might want to fetch the existing image link if available
    setEditDescription(category.description);
    setEditDiscount(''); // Initialize discount
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCategory(null);
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    const updatedCategoryData = {
      name: editName,
      image: editImageLink, // Assuming 'image' is the field name in your backend
      description: editDescription,
      discount: parseInt(editDiscount, 10),
    };

    try {
      const response = await fetch(`http://localhost:5000/api/products/cat/${selectedCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCategoryData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedData = await response.json(); // Assuming the server returns the updated category
      const updatedCategories = categories.map((cat) =>
        cat._id === selectedCategory._id ? updatedData : cat
      );
      setCategories(updatedCategories);
      handleCloseModal();
      alert('Category updated successfully!');
    } catch (err) {
      console.error('Error updating category:', err);
      alert('Failed to update category.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/cat/${categoryId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setCategories(categories.filter((cat) => cat._id !== categoryId));
        alert('Category deleted successfully!');
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Failed to delete category.');
      }
    }
  };

  if (loading) {
    return <Typography variant="h6">Loading categories...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
     <Grid container spacing={2} justifyContent="center">
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={3} lg={3} key={category._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={category.image_link || "https://via.placeholder.com/150"}
                alt={category.name}
                loading="lazy"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {category.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
                <div style={{ marginTop: 16 }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    size="small"
                    onClick={() => handleOpenModal(category)}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    size="small"
                    color="error"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Category
          </Typography>
          {selectedCategory && (
            <Box mt={2}>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="edit-name">Name</InputLabel>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="edit-image-link">Image Link (Optional)</InputLabel>
                <Input
                  id="edit-image-link"
                  value={editImageLink}
                  onChange={(e) => setEditImageLink(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  id="edit-description"
                  label="Description"
                  multiline
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="edit-discount">Discount (1-100)</InputLabel>
                <Input
                  id="edit-discount"
                  type="number"
                  value={editDiscount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value >= 1 && value <= 100) {
                      setEditDiscount(e.target.value);
                    } else if (e.target.value === '') {
                      setEditDiscount('');
                    }
                  }}
                />
                <FormHelperText>Enter a number between 1 and 100.</FormHelperText>
              </FormControl>
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button onClick={handleCloseModal} style={{ marginRight: 8 }}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleEditCategory}>
                  Save
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default CategoryList;