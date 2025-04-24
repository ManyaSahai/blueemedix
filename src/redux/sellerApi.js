import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Orders API service
export const sellerApi = createApi({
  reducerPath: 'sellerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      // Add auth token from localStorage if available
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Order', 'User'], // Add 'User' tag
  endpoints: (builder) => ({
    // Get orders for a seller
    sellerOrders: builder.query({
      query: (sellerId) => `orders/seller/${sellerId}`,
      providesTags: (result) =>
        result?.orders
          ? [
            ...result.orders.map((order) => ({
              type: 'Order',
              id: typeof order === 'string' ? order : order._id
            })),
            { type: 'Order', id: 'LIST' },
          ]
          : [{ type: 'Order', id: 'LIST' }],
      transformResponse: (response) => {
        // Return the response as-is - we'll handle both formats
        return response;
      }
    }),

    // Get details of a specific order
    orderDetails: builder.query({
      query: (orderId) => `orders/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
    }),

    // Update order status - Changed to PUT method with proper enum values
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status, description }) => ({
        url: `orders/status/${orderId}`,
        method: 'PUT', // Changed from PATCH to PUT
        body: {
          status, // One of: 'pending', 'accepted', 'dispatched', 'delivered', 'rejected', 'cancelled'
          description: description || `Order status updated to ${status}`
        },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        'Order'
      ],
    }),

    // Create a new order (for the place order functionality)
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: 'orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),

    // Get user profile information
    getMe: builder.query({ // Add this endpoint
      query: () => '/auth/me',
      providesTags: ['User'], // Add User tag
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useSellerOrdersQuery,
  useOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useCreateOrderMutation,
  useGetMeQuery: useGetMeQuery, // Export the new hook
} = sellerApi;