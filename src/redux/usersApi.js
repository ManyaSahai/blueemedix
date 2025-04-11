import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { cacheUsers, getCachedUsers } from '../utils/userCache';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: async (args, api, extraOptions) => {
    const cached = await getCachedUsers();

    if (cached.length > 0) {
      console.log('📦 Serving users from IndexedDB');
      return { data: cached };
    }

    const rawBaseQuery = fetchBaseQuery({ baseUrl: 'https://fakestoreapi.com/' });
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result?.data) {
      console.log('🌐 Fetched users from API');
      await cacheUsers(result.data);
    }

    return result;
  },
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users', // FakeStoreAPI's `/users` endpoint
    }),
  }),
});

export const { useGetUsersQuery } = userApi;