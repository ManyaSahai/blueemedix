import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../utils/baseURL'; // Import the local backend base URL

import {
    fetchAndCacheProducts, // Keep this for fallback
    storeInIndexedDB,
    updateProductInIndexedDB,
    addProductToIndexedDB,
    deleteProductFromIndexedDB, // Define this method to delete from IndexedDB
} from '../utils/dataCache';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({ baseUrl: getBaseUrl() }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        // Fetch all products from the backend or IndexedDB if offline
        getProducts: builder.query({
            query: () => '/products', // Assuming your backend endpoint is /products
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    await storeInIndexedDB(result.data); // Store data in IndexedDB after fetching from backend
                } catch (error) {
                    const cachedProducts = await fetchAndCacheProducts();
                    dispatch(productApi.util.updateQueryData('getProducts', undefined, () => cachedProducts)); // Fallback to IndexedDB
                }
            },
            providesTags: (result, error, arg) => {
                if (error) return ['Product'];
                return result
                    ? [...result.map(({ _id }) => ({ type: 'Product', id: _id })), 'Product'] // Use _id from your data
                    : ['Product'];
            },
        }),

        // Fetch a single product by ID
        getProductById: builder.query({
            query: (productId) => `/products/${productId}`, // Fetch product by ID from backend
            providesTags: (result, error, productId) =>
                result ? [{ type: 'Product', id: result._id }] : [{ type: 'Product', id: productId }],
        }),

        // Add a new product
        addProduct: builder.mutation({
            queryFn: async (newProduct) => {
                const response = await fetch(`${getBaseUrl()}/products/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newProduct), // Send new product data to backend
                });
                const data = await response.json();
                if (response.ok) {
                    const productWithId = { ...data, id: data._id }; // Ensure 'id' is present
                    await addProductToIndexedDB(productWithId); // Use addProductToIndexedDB
                    return { data: productWithId };
                }
                return { error: { message: data?.message || 'Failed to add product' } };
            },
            invalidatesTags: ['Product'], // Correct invalidation
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

                const errorData = await response.json(); //try to get error message from backend
                return { error: { message: errorData?.message || 'Failed to update product' } }; // Return a serializable error
            },
            // ✅ This is what triggers refetching `getProducts` after update
            invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg._id }], // Invalidate the specific product and the list
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
                    return { data: { id: productId } }; // Consistent return
                }

                const errorData = await response.json();
                return { error: { message: errorData?.message || 'Failed to delete product' } };
            },
            invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.productId }], // Invalidate using the id
        }),

        // Fetch products by category
        getProductsByCategory: builder.query({
            query: (categoryId) => `/products/category/${categoryId}`, // Fetch products by category ID
            providesTags: (result, error) => {
              if (error) return ['Product'];
              return result
                ? [...result.map((item) => ({ type: 'Product', id: item._id })), 'Product']
                : ['Product'];
            },
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
