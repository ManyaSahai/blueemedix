import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categoryCount: 10,
  productCount: 110598,
  totalOrders: 6436,
  userCount: 16178,
  todaysOrders: 0,
  todaysPendingOrders: 0,
  todaysQuotationSent: 0,
  todaysOrderPlaced: 0,
  todaysOrderInReview: 0,
  todaysOrdersShipped: 0,
  todaysOrdersDelivered: 0,
  todaysOrdersRejected: 0,
  todaysOrdersCancelled: 0,
  weeklyOrderData: [
    { name: 'Wed', orderPlaced: 0, rejected: 0, delivered: 0, shipped: 0, totalOrder: 0 },
    { name: 'Thu', orderPlaced: 0, rejected: 0, delivered: 0, shipped: 0, totalOrder: 0 },
    { name: 'Fri', orderPlaced: 0, rejected: 0, delivered: 0, shipped: 0, totalOrder: 0 },
    { name: 'Sat', orderPlaced: 0, rejected: 0, delivered: 0, shipped: 0, totalOrder: 0 },
    { name: 'Sun', orderPlaced: 0, rejected: 0, delivered: 0, shipped: 0, totalOrder: 0 },
    { name: 'Mon', orderPlaced: 0, rejected: 0, delivered: 0, shipped: 0, totalOrder: 0 },
    { name: 'Today', orderPlaced: 0, rejected: 0, delivered: 0, shipped: 0, totalOrder: 0 },
  ],
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardData: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { fetchDashboardData } = dashboardSlice.actions;

export default dashboardSlice.reducer;