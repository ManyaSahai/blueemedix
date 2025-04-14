import { useGetProductsQuery } from '../../redux/productApi';
import ProductPieChart from './ProductPieChart';
import ProductLineChart from './ProductLineChart';
import { useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';

export default function Reports() {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedProductId, setSelectedProductId] = useState('all');

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  const filteredProducts = selectedProductId === 'all'
    ? products
    : products.filter(product => product.id === Number(selectedProductId));

  const chartData = filteredProducts.map(product => ({
    name: product.title.length > 10 ? product.title.slice(0, 10) + "..." : product.title,
    price: product.price,
    rating: product.rating.rate,
    count: product.rating.count,
  }));

  const pieChartData = filteredProducts.map((product) => ({
    name: product.category,
    value: product.rating?.rate || 1,
  }));

  const dataKeys = [
    { dataKey: 'price', stroke: '#8884d8' },
    { dataKey: 'rating', stroke: '#82ca9d' },
    { dataKey: 'count', stroke: '#ff7300' },
  ];

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: windowWidth < 768 ? '1fr' : '1fr 1fr',
    gap: '20px',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const chartContainerStyle = {
    width: '100%',
    height: windowWidth < 600 ? 300 : 400,
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    padding: '10px',
  };

  const renderRow = ({ index, style }) => (
    <MenuItem
      key={products[index].id}
      value={products[index].id}
      style={style}
    >
      {products[index].title.length > 30 ? products[index].title.slice(0, 30) + "..." : products[index].title}
    </MenuItem>
  );

  return (
    <>
      <Box sx={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="product-select-label">Select Product</InputLabel>
          <Select
            labelId="product-select-label"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                },
              },
            }}
          >
            <MenuItem value="all">All Products</MenuItem>
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.title.length > 30 ? product.title.slice(0, 30) + "..." : product.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <div style={gridStyle}>
        <div style={chartContainerStyle}>
          <ProductLineChart chartData={chartData} dataKeys={dataKeys} xAxisKey="name" />
        </div>
        <div style={chartContainerStyle}>
          <ProductPieChart chartData={pieChartData} />
        </div>
      </div>

    </>
  );
}