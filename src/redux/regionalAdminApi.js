// src/features/api/regionalAdminApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Utility function to get token from localStorage
const getAuthToken = () => localStorage.getItem('token');

export const regionalAdminApi = createApi({
  reducerPath: 'regionalAdminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/regional-admin',
    prepareHeaders: (headers, { getState }) => {
      const token = getAuthToken();
      console.log('Token being used:', token);
      
      if (token) {
        // Make sure there's a space between "Bearer" and the token
        headers.set('Authorization', ` ${token}`);
        console.log('Authorization header set:', `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Seller'],
  endpoints: (builder) => ({
    fetchPendingSellers: builder.query({
      query: () => '/sellers/pending',
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
  }),
});

export const {
  useFetchPendingSellersQuery,
  useFetchApprovedSellersQuery,
  useApproveSellerMutation,
  useRejectSellerMutation,
} = regionalAdminApi;
