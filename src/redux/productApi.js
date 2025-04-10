// src/redux/api/productApi.js

import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchAndCacheProducts } from '../utils/dataCache';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: async () => {
    try {
      const data = await fetchAndCacheProducts();
      return { data };
    } catch (error) {
      console.error("❌ Error loading products:", error);
      return { error: { status: 500, message: 'Failed to fetch products' } };
    }
  },
  endpoints: (builder) => ({
    getProducts: builder.query({
      queryFn: async () => {
        const data = await fetchAndCacheProducts();
        return { data };
      },
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
