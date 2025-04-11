import { configureStore } from '@reduxjs/toolkit';
import { productApi } from './productApi';
import { userApi } from './usersApi';

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      userApi.middleware
    ),
});
