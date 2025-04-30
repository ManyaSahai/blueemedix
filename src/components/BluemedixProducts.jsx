import React, { useEffect, useState } from "react";
import getBaseUrl from "../utils/baseURL"
import axios from "axios";
import { Add, Remove} from "@mui/icons-material";
import { Box, IconButton,Typography, Button } from "@mui/material";

const BluemedixProducts = () => {

  const [topProducts, setTopProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await axios.get(`${getBaseUrl()}/analytics/top/top-products`);
        setTopProducts(res.data);
        console.log(topProducts)
      } catch (error) {
        console.error("Error fetching top products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);
  const handleAddToCart = (productId, quantity) => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role")

    if (!userId && role!=='Customer') {
    alert("Please log in as a customer to add items to your cart.");
    console.log(role)
    window.location.href = '/login'; // Basic JavaScript redirect if no router is readily available
    return;
    }

    fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, productId, quantity }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }
        return response.json();
      })
      .then(() => {
        alert("Product added to cart!");
      })
      .catch((error) => {
        console.error("Failed to add item to cart:", error);
      });
  };

  const handleIncrement = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 1) + 1,
    }));
  };

  const handleDecrement = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]:
        prevQuantities[productId] > 1 ? prevQuantities[productId] - 1 : 1,
    }));
  };

  if (loading) return <p>Loading top products...</p>;
  return (
    <div style={{ maxWidth: false, margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            borderBottom: "3px solid #3949ab",
            paddingBottom: "5px",
            color: "#333",
          }}
        >
          BLUEMEDIX
        </h2>
        <button
          style={{
            backgroundColor: "#3f51b5",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          SEE ALL
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "15px",
        }}
      >
        {topProducts.map((product) => {
  const details = product.productDetails;
  const hasDiscount = details.discount > 0;
  const quantity = quantities[details._id] || 1;
        
  return (
    <div style={{display:"flex", gap:"16px", alignItems:"center", justifyContent:"center"}}>
    <div
      key={product.productId}
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "5px",
        overflow: "hidden",
        backgroundColor: "white",
        position: "relative",
        padding: "15px",
        textAlign: "center",
        width: "350px", // Ensure cards are same width
        margin: "10px",
      }}
    >
      {hasDiscount && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "0",
            backgroundColor: "#4caf50",
            color: "white",
            padding: "4px 8px",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          {details.discount}% OFF
        </div>
      )}

      <img
        src={details.image_link}
        alt={details.name}
        style={{
          maxWidth: "auto",
          height: "100px",
          objectFit: "contain",
          marginBottom: "10px",
        }}
      />

      <p
        style={{
          fontSize: "14px",
          fontWeight: "500",
          color: "#333",
          marginBottom: "8px",
          textWrap:"wrap"
        }}
      >
        {details.name}
      </p>

      <p
        style={{
          fontSize: "14px",
          color: "#4caf50",
          fontWeight: "bold",
        }}
      >
        ₹{details.price.toFixed(2)}
      </p>

      {/* Add to Cart Controls */}
      <Box sx={{ mt: "auto", width: "100%" }}>
        <Box display="flex" alignItems="center" mt={2} justifyContent="center">
          <IconButton
            onClick={() => handleDecrement(details._id)}
            color="primary"
            disabled={quantity <= 1}
            size="small"
          >
            <Remove />
          </IconButton>
          <Typography variant="body1" mx={1}>
            {quantity}
          </Typography>
          <IconButton
            onClick={() => handleIncrement(details._id)}
            color="primary"
            size="small"
          >
            <Add />
          </IconButton>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAddToCart(details._id, quantity)}
          sx={{ mt: 2, width: "100px" }}
        >
          Add to Cart
        </Button>
      </Box>
    </div>
    </div>
  );
})}


      </div>
    </div>
  );
};

export default BluemedixProducts;
