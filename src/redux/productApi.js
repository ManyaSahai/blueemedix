import { createApi } from '@reduxjs/toolkit/query/react';
import {
  fetchAndCacheProducts,
  addProductToIndexedDB,
  updateProductInIndexedDB,
  deleteProductFromIndexedDB,
} from '../utils/dataCache';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: async () => {
    try {
      const data = await fetchAndCacheProducts();
      return { data };
    } catch (error) {
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
    addProduct: builder.mutation({
      queryFn: async (newProduct) => {
        const added = await addProductToIndexedDB(newProduct);
        return { data: added };
      },
    }),
    updateProduct: builder.mutation({
      queryFn: async (updatedProduct) => {
        const updated = await updateProductInIndexedDB(updatedProduct);
        return { data: updated };
      },
    }),
    deleteProduct: builder.mutation({
      queryFn: async (productId) => {
        await deleteProductFromIndexedDB(productId);
        return { data: productId };
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
