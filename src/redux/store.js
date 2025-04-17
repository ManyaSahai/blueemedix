import { configureStore } from '@reduxjs/toolkit';
import { productApi } from './productApi';
import { userApi } from './usersApi';
import { regionalAdminApi } from './regionalAdminApi';

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [regionalAdminApi.reducerPath]: regionalAdminApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      userApi.middleware,
      regionalAdminApi.middleware
    ),
});
