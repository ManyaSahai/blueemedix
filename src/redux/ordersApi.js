// src/api/ordersApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  storeInIndexedDB,
  getFromIndexedDB,
  updateInIndexedDB,
  deleteFromIndexedDB,
} from '../utils/orderCache';
import getBaseUrl from '../utils/baseURL';  // Assuming this is where your baseUrl is defined

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({  baseUrl: `${getBaseUrl()}/orders` }), // Uses baseUrl from getBaseUrl function
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    // 1. Place a new order
    placeOrder: builder.mutation({
      query: (orderData) => ({
        url: '/create',
        method: 'POST',
        body: orderData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await storeInIndexedDB(data.order._id, data.order); // Cache new order
        } catch (err) {
          console.error('Order creation failed:', err);
        }
      },
      invalidatesTags: ['Order'],
    }),

    // 2. Fetch all orders (admin)
    getAllOrders: builder.query({
      query: () => `/`,
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          for (const order of data.orders) {
            await storeInIndexedDB(order._id, order);
          }
        } catch {
          const cached = await getFromIndexedDB();
          return { data: { orders: cached } };
        }
      },
      providesTags: ['Order'],
    }),

    // 3. Fetch orders by user (customer)
    getOrdersByUser: builder.query({
      query: (userId) => {
        // Check if userId is valid before making the request
        if (!userId) {
          // Return empty data to avoid making a request with invalid ID
          return { 
            url: '/empty-orders',
            method: 'GET',
            // This endpoint doesn't need to exist - RTK Query will handle the error
          };
        }
        return `/user/${userId}`;
      },
      // Skip the query if userId is undefined
      skip: (userId) => !userId,
      async onQueryStarted(userId, { queryFulfilled }) {
        if (!userId) return { data: { orders: [] } };
        
        try {
          const { data } = await queryFulfilled;
          for (const order of data.orders) {
            await storeInIndexedDB(order._id, order);
          }
        } catch {
          const cached = await getFromIndexedDB((order) => order.userId === userId);
          return { data: { orders: cached } };
        }
      },
      // Transform the response in case of error to provide empty orders
      transformErrorResponse: () => {
        return { data: { orders: [] } };
      },
      providesTags: ['Order'],
    }),
    // 4. Fetch orders by seller
    getOrdersBySeller: builder.query({
      query: ({ sellerId, status }) => `/seller/${sellerId}${status ? `?status=${status}` : ''}`,
      async onQueryStarted({ sellerId }, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          for (const order of data.orders) {
            await storeInIndexedDB(order._id, order);
          }
        } catch {
          const cached = await getFromIndexedDB((order) => order.sellerId === sellerId);
          return { data: { orders: cached } };
        }
      },
      providesTags: ['Order'],
    }),

    // 5. Fetch order by ID
    getOrderById: builder.query({
      query: (orderId) => `/${orderId}`,
      async onQueryStarted(orderId, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await storeInIndexedDB(orderId, data.order);
        } catch {
          const cached = await getFromIndexedDB((order) => order._id === orderId);
          return { data: { order: cached } };
        }
      },
      providesTags: ['Order'],
    }),

    // 6. Track order
    trackOrder: builder.query({
      query: (orderId) => `/track/${orderId}`,
    }),

    // 7. Update order status (Seller)
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/status/${orderId}`,
        method: 'PUT',
        body: { status },
      }),
      async onQueryStarted({ orderId, status }, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await updateInIndexedDB(orderId, { status });
        } catch (err) {
          console.error('Order status update failed:', err);
        }
      },
      invalidatesTags: ['Order'],
    }),

    // 8. Cancel order
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/cancel/${orderId}`,
        method: 'PUT',
      }),
      async onQueryStarted(orderId, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await updateInIndexedDB(orderId, { status: 'cancelled' });
        } catch (err) {
          console.error('Order cancel failed:', err);
        }
      },
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetAllOrdersQuery,
  useGetOrdersByUserQuery,
  useGetOrdersBySellerQuery,
  useGetOrderByIdQuery,
  useTrackOrderQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = ordersApi;
