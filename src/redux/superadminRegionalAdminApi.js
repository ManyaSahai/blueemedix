// src/api/regionalAdminsApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../utils/baseUrl'; // Correct path
import { storeInIndexedDB, getFromIndexedDB } from '../utils/regionalSuperAdminCache';

export const regionalAdminsApi = createApi({
  reducerPath: 'regionalAdminsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/regionalAdmin/regional-admins`, // Added the specific path here
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['RegionalAdmins'],
  endpoints: (builder) => ({
    // Get all regional admins
    getRegionalAdmins: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const cached = await getFromIndexedDB('regionalAdmins');
          if (cached) return { data: cached };

          const res = await fetchWithBQ('/'); // Get all regional admins
          if (res.error) return { error: res.error };

          await storeInIndexedDB('regionalAdmins', res.data.admins);
          return { data: res.data.admins };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: ['RegionalAdmins'],
    }),

    // Get pending admins
    getPendingAdmins: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const cached = await getFromIndexedDB('pending');
          if (cached) return { data: cached };

          const res = await fetchWithBQ('/pending'); // Use `/pending` here as part of the route
          if (res.error) return { error: res.error };

          await storeInIndexedDB('pending', res.data.pendingAdmins);
          return { data: res.data.pendingAdmins };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: ['RegionalAdmins'],
    }),

    // Approve an admin
    approveAdmin: builder.mutation({
      query: (adminId) => ({
        url: `/${adminId}/approve`, // Add `/approve` after the adminId
        method: 'PUT',
      }),
      invalidatesTags: ['RegionalAdmins'],
    }),

    // Decline an admin
    declineAdmin: builder.mutation({
      query: ({ adminId, reason }) => ({
        url: `/${adminId}/decline`, // Add `/decline` after the adminId
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['RegionalAdmins'],
    }),
  }),
});

export const {
  useGetRegionalAdminsQuery,  // Use this to fetch all regional admins
  useGetPendingAdminsQuery,   // Use this to fetch pending regional admins
  useApproveAdminMutation,    // For approving an admin
  useDeclineAdminMutation,    // For declining an admin
} = regionalAdminsApi;
