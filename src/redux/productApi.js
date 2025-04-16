import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../utils/baseURL';  // Import the local backend base URL

import {
  fetchAndCacheProducts,  // Keep this for fallback
  storeInIndexedDB,   
  updateProductInIndexedDB,
  addProductToIndexedDB,
  deleteProductFromIndexedDB  // Define this method to delete from IndexedDB
} from '../utils/dataCache';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: getBaseUrl() }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    // Fetch all products from the backend or IndexedDB if offline
    getProducts: builder.query({
      query: () => '/products',  // Assuming your backend endpoint is /products
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          await storeInIndexedDB(result.data);  // Store data in IndexedDB after fetching from backend
        } catch (error) {
          const cachedProducts = await fetchAndCacheProducts();
          dispatch(productApi.util.updateQueryData('getProducts', undefined, () => cachedProducts));  // Fallback to IndexedDB
        }
      },
      providesTags: ['Product'],
    }),

    // Fetch a single product by ID
    getProductById: builder.query({
      query: (productId) => `/products/${productId}`,  // Fetch product by ID from backend
      providesTags: ['Product'],
    }),

    // Add a new product
    addProduct: builder.mutation({
      queryFn: async (newProduct) => {
        const response = await fetch(`${getBaseUrl()}/products/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),  // Send new product data to backend
        });
        const data = await response.json();
        if (response.ok) {
          await storeInIndexedDB(data);  // Save added product to IndexedDB
        }
        return { data };
      },
    }),

    // Update a product by ID
    updateProduct: builder.mutation({
      queryFn: async (updatedProduct) => {
        const { _id, name, price } = updatedProduct;
    
        const response = await fetch(`${getBaseUrl()}/products/${_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, price }),
        });
    
        if (response.ok) {
          const data = await response.json();
          const updatedProductWithId = { ...data, id: data._id };
    
          // ✅ Update IndexedDB too
          await updateProductInIndexedDB(updatedProductWithId);
    
          return { data: updatedProductWithId };
        }
    
        return { error: new Error('Failed to update product') };
      },
    
      // ✅ THIS is what triggers refetching `getProducts` after update
      invalidatesTags: ['Product'],
    }),
    
    // Delete a product by ID
    deleteProduct: builder.mutation({
      queryFn: async ({ productId }) => {
        if (!productId) {
          return { error: new Error('Product ID is required') };
        }
    
        const response = await fetch(`${getBaseUrl()}/products/delete/${productId}`, {
          method: 'DELETE',
        });
    
        if (response.ok) {
          // ✅ Delete product from IndexedDB
          await deleteProductFromIndexedDB(productId);
          return { data: productId };  // Return productId to be used for invalidation
        }
    
        return { error: new Error('Failed to delete product') };
      },
      invalidatesTags: ['Product'],
    }),

    // Fetch products by category
    getProductsByCategory: builder.query({
      query: (categoryId) => `/products/category/${categoryId}`,  // Fetch products by category ID
      providesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsByCategoryQuery,
} = productApi;
