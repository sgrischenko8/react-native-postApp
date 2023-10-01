import { configureStore } from '@reduxjs/toolkit';
import { postsApi } from './postsSlice';
import { usersApi } from './userSlice';
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { persistedAuthReducer } from './authSlice';
import { persistedThemeTempReducer } from './themeTempSlice';
import { persistedAvatarTempReducer } from './avatarTempSlice';

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    themeTemp: persistedThemeTempReducer,
    avatarTemp: persistedAvatarTempReducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(postsApi.middleware, usersApi.middleware),
});

export const persistor = persistStore(store);
