import React from "react";

const BluemedixProducts = () => {
  const products = [
    {
      id: 1,
      name: "Dr Morepen BP Monitor BP-09",
      image: "/src/images/1.jpg",
      originalPrice: "Rs 1565.00",
      discountedPrice: "Rs 1095.50",
      discount: "30% OFF",
    },
    {
      id: 2,
      name: "Himalaya liv. 52 ds tablet",
      image: "/src/images/2.jpg",
      originalPrice: "Rs 155.00",
      discountedPrice: "Rs 147.25",
      discount: "5% OFF",
    },
    {
      id: 3,
      name: "Dettol Sensitive Liquid Handwash",
      image: "/src/images/3.jpg",
      originalPrice: "Rs 209.00",
      discountedPrice: "Rs 202.73",
      discount: "3% OFF",
    },
    {
      id: 4,
      name: "Complan Refill Powder Chocolate",
      image: "/src/images/4.jpg",
      originalPrice: "Rs 540.00",
      discountedPrice: "Rs 518.40",
      discount: "4% OFF",
    },
    {
      id: 5,
      name: "Himalaya Anti-Dandruff Shampoo",
      image: "/src/images/5.jpg",
      originalPrice: "Rs 260.00",
      discountedPrice: "Rs 252.20",
      discount: "3% OFF",
    },
    {
      id: 6,
      name: "Horlicks Mother's Powder Vanilla",
      image: "/src/images/6.jpg",
      originalPrice: "Rs 529.00",
      discountedPrice: "Rs 513.13",
      discount: "3% OFF",
    },
  ];

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
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "5px",
              overflow: "hidden",
              backgroundColor: "white",
              position: "relative",
            }}
          >
            {product.discount && (
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
                {product.discount}
              </div>
            )}

            <div style={{ padding: "15px", textAlign: "center" }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  maxWidth: "100%",
                  height: "120px",
                  objectFit: "contain",
                  marginBottom: "10px",
                }}
              />

              <div style={{ height: "40px", marginBottom: "10px" }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#333",
                    textAlign: "center",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {product.name}
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#757575",
                    textDecoration: "line-through",
                    marginBottom: "4px",
                  }}
                >
                  {product.originalPrice}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#4caf50",
                    fontWeight: "bold",
                  }}
                >
                  {product.discountedPrice}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BluemedixProducts;
