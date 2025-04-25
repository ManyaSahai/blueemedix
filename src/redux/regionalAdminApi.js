import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Utility function to get token from localStorage
const getAuthToken = () => localStorage.getItem('token');

export const regionalAdminApi = createApi({
  reducerPath: 'regionalAdminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/regional-admin', // Base URL for regional admin specific endpoints
    prepareHeaders: (headers, { getState }) => {
      const token = getAuthToken();
      if (token) {
        headers.set('Authorization', `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Seller', 'User', 'Order'], // Add 'Order' as a tag type
  endpoints: (builder) => ({
    fetchPendingSellers: builder.query({
      query: () => '/sellers/pending',
      providesTags: ['Seller'],
    }),
    fetchAllRegionalSellers: builder.query({
      query: () => '/sellers/all',
      providesTags: ['Seller'],
    }),
    fetchApprovedSellers: builder.query({
      query: () => '/sellers/approved',
    }),
    approveSeller: builder.mutation({
      query: (sellerId) => ({
        url: `/sellers/${sellerId}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: ['Seller'],
    }),
    rejectSeller: builder.mutation({
      query: ({ sellerId, reason }) => ({
        url: `/sellers/${sellerId}/reject`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['Seller'],
    }),
    fetchRegionalUsers: builder.query({
      query: (regAdminId) => `/auth/regAdmin/customer/${regAdminId}`, // Corrected path
      providesTags: ['User'],
    }),
    fetchRegionalOrders: builder.query({
      query: (region) => ({
        url: `/regAdmin`,  // No :region in URL
        method: 'GET',
        params: { region },
      }),
      transformResponse: (response) => response.orders,
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useFetchPendingSellersQuery,
  useFetchAllRegionalSellersQuery,
  useFetchApprovedSellersQuery,
  useApproveSellerMutation,
  useRejectSellerMutation,
  useFetchRegionalUsersQuery,
  useFetchRegionalOrdersQuery,
} = regionalAdminApi;