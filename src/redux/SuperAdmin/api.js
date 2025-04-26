import { fetchDashboardData } from './dashboardSlice';
import { fetchOrders } from './ordersSlice';

// These would be actual API calls in a real application
export const getDashboardData = () => {
  return (dispatch) => {
    // Simulating API call with mock data
    const mockData = {
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

    setTimeout(() => {
      dispatch(fetchDashboardData(mockData));
    }, 500);
  };
};

export const getOrders = () => {
  return (dispatch) => {
    // Simulating API call with mock data
    const mockOrders = [
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

    setTimeout(() => {
      dispatch(fetchOrders(mockOrders));
    }, 500);
  };
};