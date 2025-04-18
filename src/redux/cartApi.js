import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../utils/baseURL'; // Import the getBaseUrl function

// Use getBaseUrl to get the base URL dynamically
const baseUrl = getBaseUrl();

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({ baseUrl }), // Set the base URL dynamically
  endpoints: (builder) => ({
    // Add item to the cart
    addItemToCart: builder.mutation({
      query: ({ userId, productId, quantity }) => ({
        url: '/cart/add',
        method: 'POST',
        body: { userId, productId, quantity },
      }),
    }),

    // Get all cart items for a specific user
    getCart: builder.query({
      query: (userId) => `/cart/${userId}`,
    }),

    // Delete an item from the cart
    deleteCartItem: builder.mutation({
      query: ({ userId, productId }) => ({
        url: `/cart/${userId}/${productId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useAddItemToCartMutation,
  useGetCartQuery,
  useDeleteCartItemMutation,
} = cartApi;