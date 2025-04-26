import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  { orderNo: 'ORD6485', orderDate: '04-03-2025', totalAmount: 'Rs 0.00', status: 'Pending' },
  { orderNo: 'ORD6484', orderDate: '22-02-2025', totalAmount: 'Rs 101.52', status: 'order placed' },
  { orderNo: 'ORD6483', orderDate: '14-01-2025', totalAmount: 'Rs 0.00', status: 'Pending' },
  { orderNo: 'ORD6482', orderDate: '14-01-2025', totalAmount: 'Rs 0.00', status: 'Pending' },
  { orderNo: 'ORD6481', orderDate: '07-01-2025', totalAmount: 'Rs 576.72', status: 'order placed' },
  { orderNo: 'ORD6480', orderDate: '07-01-2025', totalAmount: 'Rs 576.72', status: 'order placed' },
  { orderNo: 'ORD6479', orderDate: '18-12-2024', totalAmount: 'Rs 547.20', status: 'order placed' },
  { orderNo: 'ORD6478', orderDate: '09-12-2024', totalAmount: 'Rs 268.24', status: 'order placed' },
  { orderNo: 'ORD6477', orderDate: '01-12-2024', totalAmount: 'Rs 0.00', status: 'Pending' },
  { orderNo: 'ORD6476', orderDate: '01-12-2024', totalAmount: 'Rs 0.00', status: 'Pending' },
];

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    fetchOrders: (state, action) => {
      return action.payload;
    },
  },
});

export const { fetchOrders } = ordersSlice.actions;

export default ordersSlice.reducer;