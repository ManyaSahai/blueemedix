import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useState, useEffect } from "react";

export default function EditProductModal({ open, onClose, product, onSave }) {
  const [form, setForm] = useState(product || {});

  // Log the product being passed to the modal
  useEffect(() => {
    console.log('Product in modal:', product);
    if (product) setForm(product);  // Update form data whenever the product prop changes
  }, [product]);

  const handleChange = (e) => {
    console.log("Form change:", e.target.name, e.target.value);  // Log every change to the form
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    console.log("Saving product:", form);  // Log the form data before saving
    if (form._id) {
      onSave(form);  // Pass the entire updated product object to onSave
    }
    onClose();  // Close the modal
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="name"
          label="Name"
          fullWidth
          value={form.name || ""}  // Make sure form.name is a string
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="price"
          label="Price"
          type="number"
          fullWidth
          value={form.price?.$numberDecimal || form.price || ""}  // Ensure form.price is a number or a string
          onChange={handleChange}
        />
        {/* Add more fields if needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}


