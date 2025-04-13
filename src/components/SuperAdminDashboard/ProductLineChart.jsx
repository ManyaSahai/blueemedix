import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductLineChart = ({ chartData, dataKeys, xAxisKey }) => {
  // Get window width
  const isMobile = window.innerWidth < 600; // You can adjust breakpoint if needed

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 250 : 400}>
      <LineChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 10,
          bottom: 30, // give more bottom margin for rotated labels
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{
            fontSize: isMobile ? 8 : 12, // smaller font on mobile
            angle: isMobile ? -45 : 0,    // rotate labels on mobile
            textAnchor: isMobile ? 'end' : 'middle',
          }}
        />
        <YAxis 
          tick={{ fontSize: isMobile ? 8 : 12 }}
        />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 14 }} />
        {dataKeys.map((key, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={key.dataKey}
            stroke={key.stroke}
            activeDot={{ r: 6 }}
            strokeWidth={isMobile ? 1.5 : 2.5} // thinner lines for mobile
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProductLineChart;
