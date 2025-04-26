import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboardSlice';
import ordersReducer from './ordersSlice';

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    orders: ordersReducer,
  },
});

export default store;