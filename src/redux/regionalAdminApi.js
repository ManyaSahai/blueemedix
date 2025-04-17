// src/features/api/regionalAdminApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const regionalAdminApi = createApi({
  reducerPath: 'regionalAdminApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/regional-admin' }),
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
