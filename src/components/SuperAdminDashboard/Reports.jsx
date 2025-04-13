import { useGetProductsQuery } from '../../redux/productApi';
import ProductPieChart from './ProductPieChart';
import ProductLineChart from './ProductLineChart';
import { useEffect, useState } from 'react';

export default function Reports() {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  const chartData = products.map(product => ({
    name: product.title.length > 10 ? product.title.slice(0, 10) + "..." : product.title,
    price: product.price,
    rating: product.rating.rate,
  }));

  const dataKeys = [
    { dataKey: 'price', stroke: '#8884d8' },
    { dataKey: 'rating', stroke: '#82ca9d' },
  ];

  const pieChartData = products.map((product) => ({
    name: product.category,     // or product.title, etc.
    value: product.rating?.rate || 1, // or any numeric value you want
  }));

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: windowWidth < 768 ? '1fr' : '1fr 1fr', // 1 column on mobile, 2 columns on tablet/desktop
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

  return (
    <>
    <div style={gridStyle}>
      <div style={chartContainerStyle}>
        <ProductLineChart chartData={chartData} dataKeys={dataKeys} xAxisKey="name" />
      </div>

      {/* 🎯 Future ready: easily add more charts here */}

      <div style={chartContainerStyle}>
        {/* Example: Another ProductLineChart or BarChart */}
        <ProductLineChart chartData={chartData} dataKeys={dataKeys} xAxisKey="name" />
      </div>

      {/* You can add as many <div style={chartContainerStyle}>...charts</div> here */}
    </div>
    <div style={gridStyle}>
    <div style={chartContainerStyle}>
      <ProductPieChart chartData={pieChartData} />
    </div>
    </div>
    </>
  );
}
