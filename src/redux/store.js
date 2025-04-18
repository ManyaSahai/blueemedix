import { configureStore } from '@reduxjs/toolkit';
import { productApi } from './productApi';
import { userApi } from './usersApi';
import { regionalAdminApi } from './regionalAdminApi';
import { ordersApi } from './ordersApi';
import { cartApi } from './cartApi';

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [regionalAdminApi.reducerPath]: regionalAdminApi.reducer,
    [ordersApi.reducerPath] : ordersApi.reducer,
    [cartApi.reducerPath] : cartApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      userApi.middleware,
      regionalAdminApi.middleware,
      ordersApi.middleware,
      cartApi.middleware
    ),
});
